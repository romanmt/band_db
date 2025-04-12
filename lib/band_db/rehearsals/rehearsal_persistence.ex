defmodule BandDb.Rehearsals.RehearsalPersistence do
  @moduledoc """
  Handles all persistence operations for rehearsal plans.
  This module is responsible for loading and saving rehearsal plans to the database.
  """

  alias BandDb.{Rehearsals.RehearsalPlan, Songs.Song, Repo}
  import Ecto.Query

  @doc """
  Loads all rehearsal plans from the database.
  Returns {:ok, plans} or {:error, reason}
  """
  def load_plans do
    # Get all non-deleted songs indexed by UUID
    songs_by_uuid = from(s in Song)
    |> Repo.all()
    |> Enum.reduce(%{}, fn song, acc ->
      Map.put(acc, song.uuid, song)
    end)

    # Get all rehearsal plans
    plans = Repo.all(RehearsalPlan)
    |> Enum.map(fn plan ->
      # Convert the stored UUIDs back to full song structs
      rehearsal_songs = Enum.map(plan.rehearsal_songs, &Map.fetch!(songs_by_uuid, &1))
      set_songs = Enum.map(plan.set_songs, &Map.fetch!(songs_by_uuid, &1))

      %{plan |
        rehearsal_songs: rehearsal_songs,
        set_songs: set_songs
      }
    end)

    {:ok, plans}
  end

  @doc """
  Persists all rehearsal plans to the database.
  Returns :ok on success or {:error, reason} on failure.
  """
  def persist_plans(plans) do
    Repo.transaction(fn ->
      Repo.delete_all(RehearsalPlan)

      Enum.each(plans, fn plan ->
        # Store the song UUIDs
        rehearsal_song_uuids = Enum.map(plan.rehearsal_songs, & &1.uuid)
        set_song_uuids = Enum.map(plan.set_songs, & &1.uuid)

        %RehearsalPlan{}
        |> RehearsalPlan.changeset(%{
          date: plan.date,
          duration: plan.duration,
          rehearsal_songs: rehearsal_song_uuids,
          set_songs: set_song_uuids
        })
        |> Repo.insert!()
      end)
    end)
  end
end
