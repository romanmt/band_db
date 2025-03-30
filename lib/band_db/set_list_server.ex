defmodule BandDb.SetListServer do
  use GenServer
  require Logger

  # Client API
  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def save_set_list(name, songs, total_duration) do
    GenServer.call(__MODULE__, {:save_set_list, name, songs, total_duration})
  end

  def list_set_lists do
    GenServer.call(__MODULE__, :list_set_lists)
  end

  # Server Callbacks
  @impl true
  def init(_) do
    {:ok, %{set_lists: []}}
  end

  @impl true
  def handle_call({:save_set_list, name, songs, total_duration}, _from, state) do
    set_list = %{
      name: name,
      songs: songs,
      total_duration: total_duration,
      created_at: DateTime.utc_now()
    }

    new_state = %{state | set_lists: [set_list | state.set_lists]}
    {:reply, :ok, new_state}
  end

  @impl true
  def handle_call(:list_set_lists, _from, state) do
    sorted_lists = Enum.sort_by(state.set_lists, & &1.created_at, {:desc, DateTime})
    {:reply, sorted_lists, state}
  end
end
