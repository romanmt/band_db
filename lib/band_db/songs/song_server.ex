defmodule BandDb.Songs.SongServer do
  use GenServer
  require Logger
  alias BandDb.Songs.Song
  alias BandDb.Repo
  use BandDb.Shared.Persistence,
    table_name: :songs_table

  # Client API

  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
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
    state = init_persistence()
    # Ensure we have a songs list
    state = if Map.has_key?(state, :songs), do: state, else: %{songs: []}
    {:ok, state}
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
        old_song = Enum.at(state.songs, index)
        updated_song = struct(Song, Map.merge(Map.from_struct(old_song), attrs))

        updated_songs = List.update_at(state.songs, index, fn _ -> updated_song end)
        new_state = %{state | songs: updated_songs}

        {:reply, {:ok, updated_song}, new_state}
    end
  end

  @impl true
  def handle_call({:bulk_import_songs, song_text}, _from, state) do
    songs = state.songs
    new_songs = song_text
    |> String.split("\n")
    |> Enum.reject(&(String.trim(&1) == ""))
    |> Enum.map(fn line ->
      [band_name, title, duration, status, tuning, notes] = String.split(line, "\t")
      [minutes, seconds] = String.split(duration, ":")
      duration_seconds = String.to_integer(minutes) * 60 + String.to_integer(seconds)

      # Convert tuning to atom and handle invalid values
      tuning_atom = case String.trim(tuning) do
        "standard" -> :standard
        "drop_d" -> :drop_d
        "e_flat" -> :e_flat
        "drop_c_sharp" -> :drop_c_sharp
        invalid -> {:error, "Invalid tuning value: #{invalid}"}
      end

      case tuning_atom do
        {:error, msg} -> {:error, msg}
        tuning_atom ->
          %Song{
            title: String.trim(title),
            band_name: String.trim(band_name),
            duration: duration_seconds,
            status: String.to_existing_atom(String.trim(status)),
            tuning: tuning_atom,
            notes: String.trim(notes),
            uuid: Ecto.UUID.generate()
          }
      end
    end)

    # Check for any errors in the parsed songs
    case Enum.find(new_songs, &(match?({:error, _}, &1))) do
      {:error, msg} -> {:reply, {:error, msg}, state}
      nil ->
        # Merge new songs with existing ones, updating if title exists
        updated_songs = Enum.reduce(new_songs, songs, fn new_song, acc ->
          case Enum.find_index(acc, &(&1.title == new_song.title)) do
            nil -> [new_song | acc]
            index ->
              # Preserve the UUID when updating an existing song
              existing_song = Enum.at(acc, index)
              updated_song = %{new_song | uuid: existing_song.uuid}
              List.update_at(acc, index, fn _ -> updated_song end)
          end
        end)

        new_state = %{state | songs: updated_songs}
        {:reply, {:ok, length(new_songs)}, new_state}
    end
  end

  @impl true
  def handle_info(:backup, state), do: handle_backup(state)
end
