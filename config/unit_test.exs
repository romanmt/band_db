import Config

# Only in tests, remove the complexity from the password hashing algorithm
config :bcrypt_elixir, :log_rounds, 1

# Set the environment to :test for conditionals in GenServers
config :band_db, :env, :test
config :band_db, :unit_test_mode, true

# Configure Repo to be skipped entirely
config :band_db, :skip_repo, true

# Use mock persistence modules
config :band_db, :song_persistence, BandDb.Songs.SongPersistenceMock
config :band_db, :set_list_persistence, BandDb.SetLists.SetListPersistenceMock
config :band_db, :rehearsal_persistence, BandDb.Rehearsals.RehearsalPersistenceMock
config :band_db, :repo, BandDb.RepoMock

# We don't run a server during test
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
