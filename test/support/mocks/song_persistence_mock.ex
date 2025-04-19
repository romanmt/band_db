defmodule BandDb.Songs.SongPersistenceMock do
  @moduledoc """
  Mock implementation of SongPersistence for unit testing.
  This module mimics the behavior of the real persistence layer without touching the database.
  """

  # Mock implementations of SongPersistence functions
  def load_songs do
    {:ok, []}
  end

  def persist_songs(_songs) do
    :ok
  end
end
