defmodule BandDb.Repo.Migrations.AddUuidToSongs do
  use Ecto.Migration

  def up do
    # First add the column as nullable
    alter table(:songs) do
      add :uuid, :uuid
    end

    # Execute raw SQL to populate UUIDs for existing records
    execute """
    UPDATE songs
    SET uuid = gen_random_uuid()
    WHERE uuid IS NULL
    """

    # Now make it non-nullable and add the unique constraint
    alter table(:songs) do
      modify :uuid, :uuid, null: false
    end

    create unique_index(:songs, [:uuid])
  end

  def down do
    drop index(:songs, [:uuid])

    alter table(:songs) do
      remove :uuid
    end
  end
end
