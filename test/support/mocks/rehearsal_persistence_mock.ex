defmodule BandDb.Rehearsals.RehearsalPersistenceMock do
  @moduledoc """
  Mock implementation of RehearsalPersistence for unit testing.
  This module mimics the behavior of the real persistence layer without touching the database.
  """

  @doc """
  Mock implementation of load_plans that returns an empty list without touching the database
  """
  def load_plans do
    {:ok, []}
  end

  @doc """
  Mock implementation of persist_plans that does nothing and returns :ok
  """
  def persist_plans(_plans) do
    :ok
  end
end
