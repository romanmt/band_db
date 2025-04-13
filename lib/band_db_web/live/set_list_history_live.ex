defmodule BandDbWeb.SetListHistoryLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader
  alias BandDb.{SetLists.SetListServer, Songs.SongServer}
  import BandDbWeb.Components.ExpandableSection

  @impl true
  def mount(_params, _session, socket) do
    set_lists = SetListServer.list_set_lists()
    songs = case Process.whereis(BandDb.Songs.SongServer) do
      nil -> []
      _ -> SongServer.list_songs()
    end
    expanded_sets = %{}

    {:ok, assign(socket, set_lists: set_lists, expanded_sets: expanded_sets, songs: songs)}
  end

  @impl true
  def handle_event("toggle_details" <> params, _value, socket) do
    %{"name" => name} = URI.decode_query(String.trim_leading(params, "?"))

    expanded_sets = Map.update(
      socket.assigns.expanded_sets,
      name,
      true,
      &(!&1)
    )

    {:noreply, assign(socket, expanded_sets: expanded_sets)}
  end

  @impl true
  def handle_event("print_set_list", %{"name" => name}, socket) do
    # First expand the set list
    expanded_sets = Map.put(socket.assigns.expanded_sets, name, true)

    # Trigger the print event in the browser
    {:noreply,
      socket
      |> assign(expanded_sets: expanded_sets)
      |> push_event("print_set_list", %{name: name})}
  end

  @impl true
  def handle_info({:set_list_updated, _}, socket) do
    set_lists = SetListServer.list_set_lists()
    {:noreply, assign(socket, set_lists: set_lists)}
  end

  defp format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    "#{minutes}:#{String.pad_leading("#{remaining_seconds}", 2, "0")}"
  end
  defp format_duration(_), do: "0:00"

  defp tuning_color(:standard), do: "bg-indigo-100 text-indigo-800"
  defp tuning_color(:drop_d), do: "bg-blue-100 text-blue-800"
  defp tuning_color(:e_flat), do: "bg-green-100 text-green-800"
  defp tuning_color(:drop_c_sharp), do: "bg-purple-100 text-purple-800"
  defp tuning_color(_), do: "bg-gray-100 text-gray-800"

  defp display_tuning(:standard), do: "Standard"
  defp display_tuning(:drop_d), do: "Drop D"
  defp display_tuning(:e_flat), do: "Eb"
  defp display_tuning(:drop_c_sharp), do: "Drop C#"
  defp display_tuning(tuning) when is_atom(tuning), do: String.capitalize(to_string(tuning))
  defp display_tuning(_), do: "Unknown"

  defp get_band_name(song_title, songs) do
    case Enum.find(songs, &(&1.title == song_title)) do
      nil -> nil
      song -> song.band_name
    end
  end

  defp get_tuning(song_title, songs) do
    case Enum.find(songs, &(&1.title == song_title)) do
      nil -> nil
      song -> song.tuning
    end
  end
end
