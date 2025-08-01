defmodule BandDb.Calendar.ServiceAccountManager do
  @moduledoc """
  Manages Google Service Account authentication using Goth.
  Provides token generation and caching for Google API access.
  """
  
  alias BandDb.Repo
  alias BandDb.Calendar.ServiceAccount
  
  @goth_name BandDb.Goth
  @token_scope "https://www.googleapis.com/auth/calendar"
  
  @doc """
  Child specification for the supervisor.
  """
  def child_spec(opts) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [opts]},
      type: :worker,
      restart: :permanent,
      shutdown: 500
    }
  end
  
  @doc """
  Starts the Goth server with service account credentials.
  This should be called during application startup.
  """
  def start_link(_opts \\ []) do
    case get_active_service_account() do
      {:ok, service_account} ->
        # The credentials are already decrypted when loaded from the database
        # through the Cloak.Ecto.Binary type, so they come as a JSON string
        credentials = Jason.decode!(service_account.credentials)
        
        config = [
          name: @goth_name,
          source: {:service_account, credentials, scopes: [@token_scope]}
        ]
        
        Goth.start_link(config)
        
      {:error, :no_active_service_account} ->
        # Start a dummy GenServer that does nothing
        # This prevents the supervisor from crashing when no service account is configured
        Agent.start_link(fn -> nil end, name: __MODULE__)
    end
  end
  
  @doc """
  Checks if a service account is configured and active in the database.
  """
  def service_account_configured? do
    # Check if there's an active service account in the database
    case get_active_service_account() do
      {:ok, _service_account} -> 
        # Also verify that the Goth process is running
        case Registry.lookup(Goth.Registry, @goth_name) do
          [] -> 
            # Try to restart the Goth process if it's not running
            start_link()
            # Check again after attempted restart
            case Registry.lookup(Goth.Registry, @goth_name) do
              [] -> false
              _ -> true
            end
          _ -> true
        end
      {:error, :no_active_service_account} -> 
        false
    end
  end
  
  @doc """
  Gets a fresh access token for Google Calendar API.
  Returns {:ok, token} or {:error, reason}
  """
  def get_access_token do
    if service_account_configured?() do
      case Goth.fetch(@goth_name) do
        {:ok, %{token: token}} -> {:ok, token}
        {:error, reason} -> {:error, reason}
      end
    else
      {:error, :service_account_not_configured}
    end
  rescue
    # Handle case where Goth process doesn't exist
    ArgumentError -> {:error, :service_account_not_configured}
  end
  
  @doc """
  Gets the active service account from the database.
  Returns {:ok, service_account} or {:error, reason}
  """
  def get_active_service_account do
    case Repo.get_by(ServiceAccount, active: true) do
      nil -> {:error, :no_active_service_account}
      service_account -> {:ok, service_account}
    end
  end
  
  @doc """
  Creates a new service account record in the database.
  """
  def create_service_account(attrs) do
    %ServiceAccount{}
    |> ServiceAccount.changeset(attrs)
    |> Repo.insert()
  end
  
  @doc """
  Updates an existing service account.
  """
  def update_service_account(%ServiceAccount{} = service_account, attrs) do
    service_account
    |> ServiceAccount.changeset(attrs)
    |> Repo.update()
  end
  
  @doc """
  Deactivates all service accounts and activates the specified one.
  """
  def activate_service_account(%ServiceAccount{} = service_account) do
    Repo.transaction(fn ->
      # Deactivate all service accounts
      Repo.update_all(ServiceAccount, set: [active: false])
      
      # Activate the specified one
      service_account
      |> ServiceAccount.changeset(%{active: true})
      |> Repo.update!()
    end)
  end
  
  @doc """
  Lists all service accounts.
  """
  def list_service_accounts do
    Repo.all(ServiceAccount)
  end
  
  @doc """
  Deletes a service account.
  """
  def delete_service_account(%ServiceAccount{} = service_account) do
    Repo.delete(service_account)
  end
  
  @doc """
  Validates service account credentials by attempting to get a token.
  """
  def validate_credentials(credentials_json) do
    # Parse the JSON to ensure it's valid
    case Jason.decode(credentials_json) do
      {:ok, _parsed} ->
        # Try to get a token with these credentials
        config = %{
          source: {:service_account, credentials_json, scopes: [@token_scope]}
        }
        
        # Start a temporary Goth process to test the credentials
        case Goth.start_link(source: config) do
          {:ok, pid} ->
            # Try to fetch a token
            result = case Goth.fetch(pid) do
              {:ok, %{token: _token}} -> :ok
              {:error, reason} -> {:error, reason}
            end
            
            # Stop the temporary process
            GenServer.stop(pid)
            result
            
          {:error, reason} ->
            {:error, reason}
        end
        
      {:error, _} ->
        {:error, :invalid_json}
    end
  end
end