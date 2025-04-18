defmodule BandDb.Songs.SongServerTest do
  use BandDb.DataCase, async: false
  alias BandDb.Songs.{SongServer, Song}

  @test_server :test_song_server

  setup do
    # Clear the database first
    BandDb.Repo.delete_all(Song)

    # Stop the server if it's running
    try do
      GenServer.stop(@test_server)
    catch
      :exit, _ -> :ok
    end

    # Start the server with a different name for testing
    start_supervised!({SongServer, @test_server})
    :ok
  end

  describe "business logic" do
    test "add_song/4 adds a new song successfully" do
      assert {:ok, song} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, @test_server)
      assert song.title == "Test Song"
      assert song.status == :needs_learning
      assert song.band_name == "Test Band"
      assert song.duration == nil
      assert song.notes == ""
    end

    test "add_song/4 returns error when song already exists" do
      {:ok, _} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, @test_server)
      assert {:error, :song_already_exists} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, @test_server)
    end

    test "list_songs/0 returns all songs" do
      {:ok, _} = SongServer.add_song("Song 1", :needs_learning, "Band 1", nil, "", :standard, nil, @test_server)
      {:ok, _} = SongServer.add_song("Song 2", :ready, "Band 2", nil, "", :standard, nil, @test_server)

      songs = SongServer.list_songs(@test_server)
      assert length(songs) == 2
      assert Enum.any?(songs, &(&1.title == "Song 1"))
      assert Enum.any?(songs, &(&1.title == "Song 2"))
    end

    test "get_song/1 returns song by title" do
      {:ok, _} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, @test_server)
      assert {:ok, song} = SongServer.get_song("Test Song", @test_server)
      assert song.title == "Test Song"
    end

    test "get_song/1 returns error when song not found" do
      assert {:error, :not_found} = SongServer.get_song("Nonexistent Song", @test_server)
    end

    test "update_song_status/2 updates song status" do
      {:ok, _} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, @test_server)
      assert :ok = SongServer.update_song_status("Test Song", :ready, @test_server)

      assert {:ok, song} = SongServer.get_song("Test Song", @test_server)
      assert song.status == :ready
    end

    test "update_song_status/2 returns error when song not found" do
      assert {:error, :not_found} = SongServer.update_song_status("Nonexistent Song", :ready, @test_server)
    end
  end

  describe "persistence" do
    test "loads initial state from persistence" do
      # Use a unique name for this test
      test_server = :test_persistence_server_unique

      # Make sure all test songs are removed first
      BandDb.Repo.delete_all(Song)

      # Create a test song in the database
      song = %Song{
        title: "Persistence Test Song",
        status: :ready,
        band_name: "Test Band",
        uuid: Ecto.UUID.generate()
      }
      BandDb.Repo.insert!(song)

      # Start a new server instance
      {:ok, pid} = SongServer.start_link(test_server)

      # Verify the song was loaded
      assert {:ok, loaded_song} = SongServer.get_song("Persistence Test Song", test_server)
      assert loaded_song.title == "Persistence Test Song"
      assert loaded_song.status == :ready
      assert loaded_song.band_name == "Test Band"

      # Clean up
      GenServer.stop(pid)
      BandDb.Repo.delete_all(Song)
    end
  end
end
