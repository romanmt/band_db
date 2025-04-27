defmodule BandDb.Accounts.BandServer do
  use Supervisor
  require Logger
  alias BandDb.Accounts
  alias BandDb.Songs.SongServer
  alias BandDb.Rehearsals.RehearsalServer
  alias BandDb.SetLists.SetListServer

  @registry BandDb.BandRegistry

  # Client API

  @doc """
  Starts a band server for the given band_id.
  """
  def start_link(band_id) when is_integer(band_id) do
    Supervisor.start_link(__MODULE__, band_id, name: via_tuple(band_id))
  end

  @doc """
  Gets a band server for the given band_id, starting it if it doesn't exist.
  """
  def get_band_server(band_id) when is_integer(band_id) do
    case Registry.lookup(@registry, band_id) do
      [{pid, _}] ->
        {:ok, pid}
      [] ->
        DynamicSupervisor.start_child(
          BandDb.BandSupervisor,
          {__MODULE__, band_id}
        )
    end
  end

  @doc """
  Returns the song server for the given band_id.
  """
  def get_song_server(band_id) when is_integer(band_id) do
    child_name(band_id, SongServer)
  end

  @doc """
  Returns the rehearsal server for the given band_id.
  """
  def get_rehearsal_server(band_id) when is_integer(band_id) do
    child_name(band_id, RehearsalServer)
  end

  @doc """
  Returns the set list server for the given band_id.
  """
  def get_set_list_server(band_id) when is_integer(band_id) do
    child_name(band_id, SetListServer)
  end

  @doc """
  Stops the band server for the given band_id.
  Returns :ok if the server was stopped, or :error if it wasn't running.
  """
  def stop_band_server(band_id) when is_integer(band_id) do
    case Registry.lookup(@registry, band_id) do
      [{pid, _}] ->
        Logger.info("Stopping band server for band #{band_id}")
        DynamicSupervisor.terminate_child(BandDb.BandSupervisor, pid)
      [] ->
        Logger.info("No band server running for band #{band_id}")
        {:error, :not_found}
    end
  end

  # Server Callbacks

  @impl true
  def init(band_id) do
    Logger.info("Starting band server for band #{band_id}")

    # Validate that the band exists
    case Accounts.get_band!(band_id) do
      %Accounts.Band{} = band ->
        Logger.info("Band found: #{band.name}")

        children = [
          {SongServer, child_name(band_id, SongServer)},
          {RehearsalServer, child_name(band_id, RehearsalServer)},
          {SetListServer, child_name(band_id, SetListServer)}
        ]

        Supervisor.init(children, strategy: :one_for_one)

      _ ->
        Logger.error("Band not found for id #{band_id}")
        {:error, :band_not_found}
    end
  end

  # Private functions

  defp via_tuple(band_id) do
    {:via, Registry, {@registry, band_id}}
  end

  defp child_name(band_id, module) do
    {:via, Registry, {@registry, {band_id, module}}}
  end
end
