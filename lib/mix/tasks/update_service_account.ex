defmodule Mix.Tasks.UpdateServiceAccount do
  use Mix.Task
  
  alias BandDb.Repo
  alias BandDb.Calendar.ServiceAccount
  
  @shortdoc "Updates an existing service account with credentials"
  
  @moduledoc """
  Updates an existing service account with credentials from a JSON file.
  
  Usage:
    mix update_service_account <service_account_id> <path_to_credentials.json>
    
  Example:
    mix update_service_account 1 ~/Downloads/my-service-account-key.json
  """
  
  def run([id_str, credentials_path]) do
    Mix.Task.run("app.start")
    
    id = String.to_integer(id_str)
    
    # Read the credentials file
    case File.read(credentials_path) do
      {:ok, credentials_json} ->
        # Find the service account
        service_account = Repo.get!(ServiceAccount, id)
        
        # Update with credentials
        changeset = ServiceAccount.changeset(service_account, %{credentials: credentials_json})
        
        case Repo.update(changeset) do
          {:ok, updated} ->
            Mix.shell().info("Successfully updated service account '#{updated.name}' with credentials")
            Mix.shell().info("The calendar integration should now be working!")
          
          {:error, changeset} ->
            Mix.shell().error("Failed to update service account:")
            Enum.each(changeset.errors, fn {field, {msg, _}} ->
              Mix.shell().error("  #{field}: #{msg}")
            end)
        end
        
      {:error, reason} ->
        Mix.shell().error("Failed to read credentials file: #{reason}")
    end
  end
  
  def run(_) do
    Mix.shell().error("Usage: mix update_service_account <service_account_id> <path_to_credentials.json>")
  end
end