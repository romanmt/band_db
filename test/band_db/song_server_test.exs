defmodule BandDb.SongServerTest do
  use ExUnit.Case
  alias BandDb.SongServer

  setup do
    # Start the server with a different name for testing
    start_supervised!({SongServer, name: :test_song_server})
    :ok
  end

  describe "add_song/3" do
    test "adds a new song successfully" do
      assert {:ok, song} = GenServer.call(:test_song_server, {:add_song, "Test Song", :needs_learning, nil})
      assert song.title == "Test Song"
      assert song.status == :needs_learning
      assert song.notes == nil
    end

    test "adds a song with notes" do
      assert {:ok, song} = GenServer.call(:test_song_server, {:add_song, "Test Song", :needs_learning, "In G major"})
      assert song.title == "Test Song"
      assert song.status == :needs_learning
      assert song.notes == "In G major"
    end

    test "returns error when adding duplicate song" do
      GenServer.call(:test_song_server, {:add_song, "Test Song", :needs_learning, nil})
      assert {:error, :song_already_exists} = GenServer.call(:test_song_server, {:add_song, "Test Song", :needs_learning, nil})
    end
  end

  describe "list_songs/0" do
    test "returns empty list when no songs exist" do
      assert [] == GenServer.call(:test_song_server, :list_songs)
    end

    test "returns all added songs" do
      GenServer.call(:test_song_server, {:add_song, "Song 1", :needs_learning, nil})
      GenServer.call(:test_song_server, {:add_song, "Song 2", :performed, nil})

      songs = GenServer.call(:test_song_server, :list_songs)
      assert length(songs) == 2
      assert Enum.any?(songs, &(&1.title == "Song 1"))
      assert Enum.any?(songs, &(&1.title == "Song 2"))
    end
  end

  describe "get_song/1" do
    test "returns error when song doesn't exist" do
      assert {:error, :not_found} = GenServer.call(:test_song_server, {:get_song, "Non-existent Song"})
    end

    test "returns song when it exists" do
      GenServer.call(:test_song_server, {:add_song, "Test Song", :needs_learning, nil})
      assert {:ok, song} = GenServer.call(:test_song_server, {:get_song, "Test Song"})
      assert song.title == "Test Song"
      assert song.status == :needs_learning
    end
  end

  describe "update_song_status/2" do
    test "returns error when song doesn't exist" do
      assert {:error, :not_found} = GenServer.call(:test_song_server, {:update_status, "Non-existent Song", :ready})
    end

    test "updates song status successfully" do
      GenServer.call(:test_song_server, {:add_song, "Test Song", :needs_learning, nil})
      assert :ok = GenServer.call(:test_song_server, {:update_status, "Test Song", :ready})

      assert {:ok, song} = GenServer.call(:test_song_server, {:get_song, "Test Song"})
      assert song.status == :ready
    end

    test "can update status multiple times" do
      GenServer.call(:test_song_server, {:add_song, "Test Song", :needs_learning, nil})
      assert :ok = GenServer.call(:test_song_server, {:update_status, "Test Song", :ready})
      assert :ok = GenServer.call(:test_song_server, {:update_status, "Test Song", :performed})

      assert {:ok, song} = GenServer.call(:test_song_server, {:get_song, "Test Song"})
      assert song.status == :performed
    end
  end
end
