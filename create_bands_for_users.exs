# A simple script to create bands for existing users without a band
# Usage in production: elixir --erl "-name create_bands@127.0.0.1" -S mix run create_bands_for_users.exs

# Start the application to access Repo
Mix.Task.run("app.start")

require Logger
alias BandDb.Repo
alias BandDb.Accounts.{User, Band}
import Ecto.Query

# Find all users without a band
users_without_band = User
|> where([u], is_nil(u.band_id))
|> Repo.all()

Logger.info("Found #{length(users_without_band)} users without a band")

# Process each user
Enum.each(users_without_band, fn user ->
  # Generate a band name based on user's email
  # Extract part before @ and capitalize first letter
  email_prefix = user.email
  |> String.split("@")
  |> List.first()
  |> String.split(".")
  |> Enum.map(&String.capitalize/1)
  |> Enum.join(" ")

  band_name = "#{email_prefix}'s Band"

  Logger.info("Processing user: #{user.email}, creating band: #{band_name}")

  # Create band in a transaction to ensure atomicity
  {:ok, result} = Repo.transaction(fn ->
    # First check if a band with this name exists
    existing_band = Repo.get_by(Band, name: band_name)

    band = if existing_band do
      # Append a number to make the name unique
      suffix = :rand.uniform(1000)
      new_band_name = "#{band_name} #{suffix}"

      Logger.info("Band name '#{band_name}' already exists, using '#{new_band_name}' instead")

      {:ok, new_band} = %Band{}
      |> Band.changeset(%{name: new_band_name})
      |> Repo.insert()

      new_band
    else
      {:ok, band} = %Band{}
      |> Band.changeset(%{name: band_name})
      |> Repo.insert()

      band
    end

    # Update the user with the band
    {:ok, updated_user} = user
    |> Ecto.Changeset.change(%{band_id: band.id})
    |> Repo.update()

    Logger.info("Successfully associated user #{user.email} with band ID #{band.id}")

    {updated_user, band}
  end)

  {updated_user, band} = result

  Logger.info("Created band '#{band.name}' (ID: #{band.id}) for user #{updated_user.email}")
end)

# Verify the results
users_with_bands = User
|> Repo.all()
|> Repo.preload(:band)

Logger.info("------------- Results -------------")
Enum.each(users_with_bands, fn user ->
  band_name = if user.band, do: user.band.name, else: "NO BAND"
  Logger.info("User #{user.email} -> Band: #{band_name}")
end)

Logger.info("TASK COMPLETE: All users processed.")
