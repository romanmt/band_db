defmodule BandDb.Repo.Migrations.AddCalendarFieldsToRehearsalPlans do
  use Ecto.Migration

  def up do
    alter table(:rehearsal_plans) do
      add :scheduled_date, :date
      add :start_time, :time
      add :end_time, :time
      add :location, :string
      add :calendar_event_id, :string
    end
  end

  def down do
    alter table(:rehearsal_plans) do
      remove :scheduled_date
      remove :start_time
      remove :end_time
      remove :location
      remove :calendar_event_id
    end
  end
end
