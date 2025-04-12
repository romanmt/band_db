defmodule BandDb.Repo.Migrations.MigrateSetListsToSets do
  use Ecto.Migration

  def up do
    # First, create a temporary table to store the new format
    create table(:set_lists_new) do
      add :name, :string, null: false
      add :total_duration, :integer
      add :inserted_at, :naive_datetime, null: false
      add :updated_at, :naive_datetime, null: false
    end

    create table(:sets) do
      add :set_list_id, references(:set_lists_new, on_delete: :delete_all), null: false
      add :name, :string, null: false
      add :songs, {:array, :string}, null: false
      add :duration, :integer
      add :break_duration, :integer, default: 0
      add :set_order, :integer, null: false
      add :inserted_at, :naive_datetime, null: false
      add :updated_at, :naive_datetime, null: false
    end

    # Migrate existing data
    execute """
    INSERT INTO set_lists_new (name, total_duration, inserted_at, updated_at)
    SELECT name, duration, inserted_at, updated_at
    FROM set_lists
    """, ""

    execute """
    INSERT INTO sets (set_list_id, name, songs, duration, break_duration, set_order, inserted_at, updated_at)
    SELECT
      sl.id,
      'Set 1',
      sl.songs,
      sl.duration,
      0,  -- Set break_duration to 0 since it doesn't exist in the old table
      1,
      sl.inserted_at,
      sl.updated_at
    FROM set_lists sl
    JOIN set_lists_new sln ON sl.name = sln.name
    """, ""

    # Drop the old table
    drop table(:set_lists)

    # Rename the new table to the original name
    rename table(:set_lists_new), to: table(:set_lists)
  end

  def down do
    # Create a temporary table for the old format
    create table(:set_lists_old) do
      add :name, :string, null: false
      add :songs, {:array, :string}
      add :duration, :integer
      add :inserted_at, :naive_datetime, null: false
      add :updated_at, :naive_datetime, null: false
    end

    # Migrate data back to old format
    execute """
    INSERT INTO set_lists_old (name, songs, duration, inserted_at, updated_at)
    SELECT
      sl.name,
      s.songs,
      s.duration,
      sl.inserted_at,
      sl.updated_at
    FROM set_lists sl
    JOIN sets s ON s.set_list_id = sl.id
    WHERE s.set_order = 1
    """, ""

    # Drop the new tables
    drop table(:sets)
    drop table(:set_lists)

    # Rename the old table back
    rename table(:set_lists_old), to: table(:set_lists)
  end
end
