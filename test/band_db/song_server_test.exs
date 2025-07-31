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
      band_id = 1
      assert {:ok, song} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, band_id, server)
      assert song.title == "Test Song"
      assert song.status == :needs_learning
      assert song.band_name == "Test Band"
      assert song.duration == nil
      assert song.notes == ""
      assert song.band_id == band_id
    end

    test "add_song/4 returns error when song already exists", %{server: server} do
      band_id = 1
      {:ok, _} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, band_id, server)
      assert {:error, :song_already_exists} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, band_id, server)
    end

    test "add_song/4 allows same song title for different bands", %{server: server} do
      band_id_1 = 1
      band_id_2 = 2
      {:ok, _} = SongServer.add_song("Test Song", :needs_learning, "Test Band 1", nil, "", :standard, nil, band_id_1, server)
      assert {:ok, song} = SongServer.add_song("Test Song", :needs_learning, "Test Band 2", nil, "", :standard, nil, band_id_2, server)
      assert song.title == "Test Song"
      assert song.band_id == band_id_2
    end

    test "list_songs/0 returns all songs", %{server: server} do
      band_id_1 = 1
      band_id_2 = 2
      {:ok, _} = SongServer.add_song("Song 1", :needs_learning, "Band 1", nil, "", :standard, nil, band_id_1, server)
      {:ok, _} = SongServer.add_song("Song 2", :ready, "Band 2", nil, "", :standard, nil, band_id_2, server)

      songs = SongServer.list_songs(server)
      assert length(songs) == 2
      assert Enum.any?(songs, &(&1.title == "Song 1"))
      assert Enum.any?(songs, &(&1.title == "Song 2"))
    end

    test "list_songs_by_band returns songs for a specific band", %{server: server} do
      band_id_1 = 1
      band_id_2 = 2
      {:ok, _} = SongServer.add_song("Song 1", :needs_learning, "Band 1", nil, "", :standard, nil, band_id_1, server)
      {:ok, _} = SongServer.add_song("Song 2", :ready, "Band 2", nil, "", :standard, nil, band_id_2, server)
      {:ok, _} = SongServer.add_song("Song 3", :performed, "Band 1", nil, "", :standard, nil, band_id_1, server)

      songs = SongServer.list_songs_by_band(band_id_1, server)
      assert length(songs) == 2
      assert Enum.all?(songs, &(&1.band_id == band_id_1))
      assert Enum.any?(songs, &(&1.title == "Song 1"))
      assert Enum.any?(songs, &(&1.title == "Song 3"))
    end

    test "get_song/1 returns song by title", %{server: server} do
      band_id = 1
      {:ok, _} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, band_id, server)
      assert {:ok, song} = SongServer.get_song("Test Song", band_id, server)
      assert song.title == "Test Song"
      assert song.band_id == band_id
    end

    test "get_song/1 returns error when song not found", %{server: server} do
      band_id = 1
      assert {:error, :not_found} = SongServer.get_song("Nonexistent Song", band_id, server)
    end

    test "update_song_status/2 updates song status", %{server: server} do
      band_id = 1
      {:ok, _} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, band_id, server)
      assert :ok = SongServer.update_song_status("Test Song", :ready, band_id, server)

      assert {:ok, song} = SongServer.get_song("Test Song", band_id, server)
      assert song.status == :ready
    end

    test "update_song_status/2 returns error when song not found", %{server: server} do
      band_id = 1
      assert {:error, :not_found} = SongServer.update_song_status("Nonexistent Song", :ready, band_id, server)
    end

    test "delete_song/2 deletes a song successfully", %{server: server} do
      band_id = 1
      {:ok, _} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "", :standard, nil, band_id, server)
      assert :ok = SongServer.delete_song("Test Song", band_id, server)
      
      # Verify the song is deleted
      assert {:error, :not_found} = SongServer.get_song("Test Song", band_id, server)
      
      # Verify it's not in the list
      songs = SongServer.list_songs_by_band(band_id, server)
      assert length(songs) == 0
    end

    test "delete_song/2 returns error when song not found", %{server: server} do
      band_id = 1
      assert {:error, :not_found} = SongServer.delete_song("Nonexistent Song", band_id, server)
    end

    test "delete_song/2 only deletes song for specific band", %{server: server} do
      band_id_1 = 1
      band_id_2 = 2
      
      # Add same song title for two different bands
      {:ok, _} = SongServer.add_song("Test Song", :needs_learning, "Band 1", nil, "", :standard, nil, band_id_1, server)
      {:ok, _} = SongServer.add_song("Test Song", :ready, "Band 2", nil, "", :standard, nil, band_id_2, server)
      
      # Delete song for band 1
      assert :ok = SongServer.delete_song("Test Song", band_id_1, server)
      
      # Verify song is deleted for band 1
      assert {:error, :not_found} = SongServer.get_song("Test Song", band_id_1, server)
      
      # Verify song still exists for band 2
      assert {:ok, song} = SongServer.get_song("Test Song", band_id_2, server)
      assert song.band_id == band_id_2
      
      # Verify lists
      songs_band_1 = SongServer.list_songs_by_band(band_id_1, server)
      songs_band_2 = SongServer.list_songs_by_band(band_id_2, server)
      assert length(songs_band_1) == 0
      assert length(songs_band_2) == 1
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
