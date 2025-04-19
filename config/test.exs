import Config

# Only in tests, remove the complexity from the password hashing algorithm
config :bcrypt_elixir, :log_rounds, 1

# Set the environment to :test for conditionals in GenServers
config :band_db, :env, :test

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :band_db, BandDbWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "I0NEj6EBCnTnPReU5TgN/4QDr8Y85B7PZdtkRJcnBU321WroNbjkkicdIdjcuKbN",
  server: false

# In test we don't send emails
config :band_db, BandDb.Mailer, adapter: Swoosh.Adapters.Test

# Disable swoosh api client as it is only required for production adapters
config :swoosh, :api_client, false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

# Enable helpful, but potentially expensive runtime checks
config :phoenix_live_view,
  enable_expensive_runtime_checks: true

# Configure your database
config :band_db, BandDb.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "band_db_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10
