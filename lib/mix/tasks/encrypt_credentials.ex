defmodule Mix.Tasks.EncryptCredentials do
  @moduledoc """
  Encrypts existing service account credentials in the database.
  
  Usage:
    mix encrypt_credentials
  """
  use Mix.Task
  
  alias BandDb.Repo
  alias BandDb.Calendar.ServiceAccount
  
  @shortdoc "Encrypts existing service account credentials"
  def run(_args) do
    Mix.Task.run("app.start")
    
    IO.puts("Starting credential encryption...")
    
    # Get all service accounts
    service_accounts = Repo.all(ServiceAccount)
    
    Enum.each(service_accounts, fn account ->
      case encrypt_account_credentials(account) do
        {:ok, _} ->
          IO.puts("✓ Encrypted credentials for: #{account.name}")
        {:error, reason} ->
          IO.puts("✗ Failed to encrypt credentials for #{account.name}: #{inspect(reason)}")
      end
    end)
    
    IO.puts("Credential encryption complete!")
  end
  
  defp encrypt_account_credentials(account) do
    # The credentials are already in the database as plaintext
    # When we read them, they come as a string
    # When we save them back, Cloak will automatically encrypt them
    
    # Check if credentials look like they're already encrypted (binary data)
    case account.credentials do
      nil -> 
        {:ok, account}
      credentials when is_binary(credentials) ->
        # Try to decode as JSON to see if it's plaintext
        case Jason.decode(credentials) do
          {:ok, _json} ->
            # It's plaintext JSON, needs encryption
            # Simply updating the record will trigger encryption
            account
            |> Ecto.Changeset.change(%{})
            |> Repo.update()
          {:error, _} ->
            # It's not valid JSON, might already be encrypted
            IO.puts("  → Credentials for #{account.name} appear to already be encrypted")
            {:ok, account}
        end
    end
  end
end