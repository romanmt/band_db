defmodule BandDb.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      BandDbWeb.Telemetry,
      # Start the DNS cluster
      {DNSCluster, query: Application.get_env(:band_db, :dns_cluster_query) || :ignore},
      # Start the PubSub system
      {Phoenix.PubSub, name: BandDb.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: BandDb.Finch},
      # Start the Ecto repository
      BandDb.Repo,
      # Start the Endpoint (http/https)
      BandDbWeb.Endpoint,
      # Start the Song Server
      BandDb.Songs.SongServer,
      # Start the Set List Server
      BandDb.SetLists.SetListServer,
      # Start the Rehearsal Server
      BandDb.Rehearsals.RehearsalServer
    ]

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
end
