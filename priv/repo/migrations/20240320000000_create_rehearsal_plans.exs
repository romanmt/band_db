defmodule BandDb.Repo.Migrations.CreateRehearsalPlans do
  use Ecto.Migration

  def change do
    create table(:rehearsal_plans) do
      add :date, :date, null: false
      add :rehearsal_songs, {:array, :string}, default: []
      add :set_songs, {:array, :string}, default: []
      add :duration, :integer

      timestamps()
    end

    create unique_index(:rehearsal_plans, [:date])
  end
end
