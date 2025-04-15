defmodule BandDb.Calendar do
  @moduledoc """
  The Calendar context.
  Handles Google Calendar integration and management.
  """

  import Ecto.Query
  alias BandDb.Repo
  alias BandDb.Calendar.GoogleAuth
  alias BandDb.Calendar.GoogleAPI
  alias BandDb.Accounts.User

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
          # Extract the date from the event start datetime
          date = case event.start do
            %{"date" => date_str} -> Date.from_iso8601!(date_str)
            %{"dateTime" => datetime_str} ->
              {:ok, datetime, _} = DateTime.from_iso8601(datetime_str)
              DateTime.to_date(datetime)
          end

          %{
            id: event.id,
            title: event.summary,
            description: event.description,
            date: date,
            start_time: get_start_time(event),
            end_time: get_end_time(event),
            location: event.location,
            html_link: event.html_link
          }
        end)

        {:ok, events}

      {:error, reason} -> {:error, reason}
    end
  end

  # Helper function to extract start time from Google event
  defp get_start_time(event) do
    case event.start do
      %{"dateTime" => datetime_str} ->
        {:ok, datetime, _} = DateTime.from_iso8601(datetime_str)
        datetime
      _ -> nil
    end
  end

  # Helper function to extract end time from Google event
  defp get_end_time(event) do
    case event.end do
      %{"dateTime" => datetime_str} ->
        {:ok, datetime, _} = DateTime.from_iso8601(datetime_str)
        datetime
      _ -> nil
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

  Returns {:ok, event_id} or {:error, reason}
  """
  def create_event(%User{} = user, calendar_id, event_params) do
    case get_access_token(user) do
      {:ok, access_token} ->
        # Convert the event params to Google Calendar format
        event = %{
          "summary" => Map.get(event_params, :title),
          "description" => Map.get(event_params, :description),
          "location" => Map.get(event_params, :location),
          "extendedProperties" => %{
            "private" => %{
              "eventType" => Map.get(event_params, :event_type, "general"),
              "rehearsalPlanId" => Map.get(event_params, :rehearsal_plan_id)
            }
          }
        }

        # Add start time
        event = case {Map.get(event_params, :date), Map.get(event_params, :start_time)} do
          {date, nil} when not is_nil(date) ->
            # All-day event
            date_str = Date.to_iso8601(date)
            Map.put(event, "start", %{"date" => date_str})
          {date, time} when not is_nil(date) and not is_nil(time) ->
            # Event with specific time
            datetime = %DateTime{
              year: date.year,
              month: date.month,
              day: date.day,
              hour: time.hour,
              minute: time.minute,
              second: 0,
              microsecond: {0, 0},
              time_zone: "Etc/UTC",
              zone_abbr: "UTC",
              utc_offset: 0,
              std_offset: 0
            }
            datetime_str = DateTime.to_iso8601(datetime)
            Map.put(event, "start", %{"dateTime" => datetime_str, "timeZone" => "UTC"})
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
            datetime = %DateTime{
              year: date.year,
              month: date.month,
              day: date.day,
              hour: time.hour,
              minute: time.minute,
              second: 0,
              microsecond: {0, 0},
              time_zone: "Etc/UTC",
              zone_abbr: "UTC",
              utc_offset: 0,
              std_offset: 0
            }
            datetime_str = DateTime.to_iso8601(datetime)
            Map.put(event, "end", %{"dateTime" => datetime_str, "timeZone" => "UTC"})
          _ ->
            # If no end time but we have start time, use start time + 1 hour
            case event do
              %{"start" => %{"dateTime" => start_datetime_str}} ->
                {:ok, start_datetime, _} = DateTime.from_iso8601(start_datetime_str)
                end_datetime = DateTime.add(start_datetime, 3600, :second)
                end_datetime_str = DateTime.to_iso8601(end_datetime)
                Map.put(event, "end", %{"dateTime" => end_datetime_str, "timeZone" => "UTC"})
              _ ->
                # Ensure we always have an end time
                # If we get here, we don't have start or end time
                # Use current date + default times as a fallback
                now = DateTime.utc_now()
                default_end = %DateTime{
                  year: now.year,
                  month: now.month,
                  day: now.day,
                  hour: 21,
                  minute: 0,
                  second: 0,
                  microsecond: {0, 0},
                  time_zone: "Etc/UTC",
                  zone_abbr: "UTC",
                  utc_offset: 0,
                  std_offset: 0
                }
                datetime_str = DateTime.to_iso8601(default_end)
                Map.put(event, "end", %{"dateTime" => datetime_str, "timeZone" => "UTC"})
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
end
