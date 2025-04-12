defmodule BandDb.SetLists.SetListServer do
  @moduledoc """
  GenServer for managing set lists.
  """
  use GenServer
  require Logger
  alias BandDb.SetLists.{SetList, Set, SetListPersistence}

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
  def init(name) do
    state = case SetListPersistence.load_set_lists() do
      {:ok, set_lists} -> set_lists
      {:error, _} -> %{}
    end

    schedule_backup()
    {:ok, state}
  end

  @impl true
  def handle_call({:add_set_list, name, sets}, _from, state) do
    case Map.has_key?(state, name) do
      true ->
        {:reply, {:error, "Set list already exists"}, state}
      false ->
        # Handle both single set and list of sets
        sets = if is_list(sets), do: sets, else: [sets]
        # Create a new SetList with the sets directly
        set_list = %SetList{
          id: Ecto.UUID.generate(),
          name: name,
          sets: sets,
          total_duration: calculate_total_duration(sets)
        }
        new_state = Map.put(state, name, set_list)
        {:reply, :ok, new_state}
    end
  end

  @impl true
  def handle_call(:list_set_lists, _from, state) do
    {:reply, Map.values(state), state}
  end

  @impl true
  def handle_call({:get_set_list, name}, _from, state) do
    case Map.get(state, name) do
      nil -> {:reply, {:error, "Set list not found"}, state}
      set_list -> {:reply, {:ok, set_list}, state}
    end
  end

  @impl true
  def handle_call({:update_set_list, name, sets}, _from, state) do
    case Map.get(state, name) do
      nil ->
        {:reply, {:error, "Set list not found"}, state}
      set_list ->
        # Handle both single set and list of sets
        sets = if is_list(sets), do: sets, else: [sets]
        updated_set_list = %{set_list |
          sets: sets,
          total_duration: calculate_total_duration(sets)
        }
        new_state = Map.put(state, name, updated_set_list)
        {:reply, :ok, new_state}
    end
  end

  @impl true
  def handle_call({:delete_set_list, name}, _from, state) do
    case Map.get(state, name) do
      nil ->
        {:reply, {:error, "Set list not found"}, state}
      _ ->
        new_state = Map.delete(state, name)
        {:reply, :ok, new_state}
    end
  end

  @impl true
  def handle_info(:backup, state) do
    Logger.info("Backing up set lists")
    SetListPersistence.persist_set_lists(state)
    schedule_backup()
    {:noreply, state}
  end

  defp schedule_backup do
    Process.send_after(self(), :backup, :timer.hours(24))
  end

  defp calculate_total_duration(sets) do
    Enum.reduce(sets, 0, fn set, acc ->
      set_duration = (set.duration || 0)
      break_duration = (set.break_duration || 0)
      acc + set_duration + break_duration
    end)
  end
end
