defmodule BandDb.Set do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  embedded_schema do
    field :name, :string
    field :songs, {:array, :string}
    field :duration, :integer  # Duration in seconds
    field :break_duration, :integer  # Break duration in seconds after this set (nil for last set)
    field :set_order, :integer  # Order of the set in the set list
  end

  def changeset(%__MODULE__{} = set, params) when is_map(params) do
    set
    |> cast(params, [:name, :songs, :duration, :break_duration, :set_order])
    |> validate_required([:name, :songs, :set_order])
  end
end

defmodule BandDb.SetList do
  use Ecto.Schema
  import Ecto.Changeset

  schema "set_lists" do
    field :name, :string
    embeds_many :sets, BandDb.Set
    field :total_duration, :integer  # Total duration including breaks in seconds

    timestamps()
  end

  def changeset(%__MODULE__{} = set_list, params) when is_map(params) do
    set_list
    |> cast(params, [:name, :total_duration])
    |> cast_embed(:sets)
    |> validate_required([:name])
    |> unique_constraint(:name)
  end
end

defmodule BandDb.SetListServer do
  use GenServer
  require Logger
  alias BandDb.{SetList, Repo}
  use BandDb.Persistence,
    table_name: :set_lists_table

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
    state = init_persistence()
    # Ensure we have a set_lists list
    state = if Map.has_key?(state, :set_lists), do: state, else: %{set_lists: []}
    # Migrate any old format set lists to new format
    state = migrate_old_set_lists(state)
    {:ok, state}
  end

  defp migrate_old_set_lists(state) do
    updated_set_lists = Enum.map(state.set_lists, fn set_list ->
      cond do
        # Handle old format with songs array
        is_list(set_list.songs) and not is_list(Map.get(set_list, :sets, nil)) ->
          %SetList{
            name: set_list.name,
            sets: [
              %BandDb.Set{
                name: "Set 1",
                songs: Enum.map(set_list.songs, & &1.title),
                duration: set_list.duration,
                break_duration: nil,
                set_order: 1
              }
            ],
            total_duration: set_list.duration
          }
        # Already in new format
        true ->
          set_list
      end
    end)

    %{state | set_lists: updated_set_lists}
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
  def handle_info(:backup, state), do: handle_backup(state)
end
