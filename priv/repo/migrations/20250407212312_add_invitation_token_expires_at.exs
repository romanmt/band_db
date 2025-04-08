defmodule BandDb.Repo.Migrations.AddInvitationTokenExpiresAt do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :invitation_token_expires_at, :utc_datetime
    end
  end
end
