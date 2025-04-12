# Script to generate an invitation link and create an admin user
alias BandDb.Accounts
alias BandDb.Accounts.User

# Generate invitation link
base_url = BandDbWeb.Endpoint.url()
{token, url, expires_at} = Accounts.generate_invitation_link(base_url)

IO.puts("\nInvitation Link Generated:")
IO.puts("=======================")
IO.puts("URL: #{url}")
IO.puts("Expires at: #{DateTime.to_string(expires_at)}")
IO.puts("Token: #{token}")
IO.puts("\nPlease use this link to register your admin account.")
IO.puts("After registration, run the following command to make the user an admin:")
IO.puts("\nmix run priv/repo/seeds.exs\n")
