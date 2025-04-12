defmodule BandDb.Repo.Migrations.AddSetListIndexes do
  use Ecto.Migration

  def change do
    # Add indexes to the sets table
    create index(:sets, [:set_list_id])
    create index(:sets, [:set_order])
    create unique_index(:sets, [:set_list_id, :set_order], name: :sets_set_list_id_set_order_index)
  end
end
