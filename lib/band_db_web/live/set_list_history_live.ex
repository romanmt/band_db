defmodule BandDbWeb.SetListHistoryLive do
  use BandDbWeb, :live_view
  alias BandDb.SetListServer

  @impl true
  def mount(_params, _session, socket) do
    set_lists = SetListServer.list_set_lists()
    {:ok, assign(socket, set_lists: set_lists)}
  end

  defp format_duration(nil), do: ""
  defp format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    :io_lib.format("~2..0B:~2..0B", [minutes, remaining_seconds])
  end

  defp status_color(:ready), do: "bg-green-100 text-green-800"
  defp status_color(:performed), do: "bg-blue-100 text-blue-800"
  defp status_color(:suggested), do: "bg-purple-100 text-purple-800"
end
