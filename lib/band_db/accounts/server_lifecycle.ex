defmodule BandDb.Accounts.ServerLifecycle do
  @moduledoc """
  Module responsible for managing the lifecycle of band servers.
  Starts and stops the band servers when users log in or out.
  """
  require Logger
  alias BandDb.Accounts.BandServer

  @doc """
  Called when a user logs in.
  Starts the band server for the user's band.
  """
  def on_user_login(user) do
    if user && user.band_id do
      Logger.info("User #{user.id} logged in. Starting band server for band #{user.band_id}")
      case BandServer.get_band_server(user.band_id) do
        {:ok, pid} ->
          Logger.info("Band server started or already running at pid #{inspect(pid)}")
          {:ok, pid}
        {:error, reason} ->
          Logger.error("Failed to start band server for band #{user.band_id}: #{inspect(reason)}")
          {:error, reason}
      end
    else
      Logger.info("User logged in but has no band_id")
      {:error, :no_band_id}
    end
  end

  @doc """
  Called when a user logs out.
  Stops the band server for the user's band.
  """
  def on_user_logout(user) do
    if user && user.band_id do
      Logger.info("User #{user.id} logged out. Stopping band server for band #{user.band_id}")
      case BandServer.stop_band_server(user.band_id) do
        :ok ->
          Logger.info("Band server for band #{user.band_id} stopped successfully")
          :ok
        {:error, reason} ->
          Logger.info("Band server for band #{user.band_id} not found or already stopped: #{inspect(reason)}")
          {:error, reason}
      end
    else
      Logger.info("User logged out but has no band_id")
      {:error, :no_band_id}
    end
  end
end
