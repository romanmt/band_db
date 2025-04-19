defmodule BandDb.SetLists.SetListServer do
  @moduledoc """
  GenServer for managing set lists.

  Follows architectural pattern:
  - State is managed in memory
  - Persistence is only used for recovery after server restarts
  """
  use GenServer
  require Logger

  # Client API

  @doc """
  Starts the SetListServer with the given name.
  """
  def start_link(name \\ __MODULE__)

  def start_link(name) when is_atom(name) do
    GenServer.start_link(__MODULE__, name, name: name)
  end

  @doc """
  Adds a new set list.
  """
  def add_set_list(server \\ __MODULE__, name, sets) do
    GenServer.call(server, {:add_set_list, name, sets})
  end

  @doc """
  Lists all set lists.
  """
  def list_set_lists(server \\ __MODULE__) do
    GenServer.call(server, :list_set_lists)
  end

  @doc """
  Gets a set list by name.
  """
  def get_set_list(server \\ __MODULE__, name) do
    GenServer.call(server, {:get_set_list, name})
  end

  @doc """
  Updates a set list.
  """
  def update_set_list(server \\ __MODULE__, name, params) do
    GenServer.call(server, {:update_set_list, name, params})
  end

  @doc """
  Deletes a set list.
  """
  def delete_set_list(server \\ __MODULE__, name) do
    GenServer.call(server, {:delete_set_list, name})
  end

  # Server Callbacks

  @impl true
  def init(name) do
    # Check if we're in test mode
    sandbox_mode = Application.get_env(:band_db, BandDb.Repo)[:pool] == DBConnection.Ownership

    if sandbox_mode do
      # In test mode, defer database access to handle_info to avoid connection ownership issues
      # This allows the test process to properly set up sandbox before we access the database
      Logger.debug("Starting SetListServer in sandbox mode, deferring DB access")
      Process.send_after(self(), :load_initial_state, 100)
      {:ok, %{set_lists: %{}, server_name: name}}
    else
      # In production mode, load state immediately
      Logger.debug("Starting SetListServer in production mode, loading immediately")
      set_lists = load_set_lists_from_storage()
      Logger.info("SetListServer initialized with #{map_size(set_lists)} set lists")
      {:ok, %{set_lists: set_lists, server_name: name}}
    end
  end

  @impl true
  def handle_info(:load_initial_state, %{server_name: server_name} = state) do
    # Now we can safely access the database since the process that started us
    # has had time to set up the sandbox
    Logger.debug("SetListServer (#{inspect(server_name)}) loading initial state from database")
    set_lists = load_set_lists_from_storage()
    Logger.info("SetListServer (#{inspect(server_name)}) initialized with #{map_size(set_lists)} set lists")
    {:noreply, %{state | set_lists: set_lists}}
  end

  @impl true
  def handle_call({:add_set_list, name, sets}, _from, state) do
    # Handle both single set and list of sets
    sets = if is_list(sets), do: sets, else: [sets]

    if Map.has_key?(state.set_lists, name) do
      {:reply, {:error, "Set list with that name already exists"}, state}
    else
      # Calculate total duration
      total_duration = calculate_total_duration(sets)

      # Create the new set list in memory
      new_set_list = %{
        name: name,
        sets: Enum.with_index(sets, 1) |> Enum.map(fn {set, index} ->
          %{
            name: set.name || "Set #{index}",
            duration: set.duration || 0,
            break_duration: set.break_duration || 0,
            songs: set.songs || [],
            set_order: index
          }
        end),
        total_duration: total_duration
      }

      # Update the in-memory state
      new_state = %{state | set_lists: Map.put(state.set_lists, name, new_set_list)}

      # Persist the updated state
      persist_set_lists(new_state.set_lists)

      {:reply, :ok, new_state}
    end
  end

  @impl true
  def handle_call(:list_set_lists, _from, state) do
    # Convert the in-memory map to a list and sort by name
    set_lists =
      state.set_lists
      |> Map.values()
      |> Enum.sort_by(& &1.name)

    {:reply, set_lists, state}
  end

  @impl true
  def handle_call({:get_set_list, name}, _from, state) do
    case Map.get(state.set_lists, name) do
      nil -> {:reply, {:error, "Set list not found"}, state}
      set_list -> {:reply, {:ok, set_list}, state}
    end
  end

  @impl true
  def handle_call({:update_set_list, name, params}, _from, state) do
    case Map.get(state.set_lists, name) do
      nil ->
        {:reply, {:error, "Set list not found"}, state}
      _existing ->
        # Extract sets from params
        sets = cond do
          # If params has a sets field, use that
          is_map(params) && (Map.has_key?(params, :sets) || Map.has_key?(params, "sets")) ->
            safe_get(params, :sets) || safe_get(params, "sets")
          # If it's already a list, assume it's the sets directly
          is_list(params) -> params
          # Otherwise treat the entire params as a single set
          true -> [params]
        end

        # Calculate total duration
        total_duration = calculate_total_duration(sets)

        # Create the updated set list in memory, preserving existing fields
        updated_set_list = %{
          name: name,
          sets: Enum.with_index(sets, 1) |> Enum.map(fn {set, index} ->
            %{
              name: safe_get(set, :name) || "Set #{index}",
              duration: safe_get(set, :duration) || 0,
              break_duration: safe_get(set, :break_duration) || 0,
              songs: safe_get(set, :songs) || [],
              set_order: index
            }
          end),
          total_duration: total_duration
        }

        # Add calendar fields if provided
        updated_set_list = if is_map(params) do
          calendar_fields = [:date, :location, :start_time, :end_time, :calendar_event_id]

          Enum.reduce(calendar_fields, updated_set_list, fn field, acc ->
            case Map.get(params, field) do
              nil -> acc
              value -> Map.put(acc, field, value)
            end
          end)
        else
          updated_set_list
        end

        # Update the in-memory state
        new_state = %{state | set_lists: Map.put(state.set_lists, name, updated_set_list)}

        # Persist the updated state
        persist_set_lists(new_state.set_lists)

        {:reply, :ok, new_state}
    end
  end

  @impl true
  def handle_call({:delete_set_list, name}, _from, state) do
    case Map.get(state.set_lists, name) do
      nil ->
        {:reply, {:error, "Set list not found"}, state}
      _set_list ->
        # Remove the set list from the in-memory state
        new_state = %{state | set_lists: Map.delete(state.set_lists, name)}

        # Persist the updated state
        persist_set_lists(new_state.set_lists)

        {:reply, :ok, new_state}
    end
  end

  # Helper functions for state management and persistence

  # Calculate total duration for a list of sets
  defp calculate_total_duration(sets) when is_list(sets) do
    Enum.reduce(sets, 0, fn set, total ->
      set_duration = cond do
        # If it's a struct with duration accessible
        is_struct(set) && Map.has_key?(set, :duration) ->
          duration = Map.get(set, :duration) || 0
          break_duration = Map.get(set, :break_duration) || 0
          duration + break_duration

        # For regular maps with duration key (atom or string)
        is_map(set) && (Map.has_key?(set, :duration) || Map.has_key?(set, "duration")) ->
          duration = Map.get(set, :duration) || Map.get(set, "duration") || 0
          break_duration = Map.get(set, :break_duration) || Map.get(set, "break_duration") || 0
          duration + break_duration

        # For maps with songs (calculate from songs if needed)
        is_map(set) && (Map.has_key?(set, :songs) || Map.has_key?(set, "songs")) ->
          songs = Map.get(set, :songs) || Map.get(set, "songs") || []
          songs_duration = calculate_songs_duration(songs)
          songs_duration + (Map.get(set, :break_duration) || Map.get(set, "break_duration") || 0)

        # If none of the above matched, return 0
        true -> 0
      end

      total + set_duration
    end)
  end

  # Calculate total duration for a map or struct with different structures
  defp calculate_total_duration(data) when is_map(data) do
    cond do
      # Handle map with sets field (atom key)
      Map.has_key?(data, :sets) ->
        sets = Map.get(data, :sets)
        if is_list(sets), do: calculate_total_duration(sets), else: 0

      # Handle map with sets field (string key)
      Map.has_key?(data, "sets") ->
        sets = Map.get(data, "sets")
        if is_list(sets), do: calculate_total_duration(sets), else: 0

      # Handle structs or maps with direct duration
      (is_struct(data) || is_map(data)) && (Map.has_key?(data, :duration) || Map.has_key?(data, "duration")) ->
        duration = Map.get(data, :duration) || Map.get(data, "duration") || 0
        break_duration = Map.get(data, :break_duration) || Map.get(data, "break_duration") || 0
        duration + break_duration

      # Handle maps with songs only
      (Map.has_key?(data, :songs) || Map.has_key?(data, "songs")) ->
        songs = Map.get(data, :songs) || Map.get(data, "songs") || []
        calculate_songs_duration(songs)

      # Default case
      true -> 0
    end
  end

  # Calculate the total duration for nil or any other type
  defp calculate_total_duration(_), do: 0

  # Helper to calculate duration from songs if needed
  defp calculate_songs_duration(songs) when is_list(songs) do
    songs
    |> Enum.map(fn song ->
      cond do
        is_map(song) && (Map.has_key?(song, :duration) || Map.has_key?(song, "duration")) ->
          Map.get(song, :duration) || Map.get(song, "duration") || 0
        true -> 0
      end
    end)
    |> Enum.sum()
  end
  defp calculate_songs_duration(_), do: 0

  # Load set lists from storage (database) for recovery
  defp load_set_lists_from_storage do
    # Check if we're in test mode
    test_env = Application.get_env(:band_db, :env) == :test

    if test_env do
      # In test mode, use the mock or return empty state to avoid DB access
      case persistence_module().load_set_lists() do
        {:ok, set_lists} -> set_lists
        {:error, _reason} -> %{}
      end
    else
      # In production, use normal persistence
      try do
        case persistence_module().load_set_lists() do
          {:ok, set_lists} -> set_lists
          {:error, _reason} -> %{}
        end
      rescue
        # Handle any database connection errors
        e ->
          Logger.error("Failed to load set lists from storage: #{inspect(e)}")
          %{}
      end
    end
  end

  # Persist set lists to storage (database) for recovery
  defp persist_set_lists(set_lists) do
    # Check if we're in test mode
    test_env = Application.get_env(:band_db, :env) == :test

    if test_env do
      # In test mode, use the mock without database access
      persistence_module().persist_set_lists(set_lists)
    else
      # In production, use normal persistence with error handling
      try do
        persistence_module().persist_set_lists(set_lists)
      rescue
        # Handle any database connection errors
        e ->
          Logger.error("Failed to persist set lists to storage: #{inspect(e)}")
          {:error, :persist_failed}
      end
    end
  end

  # Get the configured persistence module
  defp persistence_module do
    Application.get_env(:band_db, :set_list_persistence, BandDb.SetLists.SetListPersistence)
  end

  # Helper function to safely get a value from a map or struct
  defp safe_get(data, key, default \\ nil) do
    cond do
      # If it's nil, return the default
      is_nil(data) ->
        default

      # For Elixir structs (using Map.get for structs that implement Access)
      is_struct(data) ->
        if Map.has_key?(data, key) do
          Map.get(data, key)
        else
          # Just return default if the key doesn't exist in the struct
          default
        end

      # For plain maps with atom keys
      is_map(data) && is_atom(key) && Map.has_key?(data, key) ->
        Map.get(data, key)

      # For plain maps with string keys when using atom lookup
      is_map(data) && is_atom(key) && Map.has_key?(data, to_string(key)) ->
        Map.get(data, to_string(key))

      # For plain maps with atom keys when using string lookup
      is_map(data) && is_binary(key) && has_atom_key?(data, key) ->
        Map.get(data, String.to_atom(key))

      # Default case
      true -> default
    end
  end

  # Helper to safely check if a map has an atom key from a string
  defp has_atom_key?(map, string_key) do
    try do
      atom_key = String.to_existing_atom(string_key)
      Map.has_key?(map, atom_key)
    rescue
      _ -> false
    end
  end
end
