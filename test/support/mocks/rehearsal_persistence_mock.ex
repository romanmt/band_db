defmodule BandDb.Rehearsals.RehearsalPersistenceMock do
  @moduledoc """
  Mock implementation of RehearsalPersistence for unit testing.
  This module mimics the behavior of the real persistence layer without touching the database.
  """
  require Logger

  @doc """
  Mock implementation of load_plans that returns test data without touching the database
  """
  def load_plans do
    # Check if we're in a test that expects empty data
    if System.get_env("EMPTY_MOCK_DATA") == "true" do
      Logger.debug("Using RehearsalPersistenceMock.load_plans (empty data)")
      {:ok, []}
    else
      Logger.debug("Using RehearsalPersistenceMock.load_plans (mock data)")

      # Create a test date in the future for rehearsal plans
      today = Date.utc_today()
      test_date = Date.add(today, 7)

      {:ok, [
        %{
          date: test_date,
          rehearsal_songs: ["11111111-1111-1111-1111-111111111111"],
          set_songs: ["22222222-2222-2222-2222-222222222222"],
          duration: 120,
          scheduled_date: test_date,
          start_time: ~T[19:00:00],
          end_time: ~T[21:00:00],
          location: "Test Studio"
        }
      ]}
    end
  end

  @doc """
  Mock implementation of persist_plans that does nothing and returns :ok
  """
  def persist_plans(plans) do
    Logger.debug("RehearsalPersistenceMock.persist_plans called with #{length(plans)} plans")
    :ok
  end
end
