defmodule BandDb.Rehearsals.RehearsalServer do
  use GenServer
  require Logger
  alias BandDb.Rehearsals.{RehearsalPlan}

  # Client API

  def start_link(opts \\ [])

  def start_link(name) when is_atom(name) do
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def start_link({:via, Registry, {_registry, {band_id, _module}}} = name) do
    GenServer.start_link(__MODULE__, band_id, name: name)
  end

  def start_link(opts) when is_list(opts) do
    name = Keyword.get(opts, :name, __MODULE__)
    band_id = Keyword.get(opts, :band_id)
    GenServer.start_link(__MODULE__, band_id, name: name)
  end

  def save_plan(date, rehearsal_songs, set_songs, duration, band_id \\ nil, server \\ __MODULE__) do
    GenServer.call(server, {:save_plan, date, rehearsal_songs, set_songs, duration, band_id})
  end

  def list_plans(server \\ __MODULE__) do
    GenServer.call(server, :list_plans)
  end

  def list_plans_by_band(band_id, server \\ __MODULE__) do
    GenServer.call(server, {:list_plans_by_band, band_id})
  end

  def get_plan(date, server \\ __MODULE__) do
    GenServer.call(server, {:get_plan, date})
  end

  def update_plan(date, attrs, server \\ __MODULE__) do
    GenServer.call(server, {:update_plan, date, attrs})
  end

  def update_plan_calendar_info(date, calendar_info, server \\ __MODULE__) do
    GenServer.call(server, {:update_plan_calendar_info, date, calendar_info})
  end

  def delete_plan(date, server \\ __MODULE__) do
    GenServer.call(server, {:delete_plan, date})
  end

  # Server Callbacks

  @impl true
  def init(band_id) do
    # Normalize band_id - only accept integers, otherwise nil
    normalized_band_id = if is_integer(band_id), do: band_id, else: nil
    
    # Load initial state from persistence
    case persistence_module().load_plans() do
      {:ok, plans} ->
        # Filter plans for this band if band_id is provided
        filtered_plans = if normalized_band_id do
          Enum.filter(plans, &(&1.band_id == normalized_band_id))
        else
          plans
        end
        schedule_backup()
        {:ok, %{plans: filtered_plans, band_id: normalized_band_id}}
      _ ->
        schedule_backup()
        {:ok, %{plans: [], band_id: normalized_band_id}}
    end
  end

  @impl true
  def handle_call({:save_plan, date, rehearsal_songs, set_songs, duration, band_id}, _from, state) do
    plans = state.plans
    case Enum.find(plans, fn plan -> plan.date == date end) do
      nil ->
        # Extract just the UUIDs from the song structs
        rehearsal_song_uuids = Enum.map(rehearsal_songs, & &1.uuid)
        set_song_uuids = Enum.map(set_songs, & &1.uuid)

        new_plan = %RehearsalPlan{
          date: date,
          rehearsal_songs: rehearsal_song_uuids,
          set_songs: set_song_uuids,
          duration: duration,
          band_id: band_id
        }
        new_state = %{state | plans: [new_plan | plans]}

        # Broadcast that a plan was saved
        Phoenix.PubSub.broadcast(BandDb.PubSub, "rehearsal_plans", {:plan_saved, new_plan})

        {:reply, {:ok, new_plan}, new_state}
      _existing ->
        {:reply, {:error, :plan_already_exists}, state}
    end
  end

  @impl true
  def handle_call(:list_plans, _from, state) do
    # Make sure full song objects are loaded for each plan
    plans = Enum.map(state.plans, fn plan ->
      case plan do
        %{rehearsal_songs: rehearsal_songs, set_songs: set_songs} when is_list(rehearsal_songs) and is_list(set_songs) ->
          # Check if the first item is a string (UUID) or a song struct
          if (Enum.empty?(rehearsal_songs) or is_binary(List.first(rehearsal_songs))) or
             (Enum.empty?(set_songs) or is_binary(List.first(set_songs))) do

            # Convert UUIDs to full song objects
            song_uuids = MapSet.new(rehearsal_songs ++ set_songs)
            # Get the correct song server for this band
            song_server = if is_integer(state.band_id) do
              BandDb.ServerLookup.get_song_server(state.band_id)
            else
              # Fallback for backwards compatibility
              BandDb.Songs.SongServer
            end
            songs_by_uuid = BandDb.Songs.SongServer.list_songs(song_server)
                            |> Enum.filter(&(&1.uuid in song_uuids))
                            |> Enum.reduce(%{}, fn song, acc -> Map.put(acc, song.uuid, song) end)

            # Map UUIDs to song objects or keep the UUID if song is not found
            rehearsal_song_objects = Enum.map(rehearsal_songs, fn uuid ->
              Map.get(songs_by_uuid, uuid) || uuid
            end)

            set_song_objects = Enum.map(set_songs, fn uuid ->
              Map.get(songs_by_uuid, uuid) || uuid
            end)

            %{plan | rehearsal_songs: rehearsal_song_objects, set_songs: set_song_objects}
          else
            plan # Already has song objects
          end
        _ ->
          plan # Not the expected format, return as is
      end
    end)

    {:reply, plans, state}
  end

  @impl true
  def handle_call({:list_plans_by_band, band_id}, _from, state) do
    # Filter plans by band_id
    plans = state.plans
    |> Enum.filter(fn plan -> plan.band_id == band_id end)
    |> Enum.map(fn plan ->
      case plan do
        %{rehearsal_songs: rehearsal_songs, set_songs: set_songs} when is_list(rehearsal_songs) and is_list(set_songs) ->
          # Check if the first item is a string (UUID) or a song struct
          if (Enum.empty?(rehearsal_songs) or is_binary(List.first(rehearsal_songs))) or
             (Enum.empty?(set_songs) or is_binary(List.first(set_songs))) do

            # Convert UUIDs to full song objects
            song_uuids = MapSet.new(rehearsal_songs ++ set_songs)
            songs_by_uuid = BandDb.Songs.SongServer.list_songs_by_band(band_id)
                            |> Enum.filter(&(&1.uuid in song_uuids))
                            |> Enum.reduce(%{}, fn song, acc -> Map.put(acc, song.uuid, song) end)

            # Map UUIDs to song objects or keep the UUID if song is not found
            rehearsal_song_objects = Enum.map(rehearsal_songs, fn uuid ->
              Map.get(songs_by_uuid, uuid) || uuid
            end)

            set_song_objects = Enum.map(set_songs, fn uuid ->
              Map.get(songs_by_uuid, uuid) || uuid
            end)

            %{plan | rehearsal_songs: rehearsal_song_objects, set_songs: set_song_objects}
          else
            plan # Already has song objects
          end
        _ ->
          plan # Not the expected format, return as is
      end
    end)

    {:reply, plans, state}
  end

  @impl true
  def handle_call({:get_plan, date}, _from, state) do
    case Enum.find(state.plans, fn plan -> plan.date == date end) do
      nil -> {:reply, {:error, :not_found}, state}
      plan ->
        # Check if we need to convert UUIDs to song objects
        plan = case plan do
          %{rehearsal_songs: rehearsal_songs, set_songs: set_songs} when is_list(rehearsal_songs) and is_list(set_songs) ->
            if (Enum.empty?(rehearsal_songs) or is_binary(List.first(rehearsal_songs))) or
               (Enum.empty?(set_songs) or is_binary(List.first(set_songs))) do

              # Convert UUIDs to full song objects
              song_uuids = MapSet.new(rehearsal_songs ++ set_songs)
              songs_by_uuid = BandDb.Songs.SongServer.list_songs()
                              |> Enum.filter(&(&1.uuid in song_uuids))
                              |> Enum.reduce(%{}, fn song, acc -> Map.put(acc, song.uuid, song) end)

              # Map UUIDs to song objects or keep the UUID if the song is not found
              rehearsal_song_objects = Enum.map(rehearsal_songs, fn uuid ->
                Map.get(songs_by_uuid, uuid) || uuid
              end)

              set_song_objects = Enum.map(set_songs, fn uuid ->
                Map.get(songs_by_uuid, uuid) || uuid
              end)

              %{plan | rehearsal_songs: rehearsal_song_objects, set_songs: set_song_objects}
            else
              plan # Already has song objects
            end
          _ ->
            plan # Not the expected format, return as is
        end

        {:reply, {:ok, plan}, state}
    end
  end

  @impl true
  def handle_call({:update_plan, date, attrs}, _from, state) do
    case Enum.find_index(state.plans, fn plan -> plan.date == date end) do
      nil ->
        {:reply, {:error, :not_found}, state}
      index ->
        old_plan = Enum.at(state.plans, index)
        updated_plan = struct(RehearsalPlan, Map.merge(Map.from_struct(old_plan), attrs))

        updated_plans = List.update_at(state.plans, index, fn _ -> updated_plan end)
        new_state = %{state | plans: updated_plans}

        {:reply, {:ok, updated_plan}, new_state}
    end
  end

  @impl true
  def handle_call({:update_plan_calendar_info, date, calendar_info}, _from, state) do
    case Enum.find_index(state.plans, fn plan -> plan.date == date end) do
      nil ->
        {:reply, {:error, :not_found}, state}
      index ->
        old_plan = Enum.at(state.plans, index)
        updated_plan = struct(RehearsalPlan, Map.merge(Map.from_struct(old_plan), calendar_info))

        updated_plans = List.update_at(state.plans, index, fn _ -> updated_plan end)
        new_state = %{state | plans: updated_plans}

        {:reply, {:ok, updated_plan}, new_state}
    end
  end

  @impl true
  def handle_call({:delete_plan, date}, _from, state) do
    case Enum.find_index(state.plans, fn plan -> plan.date == date end) do
      nil ->
        {:reply, {:error, :not_found}, state}
      index ->
        updated_plans = List.delete_at(state.plans, index)
        new_state = %{state | plans: updated_plans}
        {:reply, :ok, new_state}
    end
  end

  @impl true
  def handle_info(:backup, state) do
    Logger.info("Backing up rehearsal plans")
    persistence_module().persist_plans(state.plans)
    schedule_backup()
    {:noreply, state}
  end

  defp schedule_backup do
    Process.send_after(self(), :backup, :timer.minutes(1))
  end

  # Get the configured persistence module
  defp persistence_module do
    Application.get_env(:band_db, :rehearsal_persistence, BandDb.Rehearsals.RehearsalPersistence)
  end
end
