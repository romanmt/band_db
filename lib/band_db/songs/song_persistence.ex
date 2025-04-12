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
      # Delete all existing songs
      Repo.delete_all(Song)

      # Insert all songs
      Enum.each(songs, fn song ->
        %Song{}
        |> Song.changeset(Map.from_struct(song))
        |> Repo.insert!()
      end)
    end)
  end
end
