defmodule BandDb.Songs.SongPersistence do
  @moduledoc """
  Handles all persistence operations for songs.
  This module is responsible for loading and saving songs to the database.
  """

  alias BandDb.Songs.Song
  alias BandDb.Repo

  @doc """
  Loads all songs from the database.
  Returns {:ok, songs} or {:error, reason}
  """
  def load_songs do
    case Repo.all(Song) do
      songs when is_list(songs) -> {:ok, songs}
      _ -> {:ok, []}
    end
  end

  @doc """
  Persists all songs to the database.
  Returns :ok on success or {:error, reason} on failure.
  """
  def persist_songs(songs) do
    Repo.transaction(fn ->
      # Get existing songs indexed by UUID for comparison
      existing_songs = Repo.all(Song)
      existing_uuids = MapSet.new(existing_songs, & &1.uuid)

      # Insert or update each song
      Enum.each(songs, fn song ->
        if MapSet.member?(existing_uuids, song.uuid) do
          # Find existing song and update it
          existing = Enum.find(existing_songs, & &1.uuid == song.uuid)
          Song.changeset(existing, Map.from_struct(song))
          |> Repo.update!()
        else
          # Insert new song
          %Song{}
          |> Song.changeset(Map.from_struct(song))
          |> Repo.insert!()
        end
      end)

      # Delete songs that no longer exist in memory
      current_uuids = MapSet.new(songs, & &1.uuid)
      songs_to_delete = Enum.filter(existing_songs, fn song ->
        not MapSet.member?(current_uuids, song.uuid)
      end)

      Enum.each(songs_to_delete, &Repo.delete!/1)
    end)
  end
end
