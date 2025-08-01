defmodule BandDb.Repo.Migrations.MigrateCalendarsToBands do
  use Ecto.Migration
  import Ecto.Query
  
  def up do
    # This migration copies calendar_id from google_auths to bands table
    # It assumes one-to-one relationship between users and bands through is_admin flag
    
    execute """
    UPDATE bands
    SET calendar_id = subquery.calendar_id
    FROM (
      SELECT DISTINCT ON (b.id) b.id as band_id, ga.calendar_id
      FROM bands b
      INNER JOIN users u ON u.band_id = b.id AND u.is_admin = true
      INNER JOIN google_auths ga ON ga.user_id = u.id
      WHERE ga.calendar_id IS NOT NULL
      ORDER BY b.id, ga.updated_at DESC
    ) AS subquery
    WHERE bands.id = subquery.band_id
    AND bands.calendar_id IS NULL
    """
    
    # Generate iCal tokens using Elixir instead of PostgreSQL function
    # This avoids PostgreSQL version/extension dependencies
    alias BandDb.Repo
    alias BandDb.Accounts.Band
    
    bands_without_token = Repo.all(from b in Band, where: is_nil(b.ical_token))
    
    Enum.each(bands_without_token, fn band ->
      token = Band.generate_ical_token()
      
      band
      |> Ecto.Changeset.change(ical_token: token)
      |> Repo.update!()
    end)
  end
  
  def down do
    # Clear migrated data
    execute "UPDATE bands SET calendar_id = NULL, ical_token = NULL"
  end
end