defmodule BandDb.SongServerTest do
  use ExUnit.Case
  alias BandDb.SongServer

  setup do
    # Start the server with a different name for testing
    start_supervised!({SongServer, name: :test_song_server})
    :ok
  end

  test "add_song/4 adds a new song successfully" do
    assert {:ok, song} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "")
    assert song.title == "Test Song"
    assert song.status == :needs_learning
    assert song.band_name == "Test Band"
    assert song.duration == nil
    assert song.notes == ""
  end

  test "add_song/4 returns error when song already exists" do
    SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "")
    assert {:error, :song_already_exists} = SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "")
  end

  test "list_songs/0 returns all songs" do
    SongServer.add_song("Song 1", :needs_learning, "Band 1", nil, "")
    SongServer.add_song("Song 2", :ready, "Band 2", nil, "")

    songs = SongServer.list_songs()
    assert length(songs) == 2
    assert Enum.any?(songs, &(&1.title == "Song 1"))
    assert Enum.any?(songs, &(&1.title == "Song 2"))
  end

  test "get_song/1 returns song by title" do
    SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "")
    assert {:ok, song} = SongServer.get_song("Test Song")
    assert song.title == "Test Song"
  end

  test "get_song/1 returns error when song not found" do
    assert {:error, :not_found} = SongServer.get_song("Nonexistent Song")
  end

  test "update_song_status/2 updates song status" do
    SongServer.add_song("Test Song", :needs_learning, "Test Band", nil, "")
    assert :ok = SongServer.update_song_status("Test Song", :ready)

    assert {:ok, song} = SongServer.get_song("Test Song")
    assert song.status == :ready
  end

  test "update_song_status/2 returns error when song not found" do
    assert {:error, :not_found} = SongServer.update_song_status("Nonexistent Song", :ready)
  end
end
