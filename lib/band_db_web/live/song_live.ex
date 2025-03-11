defmodule BandDbWeb.SongLive do
  use BandDbWeb, :live_view
  alias BandDb.SongServer

  @impl true
  def mount(_params, _session, socket) do
    songs = SongServer.list_songs()
    non_suggested_songs = Enum.reject(songs, & &1.status == :suggested)
    {:ok, assign(socket,
      songs: non_suggested_songs,
      show_modal: false,
      new_song: %{title: "", status: :needs_learning, band_name: "", duration: "", notes: ""},
      search_term: "",
      expanded_sections: MapSet.new([:suggested])
    )}
  end

  @impl true
  def handle_event("search", %{"search" => %{"term" => term}}, socket) do
    songs = SongServer.list_songs()
    non_suggested_songs = Enum.reject(songs, & &1.status == :suggested)
    filtered_songs = filter_songs(non_suggested_songs, term)
    {:noreply, assign(socket, songs: filtered_songs, search_term: term)}
  end

  @impl true
  def handle_event("show_modal", _params, socket) do
    {:noreply, assign(socket, show_modal: true)}
  end

  @impl true
  def handle_event("hide_modal", _params, socket) do
    {:noreply, assign(socket, show_modal: false)}
  end

  @impl true
  def handle_event("toggle_section", %{"status" => status}, socket) do
    status = String.to_existing_atom(status)
    expanded_sections = toggle_section(socket.assigns.expanded_sections, status)
    {:noreply, assign(socket, expanded_sections: expanded_sections)}
  end

  @impl true
  def handle_event("add_song", %{"song" => song_params}, socket) do
    status = String.to_existing_atom(song_params["status"])
    case SongServer.add_song(
      song_params["title"],
      status,
      song_params["band_name"],
      parse_duration(song_params["duration"]),
      song_params["notes"]
    ) do
      {:ok, _song} ->
        songs = SongServer.list_songs()
        non_suggested_songs = Enum.reject(songs, & &1.status == :suggested)
        filtered_songs = filter_songs(non_suggested_songs, socket.assigns.search_term)
        {:noreply,
         socket
         |> assign(songs: filtered_songs, show_modal: false)
         |> put_flash(:info, "Song added successfully!")}

      {:error, :song_already_exists} ->
        {:noreply,
         socket
         |> put_flash(:error, "A song with that title already exists")}
    end
  end

  @impl true
  def handle_event("update_status", %{"title" => title, "value" => new_status}, socket) do
    SongServer.update_song_status(title, String.to_existing_atom(new_status))
    songs = SongServer.list_songs()
    non_suggested_songs = Enum.reject(songs, & &1.status == :suggested)
    filtered_songs = filter_songs(non_suggested_songs, socket.assigns.search_term)
    {:noreply, assign(socket, songs: filtered_songs)}
  end

  defp filter_songs(songs, ""), do: songs
  defp filter_songs(songs, term) do
    term = String.downcase(term)
    Enum.filter(songs, fn song ->
      String.contains?(String.downcase(song.title), term) ||
      String.contains?(String.downcase(song.band_name), term) ||
      (song.notes && String.contains?(String.downcase(song.notes), term))
    end)
  end

  defp format_duration(nil), do: ""
  defp format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    :io_lib.format("~2..0B:~2..0B", [minutes, remaining_seconds])
  end

  defp parse_duration(""), do: nil
  defp parse_duration(duration) when is_binary(duration) do
    case String.split(duration, ":") do
      [minutes, seconds] ->
        String.to_integer(minutes) * 60 + String.to_integer(seconds)
      _ ->
        nil
    end
  end

  defp status_options do
    [
      {"Needs Learning", :needs_learning},
      {"Ready", :ready},
      {"Performed", :performed},
      {"Suggested", :suggested}
    ]
  end

  defp status_color(:needs_learning), do: "bg-yellow-100 text-yellow-800"
  defp status_color(:ready), do: "bg-green-100 text-green-800"
  defp status_color(:performed), do: "bg-blue-100 text-blue-800"
  defp status_color(:suggested), do: "bg-purple-100 text-purple-800"

  defp toggle_section(expanded_sections, status) do
    if MapSet.member?(expanded_sections, status) do
      MapSet.delete(expanded_sections, status)
    else
      MapSet.put(expanded_sections, status)
    end
  end

  defp section_expanded?(expanded_sections, status) do
    MapSet.member?(expanded_sections, status)
  end

  defp group_songs_by_status(songs) do
    songs
    |> Enum.group_by(& &1.status)
    |> Map.new()
  end
end
