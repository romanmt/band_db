defmodule BandDb.MixProject do
  use Mix.Project

  def project do
    [
      app: :band_db,
      version: "0.1.0",
      elixir: "~> 1.14",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      preferred_cli_env: [
        "test.unit": :test,
        "test.all": :test,
        "test.e2e": :test
      ]
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {BandDb.Application, []},
      extra_applications: extra_applications(Mix.env())
    ]
  end

  defp extra_applications(:dev), do: [:logger, :observer, :wx, :runtime_tools, :tzdata]
  defp extra_applications(_), do: [:logger, :runtime_tools, :tzdata]

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:bcrypt_elixir, "~> 3.0"},
      {:phoenix, "~> 1.7.20"},
      {:phoenix_html, "~> 4.1"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix_live_view, "~> 1.0.0"},
      {:phoenix_ecto, "~> 4.0"},
      {:floki, ">= 0.30.0", only: :test},
      {:wallaby, "~> 0.30", only: :test},
      {:phoenix_live_dashboard, "~> 0.8.3"},
      {:esbuild, "~> 0.8", runtime: Mix.env() == :dev},
      {:tailwind, "~> 0.2", runtime: Mix.env() == :dev},
      {:heroicons,
       github: "tailwindlabs/heroicons",
       tag: "v2.1.1",
       sparse: "optimized",
       app: false,
       compile: false,
       depth: 1},
      {:swoosh, "~> 1.5"},
      {:finch, "~> 0.13"},
      {:telemetry_metrics, "~> 1.0"},
      {:telemetry_poller, "~> 1.0"},
      {:gettext, "~> 0.26"},
      {:jason, "~> 1.2"},
      {:dns_cluster, "~> 0.1.1"},
      {:bandit, "~> 1.5"},
      {:ecto_sql, "~> 3.10"},
      {:postgrex, ">= 0.0.0"},
      {:httpoison, "~> 2.0"},
      {:tzdata, "~> 1.1"},
      {:google_api_calendar, "~> 0.16.0"},
      {:goth, "~> 1.4.0"},
      {:plug_cowboy, "~> 2.5"},
      {:inflex, "~> 2.0"},
      {:cloak_ecto, "~> 1.3"},
      # Override conflicting dependencies
      {:mime, "~> 2.0", override: true},
      {:mimerl, "~> 1.4", override: true},
      {:certifi, "~> 2.15.0", override: true},
      {:plug, "~> 1.18", override: true}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      setup: ["deps.get", "ecto.setup", "assets.setup", "assets.build"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"],
      "test.unit": ["test --exclude db"],
      "test.all": ["test --include db"],
      "test.e2e": ["test --only e2e"],
      "assets.setup": ["tailwind.install --if-missing", "esbuild.install --if-missing", "cmd --cd assets npm install"],
      "assets.build": ["tailwind band_db", "esbuild band_db"],
      "assets.deploy": [
        "tailwind band_db",
        "esbuild band_db --minify",
        "phx.digest"
      ]
    ]
  end
end
