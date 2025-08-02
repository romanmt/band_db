defmodule BandDb.Songs.SongPersistenceMock do
  @moduledoc """
  Mock implementation of SongPersistence for unit testing.
  This module mimics the behavior of the real persistence layer without touching the database.
  """
  # Mock implementation without logging

  # Mock implementations of SongPersistence functions
  def load_songs do
    # Check if we're in a test that expects empty data
    if System.get_env("EMPTY_MOCK_DATA") == "true" do
      # Empty data for tests
      {:ok, []}
    else
      # Mock data for tests
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
          uuid: "11111111-1111-1111-1111-111111111111",
          band_id: 1
        },
        %BandDb.Songs.Song{
          title: "Test Song 2",
          status: :needs_learning,
          band_name: "Test Band",
          duration: 240,
          notes: "Test notes",
          tuning: :drop_d,
          youtube_link: nil,
          uuid: "22222222-2222-2222-2222-222222222222",
          band_id: 1
        }
      ]}
    end
  end

  def persist_songs(_songs) do
    # Persist songs mock
    :ok
  end

  def load_songs_by_band_id(band_id) do
    # Load songs by band_id mock

    # Get all songs, then filter by band_id
    {:ok, songs} = load_songs()
    filtered_songs = Enum.filter(songs, fn song -> song.band_id == band_id end)

    {:ok, filtered_songs}
  end

  def load_column_preferences do
    # Load column preferences mock
    {:ok, %{}}
  end

  def persist_column_preferences(_preferences) do
    # Persist column preferences mock
    :ok
  end
end
