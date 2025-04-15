defmodule BandDbWeb.BandCalendarLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader
  alias BandDb.Calendar

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    current_date = Date.utc_today()
    user = socket.assigns.current_user

    # Get Google auth status
    google_auth = Calendar.get_google_auth(user)
    connected = google_auth != nil
    has_calendar = connected && google_auth.calendar_id != nil

    # Generate calendar data for the current month
    first_day = Date.beginning_of_month(current_date)
    last_day = Date.end_of_month(current_date)
    days_in_month = Date.days_in_month(current_date)

    # Generate the days of the month
    days = for day <- 1..days_in_month do
      Date.new!(current_date.year, current_date.month, day)
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

    socket = assign(socket,
      current_date: current_date,
      weeks: weeks,
      has_calendar: has_calendar,
      connected: connected,
      month_name: month_name(current_date.month),
      events: events,
      events_by_date: events_by_date,
      selected_event: nil,
      show_event_modal: false,
      show_event_form: false,
      selected_date: nil,
      event_form: %{
        title: "",
        description: "",
        location: "",
        all_day: true,
        start_time: ~T[09:00:00],
        end_time: ~T[10:00:00]
      },
      form_error: nil
    )

    {:ok, socket}
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
        start_time = Time.from_iso8601!(event_params["start_time"])
        end_time = Time.from_iso8601!(event_params["end_time"])
        event_data
        |> Map.put(:start_time, start_time)
        |> Map.put(:end_time, end_time)
      end

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

  @impl true
  def handle_event("toggle_all_day", params, socket) do
    # Toggle the current value
    current_all_day = socket.assigns.event_form.all_day
    event_form = Map.put(socket.assigns.event_form, :all_day, !current_all_day)
    {:noreply, assign(socket, event_form: event_form)}
  end

  @impl true
  def handle_event("form_change", %{"event" => event_params}, socket) do
    event_form = %{
      title: event_params["title"] || "",
      description: event_params["description"] || "",
      location: event_params["location"] || "",
      all_day: event_params["all_day"] == "true",
      start_time: event_params["start_time"] || socket.assigns.event_form.start_time,
      end_time: event_params["end_time"] || socket.assigns.event_form.end_time
    }

    {:noreply, assign(socket, event_form: event_form)}
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
end
