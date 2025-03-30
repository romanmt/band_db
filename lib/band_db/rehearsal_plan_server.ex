defmodule BandDb.RehearsalPlanServer do
  use GenServer
  require Logger

  # Client API
  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def save_plan(date, rehearsal_songs, set_songs, total_duration) do
    GenServer.call(__MODULE__, {:save_plan, date, rehearsal_songs, set_songs, total_duration})
  end

  def list_plans do
    GenServer.call(__MODULE__, :list_plans)
  end

  # Server Callbacks
  @impl true
  def init(_) do
    {:ok, %{plans: []}}
  end

  @impl true
  def handle_call({:save_plan, date, rehearsal_songs, set_songs, total_duration}, _from, state) do
    plan = %{
      date: date,
      rehearsal_songs: rehearsal_songs,
      set_songs: set_songs,
      total_duration: total_duration,
      created_at: DateTime.utc_now()
    }

    new_state = %{state | plans: [plan | state.plans]}
    {:reply, :ok, new_state}
  end

  @impl true
  def handle_call(:list_plans, _from, state) do
    sorted_plans = state.plans
      |> Enum.sort_by(& &1.date, {:desc, Date})
    {:reply, sorted_plans, state}
  end
end
