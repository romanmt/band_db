defmodule BandDb.RehearsalPlan do
  use Ecto.Schema
  import Ecto.Changeset

  schema "rehearsal_plans" do
    field :date, :date
    field :rehearsal_songs, {:array, :string}
    field :set_songs, {:array, :string}
    field :duration, :integer  # Duration in minutes

    timestamps()
  end

  def changeset(%__MODULE__{} = plan, params) when is_map(params) do
    plan
    |> cast(params, [:date, :rehearsal_songs, :set_songs, :duration])
    |> validate_required([:date])
  end
end

defmodule BandDb.RehearsalPlanServer do
  use GenServer
  require Logger
  alias BandDb.{RehearsalPlan, Repo}
  use BandDb.Persistence,
    table_name: :rehearsal_plans_table

  # Client API

  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def save_plan(date, rehearsal_songs, set_songs, duration) do
    GenServer.call(__MODULE__, {:save_plan, date, rehearsal_songs, set_songs, duration})
  end

  def list_plans do
    GenServer.call(__MODULE__, :list_plans)
  end

  def get_plan(date) do
    GenServer.call(__MODULE__, {:get_plan, date})
  end

  def update_plan(date, attrs) do
    GenServer.call(__MODULE__, {:update_plan, date, attrs})
  end

  def delete_plan(date) do
    GenServer.call(__MODULE__, {:delete_plan, date})
  end

  # Server Callbacks

  @impl true
  def init(_args) do
    state = init_persistence()
    # Ensure we have a plans list
    state = if Map.has_key?(state, :plans), do: state, else: %{plans: []}
    {:ok, state}
  end

  @impl true
  def handle_call({:save_plan, date, rehearsal_songs, set_songs, duration}, _from, state) do
    plans = state.plans
    case Enum.find(plans, fn plan -> plan.date == date end) do
      nil ->
        new_plan = %RehearsalPlan{
          date: date,
          rehearsal_songs: rehearsal_songs,
          set_songs: set_songs,
          duration: duration
        }
        new_state = %{state | plans: [new_plan | plans]}
        {:reply, {:ok, new_plan}, new_state}
      _existing ->
        {:reply, {:error, :plan_already_exists}, state}
    end
  end

  @impl true
  def handle_call(:list_plans, _from, state) do
    {:reply, state.plans, state}
  end

  @impl true
  def handle_call({:get_plan, date}, _from, state) do
    case Enum.find(state.plans, fn plan -> plan.date == date end) do
      nil -> {:reply, {:error, :not_found}, state}
      plan -> {:reply, {:ok, plan}, state}
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
  def handle_info(:backup, state), do: handle_backup(state)
end
