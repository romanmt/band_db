defmodule Mix.Tasks.ManageServiceAccounts do
  @moduledoc """
  Mix task to manage Google service accounts.
  
  Usage:
    mix manage_service_accounts list                    # List all service accounts
    mix manage_service_accounts activate <name>         # Activate a service account by name
    mix manage_service_accounts activate_first         # Activate the first service account
    mix manage_service_accounts delete <name>          # Delete a service account by name
  """
  
  use Mix.Task
  
  alias BandDb.Repo
  alias BandDb.Calendar.{ServiceAccount, ServiceAccountManager}
  
  @shortdoc "Manage Google service accounts"
  
  def run(["list"]) do
    start_app()
    
    accounts = ServiceAccountManager.list_service_accounts()
    
    if Enum.empty?(accounts) do
      Mix.shell().info("No service accounts found.")
    else
      Mix.shell().info("Service Accounts:")
      Mix.shell().info("================")
      
      Enum.each(accounts, fn account ->
        status = if account.active, do: "ACTIVE", else: "inactive"
        has_creds = if account.credentials, do: "Yes", else: "No"
        Mix.shell().info("- #{account.name} (#{status}) - Has credentials: #{has_creds}")
      end)
    end
  end
  
  def run(["activate", name]) do
    start_app()
    
    case Repo.get_by(ServiceAccount, name: name) do
      nil ->
        Mix.shell().error("Service account '#{name}' not found.")
        
      account ->
        case ServiceAccountManager.activate_service_account(account) do
          {:ok, _} ->
            Mix.shell().info("Successfully activated service account '#{name}'.")
            
            # Restart the Goth process
            case Registry.lookup(Goth.Registry, BandDb.Goth) do
              [{pid, _}] -> GenServer.stop(pid)
              _ -> :ok
            end
            ServiceAccountManager.start_link([])
            
            Mix.shell().info("Goth process restarted with new credentials.")
            
          {:error, reason} ->
            Mix.shell().error("Failed to activate service account: #{inspect(reason)}")
        end
    end
  end
  
  def run(["activate_first"]) do
    start_app()
    
    case ServiceAccountManager.list_service_accounts() do
      [] ->
        Mix.shell().error("No service accounts found.")
        
      [first | _] ->
        Mix.shell().info("Activating first service account: #{first.name}")
        run(["activate", first.name])
    end
  end
  
  def run(["delete", name]) do
    start_app()
    
    case Repo.get_by(ServiceAccount, name: name) do
      nil ->
        Mix.shell().error("Service account '#{name}' not found.")
        
      account ->
        case ServiceAccountManager.delete_service_account(account) do
          {:ok, _} ->
            Mix.shell().info("Successfully deleted service account '#{name}'.")
            
          {:error, reason} ->
            Mix.shell().error("Failed to delete service account: #{inspect(reason)}")
        end
    end
  end
  
  def run(_) do
    Mix.shell().info(@moduledoc)
  end
  
  defp start_app do
    Mix.Task.run("app.start")
  end
end