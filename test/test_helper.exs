ExUnit.start(exclude: [:db])
Ecto.Adapters.SQL.Sandbox.mode(BandDb.Repo, :manual)

# Configure the SongPersistenceMock for tests
Application.put_env(:band_db, :song_persistence, BandDb.Songs.SongPersistenceMock)

# Configure the SetListPersistenceMock for tests
Application.put_env(:band_db, :set_list_persistence, BandDb.SetLists.SetListPersistenceMock)

# Configure the RehearsalPersistenceMock for tests
Application.put_env(:band_db, :rehearsal_persistence, BandDb.Rehearsals.RehearsalPersistenceMock)
