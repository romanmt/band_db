defmodule BandDbWeb.AdminCalendarLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader

  alias BandDb.Calendar

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    user = socket.assigns.current_user
    google_auth = Calendar.get_google_auth(user)

    connected = google_auth != nil
    calendars = if connected, do: get_calendars(user), else: []

    socket = assign(socket,
      google_connected: connected,
      google_auth: google_auth,
      calendars: calendars,
      show_create_calendar_modal: false,
      band_name: "",
      calendar_error: nil
    )

    {:ok, socket}
  end

  @impl true
  def handle_event("show_create_calendar_modal", _params, socket) do
    {:noreply, assign(socket, show_create_calendar_modal: true)}
  end

  @impl true
  def handle_event("hide_create_calendar_modal", _params, socket) do
    {:noreply, assign(socket, show_create_calendar_modal: false, calendar_error: nil)}
  end

  @impl true
  def handle_event("create_calendar", %{"band_name" => band_name}, socket) do
    user = socket.assigns.current_user

    case Calendar.create_band_calendar(user, band_name) do
      {:ok, _calendar_id} ->
        # Refresh the calendars list
        calendars = get_calendars(user)

        {:noreply, socket
          |> assign(
            show_create_calendar_modal: false,
            calendars: calendars,
            calendar_error: nil
          )
          |> put_flash(:info, "Calendar created successfully!")}

      {:error, reason} ->
        {:noreply, assign(socket, calendar_error: reason)}
    end
  end

  defp get_calendars(user) do
    case Calendar.list_calendars(user) do
      {:ok, calendars} -> calendars
      {:error, _reason} -> []
    end
  end
end
