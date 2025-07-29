defmodule BandDb.Songs.SongPersistence do
  @moduledoc """
  Handles all persistence operations for songs.
  This module is responsible for loading and saving songs to the database.
  """

  alias BandDb.Songs.Song
  import Ecto.Query

  # Get the configured repo module
  defp repo, do: Application.get_env(:band_db, :repo, BandDb.Repo)

  @doc """
  Loads all songs from the database.
  """
  def load_songs do
    songs = repo().all(Song)
    {:ok, songs}
  end

  @doc """
  Loads songs for a specific band from the database.
  """
  def load_songs_by_band_id(band_id) do
    songs = repo().all(from s in Song, where: s.band_id == ^band_id)
    {:ok, songs}
  end

  @doc """
  Persists all songs to the database.
  Returns :ok on success or {:error, reason} on failure.
  """
  def persist_songs(songs) do
    repo().transaction(fn ->
      # Get existing songs indexed by UUID for comparison
      existing_songs = repo().all(Song)
      existing_uuids = MapSet.new(existing_songs, & &1.uuid)

      # Insert or update each song
      Enum.each(songs, fn song ->
        if MapSet.member?(existing_uuids, song.uuid) do
          # Find existing song and update it
          existing = Enum.find(existing_songs, & &1.uuid == song.uuid)
          Song.changeset(existing, Map.from_struct(song))
          |> repo().update!()
        else
          # Insert new song
          %Song{}
          |> Song.changeset(Map.from_struct(song))
          |> repo().insert!()
        end
      end)

      # Delete songs that no longer exist in memory
      current_uuids = MapSet.new(songs, & &1.uuid)
      songs_to_delete = Enum.filter(existing_songs, fn song ->
        not MapSet.member?(current_uuids, song.uuid)
      end)

      Enum.each(songs_to_delete, &repo().delete!/1)
    end)
  end

  @doc """
  Loads column preferences from the database.
  """
  def load_column_preferences do
    # For now, we'll store preferences in a simple key-value table
    # In a real app, you might create a separate preferences table
    {:ok, %{}}
  end

  @doc """
  Persists column preferences to the database.
  """
  def persist_column_preferences(_preferences) do
    # For now, we'll skip database persistence
    # In a real app, you would save to a preferences table
    :ok
  end
end
