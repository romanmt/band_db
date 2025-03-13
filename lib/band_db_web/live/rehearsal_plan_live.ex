defmodule BandDbWeb.RehearsalPlanLive do
  use BandDbWeb, :live_view
  alias BandDb.{SongServer, RehearsalPlanServer}

  @impl true
  def mount(_params, _session, socket) do
    songs = SongServer.list_songs()

    # Get songs that need rehearsal
    needs_rehearsal = Enum.filter(songs, & &1.status == :needs_learning)
    # Get songs that are ready or have been performed
    ready_songs = Enum.filter(songs, & &1.status in [:ready, :performed])

    # Generate initial plan
    rehearsal_plan = generate_plan(needs_rehearsal, ready_songs)

    {:ok, assign(socket,
      songs: songs,
      needs_rehearsal: needs_rehearsal,
      ready_songs: ready_songs,
      rehearsal_plan: rehearsal_plan,
      total_duration: calculate_total_duration(rehearsal_plan),
      show_date_modal: false,
      date: Date.utc_today()
    )}
  end

  @impl true
  def handle_event("show_date_modal", _, socket) do
    {:noreply, assign(socket, show_date_modal: true)}
  end

  @impl true
  def handle_event("hide_date_modal", _, socket) do
    {:noreply, assign(socket, show_date_modal: false)}
  end

  @impl true
  def handle_event("accept_plan", %{"date" => date}, socket) do
    date = Date.from_iso8601!(date)
    RehearsalPlanServer.save_plan(
      date,
      socket.assigns.rehearsal_plan.rehearsal,
      socket.assigns.rehearsal_plan.set,
      socket.assigns.total_duration
    )

    {:noreply,
      socket
      |> put_flash(:info, "Rehearsal plan saved for #{Date.to_string(date)}")
      |> push_navigate(to: ~p"/rehearsal/history")}
  end

  @impl true
  def handle_event("regenerate", _params, socket) do
    rehearsal_plan = generate_plan(socket.assigns.needs_rehearsal, socket.assigns.ready_songs)
    {:noreply, assign(socket,
      rehearsal_plan: rehearsal_plan,
      total_duration: calculate_total_duration(rehearsal_plan)
    )}
  end

  # Generate a rehearsal plan with songs that need rehearsal and a full set of ready/performed songs
  defp generate_plan(needs_rehearsal, ready_songs) do
    # Get rehearsal history
    plans = RehearsalPlanServer.list_plans()

    # Create a map of song titles to their last rehearsal date
    last_rehearsal_dates = Enum.reduce(plans, %{}, fn plan, acc ->
      # Add rehearsal songs
      rehearsal_dates = Enum.reduce(plan.rehearsal_songs, acc, fn song, acc ->
        Map.put(acc, song.title, plan.date)
      end)

      # Add set list songs
      Enum.reduce(plan.set_songs, rehearsal_dates, fn song, acc ->
        Map.put(acc, song.title, plan.date)
      end)
    end)

    # Sort songs needing rehearsal by last rehearsal date (most recent first)
    rehearsal_songs = needs_rehearsal
      |> Enum.sort_by(fn song ->
        Map.get(last_rehearsal_dates, song.title, ~D[2000-01-01])
      end, {:desc, Date})
      |> Enum.take(5)  # Take up to 5 songs

    # Sort ready songs by status and last rehearsal date
    sorted_ready_songs = ready_songs
      |> Enum.sort_by(fn song ->
        # Sort by status (ready first, then performed) and last rehearsal date (least recent first)
        status_priority = if song.status == :ready, do: 0, else: 1
        last_date = Map.get(last_rehearsal_dates, song.title, ~D[2000-01-01])
        {status_priority, last_date}
      end)

    # Select enough ready songs to make a full set (aiming for about 45-60 minutes total)
    target_duration = Enum.random(2700..3600) # 45-60 minutes in seconds

    {set_songs, _total_duration} = Enum.reduce_while(sorted_ready_songs, {[], 0}, fn song, {songs, duration} ->
      new_duration = duration + (song.duration || 0)
      if new_duration <= target_duration do
        {:cont, {[song | songs], new_duration}}
      else
        {:halt, {songs, duration}}
      end
    end)

    %{
      rehearsal: rehearsal_songs,
      set: Enum.reverse(set_songs)
    }
  end

  defp calculate_total_duration(%{rehearsal: rehearsal, set: set}) do
    (rehearsal ++ set)
    |> Enum.map(& &1.duration)
    |> Enum.reject(&is_nil/1)
    |> Enum.sum()
  end

  defp format_duration(nil), do: ""
  defp format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    :io_lib.format("~2..0B:~2..0B", [minutes, remaining_seconds])
  end

  defp status_color(:needs_learning), do: "bg-yellow-100 text-yellow-800"
  defp status_color(:ready), do: "bg-green-100 text-green-800"
  defp status_color(:performed), do: "bg-blue-100 text-blue-800"
  defp status_color(:suggested), do: "bg-purple-100 text-purple-800"
end
