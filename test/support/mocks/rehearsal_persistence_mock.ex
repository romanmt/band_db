defmodule BandDb.Rehearsals.RehearsalPersistenceMock do
  @moduledoc """
  Mock implementation of RehearsalPersistence for unit testing.
  This module mimics the behavior of the real persistence layer without touching the database.
  Maintains state between function calls using Agent for testing purposes.
  """
  # Mock implementation without logging
  use Agent

  # Start the agent when the module is loaded
  def start_link do
    Agent.start_link(fn -> %{plans: []} end, name: __MODULE__)
  end

  # Ensure the agent is started before any operations
  defp ensure_started do
    case Process.whereis(__MODULE__) do
      nil ->
        # Start the agent if it's not already running
        {:ok, _} = start_link()
      _pid ->
        :ok
    end
  end

  # Reset all data in the mock - useful for test setup
  def reset do
    ensure_started()
    Agent.update(__MODULE__, fn _ -> %{plans: []} end)
  end

  @doc """
  Mock implementation of load_plans that returns test data without touching the database
  Uses the agent to maintain state between function calls
  """
  def load_plans do
    ensure_started()

    # Check if we're in a test that expects empty data
    if System.get_env("EMPTY_MOCK_DATA") == "true" do
      # Empty data for tests

      # Get current data from the agent
      plans = Agent.get(__MODULE__, fn state -> state.plans end)
      {:ok, plans}
    else
      # Mock data for tests

      # Create a test date in the future for rehearsal plans
      today = Date.utc_today()
      test_date = Date.add(today, 7)

      plans = [
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
      ]

      # Update the agent state
      Agent.update(__MODULE__, fn _ -> %{plans: plans} end)

      {:ok, plans}
    end
  end

  @doc """
  Mock implementation of persist_plans that stores plans in the agent
  """
  def persist_plans(plans) do
    ensure_started()
    # Persist plans mock
    Agent.update(__MODULE__, fn _ -> %{plans: plans} end)
    :ok
  end
end
