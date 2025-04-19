defmodule BandDb.Rehearsals.RehearsalServerTest do
  use BandDb.UnitCase, async: true
  alias BandDb.Rehearsals.RehearsalServer
  alias BandDb.Songs.Song

  setup do
    # Each test should use a unique server name to avoid conflicts
    server_name = :"test_rehearsal_server_#{System.unique_integer([:positive])}"

    # Start the server with the unique name
    start_supervised!({RehearsalServer, server_name})

    # Return the server name to the test
    {:ok, server: server_name}
  end

  # Generate unique dates for tests to avoid conflicts
  defp unique_date(base_date \\ ~D[2025-01-01]) do
    days_to_add = System.unique_integer([:positive]) |> rem(365)
    Date.add(base_date, days_to_add)
  end

  describe "business logic" do
    test "save_plan/4 adds a new plan successfully", %{server: server} do
      # Generate unique UUIDs for the songs
      uuid1 = Ecto.UUID.generate()
      uuid2 = Ecto.UUID.generate()

      date = unique_date()
      rehearsal_songs = [%Song{title: "Song 1", uuid: uuid1}]
      set_songs = [%Song{title: "Song 2", uuid: uuid2}]
      duration = 3600

      assert {:ok, plan} = RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration, server)
      assert plan.date == date
      assert plan.rehearsal_songs == [uuid1] # Note: server stores UUIDs, not full song objects
      assert plan.set_songs == [uuid2]       # Note: server stores UUIDs, not full song objects
      assert plan.duration == duration
    end

    test "save_plan/4 returns error when plan already exists", %{server: server} do
      date = unique_date()
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration, server)
      assert {:error, :plan_already_exists} = RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration, server)
    end

    test "list_plans/0 returns all plans", %{server: server} do
      date1 = unique_date()
      date2 = unique_date()
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date1, rehearsal_songs, set_songs, duration, server)
      RehearsalServer.save_plan(date2, rehearsal_songs, set_songs, duration, server)

      plans = RehearsalServer.list_plans(server)
      assert length(plans) == 2
      assert Enum.any?(plans, &(&1.date == date1))
      assert Enum.any?(plans, &(&1.date == date2))
    end

    test "get_plan/1 returns plan by date", %{server: server} do
      date = unique_date()
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration, server)
      assert {:ok, plan} = RehearsalServer.get_plan(date, server)
      assert plan.date == date
    end

    test "get_plan/1 returns error when plan not found", %{server: server} do
      # Use a date we know doesn't exist
      date = ~D[2099-12-31]
      assert {:error, :not_found} = RehearsalServer.get_plan(date, server)
    end

    test "update_plan/2 updates plan successfully", %{server: server} do
      date = unique_date()
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration, server)
      new_duration = 7200
      assert {:ok, updated_plan} = RehearsalServer.update_plan(date, %{duration: new_duration}, server)
      assert updated_plan.duration == new_duration
    end

    test "update_plan/2 returns error when plan not found", %{server: server} do
      # Use a date we know doesn't exist
      date = ~D[2099-12-31]
      assert {:error, :not_found} = RehearsalServer.update_plan(date, %{duration: 3600}, server)
    end

    test "delete_plan/1 removes plan successfully", %{server: server} do
      date = unique_date()
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration, server)
      assert :ok = RehearsalServer.delete_plan(date, server)
      assert {:error, :not_found} = RehearsalServer.get_plan(date, server)
    end

    test "delete_plan/1 returns error when plan not found", %{server: server} do
      # Use a date we know doesn't exist
      date = ~D[2099-12-31]
      assert {:error, :not_found} = RehearsalServer.delete_plan(date, server)
    end
  end

  # Now we can safely test persistence aspects using mocks
  describe "persistence" do
    test "persistence module is properly configured" do
      assert RehearsalServer.start_link(:test_persistence_server) != {:error, :already_started}
      assert :sys.get_state(:test_persistence_server).plans == []
      GenServer.stop(:test_persistence_server)
    end
  end
end
