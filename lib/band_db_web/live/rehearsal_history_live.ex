defmodule BandDbWeb.RehearsalHistoryLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader
  alias BandDb.Rehearsals.RehearsalServer
  alias BandDb.Songs.SongServer

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    # Subscribe to rehearsal plan updates
    if connected?(socket) do
      Phoenix.PubSub.subscribe(BandDb.PubSub, "rehearsal_plans")
    end

    plans = RehearsalServer.list_plans()
    songs = SongServer.list_songs()
    # Add expanded state to each plan
    plans = Enum.map(plans, &Map.put(&1, :expanded, false))
    {:ok, assign(socket, plans: plans, songs: songs)}
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
    # Reload plans to ensure we get the full song objects
    plans = RehearsalServer.list_plans()
    # Add expanded state to each plan
    plans = Enum.map(plans, &Map.put(&1, :expanded, false))
    {:noreply, assign(socket, plans: plans)}
  end

  defp format_duration(nil), do: ""
  defp format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    :io_lib.format("~2..0B:~2..0B", [minutes, remaining_seconds])
  end
end
