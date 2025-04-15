defmodule BandDb.Repo.Migrations.AddCalendarFieldsToSetLists do
  use Ecto.Migration

  def up do
    alter table(:set_lists) do
      add :date, :date
      add :location, :string
      add :start_time, :time
      add :end_time, :time
      add :calendar_event_id, :string
    end
  end

  def down do
    alter table(:set_lists) do
      remove :date
      remove :location
      remove :start_time
      remove :end_time
      remove :calendar_event_id
    end
  end
end
