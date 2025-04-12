defmodule BandDb.Songs.SongServer do
  use GenServer
  require Logger
  alias BandDb.Songs.{Song, SongPersistence}

  # Client API

  def start_link(name \\ __MODULE__) do
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def add_song(title, status, band_name, duration \\ nil, notes \\ nil, tuning \\ :standard, youtube_link \\ nil) do
    GenServer.call(__MODULE__, {:add_song, title, status, band_name, duration, notes, tuning, youtube_link})
  end

  def list_songs do
    GenServer.call(__MODULE__, :list_songs)
  end

  def get_song(title) do
    GenServer.call(__MODULE__, {:get_song, title})
  end

  def update_song_status(title, new_status) do
    GenServer.call(__MODULE__, {:update_status, title, new_status})
  end

  def update_song_tuning(title, new_tuning) do
    GenServer.call(__MODULE__, {:update_tuning, title, new_tuning})
  end

  def update_song(title, attrs) do
    GenServer.call(__MODULE__, {:update_song, title, attrs})
  end

  def bulk_import_songs(song_text) do
    GenServer.call(__MODULE__, {:bulk_import_songs, song_text})
  end

  # Server Callbacks

  @impl true
  def init(_args) do
    # Load initial state from persistence
    case SongPersistence.load_songs() do
      {:ok, songs} ->
        schedule_backup()
        {:ok, %{songs: songs}}
      _ ->
        schedule_backup()
        {:ok, %{songs: []}}
    end
  end

  @impl true
  def handle_call({:add_song, title, status, band_name, duration, notes, tuning, youtube_link}, _from, state) do
    songs = state.songs
    case Enum.find(songs, fn song -> song.title == title end) do
      nil ->
        new_song = %Song{
          title: title,
          status: status,
          band_name: band_name,
          duration: duration,
          notes: notes,
          tuning: tuning,
          youtube_link: youtube_link,
          uuid: Ecto.UUID.generate()
        }
        new_state = %{state | songs: [new_song | songs]}
        {:reply, {:ok, new_song}, new_state}
      _existing ->
        {:reply, {:error, :song_already_exists}, state}
    end
  end

  @impl true
  def handle_call(:list_songs, _from, state) do
    {:reply, state.songs, state}
  end

  @impl true
  def handle_call({:get_song, title}, _from, state) do
    case Enum.find(state.songs, fn song -> song.title == title end) do
      nil -> {:reply, {:error, :not_found}, state}
      song -> {:reply, {:ok, song}, state}
    end
  end

  @impl true
  def handle_call({:update_status, title, new_status}, _from, state) do
    case Enum.find_index(state.songs, fn song -> song.title == title end) do
      nil ->
        {:reply, {:error, :not_found}, state}
      index ->
        updated_songs = List.update_at(state.songs, index, fn song ->
          %{song | status: new_status}
        end)
        new_state = %{state | songs: updated_songs}
        {:reply, :ok, new_state}
    end
  end

  @impl true
  def handle_call({:update_tuning, title, new_tuning}, _from, state) do
    case Enum.find_index(state.songs, fn song -> song.title == title end) do
      nil ->
        {:reply, {:error, :not_found}, state}
      index ->
        updated_songs = List.update_at(state.songs, index, fn song ->
          %{song | tuning: new_tuning}
        end)
        new_state = %{state | songs: updated_songs}
        {:reply, :ok, new_state}
    end
  end

  @impl true
  def handle_call({:update_song, title, attrs}, _from, state) do
    case Enum.find_index(state.songs, fn song -> song.title == title end) do
      nil ->
        {:reply, {:error, :not_found}, state}
      index ->
        updated_songs = List.update_at(state.songs, index, fn song ->
          Map.merge(song, attrs)
        end)
        new_state = %{state | songs: updated_songs}
        {:reply, :ok, new_state}
    end
  end

  @impl true
  def handle_call({:bulk_import_songs, song_text}, _from, state) do
    songs = state.songs
    new_songs = song_text
    |> String.split("\n")
    |> Enum.map(&String.trim/1)
    |> Enum.filter(&(&1 != ""))
    |> Enum.map(fn line ->
      [title, status, band_name] = String.split(line, "|")
      %Song{
        title: String.trim(title),
        status: String.trim(status),
        band_name: String.trim(band_name),
        uuid: Ecto.UUID.generate()
      }
    end)

    new_state = %{state | songs: new_songs ++ songs}
    {:reply, :ok, new_state}
  end

  @impl true
  def handle_info(:backup, state) do
    Logger.info("Backing up songs")
    SongPersistence.persist_songs(state.songs)
    schedule_backup()
    {:noreply, state}
  end

  defp schedule_backup do
    Process.send_after(self(), :backup, :timer.hours(24))
  end
end
