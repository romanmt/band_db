defmodule BandDb.Repo.Migrations.AddInvitationTokenSafely do
  use Ecto.Migration

  def change do
    # Add the column if it doesn't exist
    execute """
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'invitation_token'
      ) THEN
        ALTER TABLE users ADD COLUMN invitation_token text;
      END IF;
    END $$;
    """

    # Create the index if it doesn't exist
    execute """
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'users'
        AND indexname = 'users_invitation_token_index'
      ) THEN
        CREATE UNIQUE INDEX users_invitation_token_index ON users (invitation_token);
      END IF;
    END $$;
    """
  end
end
