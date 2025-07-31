defmodule BandDb.Calendar.ServiceAccountEncryptionTest do
  use BandDb.DataCase
  
  alias BandDb.Calendar.ServiceAccount
  alias BandDb.Calendar.ServiceAccountManager
  alias BandDb.Repo
  
  @test_credentials """
  {
    "type": "service_account",
    "project_id": "test-project",
    "private_key_id": "key123",
    "private_key": "-----BEGIN PRIVATE KEY-----\\ntest_key\\n-----END PRIVATE KEY-----\\n",
    "client_email": "test@test-project.iam.gserviceaccount.com",
    "client_id": "123456789",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
  """
  
  describe "service account credentials encryption" do
    test "credentials are encrypted when saved to database" do
      # Create a service account with credentials
      {:ok, account} = ServiceAccountManager.create_service_account(%{
        name: "Test Account",
        credentials: @test_credentials
      })
      
      # Fetch the raw data from the database
      raw_account = Repo.one!(
        from sa in "service_accounts",
        where: sa.id == ^account.id,
        select: %{id: sa.id, credentials: sa.credentials}
      )
      
      # The raw credentials should be binary (encrypted)
      assert is_binary(raw_account.credentials)
      
      # The encrypted data should not contain the plaintext
      refute raw_account.credentials =~ "test-project"
      refute raw_account.credentials =~ "private_key"
      
      # When loaded through the schema, credentials should be decrypted
      loaded_account = Repo.get!(ServiceAccount, account.id)
      assert loaded_account.credentials == @test_credentials
    end
    
    test "credentials can be updated and remain encrypted" do
      # Create a service account
      {:ok, account} = ServiceAccountManager.create_service_account(%{
        name: "Update Test",
        credentials: @test_credentials
      })
      
      # Update with new credentials
      new_credentials = String.replace(@test_credentials, "test-project", "updated-project")
      {:ok, updated_account} = ServiceAccountManager.update_service_account(account, %{
        credentials: new_credentials
      })
      
      # Verify the update worked
      assert updated_account.credentials =~ "updated-project"
      
      # Verify it's still encrypted in the database
      raw_account = Repo.one!(
        from sa in "service_accounts",
        where: sa.id == ^account.id,
        select: %{credentials: sa.credentials}
      )
      
      refute raw_account.credentials =~ "updated-project"
    end
    
    test "credentials validation still works" do
      # Try to create account without credentials (should fail)
      {:error, changeset} = ServiceAccountManager.create_service_account(%{
        name: "No Credentials"
      })
      
      assert errors_on(changeset).credentials == ["can't be blank"]
    end
    
    test "invalid JSON in credentials is rejected" do
      {:error, changeset} = ServiceAccountManager.create_service_account(%{
        name: "Invalid JSON",
        credentials: "not valid json"
      })
      
      assert errors_on(changeset).credentials
    end
  end
end