defmodule BandDbWeb.GoogleAuthController do
  use BandDbWeb, :controller

  alias BandDb.Calendar
  alias BandDb.Calendar.GoogleAPI

  @doc """
  Redirects to Google OAuth consent page.
  """
  def authenticate(conn, _params) do
    redirect_url = GoogleAPI.authorize_url()
    redirect(conn, external: redirect_url)
  end

  @doc """
  Handles the OAuth callback from Google.
  """
  def callback(conn, %{"code" => code}) do
    # Get the current user
    user = conn.assigns.current_user

    # Exchange the code for tokens
    case GoogleAPI.exchange_code_for_token(code) do
      {:ok, %{access_token: access_token, refresh_token: refresh_token, expires_in: expires_in}} ->
        # Calculate token expiration
        expires_at = DateTime.add(DateTime.utc_now(), expires_in, :second)

        # Save the tokens
        attrs = %{
          access_token: access_token,
          refresh_token: refresh_token,
          expires_at: expires_at
        }

        case Calendar.get_google_auth(user) do
          nil ->
            # Create a new auth record
            case Calendar.create_google_auth(user, attrs) do
              {:ok, _auth} ->
                conn
                |> put_flash(:info, "Google Calendar connected successfully!")
                |> redirect(to: ~p"/calendar")

              {:error, _changeset} ->
                conn
                |> put_flash(:error, "Failed to save Google authorization.")
                |> redirect(to: ~p"/calendar")
            end

          auth ->
            # Update existing auth record
            case Calendar.update_google_auth(auth, attrs) do
              {:ok, _auth} ->
                conn
                |> put_flash(:info, "Google Calendar re-connected successfully!")
                |> redirect(to: ~p"/calendar")

              {:error, _changeset} ->
                conn
                |> put_flash(:error, "Failed to update Google authorization.")
                |> redirect(to: ~p"/calendar")
            end
        end

      {:error, reason} ->
        conn
        |> put_flash(:error, "Failed to connect to Google: #{reason}")
        |> redirect(to: ~p"/calendar")
    end
  end

  @doc """
  Disconnects Google Calendar integration.
  """
  def disconnect(conn, _params) do
    user = conn.assigns.current_user

    case Calendar.get_google_auth(user) do
      nil ->
        conn
        |> put_flash(:info, "No Google Calendar connection found.")
        |> redirect(to: ~p"/calendar")

      auth ->
        case Calendar.delete_google_auth(auth) do
          {:ok, _} ->
            conn
            |> put_flash(:info, "Google Calendar disconnected successfully.")
            |> redirect(to: ~p"/calendar")

          {:error, _changeset} ->
            conn
            |> put_flash(:error, "Failed to disconnect Google Calendar.")
            |> redirect(to: ~p"/calendar")
        end
    end
  end
end
