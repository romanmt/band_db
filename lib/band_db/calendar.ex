defmodule BandDb.Calendar do
  @moduledoc """
  The Calendar context.
  Handles Google Calendar integration and management.
  """

  alias BandDb.Repo
  alias BandDb.Accounts.User
  alias BandDb.Calendar.GoogleAuth
  alias BandDb.Calendar.GoogleAPI

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
end
