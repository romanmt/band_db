defmodule BandDb.Calendar.ICSGenerator do
  @moduledoc """
  Generates ICS (iCalendar) format files for calendar feeds.
  Supports creating calendar feeds for bands that can be subscribed to
  by various calendar applications.
  """
  
  alias BandDb.Accounts.Band
  alias BandDb.Calendar
  
  @doc """
  Generates an ICS feed for a band's calendar events.
  Returns the ICS content as a string.
  """
  def generate_feed(%Band{} = band, start_date \\ nil, end_date \\ nil) do
    # Default to 3 months before and 6 months after today
    start_date = start_date || Date.add(Date.utc_today(), -90)
    end_date = end_date || Date.add(Date.utc_today(), 180)
    
    # Get events from the band calendar
    events = case Calendar.list_band_events(band, start_date, end_date) do
      {:ok, events} -> events
      {:error, _} -> []
    end
    
    # Generate ICS content
    ics_content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Band Boss//#{band.name} Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:#{band.name} Rehearsals & Shows",
      "X-WR-CALDESC:Calendar for #{band.name} rehearsals and performances",
      "X-WR-TIMEZONE:America/New_York"
    ]
    
    # Add timezone definition
    ics_content = ics_content ++ timezone_definition()
    
    # Add events
    event_entries = Enum.map(events, &format_event(&1, band))
    ics_content = ics_content ++ List.flatten(event_entries)
    
    # Close calendar
    ics_content = ics_content ++ ["END:VCALENDAR"]
    
    # Join with CRLF line endings as required by ICS spec
    Enum.join(ics_content, "\r\n")
  end
  
  defp timezone_definition do
    [
      "BEGIN:VTIMEZONE",
      "TZID:America/New_York",
      "X-LIC-LOCATION:America/New_York",
      "BEGIN:DAYLIGHT",
      "TZOFFSETFROM:-0500",
      "TZOFFSETTO:-0400",
      "TZNAME:EDT",
      "DTSTART:19700308T020000",
      "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
      "END:DAYLIGHT",
      "BEGIN:STANDARD",
      "TZOFFSETFROM:-0400",
      "TZOFFSETTO:-0500",
      "TZNAME:EST",
      "DTSTART:19701101T020000",
      "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
      "END:STANDARD",
      "END:VTIMEZONE"
    ]
  end
  
  defp format_event(event, band) do
    uid = "#{event.id}@bandboss.#{band.id}"
    
    # Format dates based on whether it's all-day or timed
    {dtstart, dtend} = if event.start_time do
      # Timed event
      start_dt = format_datetime(event.date, event.start_time)
      end_dt = if event.end_time do
        format_datetime(event.date, event.end_time)
      else
        # Default to 1 hour duration if no end time
        format_datetime(event.date, Time.add(event.start_time, 3600, :second))
      end
      
      {"DTSTART;TZID=America/New_York:#{start_dt}", "DTEND;TZID=America/New_York:#{end_dt}"}
    else
      # All-day event
      start_date = format_date(event.date)
      end_date = format_date(Date.add(event.date, 1))
      
      {"DTSTART;VALUE=DATE:#{start_date}", "DTEND;VALUE=DATE:#{end_date}"}
    end
    
    # Build event entry
    event_lines = [
      "BEGIN:VEVENT",
      "UID:#{uid}",
      dtstart,
      dtend,
      "DTSTAMP:#{format_utc_datetime(DateTime.utc_now())}",
      "SUMMARY:#{escape_text(event.title || "Untitled Event")}",
      "LOCATION:#{escape_text(event.location || "")}",
      "DESCRIPTION:#{escape_text(event.description || "")}",
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE"
    ]
    
    # Add event type classification if available
    event_lines = case event.event_type do
      "rehearsal" -> event_lines ++ ["CATEGORIES:REHEARSAL"]
      "performance" -> event_lines ++ ["CATEGORIES:PERFORMANCE,SHOW"]
      _ -> event_lines
    end
    
    # Add URL if available
    event_lines = if event.html_link do
      event_lines ++ ["URL:#{event.html_link}"]
    else
      event_lines
    end
    
    event_lines ++ ["END:VEVENT"]
  end
  
  defp format_datetime(date, time) do
    # Combine date and time into a datetime string
    # Format: YYYYMMDDTHHMMSS
    date_str = date |> Date.to_iso8601() |> String.replace("-", "")
    time_str = time |> Time.to_iso8601() |> String.split(".") |> List.first() |> String.replace(":", "")
    "#{date_str}T#{time_str}"
  end
  
  defp format_date(date) do
    # Format: YYYYMMDD
    date |> Date.to_iso8601() |> String.replace("-", "")
  end
  
  defp format_utc_datetime(datetime) do
    # Format: YYYYMMDDTHHMMSSZ
    datetime
    |> DateTime.to_iso8601()
    |> String.replace(["-", ":"], "")
    |> String.split(".")
    |> List.first()
    |> Kernel.<>("Z")
  end
  
  defp escape_text(text) do
    # Escape special characters as required by ICS spec
    text
    |> to_string()
    |> String.replace("\\", "\\\\")
    |> String.replace(",", "\\,")
    |> String.replace(";", "\\;")
    |> String.replace("\n", "\\n")
  end
  
  @doc """
  Validates that a band has a valid iCal token.
  Uses secure comparison to prevent timing attacks.
  """
  def validate_token(%Band{ical_token: token}, provided_token) when is_binary(token) and is_binary(provided_token) do
    Plug.Crypto.secure_compare(token, provided_token)
  end
  def validate_token(_, _), do: false
end