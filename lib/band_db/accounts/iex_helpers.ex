defmodule BandDb.Accounts.IExHelpers do
  @moduledoc """
  Helper functions for managing users in IEx.
  """

  alias BandDb.Accounts
  alias BandDb.Accounts.User

  @doc """
  Lists all users in the database.
  """
  def list_users do
    BandDb.Repo.all(User)
  end

  @doc """
  Gets a user by email.
  """
  def get_user(email) when is_binary(email) do
    Accounts.get_user_by_email(email)
  end

  @doc """
  Deletes a user by email.
  """
  def delete_user(email) when is_binary(email) do
    case get_user(email) do
      nil -> {:error, "User not found"}
      user -> Accounts.delete_user(user)
    end
  end

  @doc """
  Deletes all users except the one with the specified email.
  """
  def delete_all_users_except(email) when is_binary(email) do
    users = list_users()
    |> Enum.reject(fn user -> user.email == email end)

    results = Enum.map(users, fn user ->
      case Accounts.delete_user(user) do
        {:ok, _} -> {:ok, user.email}
        {:error, _} -> {:error, user.email}
      end
    end)

    {:ok, results}
  end

  @doc """
  Generates an invitation link for a new user.

  ## Examples

      iex> generate_invite_link()
      "http://localhost:4000/users/register/abc123..."

  """
  def generate_invite_link(base_url \\ "http://localhost:4000") do
    {_token, url, _expires_at} = Accounts.generate_invitation_link(base_url)
    url
  end
end
