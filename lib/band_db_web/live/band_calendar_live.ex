defmodule BandDbWeb.BandCalendarLive do
  use BandDbWeb, :live_view
  use BandDbWeb.Live.Lifecycle
  import BandDbWeb.Components.PageHeader
  alias BandDb.Calendar

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    # Use the current_user that was already assigned by the on_mount callback
    current_user = socket.assigns.current_user
    band = current_user.band
    
    # Service Account Mode only
    service_account_configured = Calendar.service_account_available?()
    has_calendar = band && band.calendar_id != nil
    
    if service_account_configured && has_calendar do
      # Fetch calendar data using service account
      current_date = Date.utc_today()
      events = case Calendar.list_band_events(band, current_date |> Date.beginning_of_month(), current_date |> Date.end_of_month()) do
        {:ok, events} -> events
        {:error, _} -> []
      end
      events_by_date = group_events_by_date(events)
      
      {:ok,
       assign(socket,
         current_date: current_date,
         month_name: month_name(current_date.month),
         year: current_date.year,
         events: events,
         events_by_date: events_by_date,
         show_event_modal: false,
         selected_event: nil,
         show_event_form: false,
         show_day_events: false,
         selected_date: nil,
         event_form: %{
           title: "",
           all_day: false,
           start_time: "",
           end_time: "",
           location: "",
           description: ""
         },
         form_error: nil,
         has_calendar: has_calendar,
         service_account_configured: service_account_configured,
         band: band
       )}
    else
      # If no service account or no calendar
      {:ok,
       assign(socket,
         has_calendar: has_calendar,
         service_account_configured: service_account_configured,
         show_event_modal: false,
         show_event_form: false,
         show_day_events: false,
         band: band
       )}
    end
  end

  @impl true
  def handle_event("prev_month", _params, socket) do
    current_date = socket.assigns.current_date

    # Get the first day of the current month and subtract one day to get the last day of the previous month
    first_day = Date.beginning_of_month(current_date)
    prev_month_last_day = Date.add(first_day, -1)

    # Get a date in the middle of the previous month (e.g., the 15th)
    prev_month = %{prev_month_last_day | day: min(15, Date.days_in_month(prev_month_last_day))}

    {:noreply, push_patch(socket, to: ~p"/calendar/#{prev_month.year}/#{prev_month.month}")}
  end

  @impl true
  def handle_event("next_month", _params, socket) do
    current_date = socket.assigns.current_date

    # Get the last day of the current month and add one day to get the first day of the next month
    last_day = Date.end_of_month(current_date)
    next_month_first_day = Date.add(last_day, 1)

    # Get a date in the middle of the next month (e.g., the 15th)
    next_month = %{next_month_first_day | day: min(15, Date.days_in_month(next_month_first_day))}

    {:noreply, push_patch(socket, to: ~p"/calendar/#{next_month.year}/#{next_month.month}")}
  end

  @impl true
  def handle_event("today", _params, socket) do
    today = Date.utc_today()
    {:noreply, push_patch(socket, to: ~p"/calendar/#{today.year}/#{today.month}")}
  end

  @impl true
  def handle_event("delete_event", %{"id" => event_id}, socket) do
    # Service Account Mode
    band = socket.assigns.band
    case Calendar.delete_event_with_service_account(band.calendar_id, event_id) do
      :ok ->
        # Refresh calendar data
        {:noreply, update_calendar(socket, socket.assigns.current_date)}
      {:error, reason} ->
        {:noreply, put_flash(socket, :error, "Failed to delete event: #{reason}")}
    end
  end

  @impl true
  def handle_event("show_day_events", %{"date" => date_string}, socket) do
    date = Date.from_iso8601!(date_string)
    events = Map.get(socket.assigns.events_by_date, date, [])

    {:noreply,
     socket
     |> assign(selected_date: date)
     |> assign(day_events: events)
     |> assign(show_day_events: true)}
  end

  @impl true
  def handle_event("close_day_events", _params, socket) do
    {:noreply,
     socket
     |> assign(show_day_events: false)
     |> assign(selected_date: nil)
     |> assign(day_events: [])}
  end

  @impl true
  def handle_event("toggle_event_modal", %{"id" => event_id}, socket) do
    event = Enum.find(socket.assigns.events, &(&1.id == event_id))
    {:noreply, assign(socket, show_event_modal: true, selected_event: event)}
  end

  @impl true
  def handle_event("close_event_modal", _params, socket) do
    {:noreply, assign(socket, show_event_modal: false, selected_event: nil)}
  end

  @impl true
  def handle_event("show_event_form", %{"date" => date_string}, socket) do
    date = Date.from_iso8601!(date_string)
    
    # Set default times for the form
    event_form = %{
      title: "",
      all_day: false,
      start_time: "19:00",  # Default to 7:00 PM
      end_time: "22:00",    # Default to 10:00 PM
      location: "",
      description: "",
      date: date
    }
    
    {:noreply,
     socket
     |> assign(show_event_form: true)
     |> assign(event_form: event_form)
     |> assign(form_error: nil)}
  end

  @impl true
  def handle_event("close_event_form", _params, socket) do
    {:noreply,
     socket
     |> assign(show_event_form: false)
     |> assign(event_form: %{})
     |> assign(form_error: nil)}
  end

  @impl true
  def handle_event("update_event_form", %{"event" => event_params}, socket) do
    event_form = Map.merge(socket.assigns.event_form, event_params)
    
    # Convert string "true"/"false" to boolean for all_day
    event_form = Map.put(event_form, "all_day", event_params["all_day"] == "true")
    
    {:noreply, assign(socket, event_form: event_form)}
  end

  @impl true
  def handle_event("create_event", %{"event" => event_params}, socket) do
    # Parse the form data
    date = socket.assigns.event_form.date
    all_day = event_params["all_day"] == "true"
    
    # Build event data
    event_data = %{
      title: event_params["title"],
      date: date,
      location: event_params["location"],
      description: event_params["description"],
      event_type: "general"
    }
    
    # Add time information if not all-day
    event_data = if all_day do
      event_data
    else
      # Parse times
      start_time = parse_time(event_params["start_time"])
      end_time = parse_time(event_params["end_time"])
      
      Map.merge(event_data, %{
        start_time: start_time,
        end_time: end_time
      })
    end
    
    # Validate required fields
    cond do
      String.trim(event_data.title) == "" ->
        {:noreply, assign(socket, form_error: "Title is required")}
      
      !all_day && (is_nil(event_data.start_time) || is_nil(event_data.end_time)) ->
        {:noreply, assign(socket, form_error: "Invalid time format")}
      
      true ->
        # Service Account Mode
        band = socket.assigns.band
        case Calendar.create_event_with_service_account(band.calendar_id, event_data) do
          {:ok, _event_id} ->
            # Refresh calendar data
            {:noreply,
             socket
             |> update_calendar(socket.assigns.current_date)
             |> assign(show_event_form: false)
             |> assign(event_form: %{})
             |> assign(form_error: nil)
             |> put_flash(:info, "Event created successfully")}
          
          {:error, reason} ->
            {:noreply, assign(socket, form_error: "Failed to create event: #{reason}")}
        end
    end
  end

  @impl true
  def handle_params(%{"year" => year_str, "month" => month_str}, _uri, socket) do
    year = String.to_integer(year_str)
    month = String.to_integer(month_str)
    
    # Create a date for the requested month
    {:ok, date} = Date.new(year, month, 1)
    
    {:noreply, update_calendar(socket, date)}
  end

  def handle_params(_params, _uri, socket) do
    # Default to current month if no params
    if Map.has_key?(socket.assigns, :current_date) do
      {:noreply, socket}
    else
      current_date = Date.utc_today()
      {:noreply, update_calendar(socket, current_date)}
    end
  end

  # Update calendar data based on the given date
  defp update_calendar(socket, date) do
    band = socket.assigns.band
    has_calendar = band && band.calendar_id != nil
    
    if has_calendar do
      # Fetch events for the month
      events = fetch_events(band, date)
      events_by_date = group_events_by_date(events)
      
      socket
      |> assign(current_date: date)
      |> assign(month_name: month_name(date.month))
      |> assign(year: date.year)
      |> assign(events: events)
      |> assign(events_by_date: events_by_date)
    else
      socket
      |> assign(current_date: date)
      |> assign(month_name: month_name(date.month))
      |> assign(year: date.year)
      |> assign(events: [])
      |> assign(events_by_date: %{})
    end
  end

  # Helper function to fetch events for a month
  defp fetch_events(band, date) do
    # Get the first and last days of the month
    first_day = Date.beginning_of_month(date)
    last_day = Date.end_of_month(date)
    
    # Fetch events using service account
    case Calendar.list_band_events(band, first_day, last_day) do
      {:ok, events} -> events
      {:error, _reason} -> []
    end
  end

  # Group events by date for easy lookup
  defp group_events_by_date(events) do
    Enum.group_by(events, & &1.date)
  end

  # Get the month name
  defp month_name(month) do
    Enum.at(
      ["January", "February", "March", "April", "May", "June", 
       "July", "August", "September", "October", "November", "December"],
      month - 1
    )
  end

  # Generate calendar days for the month view
  defp calendar_days(year, month) do
    # Get the first day of the month
    {:ok, first_day} = Date.new(year, month, 1)
    
    # Get the last day of the month
    last_day = Date.end_of_month(first_day)
    
    # Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    first_day_of_week = Date.day_of_week(first_day, :sunday)
    
    # Calculate padding days from previous month
    padding_start = first_day_of_week - 1
    
    # Get days from previous month
    prev_month_days = if padding_start > 0 do
      prev_month_last_day = Date.add(first_day, -1)
      prev_month_first_padding_day = Date.add(prev_month_last_day, -(padding_start - 1))
      
      Enum.map(0..(padding_start - 1), fn offset ->
        date = Date.add(prev_month_first_padding_day, offset)
        %{date: date, current_month: false}
      end)
    else
      []
    end
    
    # Get days from current month
    current_month_days = Enum.map(1..last_day.day, fn day ->
      {:ok, date} = Date.new(year, month, day)
      %{date: date, current_month: true}
    end)
    
    # Calculate padding days from next month to complete the grid
    total_days = length(prev_month_days) + length(current_month_days)
    remaining_days = 42 - total_days  # 6 weeks * 7 days = 42
    
    next_month_days = if remaining_days > 0 do
      next_month_first_day = Date.add(last_day, 1)
      
      Enum.map(0..(remaining_days - 1), fn offset ->
        date = Date.add(next_month_first_day, offset)
        %{date: date, current_month: false}
      end)
    else
      []
    end
    
    # Combine all days
    prev_month_days ++ current_month_days ++ next_month_days
  end

  # Helper to parse time string
  defp parse_time(time_string) when is_binary(time_string) do
    case String.split(time_string, ":") do
      [hour_str, minute_str] ->
        with {hour, ""} <- Integer.parse(hour_str),
             {minute, ""} <- Integer.parse(minute_str) do
          Time.new(hour, minute, 0)
          |> case do
            {:ok, time} -> time
            _ -> nil
          end
        else
          _ -> nil
        end
      _ -> nil
    end
  end
  defp parse_time(_), do: nil

  # Helper functions for the template
  defp format_time_12h(nil), do: ""
  defp format_time_12h(time) do
    hour = time.hour
    minute = time.minute |> Integer.to_string() |> String.pad_leading(2, "0")
    
    {display_hour, period} = cond do
      hour == 0 -> {12, "AM"}
      hour < 12 -> {hour, "AM"}
      hour == 12 -> {12, "PM"}
      true -> {hour - 12, "PM"}
    end
    
    "#{display_hour}:#{minute} #{period}"
  end

  defp events_for_date(date, events_by_date) do
    Map.get(events_by_date, date, [])
  end

  defp in_current_month?(date, current_date) do
    date.year == current_date.year && date.month == current_date.month
  end

  defp is_today?(date) do
    Date.compare(date, Date.utc_today()) == :eq
  end
end