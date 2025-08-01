defmodule BandDb.Repo.Migrations.AddCalendarFieldsToBands do
  use Ecto.Migration

  def up do
    alter table(:bands) do
      add :calendar_id, :string
      add :ical_token, :string
    end

    create index(:bands, [:calendar_id])
    create unique_index(:bands, [:ical_token])
  end

  def down do
    drop unique_index(:bands, [:ical_token])
    drop index(:bands, [:calendar_id])
    
    alter table(:bands) do
      remove :calendar_id
      remove :ical_token
    end
  end
end