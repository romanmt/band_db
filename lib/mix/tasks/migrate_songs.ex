defmodule Mix.Tasks.MigrateSongs do
  use Mix.Task
  require Logger

  @shortdoc "Migrate songs to include the tuning field"

  @impl Mix.Task
  def run(_) do
    # Start the necessary applications
    Application.ensure_all_started(:band_db)

    Logger.info("Starting migration of songs...")

    # Call the migration function
    case BandDb.SongServer.migrate_songs() do
      {:ok, count} ->
        Logger.info("Successfully migrated #{count} songs.")

      error ->
        Logger.error("Error migrating songs: #{inspect(error)}")
    end

    Logger.info("Migration completed.")
  end
end
