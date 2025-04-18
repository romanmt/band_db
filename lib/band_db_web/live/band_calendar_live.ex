defmodule BandDbWeb.BandCalendarLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader
  alias BandDb.Calendar

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    # Use the current_user that was already assigned by the on_mount callback
    current_user = socket.assigns.current_user

    # Check Google Calendar connection status
    connected = has_valid_google_auth?(current_user)

    # Check if user has a band calendar configured
    has_calendar = connected && has_band_calendar?(current_user)

    # Get calendars list if connected
    calendars = if connected, do: get_calendars(current_user), else: []

    if connected && has_calendar do
      # Only fetch calendar data if we have a valid connection and calendar
      current_date = Date.utc_today()
      {:ok, events} = fetch_events(current_user, current_date)
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
         connected: connected,
         has_calendar: has_calendar,
         calendars: calendars,
         band_name: "",
         google_auth: Calendar.get_google_auth(current_user)
       )}
    else
      # If not connected or no calendar, just set basic assigns
      {:ok,
       assign(socket,
         connected: connected,
         has_calendar: has_calendar,
         show_event_modal: false,
         show_event_form: false,
         calendars: calendars,
         band_name: "",
         google_auth: Calendar.get_google_auth(current_user)
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
  def handle_event("show_event", %{"id" => event_id}, socket) do
    # Find the event from the list
    event = Enum.find(socket.assigns.events, &(&1.id == event_id))

    socket = socket
      |> assign(:selected_event, event)
      |> assign(:show_event_modal, true)

    {:noreply, socket}
  end

  @impl true
  def handle_event("close_modal", _, socket) do
    {:noreply, assign(socket, show_event_modal: false)}
  end

  @impl true
  def handle_event("delete_event", %{"id" => event_id}, socket) do
    user = socket.assigns.current_user
    google_auth = Calendar.get_google_auth(user)
    calendar_id = google_auth.calendar_id

    case Calendar.delete_event(user, calendar_id, event_id) do
      :ok ->
        # Refresh calendar data
        socket = update_calendar(socket, socket.assigns.current_date)

        {:noreply, assign(socket, show_event_modal: false)}

      {:error, reason} ->
        # Show error but keep modal open
        {:noreply, put_flash(socket, :error, "Failed to delete event: #{reason}")}
    end
  end

  @impl true
  def handle_event("new_event", %{"date" => date_str}, socket) do
    date = Date.from_iso8601!(date_str)

    socket = socket
      |> assign(:selected_date, date)
      |> assign(:show_event_form, true)
      |> assign(:event_form, %{
        title: "",
        description: "",
        location: "",
        all_day: true,
        start_time: ~T[09:00:00],
        end_time: ~T[10:00:00]
      })

    {:noreply, socket}
  end

  @impl true
  def handle_event("close_form", _, socket) do
    {:noreply, assign(socket, show_event_form: false, form_error: nil)}
  end

  @impl true
  def handle_event("save_event", %{"event" => event_params}, socket) do
    # Convert form params to our expected format
    event_data = %{
      title: event_params["title"],
      description: event_params["description"],
      location: event_params["location"],
      date: socket.assigns.selected_date
    }

    # Add time info if not an all-day event
    event_data =
      if event_params["all_day"] == "true" do
        event_data
      else
        try do
          # Ensure time strings are properly formatted with seconds
          start_time_str = ensure_time_has_seconds(event_params["start_time"])
          end_time_str = ensure_time_has_seconds(event_params["end_time"])

          start_time = Time.from_iso8601!(start_time_str)
          end_time = Time.from_iso8601!(end_time_str)
          event_data
          |> Map.put(:start_time, start_time)
          |> Map.put(:end_time, end_time)
        rescue
          e in ArgumentError ->
            require Logger
            Logger.error("Time parsing error: #{inspect(e)}, start_time=#{inspect(event_params["start_time"])}, end_time=#{inspect(event_params["end_time"])}")
            {:error, "Invalid time format. Please use HH:MM format."}
        end
      end

    # Handle errors or continue with validation
    case event_data do
      {:error, reason} ->
        {:noreply, assign(socket, form_error: reason)}
      _ ->
        # Validate form
        if event_data.title == "" do
          {:noreply, assign(socket, form_error: "Title is required")}
        else
          user = socket.assigns.current_user
          google_auth = Calendar.get_google_auth(user)
          calendar_id = google_auth.calendar_id

          case Calendar.create_event(user, calendar_id, event_data) do
            {:ok, _event_id} ->
              # Refresh calendar data
              socket = update_calendar(socket, socket.assigns.current_date)

              {:noreply, assign(socket, show_event_form: false, form_error: nil)}

            {:error, reason} ->
              {:noreply, assign(socket, form_error: "Failed to create event: #{reason}")}
          end
        end
    end
  end

  @impl true
  def handle_event("toggle_all_day", _params, socket) do
    # Toggle the current value
    current_all_day = socket.assigns.event_form.all_day
    event_form = Map.put(socket.assigns.event_form, :all_day, !current_all_day)
    {:noreply, assign(socket, event_form: event_form)}
  end

  @impl true
  def handle_event("form_change", %{"event" => event_params}, socket) do
    # Update the form data in the socket
    event_form = socket.assigns.event_form
      |> Map.put(:title, event_params["title"] || "")
      |> Map.put(:description, event_params["description"] || "")
      |> Map.put(:location, event_params["location"] || "")

    {:noreply, assign(socket, event_form: event_form, form_error: nil)}
  end

  @impl true
  def handle_params(%{"year" => year, "month" => month}, _uri, socket) do
    year = String.to_integer(year)
    month = String.to_integer(month)

    # Ensure the date is valid
    day = min(socket.assigns.current_date.day, Date.days_in_month(Date.new!(year, month, 1)))
    date = Date.new!(year, month, day)

    socket = update_calendar(socket, date)
    {:noreply, socket}
  end

  @impl true
  def handle_params(_params, _uri, socket) do
    {:noreply, socket}
  end

  # Helper function to update the calendar data
  defp update_calendar(socket, date) do
    user = socket.assigns.current_user
    google_auth = Calendar.get_google_auth(user)
    has_calendar = socket.assigns.connected && google_auth && google_auth.calendar_id != nil

    # Generate calendar data for the selected month
    first_day = Date.beginning_of_month(date)
    last_day = Date.end_of_month(date)
    days_in_month = Date.days_in_month(date)

    # Generate the days of the month
    days = for day <- 1..days_in_month do
      Date.new!(date.year, date.month, day)
    end

    # Get the starting weekday (1 = Monday, 7 = Sunday)
    first_day_weekday = Date.day_of_week(first_day)

    # Add padding days at the beginning (for days from the previous month)
    padding_start = for i <- 1..(first_day_weekday - 1) do
      Date.add(first_day, -i)
    end

    # Add padding days at the end (for days from the next month)
    last_day_weekday = Date.day_of_week(last_day)
    days_to_add = 7 - last_day_weekday
    padding_end = for i <- 1..days_to_add do
      Date.add(last_day, i)
    end

    # Combine all days
    all_days = padding_start ++ days ++ padding_end

    # Group days into weeks
    weeks = Enum.chunk_every(all_days, 7)

    # Get events if connected to Google Calendar
    events = if has_calendar do
      fetch_calendar_events(user, google_auth.calendar_id, first_day, Date.add(last_day, days_to_add))
    else
      []
    end

    # Group events by date
    events_by_date = Enum.group_by(events, & &1.date)

    assign(socket,
      current_date: date,
      weeks: weeks,
      month_name: month_name(date.month),
      events: events,
      events_by_date: events_by_date,
      show_event_modal: false
    )
  end

  # Helper function to fetch calendar events
  defp fetch_calendar_events(user, calendar_id, start_date, end_date) do
    case Calendar.get_access_token(user) do
      {:ok, access_token} ->
        case Calendar.list_events(access_token, calendar_id, start_date, end_date) do
          {:ok, events} -> events
          {:error, _} -> []
        end
      {:error, _} -> []
    end
  end

  # Helper function to get month name
  defp month_name(month) do
    case month do
      1 -> "January"
      2 -> "February"
      3 -> "March"
      4 -> "April"
      5 -> "May"
      6 -> "June"
      7 -> "July"
      8 -> "August"
      9 -> "September"
      10 -> "October"
      11 -> "November"
      12 -> "December"
    end
  end

  # Helper function to determine if a date is today
  defp is_today?(date) do
    Date.compare(date, Date.utc_today()) == :eq
  end

  # Helper function to determine if a date is in the current month
  defp in_current_month?(date, current_date) do
    date.year == current_date.year && date.month == current_date.month
  end

  # Helper function to get events for a specific date
  defp events_for_date(date, events_by_date) do
    Map.get(events_by_date, date, [])
  end

  # Helper function to generate calendar days for a month
  defp calendar_days(year, month) do
    # Create a date for the first day of the month
    first_day = Date.new!(year, month, 1)
    # Determine the last day of the month
    last_day = Date.end_of_month(first_day)
    # Number of days in the month
    days_in_month = Date.days_in_month(first_day)

    # Get the starting weekday (1 = Monday, 7 = Sunday)
    first_day_weekday = Date.day_of_week(first_day)

    # Add padding days at the beginning (for days from the previous month)
    padding_start = for _ <- 1..(first_day_weekday - 1), do: nil

    # Create day structs for the days in the month
    month_days = for day <- 1..days_in_month do
      date = Date.new!(year, month, day)
      %{day: day, date: date}
    end

    # Add padding days at the end (for days from the next month)
    last_day_weekday = Date.day_of_week(last_day)
    padding_end = for _ <- 1..(7 - last_day_weekday), do: nil

    # Combine all days
    padding_start ++ month_days ++ padding_end
  end

  # Helper function to fetch events for a user and date
  defp fetch_events(user, date) do
    # Get the first and last day of the month
    first_day = Date.beginning_of_month(date)
    last_day = Date.end_of_month(date)

    # Fetch events for the month
    google_auth = Calendar.get_google_auth(user)
    if google_auth && google_auth.calendar_id do
      calendar_id = google_auth.calendar_id
      case Calendar.get_access_token(user) do
        {:ok, access_token} ->
          Calendar.list_events(access_token, calendar_id, first_day, last_day)
        {:error, _reason} ->
          {:ok, []} # Return empty list on error
      end
    else
      {:ok, []} # Return empty list if no calendar
    end
  end

  # Helper function to group events by date
  defp group_events_by_date(events) do
    Enum.group_by(events, & &1.date)
  end

  # Helper function to check if a user has valid Google Auth
  defp has_valid_google_auth?(user) do
    google_auth = Calendar.get_google_auth(user)
    google_auth != nil && !Calendar.is_expired?(google_auth)
  end

  # Helper function to check if a user has a band calendar
  defp has_band_calendar?(user) do
    google_auth = Calendar.get_google_auth(user)
    google_auth != nil && google_auth.calendar_id != nil
  end

  # Get the list of calendars for the user
  defp get_calendars(user) do
    case Calendar.list_calendars(user) do
      {:ok, calendars} -> calendars
      {:error, _} -> []
    end
  end

  # Helper function to ensure time strings are properly formatted with seconds
  defp ensure_time_has_seconds(time_str) when is_binary(time_str) do
    if Regex.match?(~r/^\d{1,2}:\d{2}$/, time_str) do
      # Format is HH:MM, add seconds
      time_str <> ":00"
    else
      # Either already has seconds or is in an unexpected format
      time_str
    end
  end
  defp ensure_time_has_seconds(nil), do: nil

  # Helper function to format time in 12-hour format
  defp format_time_12h(nil), do: ""
  defp format_time_12h(%DateTime{} = datetime) do
    # When dealing with DateTimes, respect the timezone info
    hour = datetime.hour
    minute = datetime.minute

    period = if hour >= 12, do: "PM", else: "AM"

    # Convert 24-hour format to 12-hour format
    display_hour = cond do
      hour == 0 -> 12  # Midnight (0:00) should display as 12 AM
      hour > 12 -> hour - 12
      true -> hour
    end

    # Format the time with leading zeros for minutes
    "#{display_hour}:#{:io_lib.format("~2..0B", [minute])} #{period}"
  end
  defp format_time_12h(%Time{} = time) do
    hour = time.hour
    minute = time.minute

    period = if hour >= 12, do: "PM", else: "AM"

    # Convert 24-hour format to 12-hour format
    display_hour = cond do
      hour == 0 -> 12  # Midnight (0:00) should display as 12 AM
      hour > 12 -> hour - 12
      true -> hour
    end

    # Format the time with leading zeros for minutes
    "#{display_hour}:#{:io_lib.format("~2..0B", [minute])} #{period}"
  end
end
