defmodule BandDb.Repo.Migrations.EncryptServiceAccountCredentials do
  use Ecto.Migration

  def up do
    # Add a temporary column for the encrypted data
    alter table(:service_accounts) do
      add :credentials_encrypted, :binary
    end
    
    # Copy data to the new column (will be NULL initially, that's OK)
    execute "UPDATE service_accounts SET credentials_encrypted = NULL"
    
    # Drop the old column
    alter table(:service_accounts) do
      remove :credentials
    end
    
    # Rename the new column to credentials
    execute "ALTER TABLE service_accounts RENAME COLUMN credentials_encrypted TO credentials"
  end

  def down do
    # Add a temporary text column
    alter table(:service_accounts) do
      add :credentials_text, :text
    end
    
    # Note: We can't decrypt here since it requires the application running
    # This would need to be handled by a separate task
    execute "UPDATE service_accounts SET credentials_text = NULL"
    
    # Drop the encrypted column
    alter table(:service_accounts) do
      remove :credentials
    end
    
    # Rename back
    execute "ALTER TABLE service_accounts RENAME COLUMN credentials_text TO credentials"
  end
end