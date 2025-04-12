defmodule BandDb.SetLists.SetListPersistence do
  @moduledoc """
  Handles persistence of set lists to disk.
  """
  require Logger
  alias BandDb.SetLists.{SetList, Set}

  @set_lists_file "set_lists.json"

  @doc """
  Loads set lists from disk.
  """
  def load_set_lists do
    case File.read(@set_lists_file) do
      {:ok, content} ->
        case Jason.decode(content) do
          {:ok, decoded} ->
            set_lists = decoded
            |> Enum.map(fn {name, data} ->
              sets = Enum.map(data["sets"], fn set_data ->
                Set.new(%{
                  name: set_data["name"],
                  songs: Enum.map(set_data["songs"], fn song_data ->
                    %{
                      title: song_data["title"],
                      artist: song_data["artist"],
                      duration: song_data["duration"]
                    }
                  end)
                })
              end)
              {name, SetList.new(%{name: name, sets: sets})}
            end)
            |> Map.new()
            {:ok, set_lists}
          {:error, reason} ->
            Logger.error("Failed to decode set lists: #{inspect(reason)}")
            {:error, :decode_failed}
        end
      {:error, :enoent} ->
        {:ok, %{}}
      {:error, reason} ->
        Logger.error("Failed to read set lists file: #{inspect(reason)}")
        {:error, :read_failed}
    end
  end

  @doc """
  Persists set lists to disk.
  """
  def persist_set_lists(state) do
    encoded = state
    |> Enum.map(fn {name, set_list} ->
      {name, %{
        "name" => set_list.name,
        "sets" => Enum.map(set_list.sets, fn set ->
          %{
            "name" => set.name,
            "songs" => Enum.map(set.songs, fn song ->
              %{
                "title" => song.title,
                "artist" => song.artist,
                "duration" => song.duration
              }
            end)
          }
        end)
      }}
    end)
    |> Map.new()
    |> Jason.encode!()

    case File.write(@set_lists_file, encoded) do
      :ok -> :ok
      {:error, reason} ->
        Logger.error("Failed to write set lists: #{inspect(reason)}")
        {:error, :write_failed}
    end
  end
end
