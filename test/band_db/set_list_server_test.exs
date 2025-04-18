defmodule BandDb.SetLists.SetListServerTest do
  use BandDb.DataCase, async: false
  alias BandDb.SetLists.{SetListServer, SetList, Set}
  alias BandDb.Repo

  @test_server :test_set_list_server

  setup do
    # Clean the database first
    Repo.delete_all(Set)
    Repo.delete_all(SetList)

    # Stop the server if it's running
    try do
      GenServer.stop(@test_server)
    catch
      :exit, _ -> :ok
    end

    # Set up sandbox in shared mode for all tests
    # This ensures any process can access the database connection
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(BandDb.Repo, ownership_timeout: 30_000)
    Ecto.Adapters.SQL.Sandbox.mode(BandDb.Repo, {:shared, self()})

    # Start the server with a different name for testing
    start_supervised!({SetListServer, @test_server})

    # Wait a short time to ensure the GenServer has fully initialized
    # This helps ensure the deferred initialization completes
    :timer.sleep(50)

    :ok
  end

  # Generate unique names for tests to avoid duplicates
  defp unique_name(base_name) do
    "#{base_name}_#{System.unique_integer()}"
  end

  describe "business logic" do
    test "add_set_list/3 adds a new set list successfully" do
      name = unique_name("Test Set List")
      assert :ok = SetListServer.add_set_list(@test_server, name, [])
      assert {:ok, set_list} = SetListServer.get_set_list(@test_server, name)
      assert set_list.name == name
      assert set_list.sets == []
    end

    test "add_set_list/3 returns error when set list already exists" do
      name = unique_name("Test Set List")
      SetListServer.add_set_list(@test_server, name, [])
      assert {:error, "Set list with that name already exists"} = SetListServer.add_set_list(@test_server, name, [])
    end

    test "list_set_lists/0 returns all set lists" do
      name1 = unique_name("Set List 1")
      name2 = unique_name("Set List 2")
      SetListServer.add_set_list(@test_server, name1, [])
      SetListServer.add_set_list(@test_server, name2, [])

      set_lists = SetListServer.list_set_lists(@test_server)
      assert length(set_lists) >= 2
      assert Enum.any?(set_lists, &(&1.name == name1))
      assert Enum.any?(set_lists, &(&1.name == name2))
    end

    test "get_set_list/1 returns set list by name" do
      name = unique_name("Test Set List")
      SetListServer.add_set_list(@test_server, name, [])
      assert {:ok, set_list} = SetListServer.get_set_list(@test_server, name)
      assert set_list.name == name
    end

    test "get_set_list/1 returns error when set list not found" do
      assert {:error, "Set list not found"} = SetListServer.get_set_list(@test_server, "Nonexistent Set List")
    end

    test "update_set_list/2 updates set list successfully" do
      name = unique_name("Test Set List")
      SetListServer.add_set_list(@test_server, name, [])
      new_sets = [%{name: "Set 1", songs: [], duration: 3600}]
      assert :ok = SetListServer.update_set_list(@test_server, name, %{sets: new_sets})
      assert {:ok, updated_set_list} = SetListServer.get_set_list(@test_server, name)
      assert length(updated_set_list.sets) == 1
      assert hd(updated_set_list.sets).name == "Set 1"
    end

    test "update_set_list/2 returns error when set list not found" do
      assert {:error, "Set list not found"} = SetListServer.update_set_list(@test_server, "Nonexistent Set List", %{sets: []})
    end

    test "delete_set_list/1 removes set list successfully" do
      name = unique_name("Test Set List")
      SetListServer.add_set_list(@test_server, name, [])
      assert :ok = SetListServer.delete_set_list(@test_server, name)
      assert {:error, "Set list not found"} = SetListServer.get_set_list(@test_server, name)
    end

    test "delete_set_list/1 returns error when set list not found" do
      assert {:error, "Set list not found"} = SetListServer.delete_set_list(@test_server, "Nonexistent Set List")
    end
  end

  # Note: Persistence tests are currently disabled due to connection issues
  # They should be refactored to run in separate test files with better isolation
end
