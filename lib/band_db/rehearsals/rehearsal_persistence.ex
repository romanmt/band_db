defmodule BandDb.Rehearsals.RehearsalPersistence do
  @moduledoc """
  Handles all persistence operations for rehearsal plans.
  This module is responsible for loading and saving rehearsal plans to the database.
  """

  alias BandDb.Rehearsals.RehearsalPlan
  alias BandDb.Songs.Song
  import Ecto.Query

  # Get the configured repo module
  defp repo, do: Application.get_env(:band_db, :repo, BandDb.Repo)

  @doc """
  Loads all rehearsal plans from the database.
  Returns {:ok, plans} or {:error, reason}
  """
  def load_plans do
    # Get all non-deleted songs indexed by UUID
    songs_by_uuid = from(s in Song)
    |> repo().all()
    |> Enum.reduce(%{}, fn song, acc ->
      Map.put(acc, song.uuid, song)
    end)

    # Get all rehearsal plans
    plans = repo().all(RehearsalPlan)
    |> Enum.map(fn plan ->
      # Convert the stored UUIDs back to full song structs, skipping any that don't exist
      rehearsal_songs = Enum.map(plan.rehearsal_songs, fn uuid ->
        Map.get(songs_by_uuid, uuid)
      end) |> Enum.reject(&is_nil/1)

      set_songs = Enum.map(plan.set_songs, fn uuid ->
        Map.get(songs_by_uuid, uuid)
      end) |> Enum.reject(&is_nil/1)

      # If no songs found, keep the original UUIDs
      rehearsal_songs = if Enum.empty?(rehearsal_songs), do: plan.rehearsal_songs, else: rehearsal_songs
      set_songs = if Enum.empty?(set_songs), do: plan.set_songs, else: set_songs

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
    repo().transaction(fn ->
      # Get existing plans indexed by date for comparison
      existing_plans = repo().all(RehearsalPlan)
      existing_dates = MapSet.new(existing_plans, & &1.date)

      # Insert or update each plan
      Enum.each(plans, fn plan ->
        # Get the song UUIDs (handling both string UUIDs and song structs)
        rehearsal_song_uuids = Enum.map(plan.rehearsal_songs, fn song ->
          cond do
            is_binary(song) -> song  # Already a UUID string
            is_map(song) and Map.has_key?(song, :uuid) -> song.uuid
            true -> nil
          end
        end) |> Enum.reject(&is_nil/1)

        set_song_uuids = Enum.map(plan.set_songs, fn song ->
          cond do
            is_binary(song) -> song  # Already a UUID string
            is_map(song) and Map.has_key?(song, :uuid) -> song.uuid
            true -> nil
          end
        end) |> Enum.reject(&is_nil/1)

        # Create a map with all the plan attributes, including calendar info
        plan_attrs = %{
          date: plan.date,
          duration: plan.duration,
          rehearsal_songs: rehearsal_song_uuids,
          set_songs: set_song_uuids,
          scheduled_date: Map.get(plan, :scheduled_date),
          start_time: Map.get(plan, :start_time),
          end_time: Map.get(plan, :end_time),
          location: Map.get(plan, :location),
          calendar_event_id: Map.get(plan, :calendar_event_id)
        }

        if MapSet.member?(existing_dates, plan.date) do
          # Find existing plan and update it
          existing = Enum.find(existing_plans, & &1.date == plan.date)
          RehearsalPlan.changeset(existing, plan_attrs)
          |> repo().update!()
        else
          # Insert new plan
          %RehearsalPlan{}
          |> RehearsalPlan.changeset(plan_attrs)
          |> repo().insert!()
        end
      end)

      # Delete plans that no longer exist in memory
      current_dates = MapSet.new(plans, & &1.date)
      plans_to_delete = Enum.filter(existing_plans, fn plan ->
        not MapSet.member?(current_dates, plan.date)
      end)

      Enum.each(plans_to_delete, &repo().delete!/1)
    end)
  end
end
