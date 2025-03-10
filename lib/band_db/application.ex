defmodule BandDb.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      BandDbWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:band_db, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: BandDb.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: BandDb.Finch},
      # Start our song server
      BandDb.SongServer,
      # Start to serve requests, typically the last entry
      BandDbWeb.Endpoint
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
