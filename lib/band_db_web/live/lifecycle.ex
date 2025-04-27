defmodule BandDbWeb.Live.Lifecycle do
  @moduledoc """
  Helper module for LiveView process lifecycle management.
  """
  require Logger
  alias BandDb.Accounts.ServerLifecycle
  alias Phoenix.LiveView

  defmacro __using__(_opts) do
    quote do
      alias BandDbWeb.Live.Lifecycle
      import Lifecycle, only: [setup_cleanup: 1]

      # Add a default handle_info for cleanup monitoring
      def handle_info({:monitor_for_cleanup, user}, socket) do
        Lifecycle.setup_cleanup(user)
        {:noreply, socket}
      end
    end
  end

  @doc """
  Sets up a process monitor to clean up band servers when a LiveView process terminates.
  """
  def setup_cleanup(user) do
    if user && user.band_id do
      # Create a separate monitoring process that will stay alive
      # even if this LiveView process dies
      Task.Supervisor.start_child(BandDb.TaskSupervisor, fn ->
        # Monitor the calling LiveView process
        caller = self()
        ref = Process.monitor(caller)

        # Wait for the process to exit
        receive do
          {:DOWN, ^ref, :process, ^caller, _reason} ->
            Logger.info("LiveView process terminated, cleaning up band servers for user #{user.id}")
            ServerLifecycle.on_user_logout(user)
        end
      end)
    end
  end
end
