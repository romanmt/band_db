defmodule BandDb.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application
  require Logger

  @impl true
  def start(_type, _args) do
    # Check if the environment is test and if SKIP_DB is set
    skip_db = System.get_env("SKIP_DB") == "true"

    children = [
      # Start the Telemetry supervisor
      BandDbWeb.Telemetry,
      # Start the DNS cluster
      {DNSCluster, query: Application.get_env(:band_db, :dns_cluster_query) || :ignore},
      # Start the PubSub system
      {Phoenix.PubSub, name: BandDb.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: BandDb.Finch, pools: %{default: [protocols: [:http1]]}},
    ]

    # Only start the Repo if SKIP_DB is not set
    children =
      if skip_db do
        Logger.info("Skipping database initialization for unit tests")
        children
      else
        # Start the Ecto repository
        children ++ [BandDb.Repo]
      end

    # The Song, SetList, and Rehearsal Servers depend on persistence,
    # so we need to handle them differently in unit tests
    server_modules =
      if skip_db do
        # Mock or dummy implementations for servers
        Logger.info("Using mock persistence modules for unit tests")
        [
          # Start a Task.Supervisor for managing async operations
          {Task.Supervisor, name: BandDb.TaskSupervisor},
          # Start the Endpoint (http/https)
          BandDbWeb.Endpoint,
          # Ensure our servers are configured with mocks before starting
          {BandDb.Songs.SongServer, BandDb.Songs.SongServer},
          {BandDb.SetLists.SetListServer, BandDb.SetLists.SetListServer},
          BandDb.Rehearsals.RehearsalServer
        ]
      else
        # Real implementations for servers
        [
          # Start a Task.Supervisor for managing async operations
          {Task.Supervisor, name: BandDb.TaskSupervisor},
          # Start the Endpoint (http/https)
          BandDbWeb.Endpoint,
          # Start the Song Server
          {BandDb.Songs.SongServer, BandDb.Songs.SongServer},
          # Start the Set List Server
          {BandDb.SetLists.SetListServer, BandDb.SetLists.SetListServer},
          # Start the Rehearsal Server
          BandDb.Rehearsals.RehearsalServer
        ]
      end

    # Add the rest of the children
    children = children ++ server_modules

    # Explicitly initialize tzdata
    initialize_tzdata()

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: BandDb.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    BandDbWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  # Initialize tzdata explicitly to ensure it's properly loaded
  defp initialize_tzdata do
    case Application.ensure_all_started(:tzdata) do
      {:ok, _} ->
        # Test that the timezone database is working
        case DateTime.now("America/New_York") do
          {:ok, dt} ->
            Logger.info("Timezone database initialized successfully: #{DateTime.to_string(dt)}")
            :ok
          {:error, reason} ->
            Logger.error("Timezone database initialization error: #{inspect(reason)}")
            # Try to force a reload by stopping and restarting tzdata
            try do
              :ok = Application.stop(:tzdata)
              :ok = Application.ensure_all_started(:tzdata)
              Logger.info("Tzdata restarted successfully")
            rescue
              e ->
                Logger.error("Failed to restart tzdata: #{inspect(e)}")
            end
        end
      {:error, reason} ->
        Logger.error("Failed to start tzdata: #{inspect(reason)}")
    end
  end
end
