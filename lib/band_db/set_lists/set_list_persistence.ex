defmodule BandDb.SetLists.SetListPersistence do
  @moduledoc """
  Handles persistence of set lists using Ecto.
  """
  require Logger
  alias BandDb.SetLists.SetList
  alias BandDb.SetLists.Set
  import Ecto.Query

  # Get the configured repo module
  defp repo, do: Application.get_env(:band_db, :repo, BandDb.Repo)

  @doc """
  Loads set lists from the database.
  """
  def load_set_lists do
    try do
      set_lists = repo().all(from sl in SetList,
        preload: [:sets])
      |> Enum.map(fn set_list ->
        {set_list.name, %{
          name: set_list.name,
          sets: Enum.map(set_list.sets, fn set ->
            %{
              name: set.name,
              duration: set.duration,
              break_duration: set.break_duration,
              songs: set.songs,
              set_order: set.set_order
            }
          end) |> Enum.sort_by(& &1.set_order),
          total_duration: set_list.total_duration,
          date: set_list.date,
          location: set_list.location,
          start_time: set_list.start_time,
          end_time: set_list.end_time,
          calendar_event_id: set_list.calendar_event_id
        }}
      end)
      |> Map.new()

      {:ok, set_lists}
    rescue
      e ->
        Logger.error("Failed to load set lists: #{inspect(e)}")
        {:error, :load_failed}
    end
  end

  @doc """
  Persists set lists to the database.

  Ensures set list names are unique by handling duplicates appropriately.
  """
  def persist_set_lists(state) do
    repo().transaction(fn ->
      # Delete all existing set lists and their sets to avoid duplicates
      repo().delete_all(Set)
      repo().delete_all(SetList)

      # Insert all set lists and their sets
      # Keep track of inserted names to avoid duplicates
      Enum.reduce(state, MapSet.new(), fn {name, set_list}, used_names ->
        # Ensure we have a unique name for the database
        unique_name = get_unique_name(name, used_names)

        # Create the set list
        calendar_fields = [
          name: unique_name,
          total_duration: set_list.total_duration,
          date: Map.get(set_list, :date),
          location: Map.get(set_list, :location),
          start_time: Map.get(set_list, :start_time),
          end_time: Map.get(set_list, :end_time),
          calendar_event_id: Map.get(set_list, :calendar_event_id)
        ]

        # Filter out nil values
        calendar_fields = Enum.filter(calendar_fields, fn {_, v} -> v != nil end)

        # Create the set list with error handling for unique constraint
        result = try do
          repo().insert(%SetList{}
            |> SetList.changeset(Map.new(calendar_fields)))
        rescue
          # Handle unique constraint errors
          e in Ecto.ConstraintError ->
            Logger.warning("Constraint error when inserting set list #{unique_name}: #{inspect(e)}")
            # Try again with a new unique name
            new_unique_name = "#{unique_name}_#{System.unique_integer([:positive])}"
            new_calendar_fields = Keyword.put(calendar_fields, :name, new_unique_name)
            repo().insert(%SetList{} |> SetList.changeset(Map.new(new_calendar_fields)))
          e ->
            Logger.error("Unexpected error when inserting set list: #{inspect(e)}")
            {:error, :persist_failed}
        end

        case result do
          {:ok, db_set_list} ->
            # Create all sets for this set list
            Enum.each(set_list.sets, fn set ->
              repo().insert!(%Set{
                set_list_id: db_set_list.id,
                name: set.name,
                songs: set.songs,
                duration: set.duration,
                break_duration: set.break_duration,
                set_order: set.set_order
              })
            end)
            # Track this name as used
            MapSet.put(used_names, unique_name)

          {:error, changeset} ->
            Logger.warning("Invalid set list data: #{inspect(changeset.errors)}")
            used_names
        end
      end)
    end)
    |> case do
      {:ok, _} -> :ok
      {:error, reason} ->
        Logger.error("Failed to persist set lists: #{inspect(reason)}")
        {:error, :persist_failed}
    end
  rescue
    e ->
      Logger.error("Unhandled error in persist_set_lists: #{inspect(e)}")
      {:error, :persist_failed}
  end

  # Helper to generate a unique name if the original already exists
  defp get_unique_name(name, used_names) do
    if MapSet.member?(used_names, name) do
      # Name already used, add a unique suffix
      counter = 1
      new_name = "#{name} (#{counter})"

      # Keep incrementing until we find an unused name
      Stream.iterate(counter, &(&1 + 1))
      |> Enum.reduce_while(new_name, fn i, current_name ->
        if MapSet.member?(used_names, current_name) do
          {:cont, "#{name} (#{i + 1})"}
        else
          {:halt, current_name}
        end
      end)
    else
      # Name not used yet, return as is
      name
    end
  end
end
