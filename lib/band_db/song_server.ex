defmodule BandDb.Song do
  @type status :: :performed | :needs_learning | :needs_rehearsal | :ready | :suggested

  @enforce_keys [:title, :status, :band_name]
  defstruct [:title, :status, :notes, :band_name]

  @type t :: %__MODULE__{
    title: String.t(),
    status: status(),
    notes: String.t() | nil,
    band_name: String.t()
  }
end

defmodule BandDb.SongServer do
  use GenServer
  alias BandDb.Song

  # Client API

  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def add_song(title, status, band_name, notes \\ nil) do
    GenServer.call(__MODULE__, {:add_song, title, status, band_name, notes})
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
    {:ok, []}
  end

  @impl true
  def handle_call({:add_song, title, status, band_name, notes}, _from, songs) do
    case Enum.find(songs, fn song -> song.title == title end) do
      nil ->
        new_song = %Song{title: title, status: status, band_name: band_name, notes: notes}
        {:reply, {:ok, new_song}, [new_song | songs]}
      _existing ->
        {:reply, {:error, :song_already_exists}, songs}
    end
  end

  @impl true
  def handle_call(:list_songs, _from, songs) do
    {:reply, songs, songs}
  end

  @impl true
  def handle_call({:get_song, title}, _from, songs) do
    case Enum.find(songs, fn song -> song.title == title end) do
      nil -> {:reply, {:error, :not_found}, songs}
      song -> {:reply, {:ok, song}, songs}
    end
  end

  @impl true
  def handle_call({:update_status, title, new_status}, _from, songs) do
    case Enum.find_index(songs, fn song -> song.title == title end) do
      nil ->
        {:reply, {:error, :not_found}, songs}
      index ->
        updated_songs = List.update_at(songs, index, fn song ->
          %{song | status: new_status}
        end)
        {:reply, :ok, updated_songs}
    end
  end
end
