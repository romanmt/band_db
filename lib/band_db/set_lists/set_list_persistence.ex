defmodule BandDb.SetLists.SetListPersistence do
  @moduledoc """
  Handles all persistence operations for set lists using DETS.
  This module is responsible for loading and saving set lists to DETS.
  """

  require Logger
  alias BandDb.SetLists.SetList

  @table_name :set_lists_table
  @backup_interval :timer.minutes(1)

  @doc """
  Loads all set lists from DETS.
  Returns {:ok, set_lists} or {:error, reason}
  """
  def load_set_lists do
    case :dets.open_file(@table_name, type: :set) do
      {:ok, table} ->
        set_lists = :dets.match_object(table, {:"$1", :"$2"})
        |> Enum.map(fn {_key, set_list} -> set_list end)
        :dets.close(table)
        {:ok, set_lists}
      {:error, reason} ->
        Logger.error("Failed to open DETS table: #{inspect(reason)}")
        {:ok, []}
    end
  end

  @doc """
  Persists all set lists to DETS.
  Returns :ok on success or {:error, reason} on failure.
  """
  def persist_set_lists(set_lists) do
    case :dets.open_file(@table_name, type: :set) do
      {:ok, table} ->
        # Delete all existing entries
        :dets.delete_all_objects(table)

        # Insert all set lists
        Enum.each(set_lists, fn set_list ->
          :dets.insert(table, {set_list.name, set_list})
        end)

        :dets.close(table)
        :ok
      {:error, reason} ->
        Logger.error("Failed to open DETS table: #{inspect(reason)}")
        {:error, reason}
    end
  end

  @doc """
  Schedules the next backup.
  """
  def schedule_backup(pid) do
    Process.send_after(pid, :backup, @backup_interval)
  end
end
