defmodule BandDb.Song do
  @type status :: :performed | :needs_learning | :needs_rehearsal | :ready | :suggested

  @enforce_keys [:title, :status, :band_name]
  defstruct [:title, :status, :notes, :band_name, :duration]

  @type t :: %__MODULE__{
    title: String.t(),
    status: status(),
    notes: String.t() | nil,
    band_name: String.t(),
    duration: non_neg_integer() | nil  # Duration in seconds
  }
end

defmodule BandDb.SongServer do
  use GenServer
  require Logger
  alias BandDb.Song
  use BandDb.Persistence,
    table_name: :songs_table,
    storage_file: "priv/songs.dets"

  # Client API

  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def add_song(title, status, band_name, duration \\ nil, notes \\ nil) do
    GenServer.call(__MODULE__, {:add_song, title, status, band_name, duration, notes})
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

  # Server Callbacks

  @impl true
  def init(_args) do
    state = init_persistence()
    # Ensure we have a songs list
    state = if Map.has_key?(state, :songs), do: state, else: %{songs: []}
    {:ok, state}
  end

  @impl true
  def handle_call({:add_song, title, status, band_name, duration, notes}, _from, state) do
    songs = state.songs
    case Enum.find(songs, fn song -> song.title == title end) do
      nil ->
        new_song = %Song{title: title, status: status, band_name: band_name, duration: duration, notes: notes}
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
  def handle_info(:backup, state), do: handle_backup(state)
end
