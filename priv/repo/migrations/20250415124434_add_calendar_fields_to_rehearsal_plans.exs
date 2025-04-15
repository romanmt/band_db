defmodule BandDb.Repo.Migrations.AddCalendarFieldsToRehearsalPlans do
  use Ecto.Migration

  def change do
    alter table(:rehearsal_plans) do
      add :scheduled_date, :date
      add :start_time, :time
      add :end_time, :time
      add :location, :string
      add :calendar_event_id, :string
    end
  end
end
