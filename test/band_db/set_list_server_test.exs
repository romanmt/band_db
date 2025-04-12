defmodule BandDb.SetLists.SetListServerTest do
  use ExUnit.Case
  alias BandDb.SetLists.{SetListServer, SetList, SetListPersistence}

  setup do
    # Start the server with a different name for testing
    start_supervised!({SetListServer, name: :test_set_list_server})
    :ok
  end

  describe "business logic" do
    test "add_set_list/3 adds a new set list successfully" do
      assert {:ok, set_list} = SetListServer.add_set_list("Test Set List", [], nil)
      assert set_list.name == "Test Set List"
      assert set_list.sets == []
      assert set_list.total_duration == nil
    end

    test "add_set_list/3 returns error when set list already exists" do
      SetListServer.add_set_list("Test Set List", [], nil)
      assert {:error, :set_list_already_exists} = SetListServer.add_set_list("Test Set List", [], nil)
    end

    test "list_set_lists/0 returns all set lists" do
      SetListServer.add_set_list("Set List 1", [], nil)
      SetListServer.add_set_list("Set List 2", [], nil)

      set_lists = SetListServer.list_set_lists()
      assert length(set_lists) == 2
      assert Enum.any?(set_lists, &(&1.name == "Set List 1"))
      assert Enum.any?(set_lists, &(&1.name == "Set List 2"))
    end

    test "get_set_list/1 returns set list by name" do
      SetListServer.add_set_list("Test Set List", [], nil)
      assert {:ok, set_list} = SetListServer.get_set_list("Test Set List")
      assert set_list.name == "Test Set List"
    end

    test "get_set_list/1 returns error when set list not found" do
      assert {:error, :not_found} = SetListServer.get_set_list("Nonexistent Set List")
    end

    test "update_set_list/2 updates set list successfully" do
      SetListServer.add_set_list("Test Set List", [], nil)
      new_sets = [%{name: "Set 1", songs: [], duration: 3600}]
      assert {:ok, updated_set_list} = SetListServer.update_set_list("Test Set List", %{sets: new_sets})
      assert updated_set_list.sets == new_sets
    end

    test "update_set_list/2 returns error when set list not found" do
      assert {:error, :not_found} = SetListServer.update_set_list("Nonexistent Set List", %{sets: []})
    end

    test "delete_set_list/1 removes set list successfully" do
      SetListServer.add_set_list("Test Set List", [], nil)
      assert :ok = SetListServer.delete_set_list("Test Set List")
      assert {:error, :not_found} = SetListServer.get_set_list("Test Set List")
    end

    test "delete_set_list/1 returns error when set list not found" do
      assert {:error, :not_found} = SetListServer.delete_set_list("Nonexistent Set List")
    end
  end

  describe "persistence" do
    test "loads initial state from persistence" do
      # Create a test set list in DETS
      set_list = %SetList{
        name: "Test Set List",
        sets: [%{name: "Set 1", songs: [], duration: 3600}],
        total_duration: 3600
      }

      # Insert directly into DETS
      case :dets.open_file(:set_lists_table, type: :set) do
        {:ok, table} ->
          :dets.insert(table, {set_list.name, set_list})
          :dets.close(table)
        {:error, reason} ->
          raise "Failed to open DETS table: #{inspect(reason)}"
      end

      # Start a new server instance
      {:ok, pid} = SetListServer.start_link(name: :test_persistence_server)

      # Verify the set list was loaded
      assert {:ok, loaded_set_list} = SetListServer.get_set_list("Test Set List")
      assert loaded_set_list.name == "Test Set List"
      assert length(loaded_set_list.sets) == 1
      assert loaded_set_list.total_duration == 3600

      # Clean up
      GenServer.stop(pid)
      case :dets.open_file(:set_lists_table, type: :set) do
        {:ok, table} ->
          :dets.delete_all_objects(table)
          :dets.close(table)
        {:error, reason} ->
          raise "Failed to open DETS table: #{inspect(reason)}"
      end
    end
  end
end
