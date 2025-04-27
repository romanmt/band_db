defmodule BandDb.Repo.Migrations.AddBands do
  use Ecto.Migration

  def up do
    # Create the bands table (will do nothing if it already exists)
    create_if_not_exists table(:bands) do
      add :name, :string, null: false
      add :description, :text

      timestamps()
    end

    # Create index (will do nothing if it already exists)
    create_if_not_exists unique_index(:bands, [:name])

    # Check if band_id columns need to be added to other tables
    # Note: We don't use execute/query directly since it can fail in unit tests
    # Instead, we use alter table which is safer in migrations

    # Add band_id to users if not exists
    unless column_exists?(:users, :band_id) do
      alter table(:users) do
        add :band_id, references(:bands, on_delete: :restrict)
      end
    end

    # Add band_id to songs if not exists
    unless column_exists?(:songs, :band_id) do
      alter table(:songs) do
        add :band_id, references(:bands, on_delete: :restrict)
      end
    end

    # Add band_id to rehearsal_plans if not exists
    unless column_exists?(:rehearsal_plans, :band_id) do
      alter table(:rehearsal_plans) do
        add :band_id, references(:bands, on_delete: :restrict)
      end
    end

    # Add band_id to set_lists if not exists
    unless column_exists?(:set_lists, :band_id) do
      alter table(:set_lists) do
        add :band_id, references(:bands, on_delete: :restrict)
      end
    end

    # Create indexes if needed
    create_if_not_exists index(:users, [:band_id])
    create_if_not_exists index(:songs, [:band_id])
    create_if_not_exists index(:rehearsal_plans, [:band_id])
    create_if_not_exists index(:set_lists, [:band_id])
  end

  def down do
    # Drop indexes if they exist
    if index_exists?(:set_lists, [:band_id]) do
      drop index(:set_lists, [:band_id])
    end

    if index_exists?(:rehearsal_plans, [:band_id]) do
      drop index(:rehearsal_plans, [:band_id])
    end

    if index_exists?(:songs, [:band_id]) do
      drop index(:songs, [:band_id])
    end

    if index_exists?(:users, [:band_id]) do
      drop index(:users, [:band_id])
    end

    # Remove band_id columns if they exist
    if column_exists?(:set_lists, :band_id) do
      alter table(:set_lists) do
        remove :band_id
      end
    end

    if column_exists?(:rehearsal_plans, :band_id) do
      alter table(:rehearsal_plans) do
        remove :band_id
      end
    end

    if column_exists?(:songs, :band_id) do
      alter table(:songs) do
        remove :band_id
      end
    end

    if column_exists?(:users, :band_id) do
      alter table(:users) do
        remove :band_id
      end
    end

    # Drop the bands table if it exists
    if table_exists?(:bands) do
      if index_exists?(:bands, [:name]) do
        drop_if_exists unique_index(:bands, [:name])
      end
      drop_if_exists table(:bands)
    end
  end

  # Helper function to check if a table exists
  defp table_exists?(table) do
    query = """
    SELECT 1 FROM information_schema.tables
    WHERE table_name = '#{table}'
    """

    case repo().query(query, []) do
      {:ok, %{num_rows: 1}} -> true
      _ -> false
    end
  end

  # Helper function to check if a column exists
  defp column_exists?(table, column) do
    query = """
    SELECT 1 FROM information_schema.columns
    WHERE table_name = '#{table}' AND column_name = '#{column}'
    """

    case repo().query(query, []) do
      {:ok, %{num_rows: 1}} -> true
      _ -> false
    end
  end

  # Helper function to check if an index exists
  defp index_exists?(table, columns) do
    column_name = "#{table}_#{Enum.join(columns, "_")}_index"
    query = """
    SELECT 1 FROM pg_indexes
    WHERE tablename = '#{table}' AND indexname = '#{column_name}'
    """

    case repo().query(query, []) do
      {:ok, %{num_rows: 1}} -> true
      _ -> false
    end
  end
end
