defmodule BandDb.Songs.SongPersistenceMock do
  @moduledoc """
  Mock implementation of SongPersistence for unit testing.
  This module mimics the behavior of the real persistence layer without touching the database.
  """
  require Logger

  # Mock implementations of SongPersistence functions
  def load_songs do
    # Check if we're in a test that expects empty data
    if System.get_env("EMPTY_MOCK_DATA") == "true" do
      Logger.debug("Using SongPersistenceMock.load_songs (empty data)")
      {:ok, []}
    else
      Logger.debug("Using SongPersistenceMock.load_songs (mock data)")
      # Return mock data for testing
      {:ok, [
        %BandDb.Songs.Song{
          title: "Test Song 1",
          status: :ready,
          band_name: "Test Band",
          duration: 180,
          notes: "Test notes",
          tuning: :standard,
          youtube_link: nil,
          uuid: "11111111-1111-1111-1111-111111111111"
        },
        %BandDb.Songs.Song{
          title: "Test Song 2",
          status: :needs_learning,
          band_name: "Test Band",
          duration: 240,
          notes: "Test notes",
          tuning: :drop_d,
          youtube_link: nil,
          uuid: "22222222-2222-2222-2222-222222222222"
        }
      ]}
    end
  end

  def persist_songs(songs) do
    Logger.debug("SongPersistenceMock.persist_songs called with #{length(songs)} songs")
    :ok
  end
end
