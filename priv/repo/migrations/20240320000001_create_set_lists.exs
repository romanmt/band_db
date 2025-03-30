defmodule BandDb.Repo.Migrations.CreateSetLists do
  use Ecto.Migration

  def change do
    create table(:set_lists) do
      add :name, :string, null: false
      add :songs, {:array, :string}, default: []
      add :duration, :integer

      timestamps()
    end

    create unique_index(:set_lists, [:name])
  end
end
