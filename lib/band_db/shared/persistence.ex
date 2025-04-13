defmodule BandDb.Shared.Persistence do
  @moduledoc """
  Shared persistence logic for in-memory state management.
  """

  require Logger

  @backup_interval :timer.minutes(1)

  defmacro __using__(opts) do
    quote do
      @table_name unquote(opts[:table_name])
      @backup_interval unquote(@backup_interval)

      def init_persistence do
        Logger.info("Initializing persistence for #{@table_name}")
        # Recover state from database
        recovered_state = BandDb.Shared.Persistence.recover_state(@table_name)
        # Schedule periodic backup
        schedule_backup()
        recovered_state
      end

      def handle_backup(state) do
        Logger.info("Backing up #{@table_name} state")
        BandDb.Shared.Persistence.persist_state(@table_name, state)
        schedule_backup()
        {:noreply, state}
      end

      defp schedule_backup do
        Process.send_after(self(), :backup, @backup_interval)
      end
    end
  end

  @doc """
  Creates a persistence table for the given name.
  If table_type is :set, it creates a set table (default).
  If table_type is :bag, it creates a bag table.
  """
  def create_table(table_name, table_type \\ :set) do
    table_path = "#{table_name}"
    :dets.open_file(table_name, [
      {:file, table_path},
      {:type, table_type}
    ])
  end

  @doc """
  Closes the given persistence table.
  """
  def close_table(table_name) do
    :dets.close(table_name)
  end

  @doc """
  Recovers state from persistence storage.
  Returns either {:ok, state} or :error.
  """
  def recover_state(:songs_table) do
    case :dets.open_file(:songs_table, [{:file, "songs_table"}, {:type, :set}]) do
      {:ok, table} ->
        songs = case :dets.lookup(table, :songs) do
          [songs: songs_list] -> songs_list
          _ -> []
        end
        :dets.close(table)
        {:ok, %{songs: songs}}
      {:error, reason} ->
        Logger.error("Failed to recover songs: #{inspect(reason)}")
        :error
    end
  end

  def recover_state(:set_lists_table) do
    case :dets.open_file(:set_lists_table, [{:file, "set_lists_table"}, {:type, :bag}]) do
      {:ok, table} ->
        set_lists_tuples = :dets.match_object(table, {:"$1", :"$2"})
        set_lists = for {_, set_list} <- set_lists_tuples, do: set_list
        :dets.close(table)
        {:ok, %{set_lists: set_lists}}
      {:error, reason} ->
        Logger.error("Failed to recover set lists: #{inspect(reason)}")
        :error
    end
  end

  def recover_state(:rehearsal_plans_table) do
    case :dets.open_file(:rehearsal_plans_table, [{:file, "rehearsal_plans_table"}, {:type, :set}]) do
      {:ok, table} ->
        plans = :dets.match_object(table, {:"$1", :"$2"})
        |> Enum.map(fn {_, plan} -> plan end)
        :dets.close(table)
        {:ok, %{plans: plans}}
      {:error, reason} ->
        Logger.error("Failed to recover rehearsal plans: #{inspect(reason)}")
        :error
    end
  end

  def recover_state(table_name) do
    case :dets.open_file(table_name, [{:file, "#{table_name}"}, {:type, :set}]) do
      {:ok, table} ->
        case :dets.match_object(table, {:"$1", :"$2"}) do
          [] ->
            :dets.close(table)
            {:ok, %{}}
          items ->
            state = items
            |> Enum.map(fn {key, value} -> {key, value} end)
            |> Map.new()
            :dets.close(table)
            {:ok, state}
        end
      {:error, reason} ->
        Logger.error("Failed to recover state from #{table_name}: #{inspect(reason)}")
        :error
    end
  end

  @doc """
  Persists the given state to storage.
  """
  def persist_state(:songs_table, %{songs: songs}) do
    case :dets.open_file(:songs_table, [{:file, "songs_table"}, {:type, :set}]) do
      {:ok, table} ->
        :dets.insert(table, {:songs, songs})
        :dets.sync(table)
        :dets.close(table)
        :ok
      {:error, reason} ->
        Logger.error("Failed to persist songs: #{inspect(reason)}")
        :error
    end
  end

  def persist_state(:set_lists_table, %{set_lists: set_lists}) do
    case :dets.open_file(:set_lists_table, [{:file, "set_lists_table"}, {:type, :bag}]) do
      {:ok, table} ->
        :dets.delete_all_objects(table)
        Enum.each(set_lists, fn set_list ->
          :dets.insert(table, {set_list.name, set_list})
        end)
        :dets.sync(table)
        :dets.close(table)
        :ok
      {:error, reason} ->
        Logger.error("Failed to persist set lists: #{inspect(reason)}")
        :error
    end
  end

  def persist_state(:rehearsal_plans_table, %{plans: plans}) do
    case :dets.open_file(:rehearsal_plans_table, [{:file, "rehearsal_plans_table"}, {:type, :set}]) do
      {:ok, table} ->
        :dets.delete_all_objects(table)
        Enum.each(plans, fn plan ->
          date_str = Date.to_string(plan.date)
          :dets.insert(table, {date_str, plan})
        end)
        :dets.sync(table)
        :dets.close(table)
        :ok
      {:error, reason} ->
        Logger.error("Failed to persist rehearsal plans: #{inspect(reason)}")
        :error
    end
  end

  def persist_state(table_name, state) do
    case :dets.open_file(table_name, [{:file, "#{table_name}"}, {:type, :set}]) do
      {:ok, table} ->
        :dets.delete_all_objects(table)
        Enum.each(state, fn {key, value} ->
          :dets.insert(table, {key, value})
        end)
        :dets.sync(table)
        :dets.close(table)
        :ok
      {:error, reason} ->
        Logger.error("Failed to persist state to #{table_name}: #{inspect(reason)}")
        :error
    end
  end
end
