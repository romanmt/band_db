defmodule BandDb.Persistence do
  require Logger
  import Ecto.Query

  @backup_interval :timer.minutes(1)

  defmacro __using__(opts) do
    quote do
      @table_name unquote(opts[:table_name])
      @backup_interval unquote(@backup_interval)

      def init_persistence do
        Logger.info("Initializing persistence for #{@table_name}")
        # Recover state from database
        recovered_state = BandDb.Persistence.recover_state(@table_name)
        # Schedule periodic backup
        schedule_backup()
        recovered_state
      end

      def handle_backup(state) do
        Logger.info("Backing up #{@table_name} state")
        BandDb.Persistence.persist_state(@table_name, state)
        schedule_backup()
        {:noreply, state}
      end

      defp schedule_backup do
        Process.send_after(self(), :backup, @backup_interval)
      end
    end
  end

  def recover_state(:songs_table) do
    case BandDb.Repo.all(BandDb.Song) do
      songs when is_list(songs) -> %{songs: songs}
      _ -> %{songs: []}
    end
  end

  def persist_state(:songs_table, %{songs: songs}) do
    # Start a transaction
    BandDb.Repo.transaction(fn ->
      # Delete all existing songs
      BandDb.Repo.delete_all(BandDb.Song)

      # Insert all songs
      Enum.each(songs, fn song ->
        %BandDb.Song{}
        |> BandDb.Song.changeset(Map.from_struct(song))
        |> BandDb.Repo.insert!()
      end)
    end)
  end

  # Fallback for other tables (not yet migrated to Ecto)
  def recover_state(table_name) do
    File.mkdir_p!("priv")
    case :dets.open_file(table_name, file: String.to_charlist("priv/#{table_name}.dets")) do
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

  def persist_state(table_name, state) do
    case :dets.open_file(table_name, file: String.to_charlist("priv/#{table_name}.dets")) do
      {:ok, table} ->
        :dets.insert(table, {:state, state})
        :dets.close(table)
      {:error, reason} ->
        Logger.error("Failed to persist state for #{table_name}: #{inspect(reason)}")
    end
  end
end
