defmodule BandDb.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application
  require Logger

  @impl true
  def start(_type, _args) do
    # Check if we're in unit test mode
    unit_test_mode = Application.get_env(:band_db, :unit_test_mode, false)
    skip_db = System.get_env("SKIP_DB") == "true"
    skip_repo = Application.get_env(:band_db, :skip_repo, false)

    # Exit early for unit tests with --no-start flag
    if unit_test_mode && System.get_env("MIX_TEST_NO_START") == "true" do
      Logger.info("Skipping application start for unit tests with --no-start")
      {:ok, self()}
    else
      # Always start these children
      children = [
        # Start the Telemetry supervisor
        BandDbWeb.Telemetry,
        # Start the DNS cluster
        {DNSCluster, query: Application.get_env(:band_db, :dns_cluster_query) || :ignore},
        # Start the PubSub system
        {Phoenix.PubSub, name: BandDb.PubSub},
        # Start the Finch HTTP client for sending emails
        {Finch, name: BandDb.Finch, pools: %{default: [protocols: [:http1]]}},
        # Start a Task.Supervisor for managing async operations
        {Task.Supervisor, name: BandDb.TaskSupervisor},
        # Start the Endpoint (http/https)
        BandDbWeb.Endpoint,
      ]

      # Add database only if not in unit test mode
      children =
        if unit_test_mode || skip_db || skip_repo do
          Logger.info("Starting application in unit test mode, skipping database")
          children
        else
          Logger.info("Starting application with database support")
          # Add the Repo
          children ++ [BandDb.Repo]
        end

      # Explicitly initialize tzdata
      initialize_tzdata()

      # Add Registry and DynamicSupervisor for band servers
      children =
        if Application.get_env(:band_db, :env) == :test do
          # In test mode, we might still want the global servers for simplicity
          children ++ [
            {BandDb.Songs.SongServer, BandDb.Songs.SongServer},
            {BandDb.SetLists.SetListServer, BandDb.SetLists.SetListServer},
            BandDb.Rehearsals.RehearsalServer
          ]
        else
          # Registry for band servers
          band_registry = {Registry, keys: :unique, name: BandDb.BandRegistry}
          # Dynamic supervisor for band servers
          band_supervisor = {DynamicSupervisor, strategy: :one_for_one, name: BandDb.BandSupervisor}

          # Only start the registry and supervisor, not the global servers
          # This way, band-specific servers will only start on user login
          children ++ [band_registry, band_supervisor]
        end

      # See https://hexdocs.pm/elixir/Supervisor.html
      # for other strategies and supported options
      opts = [strategy: :one_for_one, name: BandDb.Supervisor]
      Supervisor.start_link(children, opts)
    end
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
