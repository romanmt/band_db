defmodule Mix.Tasks.GenerateResetLink do
  @moduledoc """
  Generates a password reset link for a user.

  Usage:
    mix generate_reset_link user@email.com
    mix generate_reset_link --user-id 123
  """
  use Mix.Task

  alias BandDb.Accounts
  alias BandDb.Accounts.UserToken
  alias BandDb.Repo

  @shortdoc "Generate password reset link for a user"

  def run([email]) when is_binary(email) do
    Mix.Task.run("app.start")

    case Accounts.get_user_by_email(email) do
      nil ->
        Mix.shell().error("❌ User not found with email: #{email}")

      user ->
        generate_and_display_link(user)
    end
  end

  def run(["--user-id", user_id]) do
    Mix.Task.run("app.start")

    case Repo.get(Accounts.User, user_id) do
      nil ->
        Mix.shell().error("❌ User not found with ID: #{user_id}")

      user ->
        generate_and_display_link(user)
    end
  end

  def run(_) do
    Mix.shell().info("""
    Usage:
      mix generate_reset_link user@email.com
      mix generate_reset_link --user-id 123
    """)
  end

  defp generate_and_display_link(user) do
    # Generate the token (same way the email system does)
    {encoded_token, user_token} = UserToken.build_email_token(user, "reset_password")

    # Save to database
    saved_token = Repo.insert!(user_token)

    # Generate the URL
    reset_url = "https://band-boss.com/users/reset_password/#{encoded_token}"

    Mix.shell().info("""
    ✅ Password Reset Link Generated!

    👤 User: #{user.email}
    🔗 Reset Link: #{reset_url}
    ⏰ Expires: #{format_expiry(saved_token.inserted_at)}

    📋 Copy this link and send it to the user.
    """)
  end

  defp format_expiry(inserted_at) do
    expires_at = DateTime.add(inserted_at, 24 * 60 * 60, :second) # 1 day
    Calendar.strftime(expires_at, "%Y-%m-%d at %H:%M UTC")
  end
end
