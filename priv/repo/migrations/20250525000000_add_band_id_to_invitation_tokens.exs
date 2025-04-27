defmodule BandDb.Repo.Migrations.AddBandIdToInvitationTokens do
  use Ecto.Migration

  def up do
    alter table(:invitation_tokens) do
      add :band_id, references(:bands, on_delete: :nothing)
    end

    create index(:invitation_tokens, [:band_id])
  end

  def down do
    drop index(:invitation_tokens, [:band_id])

    alter table(:invitation_tokens) do
      remove :band_id
    end
  end
end
