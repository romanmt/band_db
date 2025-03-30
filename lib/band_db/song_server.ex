defmodule BandDb.Song do
  use Ecto.Schema
  import Ecto.Changeset

  @type status :: :performed | :needs_learning | :needs_rehearsal | :ready | :suggested
  @type tuning :: :standard | :drop_d | :e_flat | :drop_c_sharp

  schema "songs" do
    field :title, :string
    field :status, Ecto.Enum, values: [:performed, :needs_learning, :needs_rehearsal, :ready, :suggested]
    field :notes, :string
    field :band_name, :string
    field :duration, :integer
    field :tuning, Ecto.Enum, values: [:standard, :drop_d, :e_flat, :drop_c_sharp], default: :standard

    timestamps()
  end

  @type t :: %__MODULE__{
    title: String.t(),
    status: status(),
    notes: String.t() | nil,
    band_name: String.t(),
    duration: non_neg_integer() | nil,  # Duration in seconds
    tuning: tuning(),
    inserted_at: NaiveDateTime.t() | nil,
    updated_at: NaiveDateTime.t() | nil
  }

  def changeset(%__MODULE__{} = song, params) when is_map(params) do
    song
    |> cast(params, [:title, :status, :notes, :band_name, :duration, :tuning])
    |> validate_required([:title, :status, :band_name])
    |> unique_constraint(:title)
  end
end

defmodule BandDb.SongServer do
  use GenServer
  require Logger
  alias BandDb.{Song, Repo}
  use BandDb.Persistence,
    table_name: :songs_table

  # Client API

  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def add_song(title, status, band_name, duration \\ nil, notes \\ nil, tuning \\ :standard) do
    GenServer.call(__MODULE__, {:add_song, title, status, band_name, duration, notes, tuning})
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

  def migrate_songs do
    GenServer.call(__MODULE__, :migrate_songs)
  end

  def update_song(title, attrs) do
    GenServer.call(__MODULE__, {:update_song, title, attrs})
  end

  # Server Callbacks

  @impl true
  def init(_args) do
    state = init_persistence()
    # Ensure we have a songs list
    state = if Map.has_key?(state, :songs), do: state, else: %{songs: []}

    # Ensure all songs have the tuning field
    updated_songs = Enum.map(state.songs, fn song ->
      if Map.has_key?(song, :tuning) do
        song
      else
        Map.put(song, :tuning, :standard)
      end
    end)

    state = %{state | songs: updated_songs}

    {:ok, state}
  end

  @impl true
  def handle_call({:add_song, title, status, band_name, duration, notes, tuning}, _from, state) do
    songs = state.songs
    case Enum.find(songs, fn song -> song.title == title end) do
      nil ->
        new_song = %Song{title: title, status: status, band_name: band_name, duration: duration, notes: notes, tuning: tuning}
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
  def handle_call(:migrate_songs, _from, state) do
    updated_songs = Enum.map(state.songs, fn song ->
      if Map.has_key?(song, :tuning) do
        song
      else
        Map.put(song, :tuning, :standard)
      end
    end)

    new_state = %{state | songs: updated_songs}
    # Persist the migrated data
    handle_backup(new_state)

    {:reply, {:ok, length(updated_songs)}, new_state}
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
  def handle_info(:backup, state), do: handle_backup(state)
end
