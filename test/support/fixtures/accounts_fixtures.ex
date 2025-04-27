defmodule BandDb.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `BandDb.Accounts` context.
  """
  require Logger

  def unique_user_email, do: "user#{System.unique_integer()}@example.com"
  def valid_user_password, do: "hello world!"

  def band_fixture(attrs \\ %{}) do
    {:ok, band} =
      attrs
      |> Enum.into(%{
        name: "test band #{System.unique_integer([:positive])}"
      })
      |> BandDb.Accounts.create_band()

    band
  end

  def valid_user_attributes(attrs \\ %{}) do
    # Generate a valid invitation token for testing
    {token, expires_at} = BandDb.Accounts.generate_invitation_token()

    # Convert keyword list to map if needed
    attrs = if Keyword.keyword?(attrs), do: Map.new(attrs), else: attrs

    # Create a test band if no band_id is provided
    attrs =
      if Map.has_key?(attrs, :band_id) || Map.has_key?(attrs, "band_id") do
        attrs
      else
        band = band_fixture()
        Map.put(attrs, :band_id, band.id)
      end

    # Create default attribute map and merge with provided attrs
    %{
      email: unique_user_email(),
      password: valid_user_password(),
      invitation_token: token,
      invitation_token_expires_at: expires_at
    }
    |> Map.merge(attrs)
  end

  def user_fixture(attrs \\ %{}) do
    user_attrs = valid_user_attributes(attrs)

    # Log the attributes for debugging
    Logger.debug("Creating user fixture with attributes: #{inspect(user_attrs)}")

    case BandDb.Accounts.register_user(user_attrs) do
      {:ok, user} ->
        user
      {:error, changeset} ->
        # Log the error details
        error_details = Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
          Enum.reduce(opts, msg, fn {key, value}, acc ->
            String.replace(acc, "%{#{key}}", to_string(value))
          end)
        end)

        Logger.error("Failed to create user fixture: #{inspect(error_details)}")
        # Raise an exception with helpful details
        raise "Failed to create user fixture: #{inspect(error_details)}"
    end
  end

  def extract_user_token(fun) do
    {:ok, captured_email} = fun.(&"[TOKEN]#{&1}[TOKEN]")
    [_, token | _] = String.split(captured_email.text_body, "[TOKEN]")
    token
  end
end
