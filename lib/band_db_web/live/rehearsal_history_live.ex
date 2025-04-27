defmodule BandDbWeb.RehearsalHistoryLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader
  alias BandDb.Rehearsals.RehearsalServer
  alias BandDb.Songs.SongServer
  alias BandDbWeb.Components.RehearsalPlanComponent
  alias BandDb.{ServerLookup, Accounts}

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    # Get the band_id from the current_user
    band_id = socket.assigns.current_user.band_id

    case get_rehearsal_plans_for_band(band_id) do
      {:ok, plans, songs} ->
        # Subscribe to rehearsal plan updates
        if connected?(socket) do
          Phoenix.PubSub.subscribe(BandDb.PubSub, "rehearsal_plans")
        end

        # Add expanded state to each plan
        plans = Enum.map(plans, &Map.put(&1, :expanded, false))

        {:ok, assign(socket,
                    plans: plans,
                    songs: songs,
                    band_id: band_id,
                    rehearsal_server: ServerLookup.get_rehearsal_server(band_id),
                    song_server: ServerLookup.get_song_server(band_id),
                    error_message: nil)}

      {:error, reason} ->
        {:ok,
          socket
          |> assign(plans: [],
                    songs: [],
                    band_id: nil,
                    rehearsal_server: nil,
                    song_server: nil,
                    error_message: reason)}
    end
  end

  # Get rehearsal plans for a band, handling the case where the band doesn't exist
  defp get_rehearsal_plans_for_band(nil), do: {:error, "Your user account is not associated with any band. Please contact an administrator."}
  defp get_rehearsal_plans_for_band(band_id) do
    # Check if the band exists first
    case Accounts.get_band(band_id) do
      nil ->
        {:error, "Band not found. Please contact an administrator."}
      _band ->
        # Now it's safe to get the servers since we know the band exists
        rehearsal_server = ServerLookup.get_rehearsal_server(band_id)
        song_server = ServerLookup.get_song_server(band_id)

        try do
          plans = RehearsalServer.list_plans(rehearsal_server)
          songs = SongServer.list_songs(song_server)
          {:ok, plans, songs}
        rescue
          error in ArgumentError ->
            {:error, "Failed to load rehearsal plans. Please try again later."}
          # Handle any other exceptions
          _ ->
            {:error, "Failed to load rehearsal plans. Please try again later."}
        end
    end
  end

  @impl true
  def handle_event("toggle_plan", %{"id" => date_str}, socket) do
    date = Date.from_iso8601!(date_str)
    plans = Enum.map(socket.assigns.plans, fn plan ->
      if plan.date == date do
        Map.put(plan, :expanded, !plan.expanded)
      else
        plan
      end
    end)
    {:noreply, assign(socket, plans: plans)}
  end

  @impl true
  def handle_event("print_plan", %{"id" => date_str}, socket) do
    date = Date.from_iso8601!(date_str)
    # First expand the plan
    plans = Enum.map(socket.assigns.plans, fn plan ->
      if plan.date == date do
        Map.put(plan, :expanded, true)
      else
        plan
      end
    end)
    # Then trigger print after a short delay to ensure the content is expanded
    {:noreply,
      socket
      |> assign(plans: plans)
      |> push_event("print_plan", %{date: date_str})}
  end

  @impl true
  def handle_info({:plan_saved, _new_plan}, socket) do
    if socket.assigns.rehearsal_server do
      # Reload plans to ensure we get the full song objects
      plans = RehearsalServer.list_plans(socket.assigns.rehearsal_server)
      # Add expanded state to each plan
      plans = Enum.map(plans, &Map.put(&1, :expanded, false))
      {:noreply, assign(socket, plans: plans)}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_info({:monitor_for_cleanup, _user}, socket) do
    # Just implement the handler to avoid warnings
    {:noreply, socket}
  end

  defp format_duration(nil), do: ""
  defp format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    :io_lib.format("~2..0B:~2..0B", [minutes, remaining_seconds])
  end
end
