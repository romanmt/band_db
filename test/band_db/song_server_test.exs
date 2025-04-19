defmodule BandDb.Songs.SongServerTest do
  use BandDb.UnitCase, async: true
  alias BandDb.Songs.SongServer

  setup do
    # Each test should use a unique server name to avoid conflicts
    server_name = :"test_song_server_#{System.unique_integer([:positive])}"

    # Start the server with the unique name
    start_supervised!({SongServer, server_name})

    # Return the server name to the test
    {:ok, server: server_name}
  end

  describe "business logic" do
    test "add_song/4 adds a new song successfully", %{server: server} do
      assert {:ok, song} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, server)
      assert song.title == "Test Song"
      assert song.status == :needs_learning
      assert song.band_name == "Test Band"
      assert song.duration == nil
      assert song.notes == ""
    end

    test "add_song/4 returns error when song already exists", %{server: server} do
      {:ok, _} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, server)
      assert {:error, :song_already_exists} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, server)
    end

    test "list_songs/0 returns all songs", %{server: server} do
      {:ok, _} = SongServer.add_song("Song 1", :needs_learning, "Band 1", nil, "", :standard, nil, server)
      {:ok, _} = SongServer.add_song("Song 2", :ready, "Band 2", nil, "", :standard, nil, server)

      songs = SongServer.list_songs(server)
      assert length(songs) == 2
      assert Enum.any?(songs, &(&1.title == "Song 1"))
      assert Enum.any?(songs, &(&1.title == "Song 2"))
    end

    test "get_song/1 returns song by title", %{server: server} do
      {:ok, _} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, server)
      assert {:ok, song} = SongServer.get_song("Test Song", server)
      assert song.title == "Test Song"
    end

    test "get_song/1 returns error when song not found", %{server: server} do
      assert {:error, :not_found} = SongServer.get_song("Nonexistent Song", server)
    end

    test "update_song_status/2 updates song status", %{server: server} do
      {:ok, _} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, server)
      assert :ok = SongServer.update_song_status("Test Song", :ready, server)

      assert {:ok, song} = SongServer.get_song("Test Song", server)
      assert song.status == :ready
    end

    test "update_song_status/2 returns error when song not found", %{server: server} do
      assert {:error, :not_found} = SongServer.update_song_status("Nonexistent Song", :ready, server)
    end
  end

  describe "persistence" do
    test "persistence module is properly configured" do
      assert SongServer.start_link(:test_persistence_server) != {:error, :already_started}
      assert :sys.get_state(:test_persistence_server).songs == []
      GenServer.stop(:test_persistence_server)
    end
  end
end
