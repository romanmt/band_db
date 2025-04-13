defmodule BandDb.SetLists.SetListServer do
  @moduledoc """
  GenServer for managing set lists.

  Follows architectural pattern:
  - State is managed in memory
  - Persistence is only used for recovery after server restarts
  """
  use GenServer
  require Logger
  alias BandDb.{Repo, SetLists.SetList, SetLists.Set}
  import Ecto.Query

  # Client API

  @doc """
  Starts the SetListServer with the given name.
  """
  def start_link(name \\ __MODULE__) do
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
  def update_set_list(server \\ __MODULE__, name, sets) do
    GenServer.call(server, {:update_set_list, name, sets})
  end

  @doc """
  Deletes a set list.
  """
  def delete_set_list(server \\ __MODULE__, name) do
    GenServer.call(server, {:delete_set_list, name})
  end

  # Server Callbacks

  @impl true
  def init(_name) do
    # Load the initial state from the database
    set_lists = load_set_lists_from_storage()
    Logger.info("SetListServer initialized with #{map_size(set_lists)} set lists")

    # Return the state with in-memory set lists
    {:ok, %{set_lists: set_lists}}
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

      # Persist asynchronously for recovery purposes
      Task.start(fn -> persist_set_lists(new_state.set_lists) end)

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
  def handle_call({:update_set_list, name, sets}, _from, state) do
    # Handle both single set and list of sets
    sets = if is_list(sets), do: sets, else: [sets]

    case Map.get(state.set_lists, name) do
      nil ->
        {:reply, {:error, "Set list not found"}, state}
      _existing ->
        # Calculate total duration
        total_duration = calculate_total_duration(sets)

        # Create the updated set list in memory
        updated_set_list = %{
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
        new_state = %{state | set_lists: Map.put(state.set_lists, name, updated_set_list)}

        # Persist asynchronously for recovery purposes
        Task.start(fn -> persist_set_lists(new_state.set_lists) end)

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

        # Persist asynchronously for recovery purposes
        Task.start(fn -> persist_set_lists(new_state.set_lists) end)

        {:reply, :ok, new_state}
    end
  end

  # Helper functions for state management and persistence

  defp calculate_total_duration(sets) do
    Enum.reduce(sets, 0, fn set, total ->
      total + (set.duration || 0) + (set.break_duration || 0)
    end)
  end

  # Load set lists from storage (database) for recovery
  defp load_set_lists_from_storage do
    # Query all set lists with their sets
    set_lists = SetList
    |> preload(:sets)
    |> order_by([sl], sl.name)
    |> Repo.all()

    # Convert them to our in-memory format (map with name as key)
    set_lists
    |> Enum.map(fn sl ->
      # Convert the set list to a map with nested sets
      {
        sl.name,
        %{
          name: sl.name,
          sets: Enum.map(sl.sets, fn set ->
            %{
              name: set.name,
              duration: set.duration,
              break_duration: set.break_duration,
              songs: set.songs,
              set_order: set.set_order
            }
          end) |> Enum.sort_by(& &1.set_order),
          total_duration: sl.total_duration
        }
      }
    end)
    |> Map.new()
  end

  # Persist set lists to storage (database) for recovery
  defp persist_set_lists(set_lists) do
    # Use a transaction to ensure all updates are atomic
    Repo.transaction(fn ->
      # Get all existing set lists from the database
      existing_set_lists = Repo.all(from sl in SetList, select: sl.name)
      existing_set_list_names = MapSet.new(existing_set_lists)

      # Determine which set lists to create, update, or delete
      current_set_list_names = MapSet.new(Map.keys(set_lists))

      # Set lists to create (in current but not in existing)
      to_create = MapSet.difference(current_set_list_names, existing_set_list_names)

      # Set lists to update (in both)
      to_update = MapSet.intersection(current_set_list_names, existing_set_list_names)

      # Set lists to delete (in existing but not in current)
      to_delete = MapSet.difference(existing_set_list_names, current_set_list_names)

      # Delete set lists that no longer exist in memory
      Repo.delete_all(from sl in SetList, where: sl.name in ^MapSet.to_list(to_delete))

      # Update existing set lists
      Enum.each(MapSet.to_list(to_update), fn name ->
        set_list = Map.get(set_lists, name)

        # Find the existing set list
        db_set_list = Repo.get_by(SetList, name: name)

        # Update the set list
        db_set_list
        |> SetList.changeset(%{total_duration: set_list.total_duration})
        |> Repo.update!()

        # Delete all existing sets and create new ones
        Repo.delete_all(from s in Set, where: s.set_list_id == ^db_set_list.id)

        # Create new sets
        Enum.each(set_list.sets, fn set ->
          # Convert the songs if they're maps to match the database schema
          songs = convert_songs_for_storage(set.songs)

          %Set{}
          |> Set.changeset(%{
            name: set.name,
            duration: set.duration,
            break_duration: set.break_duration,
            songs: songs,
            set_list_id: db_set_list.id,
            set_order: set.set_order
          })
          |> Repo.insert!()
        end)
      end)

      # Create new set lists
      Enum.each(MapSet.to_list(to_create), fn name ->
        set_list = Map.get(set_lists, name)

        # Create the set list
        db_set_list = %SetList{}
        |> SetList.changeset(%{
          name: name,
          total_duration: set_list.total_duration
        })
        |> Repo.insert!()

        # Create the sets
        Enum.each(set_list.sets, fn set ->
          # Convert the songs if they're maps to match the database schema
          songs = convert_songs_for_storage(set.songs)

          %Set{}
          |> Set.changeset(%{
            name: set.name,
            duration: set.duration,
            break_duration: set.break_duration,
            songs: songs,
            set_list_id: db_set_list.id,
            set_order: set.set_order
          })
          |> Repo.insert!()
        end)
      end)
    end)
  end

  # Convert songs to the format expected by the database
  defp convert_songs_for_storage(songs) do
    Enum.map(songs, fn
      %{title: title} -> title
      song when is_binary(song) -> song
      _ -> nil
    end)
    |> Enum.filter(&(&1 != nil))
  end

  # Error handling helper
  defp format_changeset_errors(changeset) do
    changeset
    |> errors_on()
    |> Map.to_list()
    |> Enum.map_join(", ", fn {key, errors} ->
      errors_text = Enum.join(errors, ", ")
      "#{key} #{errors_text}"
    end)
  end

  # Implementation to safely handle error message generation
  defp errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {message, opts} ->
      Regex.replace(~r"%{(\w+)}", message, fn _, key ->
        opts
        |> Keyword.get(String.to_existing_atom(key), key)
        |> stringify_value()
      end)
    end)
  end

  defp stringify_value(value) when is_tuple(value), do: inspect(value)
  defp stringify_value(value) when is_atom(value), do: Atom.to_string(value)
  defp stringify_value(value) when is_list(value), do: inspect(value)
  defp stringify_value(value) when is_map(value), do: inspect(value)
  defp stringify_value(value), do: to_string(value)
end
