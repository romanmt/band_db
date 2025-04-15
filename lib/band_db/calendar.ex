defmodule BandDb.Calendar do
  @moduledoc """
  The Calendar context.
  Handles Google Calendar integration and management.
  """

  import Ecto.Query
  alias BandDb.Repo
  alias BandDb.Calendar.GoogleAuth
  alias BandDb.Calendar.GoogleAPI
  alias BandDb.Accounts.User

  @doc """
  Gets the Google Auth record for a user.
  Returns nil if the user doesn't have Google Calendar connected.
  """
  def get_google_auth(%User{id: user_id}) do
    Repo.get_by(GoogleAuth, user_id: user_id)
  end

  @doc """
  Saves a new Google Auth record for a user.
  """
  def create_google_auth(%User{id: user_id}, attrs) do
    %GoogleAuth{user_id: user_id}
    |> GoogleAuth.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates an existing Google Auth record.
  """
  def update_google_auth(%GoogleAuth{} = auth, attrs) do
    auth
    |> GoogleAuth.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Google Auth record.
  Used when disconnecting a user's Google account.
  """
  def delete_google_auth(%GoogleAuth{} = auth) do
    Repo.delete(auth)
  end

  @doc """
  Gets a fresh access token for a user.
  Handles token refresh if the current token is expired.
  Returns {:ok, access_token} or {:error, reason}
  """
  def get_access_token(%User{} = user) do
    case get_google_auth(user) do
      nil ->
        {:error, :not_connected}

      auth ->
        if is_expired?(auth) do
          refresh_token(auth)
        else
          {:ok, auth.access_token}
        end
    end
  end

  @doc """
  Checks if the given auth record has an expired access token.
  Returns true if the token is expired or will expire in the next 5 minutes.
  """
  def is_expired?(%GoogleAuth{expires_at: expires_at}) do
    now = DateTime.utc_now()
    # Token is expired if it's in the past or will expire in the next 5 minutes
    DateTime.diff(expires_at, now) < 300
  end

  @doc """
  Refreshes an access token using the refresh token.
  Updates the database record and returns the new access token.
  """
  def refresh_token(%GoogleAuth{} = auth) do
    case GoogleAPI.refresh_access_token(auth.refresh_token) do
      {:ok, %{access_token: access_token, expires_in: expires_in}} ->
        # Calculate new expiration time
        expires_at = DateTime.add(DateTime.utc_now(), expires_in, :second)

        # Update the auth record
        case update_google_auth(auth, %{
          access_token: access_token,
          expires_at: expires_at
        }) do
          {:ok, _updated_auth} -> {:ok, access_token}
          {:error, changeset} -> {:error, "Failed to update token: #{inspect(changeset.errors)}"}
        end

      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Creates a new calendar for the band.
  Returns {:ok, calendar_id} or {:error, reason}
  """
  def create_band_calendar(%User{} = user, band_name) do
    case get_access_token(user) do
      {:ok, access_token} ->
        calendar_name = "#{band_name} Rehearsals & Shows"
        description = "Calendar for #{band_name} rehearsals and performances"

        case GoogleAPI.create_calendar(access_token, calendar_name, description) do
          {:ok, calendar_id} ->
            # Update the auth record with the calendar ID
            auth = get_google_auth(user)
            case update_google_auth(auth, %{calendar_id: calendar_id}) do
              {:ok, _updated_auth} -> {:ok, calendar_id}
              {:error, changeset} -> {:error, "Failed to save calendar ID: #{inspect(changeset.errors)}"}
            end

          {:error, reason} -> {:error, reason}
        end

      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Lists all calendars for a user.
  Returns {:ok, calendars} or {:error, reason}
  """
  def list_calendars(%User{} = user) do
    case get_access_token(user) do
      {:ok, access_token} -> GoogleAPI.list_calendars(access_token)
      {:error, reason} -> {:error, reason}
    end
  end
end
