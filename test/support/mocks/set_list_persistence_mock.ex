defmodule BandDb.SetLists.SetListPersistenceMock do
  @moduledoc """
  Mock implementation of SetListPersistence for unit testing.
  This module mimics the behavior of the real persistence layer without touching the database.
  """
  require Logger

  @doc """
  Mock implementation of SetListPersistence.load_set_lists/0 for testing.
  Returns either empty data or mock data based on the environment variable EMPTY_MOCK_DATA.
  """
  def load_set_lists do
    if System.get_env("EMPTY_MOCK_DATA") == "true" do
      Logger.debug("Using SetListPersistenceMock.load_set_lists (empty data)")
      {:ok, %{}}
    else
      Logger.debug("Using SetListPersistenceMock.load_set_lists (mock data)")
      test_set_list_id = "11111111-1111-1111-1111-111111111111"

      {:ok, %{
        test_set_list_id => %{
          id: test_set_list_id,
          name: "Test Set List",
          sets: [
            %{
              id: "22222222-2222-2222-2222-222222222222",
              set_list_id: test_set_list_id,
              set_order: 1,
              songs: [
                %{
                  id: "33333333-3333-3333-3333-333333333333",
                  set_id: "22222222-2222-2222-2222-222222222222",
                  song_id: "44444444-4444-4444-4444-444444444444",
                  title: "Test Song",
                  artist: "Test Artist",
                  key: "C",
                  bpm: 120,
                  duration_ms: 180000,
                  song_order: 1
                }
              ]
            }
          ]
        }
      }}
    end
  end

  @doc """
  Mock implementation of SetListPersistence.persist_set_lists/2 for testing.
  Logs the action and returns :ok without actually persisting anything.
  """
  def persist_set_lists(set_lists, _mode \\ :update) do
    Logger.debug("SetListPersistenceMock.persist_set_lists called with #{map_size(set_lists)} set lists")
    :ok
  end
end
