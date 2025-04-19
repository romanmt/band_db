defmodule BandDb.SetLists.SetListPersistenceMock do
  @moduledoc """
  Mock implementation of SetListPersistence for unit testing.
  This module mimics the behavior of the real persistence layer without touching the database.
  """

  @doc """
  Mock implementation of load_set_lists that returns an empty map without touching the database
  """
  def load_set_lists do
    {:ok, %{}}
  end

  @doc """
  Mock implementation of persist_set_lists that does nothing and returns :ok
  """
  def persist_set_lists(_set_lists) do
    :ok
  end
end
