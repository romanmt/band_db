defmodule Mix.Tasks.CleanupServiceAccounts do
  use Mix.Task
  
  alias BandDb.Repo
  alias BandDb.Calendar.ServiceAccount
  
  @shortdoc "Removes service accounts without credentials"
  
  @moduledoc """
  Removes service accounts that don't have credentials configured.
  
  Usage:
    mix cleanup_service_accounts [--all]
    
  Options:
    --all  Remove all service accounts (including those with credentials)
  """
  
  def run(args) do
    Mix.Task.run("app.start")
    
    remove_all = "--all" in args
    
    service_accounts = if remove_all do
      Repo.all(ServiceAccount)
    else
      import Ecto.Query
      Repo.all(from sa in ServiceAccount, where: is_nil(sa.credentials))
    end
    
    if length(service_accounts) == 0 do
      Mix.shell().info("No service accounts to remove")
    else
      Mix.shell().info("Found #{length(service_accounts)} service account(s) to remove:")
      
      Enum.each(service_accounts, fn sa ->
        Mix.shell().info("  - #{sa.name} (ID: #{sa.id}, Active: #{sa.active})")
      end)
      
      if Mix.shell().yes?("\nDo you want to remove these service accounts?") do
        Enum.each(service_accounts, fn sa ->
          Repo.delete!(sa)
          Mix.shell().info("Deleted: #{sa.name}")
        end)
        
        Mix.shell().info("\nCleanup complete! You can now configure a new service account.")
      else
        Mix.shell().info("Cleanup cancelled")
      end
    end
  end
end