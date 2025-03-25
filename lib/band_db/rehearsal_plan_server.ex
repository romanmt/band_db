defmodule BandDb.RehearsalPlanServer do
  use GenServer
  require Logger

  @table_name :rehearsal_plans_table
  @storage_file "priv/rehearsal_plans.dets"
  @backup_interval :timer.minutes(5)

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
    # Recover state from disk
    recovered_state = recover_state()

    # Schedule periodic state backup
    schedule_backup()

    {:ok, recovered_state}
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
    sorted_plans = Enum.sort_by(state.plans, & &1.date, {:desc, Date})
    {:reply, sorted_plans, state}
  end

  @impl true
  def handle_info(:backup, state) do
    Logger.info("Backing up rehearsal plans state")
    persist_state(state)
    schedule_backup()
    {:noreply, state}
  end

  # Private Functions

  defp recover_state do
    File.mkdir_p!("priv")
    case :dets.open_file(@table_name, file: String.to_charlist(@storage_file)) do
      {:ok, table} ->
        state = case :dets.lookup(table, :plans) do
          [{:plans, plans}] -> %{plans: plans}
          _ -> %{plans: []}
        end
        :dets.close(table)
        state
      {:error, reason} ->
        Logger.error("Failed to recover rehearsal plans state: #{inspect(reason)}")
        %{plans: []}
    end
  end

  defp persist_state(state) do
    case :dets.open_file(@table_name, file: String.to_charlist(@storage_file)) do
      {:ok, table} ->
        :dets.insert(table, {:plans, state.plans})
        :dets.close(table)
      {:error, reason} ->
        Logger.error("Failed to persist rehearsal plans state: #{inspect(reason)}")
    end
  end

  defp schedule_backup do
    Process.send_after(self(), :backup, @backup_interval)
  end
end
