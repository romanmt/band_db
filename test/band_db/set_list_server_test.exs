defmodule BandDb.SetLists.SetListServerTest do
  use BandDb.UnitCase, async: true
  alias BandDb.SetLists.SetListServer

  setup do
    # Each test should use a unique server name to avoid conflicts
    server_name = :"test_set_list_server_#{System.unique_integer()}"

    # Start the server with the unique name
    start_supervised!({SetListServer, server_name})

    # Return the server name to the test
    {:ok, server: server_name}
  end

  # Generate unique names for tests to avoid duplicates
  defp unique_name(base_name) do
    "#{base_name}_#{System.unique_integer([:positive])}"
  end

  describe "business logic" do
    test "add_set_list/3 adds a new set list successfully", %{server: server} do
      name = unique_name("Test Set List")
      assert :ok = SetListServer.add_set_list(server, name, [])
      assert {:ok, set_list} = SetListServer.get_set_list(server, name)
      assert set_list.name == name
      assert set_list.sets == []
    end

    test "add_set_list/3 returns error when set list already exists", %{server: server} do
      name = unique_name("Test Set List")
      SetListServer.add_set_list(server, name, [])
      assert {:error, "Set list with that name already exists"} = SetListServer.add_set_list(server, name, [])
    end

    test "list_set_lists/0 returns all set lists", %{server: server} do
      name1 = unique_name("Set List A")
      name2 = unique_name("Set List B")
      SetListServer.add_set_list(server, name1, [])
      SetListServer.add_set_list(server, name2, [])

      set_lists = SetListServer.list_set_lists(server)
      assert length(set_lists) == 2
      assert Enum.any?(set_lists, &(&1.name == name1))
      assert Enum.any?(set_lists, &(&1.name == name2))
    end

    test "get_set_list/1 returns set list by name", %{server: server} do
      name = unique_name("Test Set List")
      SetListServer.add_set_list(server, name, [])
      assert {:ok, set_list} = SetListServer.get_set_list(server, name)
      assert set_list.name == name
    end

    test "get_set_list/1 returns error when set list not found", %{server: server} do
      assert {:error, "Set list not found"} = SetListServer.get_set_list(server, "Nonexistent Set List")
    end

    test "update_set_list/2 updates set list successfully", %{server: server} do
      name = unique_name("Test Set List")
      SetListServer.add_set_list(server, name, [])
      new_sets = [%{name: "Set 1", songs: [], duration: 3600}]
      assert :ok = SetListServer.update_set_list(server, name, %{sets: new_sets})
      assert {:ok, updated_set_list} = SetListServer.get_set_list(server, name)
      assert length(updated_set_list.sets) == 1
      assert hd(updated_set_list.sets).name == "Set 1"
    end

    test "update_set_list/2 returns error when set list not found", %{server: server} do
      assert {:error, "Set list not found"} = SetListServer.update_set_list(server, "Nonexistent Set List", %{sets: []})
    end

    test "delete_set_list/1 removes set list successfully", %{server: server} do
      name = unique_name("Test Set List")
      SetListServer.add_set_list(server, name, [])
      assert :ok = SetListServer.delete_set_list(server, name)
      assert {:error, "Set list not found"} = SetListServer.get_set_list(server, name)
    end

    test "delete_set_list/1 returns error when set list not found", %{server: server} do
      assert {:error, "Set list not found"} = SetListServer.delete_set_list(server, "Nonexistent Set List")
    end
  end

  # Now we can safely test persistence aspects using mocks
  describe "persistence" do
    test "persistence module is properly configured" do
      assert SetListServer.start_link(:test_persistence_server) != {:error, :already_started}
      assert :sys.get_state(:test_persistence_server).set_lists == %{}
      GenServer.stop(:test_persistence_server)
    end
  end
end
