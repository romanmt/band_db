defmodule BandDb.Persistence do
  require Logger

  @backup_interval :timer.minutes(1)

  defmacro __using__(opts) do
    quote do
      @table_name unquote(opts[:table_name])
      @storage_file unquote(opts[:storage_file])
      @backup_interval unquote(@backup_interval)

      def init_persistence do
        Logger.info("Initializing persistence for #{@table_name}")
        # Recover state from disk
        recovered_state = BandDb.Persistence.recover_state(@table_name, @storage_file)
        # Schedule periodic backup
        schedule_backup()
        recovered_state
      end

      def handle_backup(state) do
        Logger.info("Backing up #{@table_name} state")
        BandDb.Persistence.persist_state(@table_name, @storage_file, state)
        schedule_backup()
        {:noreply, state}
      end

      defp schedule_backup do
        Process.send_after(self(), :backup, @backup_interval)
      end
    end
  end

  def recover_state(table_name, storage_file) do
    File.mkdir_p!("priv")
    case :dets.open_file(table_name, file: String.to_charlist(storage_file)) do
      {:ok, table} ->
        state = case :dets.lookup(table, :state) do
          [{:state, data}] -> data
          _ -> %{} # Return empty map if no state found
        end
        :dets.close(table)
        state
      {:error, reason} ->
        Logger.error("Failed to recover state for #{table_name}: #{inspect(reason)}")
        %{} # Return empty map on error
    end
  end

  def persist_state(table_name, storage_file, state) do
    case :dets.open_file(table_name, file: String.to_charlist(storage_file)) do
      {:ok, table} ->
        :dets.insert(table, {:state, state})
        :dets.close(table)
      {:error, reason} ->
        Logger.error("Failed to persist state for #{table_name}: #{inspect(reason)}")
    end
  end
end
