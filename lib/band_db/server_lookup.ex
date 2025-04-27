defmodule BandDb.ServerLookup do
  @moduledoc """
  Helper module for looking up the appropriate server based on band context.
  Provides transparent routing to either global servers or band-specific servers.
  """

  require Logger
  alias BandDb.Accounts.BandServer

  @doc """
  Get the appropriate SongServer for the given context.
  If band_id is provided, returns the band-specific server.
  """
  def get_song_server(band_id) when is_integer(band_id) do
    ensure_band_server(band_id)
    BandServer.get_song_server(band_id)
  end

  @doc """
  Get the appropriate RehearsalServer for the given context.
  If band_id is provided, returns the band-specific server.
  """
  def get_rehearsal_server(band_id) when is_integer(band_id) do
    ensure_band_server(band_id)
    BandServer.get_rehearsal_server(band_id)
  end

  @doc """
  Get the appropriate SetListServer for the given context.
  If band_id is provided, returns the band-specific server.
  """
  def get_set_list_server(band_id) when is_integer(band_id) do
    ensure_band_server(band_id)
    BandServer.get_set_list_server(band_id)
  end

  # Helper to ensure the band server is running
  defp ensure_band_server(band_id) do
    case BandServer.get_band_server(band_id) do
      {:ok, _pid} -> :ok
      error ->
        Logger.error("Failed to start band server for band #{band_id}: #{inspect(error)}")
        error
    end
  end
end
