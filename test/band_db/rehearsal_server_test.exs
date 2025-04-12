defmodule BandDb.Rehearsals.RehearsalServerTest do
  use ExUnit.Case
  alias BandDb.Rehearsals.{RehearsalServer, RehearsalPlan, RehearsalPersistence}
  alias BandDb.Songs.Song

  setup do
    # Start the server with a different name for testing
    start_supervised!({RehearsalServer, name: :test_rehearsal_server})
    :ok
  end

  describe "business logic" do
    test "save_plan/4 adds a new plan successfully" do
      date = Date.utc_today()
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      assert {:ok, plan} = RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration)
      assert plan.date == date
      assert plan.rehearsal_songs == rehearsal_songs
      assert plan.set_songs == set_songs
      assert plan.duration == duration
    end

    test "save_plan/4 returns error when plan already exists" do
      date = Date.utc_today()
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration)
      assert {:error, :plan_already_exists} = RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration)
    end

    test "list_plans/0 returns all plans" do
      date1 = Date.utc_today()
      date2 = Date.add(date1, 1)
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date1, rehearsal_songs, set_songs, duration)
      RehearsalServer.save_plan(date2, rehearsal_songs, set_songs, duration)

      plans = RehearsalServer.list_plans()
      assert length(plans) == 2
      assert Enum.any?(plans, &(&1.date == date1))
      assert Enum.any?(plans, &(&1.date == date2))
    end

    test "get_plan/1 returns plan by date" do
      date = Date.utc_today()
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration)
      assert {:ok, plan} = RehearsalServer.get_plan(date)
      assert plan.date == date
    end

    test "get_plan/1 returns error when plan not found" do
      assert {:error, :not_found} = RehearsalServer.get_plan(Date.utc_today())
    end

    test "update_plan/2 updates plan successfully" do
      date = Date.utc_today()
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration)
      new_duration = 7200
      assert {:ok, updated_plan} = RehearsalServer.update_plan(date, %{duration: new_duration})
      assert updated_plan.duration == new_duration
    end

    test "update_plan/2 returns error when plan not found" do
      assert {:error, :not_found} = RehearsalServer.update_plan(Date.utc_today(), %{duration: 3600})
    end

    test "delete_plan/1 removes plan successfully" do
      date = Date.utc_today()
      rehearsal_songs = [%Song{title: "Song 1", uuid: Ecto.UUID.generate()}]
      set_songs = [%Song{title: "Song 2", uuid: Ecto.UUID.generate()}]
      duration = 3600

      RehearsalServer.save_plan(date, rehearsal_songs, set_songs, duration)
      assert :ok = RehearsalServer.delete_plan(date)
      assert {:error, :not_found} = RehearsalServer.get_plan(date)
    end

    test "delete_plan/1 returns error when plan not found" do
      assert {:error, :not_found} = RehearsalServer.delete_plan(Date.utc_today())
    end
  end

  describe "persistence" do
    test "loads initial state from persistence" do
      # Create a test plan in the database
      date = Date.utc_today()
      song = %Song{
        title: "Test Song",
        status: :ready,
        band_name: "Test Band",
        uuid: Ecto.UUID.generate()
      }
      BandDb.Repo.insert!(song)

      plan = %RehearsalPlan{
        date: date,
        rehearsal_songs: [song],
        set_songs: [song],
        duration: 3600
      }
      BandDb.Repo.insert!(plan)

      # Start a new server instance
      {:ok, pid} = RehearsalServer.start_link(name: :test_persistence_server)

      # Verify the plan was loaded
      assert {:ok, loaded_plan} = RehearsalServer.get_plan(date)
      assert loaded_plan.date == date
      assert length(loaded_plan.rehearsal_songs) == 1
      assert length(loaded_plan.set_songs) == 1
      assert loaded_plan.duration == 3600

      # Clean up
      GenServer.stop(pid)
      BandDb.Repo.delete_all(RehearsalPlan)
      BandDb.Repo.delete_all(Song)
    end
  end
end
