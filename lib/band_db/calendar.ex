defmodule BandDb.Calendar do
  @moduledoc """
  The Calendar context.
  Handles Google Calendar integration and management.
  Supports both OAuth2 (legacy) and Service Account authentication.
  """

  alias BandDb.Repo
  alias BandDb.Accounts
  alias BandDb.Accounts.{User, Band}
  alias BandDb.Calendar.{GoogleAuth, GoogleAPI, ServiceAccountManager}

  @doc """
  Gets the Google Auth record for a user.
  Returns nil if the user doesn't have Google Calendar connected.
  """
  def get_google_auth(%User{id: user_id}) do
    Repo.get_by(GoogleAuth, user_id: user_id)
  end

  @doc """
  Saves a new Google Auth record for a user.
  """
  def create_google_auth(%User{id: user_id}, attrs) do
    %GoogleAuth{user_id: user_id}
    |> GoogleAuth.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates an existing Google Auth record.
  """
  def update_google_auth(%GoogleAuth{} = auth, attrs) do
    auth
    |> GoogleAuth.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Google Auth record.
  Used when disconnecting a user's Google account.
  """
  def delete_google_auth(%GoogleAuth{} = auth) do
    Repo.delete(auth)
  end

  @doc """
  Gets a fresh access token for a user.
  Handles token refresh if the current token is expired.
  Returns {:ok, access_token} or {:error, reason}
  """
  def get_access_token(%User{} = user) do
    case get_google_auth(user) do
      nil ->
        {:error, :not_connected}

      auth ->
        if is_expired?(auth) do
          refresh_token(auth)
        else
          {:ok, auth.access_token}
        end
    end
  end

  @doc """
  Checks if the given auth record has an expired access token.
  Returns true if the token is expired or will expire in the next 5 minutes.
  """
  def is_expired?(%GoogleAuth{expires_at: expires_at}) do
    now = DateTime.utc_now()
    # Token is expired if it's in the past or will expire in the next 5 minutes
    DateTime.diff(expires_at, now) < 300
  end

  @doc """
  Refreshes an access token using the refresh token.
  Updates the database record and returns the new access token.
  """
  def refresh_token(%GoogleAuth{} = auth) do
    case GoogleAPI.refresh_access_token(auth.refresh_token) do
      {:ok, %{access_token: access_token, expires_in: expires_in}} ->
        # Calculate new expiration time
        expires_at = DateTime.add(DateTime.utc_now(), expires_in, :second)

        # Update the auth record
        case update_google_auth(auth, %{
          access_token: access_token,
          expires_at: expires_at
        }) do
          {:ok, _updated_auth} -> {:ok, access_token}
          {:error, changeset} -> {:error, "Failed to update token: #{inspect(changeset.errors)}"}
        end

      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Creates a new calendar for the band.
  Returns {:ok, calendar_id} or {:error, reason}
  """
  def create_band_calendar(%User{} = user, band_name) do
    case get_access_token(user) do
      {:ok, access_token} ->
        calendar_name = "#{band_name} Rehearsals & Shows"
        description = "Calendar for #{band_name} rehearsals and performances"

        case GoogleAPI.create_calendar(access_token, calendar_name, description) do
          {:ok, calendar_id} ->
            # Update the auth record with the calendar ID
            auth = get_google_auth(user)
            case update_google_auth(auth, %{calendar_id: calendar_id}) do
              {:ok, _updated_auth} -> {:ok, calendar_id}
              {:error, changeset} -> {:error, "Failed to save calendar ID: #{inspect(changeset.errors)}"}
            end

          {:error, reason} -> {:error, reason}
        end

      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Lists all calendars for a user.
  Returns {:ok, calendars} or {:error, reason}
  """
  def list_calendars(%User{} = user) do
    case get_access_token(user) do
      {:ok, access_token} -> GoogleAPI.list_calendars(access_token)
      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Gets a specific calendar by ID.
  Returns {:ok, calendar} or {:error, reason}
  """
  def get_calendar(access_token, calendar_id) do
    GoogleAPI.get_calendar(access_token, calendar_id)
  end

  @doc """
  Lists events for a calendar within a date range.
  Returns {:ok, events} or {:error, reason}
  """
  def list_events(access_token, calendar_id, start_date, end_date) do
    # Format dates as required by Google Calendar API
    start_date_str = Date.to_iso8601(start_date)
    end_date_str = Date.to_iso8601(end_date)

    # Call the GoogleAPI module to fetch the events
    case GoogleAPI.list_events(access_token, calendar_id, start_date_str, end_date_str) do
      {:ok, google_events} ->
        # Transform Google events into the format expected by the calendar live view
        events = Enum.map(google_events, fn event ->
          # The events we get from GoogleAPI already have the date and start_time/end_time
          # fields properly formatted, so we can just use them directly
          %{
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date,
            start_time: event.start_time,
            end_time: event.end_time,
            location: event.location,
            html_link: event.html_link,
            event_type: event.event_type,
            rehearsal_plan_id: event.rehearsal_plan_id,
            set_list_name: event.set_list_name
          }
        end)

        {:ok, events}

      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Creates a new event directly from a parameter map.
  This is a simplified version to use with set lists and rehearsal plans.

  Returns {:ok, event_id} or {:error, reason}
  """
  def create_event(%User{} = user, event_params) do
    case get_google_auth(user) do
      nil ->
        {:error, :not_connected}

      auth ->
        case get_access_token(user) do
          {:ok, access_token} ->
            # Get the calendar ID from the auth record
            calendar_id = auth.calendar_id

            # Log the calendar ID and event params
            require Logger
            Logger.debug("Using calendar_id: #{calendar_id}")
            Logger.debug("Create event with params: #{inspect(event_params)}")

            # Create the event
            case GoogleAPI.create_event(access_token, calendar_id, event_params) do
              {:ok, event_id} -> {:ok, event_id}
              {:error, reason} -> {:error, reason}
            end

          {:error, reason} -> {:error, reason}
        end
    end
  end

  @doc """
  Creates a new event in the specified calendar.

  Event params should include:
  - title (required)
  - date (required) - a Date struct
  - start_time (optional) - a Time struct
  - end_time (optional) - a Time struct
  - description (optional)
  - location (optional)
  - event_type (optional) - "general", "rehearsal", "performance"
  - rehearsal_plan_id (optional) - to link to a rehearsal plan
  - set_list_name (optional) - to link to a set list

  Returns {:ok, event_id} or {:error, reason}
  """
  def create_event(%User{} = user, calendar_id, event_params) do
    case get_access_token(user) do
      {:ok, access_token} ->
        # Log the incoming event params
        require Logger
        Logger.debug("Creating event with params: #{inspect(event_params)}")

        # Convert the event params to Google Calendar format
        event = %{
          "summary" => Map.get(event_params, :title),
          "description" => Map.get(event_params, :description),
          "location" => Map.get(event_params, :location),
          "extendedProperties" => %{
            "private" => %{
              "eventType" => Map.get(event_params, :event_type, "general"),
              "rehearsalPlanId" => Map.get(event_params, :rehearsal_plan_id),
              "setListName" => Map.get(event_params, :set_list_name)
            }
          }
        }

        # Log the extended properties
        Logger.debug("Extended properties: #{inspect(get_in(event, ["extendedProperties", "private"]))}")

        # Add source URL if provided (for linking back to the app)
        source_url = Map.get(event_params, :source_url)
        source_title = Map.get(event_params, :source_title)

        event = if source_url do
          Map.put(event, "source", %{
            "url" => source_url,
            "title" => source_title || "View in BandDb"
          })
        else
          event
        end

        # Add start time
        event = case {Map.get(event_params, :date), Map.get(event_params, :start_time)} do
          {date, nil} when not is_nil(date) ->
            # All-day event
            date_str = Date.to_iso8601(date)
            Map.put(event, "start", %{"date" => date_str})
          {date, time} when not is_nil(date) and not is_nil(time) ->
            # Event with specific time
            # Create a naive datetime from the local time input
            naive_dt = NaiveDateTime.new!(
              date.year, date.month, date.day,
              time.hour, time.minute, 0
            )

            # Create a datetime in the America/New_York timezone
            timezone = "America/New_York"
            {:ok, ny_datetime} = convert_to_timezone(naive_dt, timezone)

            # Format for Google Calendar API - need to use the time in the designated timezone
            # We're sending the actual local time, not UTC, and explicitly telling Google it's in NY timezone
            datetime_str = ny_datetime |> DateTime.to_iso8601()
            Map.put(event, "start", %{"dateTime" => datetime_str, "timeZone" => timezone})
          _ ->
            # No date provided, this is an error
            event
        end

        # Add end time
        event = case {Map.get(event_params, :date), Map.get(event_params, :end_time)} do
          {date, nil} when not is_nil(date) ->
            # All-day event - ends the next day
            next_day = Date.add(date, 1)
            date_str = Date.to_iso8601(next_day)
            Map.put(event, "end", %{"date" => date_str})
          {date, time} when not is_nil(date) and not is_nil(time) ->
            # Event with specific time
            # Create a naive datetime from the local time input
            naive_dt = NaiveDateTime.new!(
              date.year, date.month, date.day,
              time.hour, time.minute, 0
            )

            # Create a datetime in the America/New_York timezone
            timezone = "America/New_York"
            {:ok, ny_datetime} = convert_to_timezone(naive_dt, timezone)

            # Format for Google Calendar API - need to use the time in the designated timezone
            # We're sending the actual local time, not UTC, and explicitly telling Google it's in NY timezone
            datetime_str = ny_datetime |> DateTime.to_iso8601()
            Map.put(event, "end", %{"dateTime" => datetime_str, "timeZone" => timezone})
          _ ->
            # If no end time but we have start time, use start time + 1 hour
            case event do
              %{"start" => %{"dateTime" => start_datetime_str}} ->
                {:ok, start_datetime, _} = DateTime.from_iso8601(start_datetime_str)
                end_datetime = DateTime.add(start_datetime, 3600, :second)
                end_datetime_str = DateTime.to_iso8601(end_datetime)
                timezone = "America/New_York"
                Map.put(event, "end", %{"dateTime" => end_datetime_str, "timeZone" => timezone})
              _ ->
                # Ensure we always have an end time
                # If we get here, we don't have start or end time
                # Use current date + default times as a fallback
                now = DateTime.utc_now()

                # Create a naive datetime for 9 PM today
                naive_dt = NaiveDateTime.new!(
                  now.year, now.month, now.day,
                  21, 0, 0
                )

                # Create a datetime in the specified timezone
                timezone = "America/New_York"
                {:ok, ny_datetime} = convert_to_timezone(naive_dt, timezone)

                # Format for Google Calendar API
                datetime_str = ny_datetime |> DateTime.to_iso8601()
                Map.put(event, "end", %{"dateTime" => datetime_str, "timeZone" => timezone})
            end
        end

        # Log the event being sent to Google API
        require Logger
        Logger.debug("Creating Google Calendar event: #{inspect(event)}")

        GoogleAPI.create_event(access_token, calendar_id, event)

      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Deletes an event from the specified calendar.
  Returns :ok or {:error, reason}
  """
  def delete_event(%User{} = user, calendar_id, event_id) do
    case get_access_token(user) do
      {:ok, access_token} ->
        GoogleAPI.delete_event(access_token, calendar_id, event_id)
      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Shares a calendar with a user by email.

  Role can be:
  - "reader" - See all event details
  - "writer" - Make changes to events
  - "owner" - Make changes to events and manage sharing

  Returns :ok or {:error, reason}
  """
  def share_calendar_with_user(%User{} = user, calendar_id, email, role \\ "reader") do
    case get_access_token(user) do
      {:ok, access_token} ->
        GoogleAPI.share_calendar(access_token, calendar_id, email, role)
      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Lists all users with whom the calendar is shared.
  Returns {:ok, shares} or {:error, reason}
  """
  def list_calendar_shares(%User{} = user, calendar_id) do
    case get_access_token(user) do
      {:ok, access_token} ->
        GoogleAPI.list_calendar_shares(access_token, calendar_id)
      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Removes a user's access to the calendar.
  Returns :ok or {:error, reason}
  """
  def remove_calendar_share(%User{} = user, calendar_id, rule_id) do
    case get_access_token(user) do
      {:ok, access_token} ->
        GoogleAPI.remove_calendar_share(access_token, calendar_id, rule_id)
      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Generates a shareable link for the calendar.
  Returns {:ok, link} or {:error, reason}
  """
  def get_shareable_link(calendar_id) do
    GoogleAPI.get_shareable_link(calendar_id)
  end

  # Private helper function to ensure tzdata is initialized before using timezone functions
  # Returns :ok if successful, or {:error, reason} if tzdata cannot be initialized
  defp ensure_tzdata do
    try do
      # Force tzdata to be loaded
      :ok = Application.ensure_all_started(:tzdata)

      # Explicitly check if the timezone database is working
      case DateTime.now("America/New_York") do
        {:ok, _} ->
          # Timezone database is working correctly
          :ok
        {:error, reason} ->
          require Logger
          Logger.error("Timezone database error after loading tzdata: #{inspect(reason)}")
          # Try forcing a reload by stopping and restarting tzdata
          try do
            :ok = Application.stop(:tzdata)
            :ok = Application.ensure_all_started(:tzdata)
            :ok
          rescue
            e ->
              Logger.error("Failed to restart tzdata: #{inspect(e)}")
              {:error, :tzdata_reload_failed}
          end
      end
    rescue
      e ->
        require Logger
        Logger.error("Exception ensuring tzdata is started: #{inspect(e)}")
        {:error, :tzdata_start_failed}
    end
  end

  @doc """
  Convert a naive datetime to a datetime with timezone information.
  Falls back to UTC if the timezone database is not available or an error occurs.
  """
  def convert_to_timezone(naive_dt, timezone \\ "America/New_York") do
    # Try to ensure tzdata is available
    tzdata_result = ensure_tzdata()

    # Make conversion attempt
    case DateTime.from_naive(naive_dt, timezone) do
      {:ok, datetime} ->
        {:ok, datetime}
      {:error, :utc_only_time_zone_database} ->
        require Logger
        Logger.error("Timezone database not configured properly. Tzdata check result: #{inspect(tzdata_result)}")
        # Fall back to UTC time
        {:ok, DateTime.from_naive!(naive_dt, "Etc/UTC")}
      {:error, reason} ->
        require Logger
        Logger.error("Error creating datetime: #{inspect(reason)}")
        # Fall back to UTC time
        {:ok, DateTime.from_naive!(naive_dt, "Etc/UTC")}
    end
  end
  
  # Service Account-based Calendar Functions
  
  @doc """
  Creates a calendar for a band using service account authentication.
  The calendar is owned by the service account and shared with band members.
  Returns {:ok, band} or {:error, reason}
  """
  def create_band_calendar_with_service_account(%Band{} = band) do
    calendar_name = "#{band.name} Rehearsals & Shows"
    description = "Calendar for #{band.name} rehearsals and performances"
    
    case GoogleAPI.create_calendar_with_service_account(calendar_name, description) do
      {:ok, calendar_id} ->
        # Generate iCal token if not present
        ical_token = band.ical_token || Band.generate_ical_token()
        
        # Update the band with calendar_id and ical_token
        case Accounts.update_band(band, %{calendar_id: calendar_id, ical_token: ical_token}) do
          {:ok, updated_band} -> 
            # Share calendar with all band members
            share_calendar_with_band_members(updated_band)
            {:ok, updated_band}
          {:error, changeset} -> 
            {:error, "Failed to save calendar ID: #{inspect(changeset.errors)}"}
        end
        
      {:error, reason} -> 
        {:error, reason}
    end
  end
  
  @doc """
  Shares the band calendar with all band members.
  Admins get writer access, regular members get reader access.
  """
  def share_calendar_with_band_members(%Band{calendar_id: nil}), do: {:error, "Band has no calendar"}
  def share_calendar_with_band_members(%Band{calendar_id: calendar_id, users: users}) when is_list(users) do
    Enum.each(users, fn user ->
      role = if user.is_admin, do: "writer", else: "reader"
      GoogleAPI.share_calendar_with_service_account(calendar_id, user.email, role)
    end)
    :ok
  end
  def share_calendar_with_band_members(%Band{} = band) do
    # Load users if not preloaded
    band = Repo.preload(band, :users)
    share_calendar_with_band_members(band)
  end
  
  @doc """
  Creates an event in the band calendar using service account.
  """
  def create_band_event(%Band{calendar_id: nil}, _event_params), do: {:error, "Band has no calendar"}
  def create_band_event(%Band{calendar_id: calendar_id}, event_params) do
    GoogleAPI.create_event_with_service_account(calendar_id, event_params)
  end
  
  @doc """
  Lists events from the band calendar using service account.
  """
  def list_band_events(%Band{calendar_id: nil}, _start_date, _end_date), do: {:error, "Band has no calendar"}
  def list_band_events(%Band{calendar_id: calendar_id}, start_date, end_date) do
    # Format dates as required by Google Calendar API
    start_date_str = Date.to_iso8601(start_date)
    end_date_str = Date.to_iso8601(end_date)
    
    case GoogleAPI.list_events_with_service_account(calendar_id, start_date_str, end_date_str) do
      {:ok, google_events} ->
        # Transform Google events into the format expected by the calendar live view
        events = Enum.map(google_events, fn event ->
          %{
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date,
            start_time: event.start_time,
            end_time: event.end_time,
            location: event.location,
            html_link: event.html_link,
            event_type: event.event_type,
            rehearsal_plan_id: event.rehearsal_plan_id,
            set_list_name: event.set_list_name
          }
        end)
        
        {:ok, events}
        
      {:error, reason} -> {:error, reason}
    end
  end
  
  @doc """
  Deletes an event from the band calendar using service account.
  """
  def delete_band_event(%Band{calendar_id: nil}, _event_id), do: {:error, "Band has no calendar"}
  def delete_band_event(%Band{calendar_id: calendar_id}, event_id) do
    GoogleAPI.delete_event_with_service_account(calendar_id, event_id)
  end
  
  @doc """
  Creates an event using service account (by calendar_id directly).
  This is a convenience function that matches the naming convention in band_calendar_live.ex
  """
  def create_event_with_service_account(calendar_id, event_params) do
    GoogleAPI.create_event_with_service_account(calendar_id, event_params)
  end
  
  @doc """
  Deletes an event using service account (by calendar_id directly).
  This is a convenience function that matches the naming convention in band_calendar_live.ex
  """
  def delete_event_with_service_account(calendar_id, event_id) do
    GoogleAPI.delete_event_with_service_account(calendar_id, event_id)
  end
  
  @doc """
  Checks if service account is configured and available.
  """
  def service_account_available? do
    ServiceAccountManager.service_account_configured?()
  end
  
  @doc """
  Checks if service account mode is enabled via feature flag.
  """
  def use_service_account? do
    Application.get_env(:band_db, :use_service_account, true)
  end
  
  @doc """
  Lists calendar shares using service account authentication.
  """
  def list_calendar_shares_with_service_account(calendar_id) do
    case GoogleAPI.get_service_account_token() do
      {:ok, access_token} ->
        GoogleAPI.list_calendar_shares(access_token, calendar_id)
      {:error, reason} ->
        {:error, reason}
    end
  end
  
  @doc """
  Removes a calendar share using service account authentication.
  """
  def remove_calendar_share_with_service_account(calendar_id, rule_id) do
    case GoogleAPI.get_service_account_token() do
      {:ok, access_token} ->
        GoogleAPI.remove_calendar_share(access_token, calendar_id, rule_id)
      {:error, reason} ->
        {:error, reason}
    end
  end
  
  # Unified Calendar Functions
  # These functions automatically use service account when available
  
  @doc """
  Creates a calendar event using the appropriate authentication method.
  If service account is enabled and the user's band has a calendar, uses service account.
  Otherwise falls back to OAuth authentication.
  """
  def create_calendar_event(user, event_params) do
    # Ensure band is loaded
    user = Repo.preload(user, :band)
    
    cond do
      # Use service account if enabled and band has calendar
      use_service_account?() && service_account_available?() && user.band && user.band.calendar_id ->
        # Format the event params for Google Calendar API
        formatted_event = format_event_for_google_api(event_params)
        create_event_with_service_account(user.band.calendar_id, formatted_event)
        
      # Fall back to OAuth if user has calendar configured
      true ->
        case get_google_auth(user) do
          nil -> 
            {:error, "No calendar configured"}
          auth when auth.calendar_id != nil ->
            create_event(user, auth.calendar_id, event_params)
          _ ->
            {:error, "No calendar configured"}
        end
    end
  end
  
  @doc """
  Gets the calendar ID for a user/band using the appropriate method.
  """
  def get_calendar_id(user) do
    # Ensure band is loaded
    user = Repo.preload(user, :band)
    
    cond do
      # Use band calendar if service account is enabled
      use_service_account?() && service_account_available?() && user.band && user.band.calendar_id ->
        {:ok, user.band.calendar_id}
        
      # Fall back to OAuth calendar
      true ->
        case get_google_auth(user) do
          nil -> {:error, "No calendar configured"}
          auth when auth.calendar_id != nil -> {:ok, auth.calendar_id}
          _ -> {:error, "No calendar configured"}
        end
    end
  end
  
  @doc """
  Checks if calendar is available for the user/band.
  """
  def calendar_available?(user) do
    case get_calendar_id(user) do
      {:ok, _} -> true
      _ -> false
    end
  end
  
  # Private function to format event params for Google Calendar API
  defp format_event_for_google_api(event_params) do
    require Logger
    Logger.debug("Original event data: #{inspect(event_params)}")
    
    # Convert the event params to Google Calendar format
    event = %{
      "summary" => Map.get(event_params, :title),
      "description" => Map.get(event_params, :description),
      "location" => Map.get(event_params, :location),
      "extendedProperties" => %{
        "private" => %{
          "eventType" => Map.get(event_params, :event_type, "general"),
          "rehearsalPlanId" => Map.get(event_params, :rehearsal_plan_id),
          "setListName" => Map.get(event_params, :set_list_name)
        }
      }
    }
    
    # Add source URL if provided (for linking back to the app)
    source_url = Map.get(event_params, :source_url)
    source_title = Map.get(event_params, :source_title)
    
    event = if source_url do
      Map.put(event, "source", %{
        "url" => source_url,
        "title" => source_title || "View in BandDb"
      })
    else
      event
    end
    
    # Add start time
    event = case {Map.get(event_params, :date), Map.get(event_params, :start_time)} do
      {date, nil} when not is_nil(date) ->
        # All-day event
        date_str = Date.to_iso8601(date)
        Map.put(event, "start", %{"date" => date_str})
      {date, time} when not is_nil(date) and not is_nil(time) ->
        # Event with specific time
        # Create a naive datetime from the local time input
        naive_dt = NaiveDateTime.new!(
          date.year, date.month, date.day,
          time.hour, time.minute, 0
        )
        
        # Create a datetime in the America/New_York timezone
        timezone = "America/New_York"
        {:ok, ny_datetime} = convert_to_timezone(naive_dt, timezone)
        
        # Format for Google Calendar API
        datetime_str = ny_datetime |> DateTime.to_iso8601()
        Map.put(event, "start", %{"dateTime" => datetime_str, "timeZone" => timezone})
      _ ->
        # No date provided, this is an error
        event
    end
    
    # Add end time
    event = case {Map.get(event_params, :date), Map.get(event_params, :end_time)} do
      {date, nil} when not is_nil(date) ->
        # All-day event - ends the next day
        next_day = Date.add(date, 1)
        date_str = Date.to_iso8601(next_day)
        Map.put(event, "end", %{"date" => date_str})
      {date, time} when not is_nil(date) and not is_nil(time) ->
        # Event with specific time
        # Create a naive datetime from the local time input
        naive_dt = NaiveDateTime.new!(
          date.year, date.month, date.day,
          time.hour, time.minute, 0
        )
        
        # Create a datetime in the America/New_York timezone
        timezone = "America/New_York"
        {:ok, ny_datetime} = convert_to_timezone(naive_dt, timezone)
        
        # Format for Google Calendar API
        datetime_str = ny_datetime |> DateTime.to_iso8601()
        Map.put(event, "end", %{"dateTime" => datetime_str, "timeZone" => timezone})
      _ ->
        # If no end time but we have start time, use start time + 1 hour
        case event do
          %{"start" => %{"dateTime" => start_datetime_str}} ->
            {:ok, start_datetime, _} = DateTime.from_iso8601(start_datetime_str)
            end_datetime = DateTime.add(start_datetime, 3600, :second)
            end_datetime_str = DateTime.to_iso8601(end_datetime)
            timezone = "America/New_York"
            Map.put(event, "end", %{"dateTime" => end_datetime_str, "timeZone" => timezone})
          _ ->
            # Ensure we always have an end time
            # If we get here, we don't have start or end time
            # Use current date + default times as a fallback
            now = DateTime.utc_now()
            
            # Create a naive datetime for 9 PM today
            naive_dt = NaiveDateTime.new!(
              now.year, now.month, now.day,
              21, 0, 0
            )
            
            # Create a datetime in the specified timezone
            timezone = "America/New_York"
            {:ok, ny_datetime} = convert_to_timezone(naive_dt, timezone)
            
            # Format for Google Calendar API
            datetime_str = ny_datetime |> DateTime.to_iso8601()
            Map.put(event, "end", %{"dateTime" => datetime_str, "timeZone" => timezone})
        end
    end
    
    # Log the formatted event
    Logger.debug("Formatted Google Calendar event: #{inspect(event)}")
    
    event
  end
end
