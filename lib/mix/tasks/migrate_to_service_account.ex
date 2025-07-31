defmodule Mix.Tasks.MigrateToServiceAccount do
  use Mix.Task
  
  alias BandDb.Repo
  alias BandDb.Accounts
  alias BandDb.Calendar
  alias BandDb.Calendar.ServiceAccountManager
  
  @shortdoc "Migrates calendar data from OAuth to Service Account"
  
  @moduledoc """
  This task helps migrate existing calendar data from OAuth-based authentication
  to Service Account-based authentication.
  
  Usage:
    mix migrate_to_service_account [--dry-run]
    
  Options:
    --dry-run  Shows what would be migrated without making changes
  """
  
  def run(args) do
    Mix.Task.run("app.start")
    
    dry_run = "--dry-run" in args
    
    if dry_run do
      Mix.shell().info("Running in DRY RUN mode - no changes will be made")
    end
    
    # Check if service account is configured
    unless ServiceAccountManager.service_account_configured?() do
      Mix.shell().error("Service account not configured. Please configure it first via the admin interface.")
      exit(:shutdown)
    end
    
    # Get all bands
    bands = Accounts.list_bands()
    
    Mix.shell().info("Found #{length(bands)} bands to process")
    
    Enum.each(bands, fn band ->
      process_band(band, dry_run)
    end)
    
    Mix.shell().info("Migration complete!")
  end
  
  defp process_band(band, dry_run) do
    Mix.shell().info("\nProcessing band: #{band.name} (ID: #{band.id})")
    
    # Check if band already has a calendar_id
    if band.calendar_id do
      Mix.shell().info("  → Band already has calendar_id: #{band.calendar_id}")
    else
      # Find admin users with Google auth
      admin_auths = 
        band
        |> Repo.preload(:users)
        |> Map.get(:users, [])
        |> Enum.filter(& &1.is_admin)
        |> Enum.map(fn user ->
          auth = Calendar.get_google_auth(user)
          {user, auth}
        end)
        |> Enum.filter(fn {_user, auth} -> auth != nil && auth.calendar_id != nil end)
      
      case admin_auths do
        [] ->
          Mix.shell().info("  → No OAuth calendars found for this band")
          
        [{user, auth} | _] ->
          Mix.shell().info("  → Found OAuth calendar: #{auth.calendar_id} (from user: #{user.email})")
          
          if dry_run do
            Mix.shell().info("  → [DRY RUN] Would migrate calendar_id to band")
            Mix.shell().info("  → [DRY RUN] Would generate iCal token")
          else
            # Generate iCal token if needed
            ical_token = band.ical_token || Accounts.Band.generate_ical_token()
            
            # Update the band
            case Accounts.update_band(band, %{calendar_id: auth.calendar_id, ical_token: ical_token}) do
              {:ok, updated_band} ->
                Mix.shell().info("  ✓ Migrated calendar to band")
                Mix.shell().info("  ✓ iCal token: #{updated_band.ical_token}")
                
                # Share calendar with all band members
                share_with_members(updated_band)
                
              {:error, changeset} ->
                Mix.shell().error("  ✗ Failed to update band: #{inspect(changeset.errors)}")
            end
          end
      end
    end
  end
  
  defp share_with_members(band) do
    Mix.shell().info("  → Sharing calendar with band members...")
    
    band
    |> Repo.preload(:users)
    |> Map.get(:users, [])
    |> Enum.each(fn user ->
      role = if user.is_admin, do: "writer", else: "reader"
      
      case Calendar.GoogleAPI.share_calendar_with_service_account(band.calendar_id, user.email, role) do
        :ok ->
          Mix.shell().info("    ✓ Shared with #{user.email} (#{role})")
        {:error, reason} ->
          Mix.shell().warning("    ✗ Failed to share with #{user.email}: #{reason}")
      end
    end)
  end
end