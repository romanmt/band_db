defmodule BandDb.Songs.SongServer do
  use GenServer
  require Logger
  alias BandDb.Songs.Song

  # Client API

  def start_link(name \\ __MODULE__)

  def start_link(name) when is_atom(name) do
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def start_link({:via, Registry, {registry, _}} = name) do
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def start_link(opts) when is_list(opts) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def add_song(title, status, band_name, duration \\ nil, notes \\ nil, tuning \\ :standard, youtube_link \\ nil, band_id \\ nil, server \\ __MODULE__) do
    GenServer.call(server, {:add_song, title, status, band_name, duration, notes, tuning, youtube_link, band_id})
  end

  def list_songs(server \\ __MODULE__) do
    GenServer.call(server, :list_songs)
  end

  def list_songs_by_band(band_id, server \\ __MODULE__) do
    GenServer.call(server, {:list_songs_by_band, band_id})
  end

  def get_song(title, band_id \\ nil, server \\ __MODULE__) do
    GenServer.call(server, {:get_song, title, band_id})
  end

  def update_song_status(title, new_status, band_id \\ nil, server \\ __MODULE__) do
    GenServer.call(server, {:update_status, title, new_status, band_id})
  end

  def update_song_tuning(title, new_tuning, band_id \\ nil, server \\ __MODULE__) do
    GenServer.call(server, {:update_tuning, title, new_tuning, band_id})
  end

  def update_song(title, attrs, band_id \\ nil, server \\ __MODULE__) do
    GenServer.call(server, {:update_song, title, attrs, band_id})
  end

  def bulk_import_songs(song_text, band_id \\ nil, server \\ __MODULE__) do
    GenServer.call(server, {:bulk_import_songs, song_text, band_id})
  end

  # Server Callbacks

  @impl true
  def init(_args) do
    # Load initial state from persistence using the configurable module
    case persistence_module().load_songs() do
      {:ok, songs} ->
        schedule_backup()
        {:ok, %{songs: songs}}
      _ ->
        schedule_backup()
        {:ok, %{songs: []}}
    end
  end

  @impl true
  def handle_call({:add_song, title, status, band_name, duration, notes, tuning, youtube_link, band_id}, _from, state) do
    songs = state.songs
    # Check if a song with the same title exists for the same band
    case Enum.find(songs, fn song -> song.title == title && song.band_id == band_id end) do
      nil ->
        new_song = %Song{
          title: title,
          status: status,
          band_name: band_name,
          duration: duration,
          notes: notes,
          tuning: tuning,
          youtube_link: youtube_link,
          uuid: Ecto.UUID.generate(),
          band_id: band_id
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
  def handle_call({:list_songs_by_band, band_id}, _from, state) do
    filtered_songs = Enum.filter(state.songs, fn song -> song.band_id == band_id end)
    {:reply, filtered_songs, state}
  end

  @impl true
  def handle_call({:get_song, title, band_id}, _from, state) do
    case Enum.find(state.songs, fn song -> song.title == title && song.band_id == band_id end) do
      nil -> {:reply, {:error, :not_found}, state}
      song -> {:reply, {:ok, song}, state}
    end
  end

  @impl true
  def handle_call({:update_status, title, new_status, band_id}, _from, state) do
    case Enum.find_index(state.songs, fn song -> song.title == title && song.band_id == band_id end) do
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
  def handle_call({:update_tuning, title, new_tuning, band_id}, _from, state) do
    case Enum.find_index(state.songs, fn song -> song.title == title && song.band_id == band_id end) do
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
  def handle_call({:update_song, title, attrs, band_id}, _from, state) do
    case Enum.find_index(state.songs, fn song -> song.title == title && song.band_id == band_id end) do
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
  def handle_call({:bulk_import_songs, song_text, band_id}, _from, state) do
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
            uuid: Ecto.UUID.generate(),
            band_id: band_id
          }
      end
    end)

    # Check for any errors in the parsed songs
    case Enum.find(new_songs, &(match?({:error, _}, &1))) do
      {:error, msg} -> {:reply, {:error, msg}, state}
      nil ->
        # Merge new songs with existing ones, updating if title exists for the same band
        updated_songs = Enum.reduce(new_songs, songs, fn new_song, acc ->
          case Enum.find_index(acc, &(&1.title == new_song.title && &1.band_id == new_song.band_id)) do
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
  def handle_info(:backup, state) do
    Logger.info("Backing up songs")
    persistence_module().persist_songs(state.songs)
    schedule_backup()
    {:noreply, state}
  end

  defp schedule_backup do
    Process.send_after(self(), :backup, :timer.minutes(1))
  end

  # Get the configured persistence module
  defp persistence_module do
    Application.get_env(:band_db, :song_persistence, BandDb.Songs.SongPersistence)
  end
end
