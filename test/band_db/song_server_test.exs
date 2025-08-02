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

  describe "bulk import" do
    test "bulk_import_songs/2 imports multiple songs successfully", %{server: server} do
      band_id = 1
      import_text = """
      Led Zeppelin,Black Dog,4:55,ready,standard,Classic rock anthem
      Pink Floyd,Comfortably Numb,6:23,needs_learning,standard,Epic guitar solo
      """
      
      assert {:ok, 2} = SongServer.bulk_import_songs(import_text, band_id, server)
      
      songs = SongServer.list_songs_by_band(band_id, server)
      assert length(songs) == 2
      
      # Verify first song
      black_dog = Enum.find(songs, &(&1.title == "Black Dog"))
      assert black_dog.band_name == "Led Zeppelin"
      assert black_dog.duration == 295  # 4:55 in seconds
      assert black_dog.status == :ready
      assert black_dog.tuning == :standard
      assert black_dog.notes == "Classic rock anthem"
      assert black_dog.band_id == band_id
      
      # Verify second song
      comfortably_numb = Enum.find(songs, &(&1.title == "Comfortably Numb"))
      assert comfortably_numb.band_name == "Pink Floyd"
      assert comfortably_numb.duration == 383  # 6:23 in seconds
      assert comfortably_numb.status == :needs_learning
      assert comfortably_numb.tuning == :standard
      assert comfortably_numb.notes == "Epic guitar solo"
      assert comfortably_numb.band_id == band_id
    end

    test "bulk_import_songs/2 handles empty lines", %{server: server} do
      band_id = 1
      import_text = """
      Led Zeppelin,Black Dog,4:55,ready,standard,Classic rock anthem

      Pink Floyd,Comfortably Numb,6:23,needs_learning,standard,Epic guitar solo

      """
      
      assert {:ok, 2} = SongServer.bulk_import_songs(import_text, band_id, server)
      songs = SongServer.list_songs_by_band(band_id, server)
      assert length(songs) == 2
    end

    test "bulk_import_songs/2 updates existing songs", %{server: server} do
      band_id = 1
      # Add an existing song
      {:ok, _} = SongServer.add_song("Black Dog", :needs_learning, "Led Zeppelin", 290, "Old notes", :drop_d, nil, band_id, server)
      
      import_text = """
      Led Zeppelin,Black Dog,4:55,ready,standard,Updated notes
      """
      
      assert {:ok, 1} = SongServer.bulk_import_songs(import_text, band_id, server)
      
      songs = SongServer.list_songs_by_band(band_id, server)
      assert length(songs) == 1
      
      # Verify the song was updated
      song = Enum.find(songs, &(&1.title == "Black Dog"))
      assert song.status == :ready
      assert song.duration == 295
      assert song.tuning == :standard
      assert song.notes == "Updated notes"
    end

    test "bulk_import_songs/2 returns error for invalid tuning", %{server: server} do
      band_id = 1
      import_text = """
      Led Zeppelin,Black Dog,4:55,ready,invalid_tuning,Classic rock anthem
      """
      
      assert {:error, "Invalid tuning value: invalid_tuning"} = SongServer.bulk_import_songs(import_text, band_id, server)
      
      # Verify no songs were imported
      songs = SongServer.list_songs_by_band(band_id, server)
      assert length(songs) == 0
    end

    test "bulk_import_songs/2 handles different tuning values", %{server: server} do
      band_id = 1
      import_text = """
      Band 1,Song 1,3:00,ready,standard,Notes
      Band 2,Song 2,3:00,ready,drop_d,Notes
      Band 3,Song 3,3:00,ready,e_flat,Notes
      Band 4,Song 4,3:00,ready,drop_c_sharp,Notes
      """
      
      assert {:ok, 4} = SongServer.bulk_import_songs(import_text, band_id, server)
      
      songs = SongServer.list_songs_by_band(band_id, server)
      assert length(songs) == 4
      
      assert Enum.find(songs, &(&1.title == "Song 1")).tuning == :standard
      assert Enum.find(songs, &(&1.title == "Song 2")).tuning == :drop_d
      assert Enum.find(songs, &(&1.title == "Song 3")).tuning == :e_flat
      assert Enum.find(songs, &(&1.title == "Song 4")).tuning == :drop_c_sharp
    end

    test "bulk_import_songs/2 maintains band isolation", %{server: server} do
      band_id_1 = 1
      band_id_2 = 2
      
      # Import songs for band 1
      import_text_1 = """
      Led Zeppelin,Black Dog,4:55,ready,standard,Band 1 song
      """
      assert {:ok, 1} = SongServer.bulk_import_songs(import_text_1, band_id_1, server)
      
      # Import songs for band 2
      import_text_2 = """
      Pink Floyd,Comfortably Numb,6:23,needs_learning,standard,Band 2 song
      """
      assert {:ok, 1} = SongServer.bulk_import_songs(import_text_2, band_id_2, server)
      
      # Verify band isolation
      songs_band_1 = SongServer.list_songs_by_band(band_id_1, server)
      songs_band_2 = SongServer.list_songs_by_band(band_id_2, server)
      
      assert length(songs_band_1) == 1
      assert length(songs_band_2) == 1
      assert Enum.at(songs_band_1, 0).title == "Black Dog"
      assert Enum.at(songs_band_2, 0).title == "Comfortably Numb"
    end

    test "bulk_import_songs/2 handles all status values", %{server: server} do
      band_id = 1
      import_text = """
      Band 1,Song 1,3:00,suggested,standard,Notes
      Band 2,Song 2,3:00,needs_learning,standard,Notes
      Band 3,Song 3,3:00,needs_rehearsing,standard,Notes
      Band 4,Song 4,3:00,ready,standard,Notes
      Band 5,Song 5,3:00,performed,standard,Notes
      """
      
      assert {:ok, 5} = SongServer.bulk_import_songs(import_text, band_id, server)
      
      songs = SongServer.list_songs_by_band(band_id, server)
      assert length(songs) == 5
      
      assert Enum.find(songs, &(&1.title == "Song 1")).status == :suggested
      assert Enum.find(songs, &(&1.title == "Song 2")).status == :needs_learning
      assert Enum.find(songs, &(&1.title == "Song 3")).status == :needs_rehearsing
      assert Enum.find(songs, &(&1.title == "Song 4")).status == :ready
      assert Enum.find(songs, &(&1.title == "Song 5")).status == :performed
    end

    test "bulk_import_songs/2 trims whitespace", %{server: server} do
      band_id = 1
      import_text = """
        Led Zeppelin  ,  Black Dog  ,  4:55  ,  ready  ,  standard  ,  Classic rock anthem  
      """
      
      assert {:ok, 1} = SongServer.bulk_import_songs(import_text, band_id, server)
      
      songs = SongServer.list_songs_by_band(band_id, server)
      song = Enum.at(songs, 0)
      
      assert song.band_name == "Led Zeppelin"
      assert song.title == "Black Dog"
      assert song.notes == "Classic rock anthem"
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
