defmodule BandDb.SetLists.SetListServer do
  use GenServer
  require Logger
  alias BandDb.SetLists.{SetList, SetListPersistence}

  # Client API

  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def add_set_list(name, sets \\ [], total_duration \\ nil) do
    GenServer.call(__MODULE__, {:add_set_list, name, sets, total_duration})
  end

  def list_set_lists do
    GenServer.call(__MODULE__, :list_set_lists)
  end

  def get_set_list(name) do
    GenServer.call(__MODULE__, {:get_set_list, name})
  end

  def update_set_list(name, attrs) do
    GenServer.call(__MODULE__, {:update_set_list, name, attrs})
  end

  def delete_set_list(name) do
    GenServer.call(__MODULE__, {:delete_set_list, name})
  end

  # Server Callbacks

  @impl true
  def init(_args) do
    # Load initial state from persistence
    case SetListPersistence.load_set_lists() do
      {:ok, set_lists} ->
        SetListPersistence.schedule_backup(self())
        {:ok, %{set_lists: set_lists}}
      _ ->
        SetListPersistence.schedule_backup(self())
        {:ok, %{set_lists: []}}
    end
  end

  @impl true
  def handle_call({:add_set_list, name, sets, total_duration}, _from, state) do
    set_lists = state.set_lists
    case Enum.find(set_lists, fn set_list -> set_list.name == name end) do
      nil ->
        new_set_list = %SetList{name: name, sets: sets, total_duration: total_duration}
        new_state = %{state | set_lists: [new_set_list | set_lists]}
        {:reply, {:ok, new_set_list}, new_state}
      _existing ->
        {:reply, {:error, :set_list_already_exists}, state}
    end
  end

  @impl true
  def handle_call(:list_set_lists, _from, state) do
    {:reply, state.set_lists, state}
  end

  @impl true
  def handle_call({:get_set_list, name}, _from, state) do
    case Enum.find(state.set_lists, fn set_list -> set_list.name == name end) do
      nil -> {:reply, {:error, :not_found}, state}
      set_list -> {:reply, {:ok, set_list}, state}
    end
  end

  @impl true
  def handle_call({:update_set_list, name, attrs}, _from, state) do
    case Enum.find_index(state.set_lists, fn set_list -> set_list.name == name end) do
      nil ->
        {:reply, {:error, :not_found}, state}
      index ->
        old_set_list = Enum.at(state.set_lists, index)
        updated_set_list = struct(SetList, Map.merge(Map.from_struct(old_set_list), attrs))

        updated_set_lists = List.update_at(state.set_lists, index, fn _ -> updated_set_list end)
        new_state = %{state | set_lists: updated_set_lists}

        {:reply, {:ok, updated_set_list}, new_state}
    end
  end

  @impl true
  def handle_call({:delete_set_list, name}, _from, state) do
    case Enum.find_index(state.set_lists, fn set_list -> set_list.name == name end) do
      nil ->
        {:reply, {:error, :not_found}, state}
      index ->
        updated_set_lists = List.delete_at(state.set_lists, index)
        new_state = %{state | set_lists: updated_set_lists}
        {:reply, :ok, new_state}
    end
  end

  @impl true
  def handle_info(:backup, state) do
    Logger.info("Backing up set lists")
    SetListPersistence.persist_set_lists(state.set_lists)
    SetListPersistence.schedule_backup(self())
    {:noreply, state}
  end
end
