defmodule BandDb.SetLists.SetListPersistence do
  @moduledoc """
  Handles persistence of set lists using Ecto.
  """
  require Logger
  alias BandDb.{Repo, SetLists.SetList, SetLists.Set}
  import Ecto.Query

  @doc """
  Loads set lists from the database.
  """
  def load_set_lists do
    try do
      set_lists = Repo.all(from sl in SetList,
        preload: [:sets])
      |> Enum.map(fn set_list ->
        {set_list.name, set_list}
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
  """
  def persist_set_lists(state) do
    Repo.transaction(fn ->
      # Delete all existing set lists and their sets
      Repo.delete_all(Set)
      Repo.delete_all(SetList)

      # Insert all set lists and their sets
      Enum.each(state, fn {_name, set_list} ->
        # Create the set list
        {:ok, db_set_list} = Repo.insert(%SetList{
          name: set_list.name,
          total_duration: set_list.total_duration
        })

        # Create all sets for this set list
        Enum.each(set_list.sets, fn set ->
          Repo.insert!(%Set{
            set_list_id: db_set_list.id,
            name: set.name,
            songs: set.songs,
            duration: set.duration,
            break_duration: set.break_duration,
            set_order: set.set_order
          })
        end)
      end)
    end)
    |> case do
      {:ok, _} -> :ok
      {:error, reason} ->
        Logger.error("Failed to persist set lists: #{inspect(reason)}")
        {:error, :persist_failed}
    end
  end
end
