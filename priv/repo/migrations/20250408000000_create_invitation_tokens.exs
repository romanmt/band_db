defmodule BandDb.Repo.Migrations.CreateInvitationTokens do
  use Ecto.Migration

  def change do
    create table(:invitation_tokens) do
      add :token, :string, null: false
      add :expires_at, :utc_datetime, null: false
      add :used_at, :utc_datetime
      add :created_by_id, references(:users, on_delete: :nothing)

      timestamps(type: :utc_datetime)
    end

    create unique_index(:invitation_tokens, [:token])
    create index(:invitation_tokens, [:created_by_id])
  end
end
