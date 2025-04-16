defmodule BandDb.Calendar.GoogleAPI do
  @moduledoc """
  Handles API calls to Google Calendar.
  """

  # URLs for Google API
  @token_url "https://oauth2.googleapis.com/token"
  @calendar_api_url "https://www.googleapis.com/calendar/v3"

  # Get credentials from environment at runtime
  defp client_id, do: System.get_env("GOOGLE_CLIENT_ID") || Application.get_env(:band_db, :google_api)[:client_id]
  defp client_secret, do: System.get_env("GOOGLE_CLIENT_SECRET") || Application.get_env(:band_db, :google_api)[:client_secret]
  defp redirect_uri, do: System.get_env("GOOGLE_REDIRECT_URI") || Application.get_env(:band_db, :google_api)[:redirect_uri] || "http://localhost:4000/auth/google/callback"

  # Calendar API related functions

  @doc """
  Generates the URL for OAuth authorization.
  """
  def authorize_url do
    params = %{
      client_id: client_id(),
      redirect_uri: redirect_uri(),
      response_type: "code",
      scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
      access_type: "offline",
      prompt: "consent" # Always ask for consent to ensure we get a refresh token
    }

    query = URI.encode_query(params)
    "https://accounts.google.com/o/oauth2/v2/auth?#{query}"
  end

  @doc """
  Exchanges an authorization code for tokens.
  Returns {:ok, %{access_token, refresh_token, expires_in}} or {:error, reason}
  """
  def exchange_code_for_token(code) do
    params = %{
      client_id: client_id(),
      client_secret: client_secret(),
      code: code,
      grant_type: "authorization_code",
      redirect_uri: redirect_uri()
    }

    case HTTPoison.post(@token_url, URI.encode_query(params), [{"Content-Type", "application/x-www-form-urlencoded"}]) do
      {:ok, %{status_code: 200, body: body}} ->
        token_data = Jason.decode!(body)
        {:ok, %{
          access_token: token_data["access_token"],
          refresh_token: token_data["refresh_token"],
          expires_in: token_data["expires_in"]
        }}

      {:ok, %{status_code: status_code, body: body}} ->
        {:error, "Failed to get token: HTTP #{status_code} - #{body}"}

      {:error, %{reason: reason}} ->
        {:error, "Network error: #{reason}"}
    end
  end

  @doc """
  Refreshes an access token using a refresh token.
  Returns {:ok, %{access_token, expires_in}} or {:error, reason}
  """
  def refresh_access_token(refresh_token) do
    params = %{
      client_id: client_id(),
      client_secret: client_secret(),
      refresh_token: refresh_token,
      grant_type: "refresh_token"
    }

    case HTTPoison.post(@token_url, URI.encode_query(params), [{"Content-Type", "application/x-www-form-urlencoded"}]) do
      {:ok, %{status_code: 200, body: body}} ->
        token_data = Jason.decode!(body)
        {:ok, %{
          access_token: token_data["access_token"],
          expires_in: token_data["expires_in"]
        }}

      {:ok, %{status_code: status_code, body: body}} ->
        {:error, "Failed to refresh token: HTTP #{status_code} - #{body}"}

      {:error, %{reason: reason}} ->
        {:error, "Network error: #{reason}"}
    end
  end

  @doc """
  Lists the user's calendars.
  Returns {:ok, calendars} or {:error, reason}
  """
  def list_calendars(access_token) do
    headers = [
      {"Authorization", "Bearer #{access_token}"},
      {"Accept", "application/json"}
    ]

    case HTTPoison.get("#{@calendar_api_url}/users/me/calendarList", headers) do
      {:ok, %{status_code: 200, body: body}} ->
        calendars = Jason.decode!(body)["items"]
        |> Enum.map(fn cal ->
          %{
            id: cal["id"],
            summary: cal["summary"],
            description: cal["description"],
            primary: cal["primary"] || false
          }
        end)
        {:ok, calendars}

      {:ok, %{status_code: status_code, body: body}} ->
        {:error, "Failed to list calendars: HTTP #{status_code} - #{body}"}

      {:error, %{reason: reason}} ->
        {:error, "Network error: #{reason}"}
    end
  end

  @doc """
  Creates a new calendar.
  Returns {:ok, calendar_id} or {:error, reason}
  """
  def create_calendar(access_token, name, description \\ nil) do
    headers = [
      {"Authorization", "Bearer #{access_token}"},
      {"Content-Type", "application/json"},
      {"Accept", "application/json"}
    ]

    body = Jason.encode!(%{
      summary: name,
      description: description
    })

    case HTTPoison.post("#{@calendar_api_url}/calendars", body, headers) do
      {:ok, %{status_code: 200, body: response_body}} ->
        {:ok, Jason.decode!(response_body)["id"]}

      {:ok, %{status_code: status_code, body: response_body}} ->
        {:error, "Failed to create calendar: HTTP #{status_code} - #{response_body}"}

      {:error, %{reason: reason}} ->
        {:error, "Network error: #{reason}"}
    end
  end

  @doc """
  Creates a calendar event.
  Returns {:ok, event_id} or {:error, reason}
  """
  def create_event(access_token, calendar_id, event) do
    headers = [
      {"Authorization", "Bearer #{access_token}"},
      {"Content-Type", "application/json"},
      {"Accept", "application/json"}
    ]

    # Log original event for debugging
    require Logger
    Logger.debug("Original event data: #{inspect(event)}")

    # Ensure we're not sending any nil values in extended properties
    cleaned_event = if Map.has_key?(event, "extendedProperties") do
      private_props = get_in(event, ["extendedProperties", "private"]) || %{}

      # Filter out nil values
      clean_private = private_props
                      |> Enum.filter(fn {_, v} -> v != nil end)
                      |> Enum.into(%{})

      # Log clean private props for debugging
      Logger.debug("Clean private properties: #{inspect(clean_private)}")

      put_in(event, ["extendedProperties", "private"], clean_private)
    else
      event
    end

    # Ensure required fields are present
    required_fields = ["summary", "start", "end"]
    missing_fields = Enum.filter(required_fields, fn field ->
      !Map.has_key?(cleaned_event, field) || cleaned_event[field] == nil
    end)

    if length(missing_fields) > 0 do
      require Logger
      Logger.error("Missing required fields for calendar event: #{inspect(missing_fields)}")
      {:error, "Missing required fields: #{Enum.join(missing_fields, ", ")}"}
    else
      # Convert to JSON, log and send
      json_body = Jason.encode!(cleaned_event)
      require Logger
      Logger.debug("Sending event to Google Calendar API: #{json_body}")
      Logger.debug("URL: #{@calendar_api_url}/calendars/#{calendar_id}/events")

      case HTTPoison.post("#{@calendar_api_url}/calendars/#{calendar_id}/events", json_body, headers) do
        {:ok, %{status_code: status_code, body: body}} when status_code in 200..299 ->
          {:ok, Jason.decode!(body)["id"]}

        {:ok, %{status_code: status_code, body: body}} ->
          Logger.error("Google Calendar API error: HTTP #{status_code} - #{body}")
          {:error, "Failed to create event: HTTP #{status_code} - #{body}"}

        {:error, %{reason: reason}} ->
          Logger.error("Network error when creating calendar event: #{reason}")
          {:error, "Network error: #{reason}"}
      end
    end
  end

  @doc """
  Lists events from a calendar between specified dates.
  Returns {:ok, events} or {:error, reason}
  """
  def list_events(access_token, calendar_id, start_date, end_date) do
    headers = [
      {"Authorization", "Bearer #{access_token}"},
      {"Accept", "application/json"}
    ]

    query_params = URI.encode_query(%{
      "timeMin" => "#{start_date}T00:00:00Z",
      "timeMax" => "#{end_date}T23:59:59Z",
      "singleEvents" => "true",
      "orderBy" => "startTime"
    })

    url = "#{@calendar_api_url}/calendars/#{URI.encode(calendar_id)}/events?#{query_params}"

    case HTTPoison.get(url, headers) do
      {:ok, %{status_code: 200, body: body}} ->
        events = Jason.decode!(body)["items"]
        |> Enum.map(fn event ->
          map_event(event)
        end)
        {:ok, events}

      {:ok, %{status_code: status_code, body: body}} ->
        {:error, "Failed to list events: HTTP #{status_code} - #{body}"}

      {:error, %{reason: reason}} ->
        {:error, "Network error: #{reason}"}
    end
  end

  @doc """
  Deletes an event from the specified calendar.
  Returns :ok or {:error, reason}
  """
  def delete_event(access_token, calendar_id, event_id) do
    headers = [
      {"Authorization", "Bearer #{access_token}"},
      {"Accept", "application/json"}
    ]

    url = "#{@calendar_api_url}/calendars/#{URI.encode(calendar_id)}/events/#{URI.encode(event_id)}"

    case HTTPoison.delete(url, headers) do
      {:ok, %{status_code: status_code}} when status_code in [200, 204] ->
        :ok

      {:ok, %{status_code: status_code, body: body}} ->
        {:error, "Failed to delete event: HTTP #{status_code} - #{body}"}

      {:error, %{reason: reason}} ->
        {:error, "Network error: #{reason}"}
    end
  end

  # Map Google event to our internal format
  defp map_event(event) do
    # Extract date info
    start_datetime = get_in(event, ["start", "dateTime"])
    start_date = get_in(event, ["start", "date"])
    end_datetime = get_in(event, ["end", "dateTime"])
    end_date = get_in(event, ["end", "date"])

    # Extract extended properties if available
    extended_properties = get_in(event, ["extendedProperties", "private"]) || %{}
    event_type = Map.get(extended_properties, "eventType")
    rehearsal_plan_id = Map.get(extended_properties, "rehearsalPlanId")
    set_list_name = Map.get(extended_properties, "setListName")

    # Log extended properties for debugging
    require Logger
    Logger.debug("Extended properties for event #{event["id"]}: #{inspect(extended_properties)}")
    Logger.debug("Event type: #{event_type}, rehearsal_plan_id: #{rehearsal_plan_id}, set_list_name: #{set_list_name}")

    # Determine if this is an all-day event
    is_all_day = start_date != nil && end_date != nil

    # Parse dates
    {date, start_time, end_time} = if is_all_day do
      {Date.from_iso8601!(start_date), nil, nil}
    else
      {:ok, datetime, _} = DateTime.from_iso8601(start_datetime)
      {:ok, end_dt, _} = DateTime.from_iso8601(end_datetime)
      {DateTime.to_date(datetime), datetime, end_dt}
    end

    # Build our event structure
    %{
      id: event["id"],
      title: event["summary"],
      description: event["description"],
      location: event["location"],
      date: date,
      start_time: start_time,
      end_time: end_time,
      is_all_day: is_all_day,
      html_link: event["htmlLink"],
      event_type: event_type,
      rehearsal_plan_id: rehearsal_plan_id,
      set_list_name: set_list_name
    }
  end
end
