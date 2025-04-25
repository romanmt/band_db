defmodule BandDb.Repo.Migrations.AddBands do
  use Ecto.Migration

  def up do
    create table(:bands) do
      add :name, :string, null: false
      add :description, :text

      timestamps()
    end

    create unique_index(:bands, [:name])

    alter table(:users) do
      add :band_id, references(:bands, on_delete: :restrict)
    end

    # Add band_id to songs
    alter table(:songs) do
      add :band_id, references(:bands, on_delete: :restrict)
      # We'll keep band_name for backward compatibility but will eventually remove it
    end

    # Add band_id to rehearsal_plans
    alter table(:rehearsal_plans) do
      add :band_id, references(:bands, on_delete: :restrict)
    end

    # Add band_id to set_lists
    alter table(:set_lists) do
      add :band_id, references(:bands, on_delete: :restrict)
    end

    # Create indexes for faster lookups
    create index(:users, [:band_id])
    create index(:songs, [:band_id])
    create index(:rehearsal_plans, [:band_id])
    create index(:set_lists, [:band_id])

    # Flush the commands so the tables and columns exist before we query them
    flush()

    # Create a default band for existing data
    execute("INSERT INTO bands (name, description, inserted_at, updated_at) VALUES ('Default Band', 'Default band created during migration', NOW(), NOW())")

    # Flush again to ensure the band is created before we query it
    flush()

    # Get the default band ID and update related tables
    default_band_id = repo().query!("SELECT id FROM bands WHERE name = 'Default Band'", []).rows |> List.first() |> List.first()

    # Update existing records to use the default band
    execute("UPDATE users SET band_id = #{default_band_id}")
    execute("UPDATE songs SET band_id = #{default_band_id}")
    execute("UPDATE rehearsal_plans SET band_id = #{default_band_id}")
    execute("UPDATE set_lists SET band_id = #{default_band_id}")
  end

  def down do
    # Remove indexes first
    drop index(:set_lists, [:band_id])
    drop index(:rehearsal_plans, [:band_id])
    drop index(:songs, [:band_id])
    drop index(:users, [:band_id])

    # Remove foreign key columns
    alter table(:set_lists) do
      remove :band_id
    end

    alter table(:rehearsal_plans) do
      remove :band_id
    end

    alter table(:songs) do
      remove :band_id
    end

    alter table(:users) do
      remove :band_id
    end

    # Drop the bands table and index
    drop unique_index(:bands, [:name])
    drop table(:bands)
  end
end
