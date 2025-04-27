ExUnit.start(exclude: [:db])
# Only set up sandbox mode when not skipping DB
if System.get_env("SKIP_DB") != "true" do
  Ecto.Adapters.SQL.Sandbox.mode(BandDb.Repo, :manual)
end

# Check if we're in a test that needs empty mock data
if System.get_env("EMPTY_MOCK_DATA") != "true" do
  # Set it by default for all tests
  System.put_env("EMPTY_MOCK_DATA", "true")
end

# Determine if we're in unit test mode (skipping DB)
is_unit_test = System.get_env("SKIP_DB") == "true"

# Force these settings with explicit put_env calls, which will take precedence
if is_unit_test do
  # Configure mocks for unit tests and set a flag to indicate unit test mode
  Application.put_env(:band_db, :unit_test_mode, true)
  Application.put_env(:band_db, :song_persistence, BandDb.Songs.SongPersistenceMock)
  Application.put_env(:band_db, :set_list_persistence, BandDb.SetLists.SetListPersistenceMock)
  Application.put_env(:band_db, :rehearsal_persistence, BandDb.Rehearsals.RehearsalPersistenceMock)

  # Use the mock repo to avoid actual database connections
  Application.put_env(:band_db, :repo, BandDb.RepoMock)
else
  # Normal configuration for integration tests
  Application.put_env(:band_db, :unit_test_mode, false)
  Application.put_env(:band_db, :song_persistence, BandDb.Songs.SongPersistenceMock)
  Application.put_env(:band_db, :set_list_persistence, BandDb.SetLists.SetListPersistenceMock)
  Application.put_env(:band_db, :rehearsal_persistence, BandDb.Rehearsals.RehearsalPersistenceMock)

  # Use the real repo for integration tests
  Application.put_env(:band_db, :repo, BandDb.Repo)
end

# Start the registry and supervisor for band servers to fix LiveView tests
# This is required for all tests that use UserAuth.on_mount
{:ok, _} = Registry.start_link(keys: :unique, name: BandDb.BandRegistry)
{:ok, _} = DynamicSupervisor.start_link(strategy: :one_for_one, name: BandDb.BandSupervisor)
