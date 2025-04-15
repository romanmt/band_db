defmodule BandDbWeb.RehearsalPlanLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader
  alias BandDb.Songs.SongServer
  alias BandDb.Rehearsals.RehearsalServer
  require Logger

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

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
      date: Date.utc_today(),
      should_schedule: false,
      scheduled_date: Date.utc_today(),
      start_time: ~T[19:00:00],
      end_time: ~T[21:00:00],
      location: "",
      has_calendar: BandDb.Calendar.get_google_auth(socket.assigns.current_user) != nil
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
  def handle_event("toggle_scheduling", _, socket) do
    {:noreply, assign(socket, should_schedule: !socket.assigns.should_schedule)}
  end

  @impl true
  def handle_event("update_form", params, socket) do
    # Extract parameters, default to existing values if not present
    scheduled_date = case params do
      %{"scheduled_date" => date} when date != "" ->
        Date.from_iso8601!(date)
      _ ->
        socket.assigns.scheduled_date
    end

    start_time = case params do
      %{"start_time" => time} when time != "" ->
        Time.from_iso8601!(time)
      _ ->
        socket.assigns.start_time
    end

    end_time = case params do
      %{"end_time" => time} when time != "" ->
        Time.from_iso8601!(time)
      _ ->
        socket.assigns.end_time
    end

    location = Map.get(params, "location", socket.assigns.location)

    # Date param is for the plan date, not the scheduled date
    date = case params do
      %{"date" => d} when is_binary(d) and d != "" ->
        Date.from_iso8601!(d)
      _ ->
        socket.assigns.date
    end

    {:noreply, assign(socket,
      date: date,
      scheduled_date: scheduled_date,
      start_time: start_time,
      end_time: end_time,
      location: location
    )}
  end

  @impl true
  def handle_event("accept_plan", params, socket) do
    date = Date.from_iso8601!(params["date"])

    # Save the rehearsal plan
    case RehearsalServer.save_plan(
      date,
      socket.assigns.rehearsal_plan.rehearsal,
      socket.assigns.rehearsal_plan.set,
      socket.assigns.total_duration
    ) do
      {:ok, plan_id} ->
        # If scheduling is enabled and connected to Google Calendar, create calendar event
        if socket.assigns.should_schedule && socket.assigns.has_calendar do
          user = socket.assigns.current_user
          google_auth = BandDb.Calendar.get_google_auth(user)

          if google_auth && google_auth.calendar_id do
            # Create calendar event
            event_params = %{
              title: "Band Rehearsal - #{Date.to_string(socket.assigns.scheduled_date)}",
              description: "Rehearsal plan includes #{length(socket.assigns.rehearsal_plan.rehearsal)} songs to rehearse and a #{length(socket.assigns.rehearsal_plan.set)} song set",
              location: socket.assigns.location,
              date: socket.assigns.scheduled_date,
              start_time: socket.assigns.start_time,
              end_time: socket.assigns.end_time,
              event_type: "rehearsal",
              rehearsal_plan_id: to_string(plan_id.id || "")
            }

            # Log the params we're sending
            Logger.debug("Creating calendar event with params: #{inspect(event_params)}")
            Logger.debug("Date: #{inspect(socket.assigns.scheduled_date)}, Start: #{inspect(socket.assigns.start_time)}, End: #{inspect(socket.assigns.end_time)}")

            case BandDb.Calendar.create_event(user, google_auth.calendar_id, event_params) do
              {:ok, event_id} ->
                # Update rehearsal plan with event info
                RehearsalServer.update_plan_calendar_info(date, %{
                  scheduled_date: socket.assigns.scheduled_date,
                  start_time: socket.assigns.start_time,
                  end_time: socket.assigns.end_time,
                  location: socket.assigns.location,
                  calendar_event_id: event_id
                })

                {:noreply,
                  socket
                  |> put_flash(:info, "Rehearsal plan saved and added to calendar")
                  |> push_navigate(to: ~p"/rehearsal/history")}

              {:error, reason} ->
                # Plan saved but calendar event failed
                {:noreply,
                  socket
                  |> put_flash(:error, "Rehearsal plan saved but calendar event failed: #{reason}")
                  |> push_navigate(to: ~p"/rehearsal/history")}
            end
          else
            {:noreply,
              socket
              |> put_flash(:info, "Rehearsal plan saved for #{Date.to_string(date)}")
              |> push_navigate(to: ~p"/rehearsal/history")}
          end
        else
          {:noreply,
            socket
            |> put_flash(:info, "Rehearsal plan saved for #{Date.to_string(date)}")
            |> push_navigate(to: ~p"/rehearsal/history")}
        end

      {:error, :plan_already_exists} ->
        {:noreply,
          socket
          |> put_flash(:error, "A rehearsal plan already exists for #{Date.to_string(date)}")
          |> push_navigate(to: ~p"/rehearsal/history")}

      {:error, reason} ->
        {:noreply,
          socket
          |> put_flash(:error, "Failed to save rehearsal plan: #{inspect(reason)}")
          |> push_navigate(to: ~p"/rehearsal/history")}
    end
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
    plans = RehearsalServer.list_plans()

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
    candidate_rehearsal_songs = needs_rehearsal
      |> Enum.sort_by(fn song ->
        Map.get(last_rehearsal_dates, song.title, ~D[2000-01-01])
      end, {:desc, Date})
      |> Enum.take(12)  # Take more candidates to allow for tuning-based selection

    # Group rehearsal songs by tuning and then select some from each tuning group
    rehearsal_songs = select_songs_by_tuning(candidate_rehearsal_songs, 5)

    # Group ready songs by tuning
    ready_songs_by_tuning = Enum.group_by(ready_songs, & &1.tuning)

    # Sort songs within each tuning group by status and last rehearsal date
    sorted_ready_songs_by_tuning = Map.new(ready_songs_by_tuning, fn {tuning, songs} ->
      sorted_songs = songs
        |> Enum.sort_by(fn song ->
          # Sort by status (ready first, then performed) and last rehearsal date (least recent first)
          status_priority = if song.status == :ready, do: 0, else: 1
          last_date = Map.get(last_rehearsal_dates, song.title, ~D[2000-01-01])
          {status_priority, last_date}
        end)
      {tuning, sorted_songs}
    end)

    # Select set list songs based on tuning groups and target duration
    target_duration = Enum.random(2700..3600) # 45-60 minutes in seconds
    set_songs = create_set_list_by_tuning(sorted_ready_songs_by_tuning, target_duration)

    %{
      rehearsal: rehearsal_songs,
      set: set_songs
    }
  end

  # Select songs for rehearsal, trying to group by tuning
  defp select_songs_by_tuning(songs, max_count) do
    # Group songs by tuning
    songs_by_tuning = Enum.group_by(songs, & &1.tuning)

    # Get a count of how many songs to include from each tuning group
    tuning_counts = calculate_tuning_distribution(songs_by_tuning, max_count)

    # Select the specified number of songs from each tuning group
    Enum.flat_map(tuning_counts, fn {tuning, count} ->
      songs_by_tuning
      |> Map.get(tuning, [])
      |> Enum.take(count)
    end)
  end

  # Determine how many songs to include from each tuning group
  defp calculate_tuning_distribution(songs_by_tuning, max_total) do
    # Get total number of songs across all tunings
    total_songs = songs_by_tuning
      |> Map.values()
      |> Enum.map(&length/1)
      |> Enum.sum()

    # Default to at least one song per tuning if possible
    tuning_counts = Map.new(songs_by_tuning, fn {tuning, songs} ->
      {tuning, min(1, length(songs))}
    end)

    initial_count = tuning_counts
      |> Map.values()
      |> Enum.sum()

    # If we have room for more songs, allocate them proportionally
    remaining = max_total - initial_count

    if remaining <= 0 do
      tuning_counts
    else
      # Calculate proportional allocation for remaining slots
      Enum.reduce(songs_by_tuning, tuning_counts, fn {tuning, tuning_songs}, acc ->
        # Skip empty tuning groups
        if length(tuning_songs) <= 0 do
          acc
        else
          # Calculate proportion of this tuning in the total
          proportion = length(tuning_songs) / total_songs
          # Allocate additional songs based on proportion
          additional = floor(remaining * proportion)
          # Update count, ensuring we don't exceed the available songs
          current = Map.get(acc, tuning, 0)
          max_possible = min(current + additional, length(tuning_songs))
          Map.put(acc, tuning, max_possible)
        end
      end)
    end
  end

  # Create a set list that groups songs by tuning
  defp create_set_list_by_tuning(songs_by_tuning, target_duration) do
    # Determine which tunings to include based on available songs
    available_tunings = Map.keys(songs_by_tuning)

    # If no tunings available, return empty list
    if Enum.empty?(available_tunings) do
      []
    else
      # Pick an initial tuning to start with
      current_tuning = List.first(available_tunings)

      # Create the set list by picking tunings and then songs from each tuning
      {set_list, _, _} = Enum.reduce_while(1..100, {[], current_tuning, 0}, fn _, {list, tuning, duration} ->
        # Get songs for current tuning
        tuning_songs = Map.get(songs_by_tuning, tuning, [])

        # Find a song we haven't used yet
        available_songs = Enum.reject(tuning_songs, fn song ->
          Enum.any?(list, fn s -> s.title == song.title end)
        end)

        cond do
          # If we've hit our target duration, stop
          duration >= target_duration ->
            {:halt, {list, tuning, duration}}

          # If no more songs available for this tuning, switch to another tuning
          Enum.empty?(available_songs) ->
            # Find the next available tuning with songs
            next_tunings = Enum.filter(available_tunings, fn t ->
              t != tuning &&
              Enum.any?(Map.get(songs_by_tuning, t, []), fn song ->
                !Enum.any?(list, fn s -> s.title == song.title end)
              end)
            end)

            if Enum.empty?(next_tunings) do
              # No more tunings with available songs
              {:halt, {list, tuning, duration}}
            else
              # Pick the next tuning and continue
              next_tuning = List.first(next_tunings)
              {:cont, {list, next_tuning, duration}}
            end

          # Otherwise, add the next song from this tuning
          true ->
            next_song = List.first(available_songs)
            new_duration = duration + (next_song.duration || 0)

            # If adding this song would exceed our target by too much, try another tuning
            if new_duration > target_duration * 1.1 do
              next_tunings = Enum.filter(available_tunings, fn t ->
                t != tuning &&
                Enum.any?(Map.get(songs_by_tuning, t, []), fn song ->
                  !Enum.any?(list, fn s -> s.title == song.title end)
                end)
              end)

              if Enum.empty?(next_tunings) do
                # No more tunings with available songs
                {:halt, {list, tuning, duration}}
              else
                # Pick the next tuning and continue
                next_tuning = List.first(next_tunings)
                {:cont, {list, next_tuning, duration}}
              end
            else
              # Add the song and continue with the same tuning
              {:cont, {[next_song | list], tuning, new_duration}}
            end
        end
      end)

      # Return the set list in reverse order (since we've been prepending)
      Enum.reverse(set_list)
    end
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

  defp tuning_color(:standard), do: "bg-indigo-100 text-indigo-800"
  defp tuning_color(:drop_d), do: "bg-blue-100 text-blue-800"
  defp tuning_color(:e_flat), do: "bg-green-100 text-green-800"
  defp tuning_color(:drop_c_sharp), do: "bg-purple-100 text-purple-800"
  defp tuning_color(_), do: "bg-gray-100 text-gray-800"

  defp display_tuning(tuning) do
    case tuning do
      :standard -> "Standard"
      :drop_d -> "Drop D"
      :e_flat -> "E♭"
      :drop_c_sharp -> "Drop C#"
      _ -> "Standard"
    end
  end
end
