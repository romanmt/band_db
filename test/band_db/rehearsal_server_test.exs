defmodule BandDb.Rehearsals.RehearsalServerTest do
  use BandDb.DataCase, async: false
  alias BandDb.Rehearsals.{RehearsalServer, RehearsalPlan}
  alias BandDb.Songs.Song
  alias BandDb.Repo

  @test_server :test_rehearsal_server

  setup do
    # Clean the database first
    Repo.delete_all(RehearsalPlan)

    # Stop the server if it's running
    try do
      GenServer.stop(@test_server)
    catch
      :exit, _ -> :ok
    end

    # Start the server with a different name for testing
    start_supervised!({RehearsalServer, @test_server})
    :ok
  end

  describe "business logic" do
    test "save_plan/4 adds a new plan successfully" do
      # Generate unique UUIDs for the songs
      uuid1 = Ecto.UUID.generate()
      uuid2 = Ecto.UUID.generate()

      date = ~D[2025-04-18] # Use a fixed date to avoid conflicts
      rehearsal_songs = [%Song{title: "Song 1", uuid: uuid1}]
      set_songs = [%Song{title: "Song 2", uuid: uuid2}]
      duration = 3600

      assert {:ok, plan} = RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration, @test_server)
      assert plan.date == date
      assert plan.rehearsal_songs == [uuid1] # Note: server stores UUIDs, not full song objects
      assert plan.set_songs == [uuid2]       # Note: server stores UUIDs, not full song objects
      assert plan.duration == duration
    end

    test "save_plan/4 returns error when plan already exists" do
      date = ~D[2025-04-19] # Use a fixed date to avoid conflicts
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration, @test_server)
      assert {:error, :plan_already_exists} = RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration, @test_server)
    end

    test "list_plans/0 returns all plans" do
      date1 = ~D[2025-04-20] # Use fixed dates to avoid conflicts
      date2 = ~D[2025-04-21]
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date1, rehearsal_songs, set_songs, duration, @test_server)
      RehearsalServer.save_plan(date2, rehearsal_songs, set_songs, duration, @test_server)

      plans = RehearsalServer.list_plans(@test_server)
      assert length(plans) == 2
      assert Enum.any?(plans, &(&1.date == date1))
      assert Enum.any?(plans, &(&1.date == date2))
    end

    test "get_plan/1 returns plan by date" do
      date = ~D[2025-04-22] # Use a fixed date to avoid conflicts
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration, @test_server)
      assert {:ok, plan} = RehearsalServer.get_plan(date, @test_server)
      assert plan.date == date
    end

    test "get_plan/1 returns error when plan not found" do
      # Use a date we know doesn't exist
      date = ~D[2099-12-31]
      assert {:error, :not_found} = RehearsalServer.get_plan(date, @test_server)
    end

    test "update_plan/2 updates plan successfully" do
      date = ~D[2025-04-23] # Use a fixed date to avoid conflicts
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration, @test_server)
      new_duration = 7200
      assert {:ok, updated_plan} = RehearsalServer.update_plan(date, %{duration: new_duration}, @test_server)
      assert updated_plan.duration == new_duration
    end

    test "update_plan/2 returns error when plan not found" do
      # Use a date we know doesn't exist
      date = ~D[2099-12-31]
      assert {:error, :not_found} = RehearsalServer.update_plan(date, %{duration: 3600}, @test_server)
    end

    test "delete_plan/1 removes plan successfully" do
      date = ~D[2025-04-24] # Use a fixed date to avoid conflicts
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration, @test_server)
      assert :ok = RehearsalServer.delete_plan(date, @test_server)
      assert {:error, :not_found} = RehearsalServer.get_plan(date, @test_server)
    end

    test "delete_plan/1 returns error when plan not found" do
      # Use a date we know doesn't exist
      date = ~D[2099-12-31]
      assert {:error, :not_found} = RehearsalServer.delete_plan(date, @test_server)
    end
  end

  describe "persistence" do
    test "loads initial state from persistence" do
      # Use a unique server name for this test
      test_server = :test_persistence_server_unique

      # Create a unique song that doesn't collide with other tests
      song_uuid = "test-persistence-#{Ecto.UUID.generate()}"
      plan_date = ~D[2025-05-01] # Use a fixed date that won't conflict
      band_id = Ecto.UUID.generate() # Generate a UUID for the band_id

      # Start a new server instance that will load an empty state
      {:ok, pid} = RehearsalServer.start_link(test_server)

      # Add a plan to the server
      rehearsal_songs = [%Song{title: "Persistence Test Song", uuid: song_uuid}]
      set_songs = []
      duration = 3600

      # Save the plan to the server
      RehearsalServer.save_plan(plan_date, rehearsal_songs, set_songs, duration, test_server)

      # Force persist to ensure data is saved before stopping the server
      plans = RehearsalServer.list_plans(test_server)
      # Add band_id to the plans before persisting
      plans_with_band_id = Enum.map(plans, fn plan ->
        Map.put(plan, :band_id, band_id)
      end)
      BandDb.Rehearsals.RehearsalPersistence.persist_plans(plans_with_band_id)

      # Stop the server
      GenServer.stop(pid)

      # Start a new server instance that should load the saved state
      {:ok, new_pid} = RehearsalServer.start_link(test_server)

      # Verify the plan was loaded
      assert {:ok, loaded_plan} = RehearsalServer.get_plan(plan_date, test_server)
      assert loaded_plan.date == plan_date
      assert loaded_plan.rehearsal_songs == [song_uuid]
      assert loaded_plan.duration == 3600

      # Clean up
      GenServer.stop(new_pid)
    end
  end
end
