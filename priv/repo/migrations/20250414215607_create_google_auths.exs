defmodule BandDb.Repo.Migrations.CreateGoogleAuths do
  use Ecto.Migration

  def up do
    create table(:google_auths) do
      add :refresh_token, :text
      add :access_token, :text
      add :expires_at, :utc_datetime
      add :calendar_id, :string
      add :user_id, references(:users, on_delete: :nothing)

      timestamps(type: :utc_datetime)
    end

    create index(:google_auths, [:user_id])
  end

  def down do
    drop index(:google_auths, [:user_id])
    drop table(:google_auths)
  end
end
