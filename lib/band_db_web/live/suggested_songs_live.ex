defmodule BandDbWeb.SuggestedSongsLive do
  use BandDbWeb, :live_view
  alias BandDb.SongServer

  @impl true
  def mount(_params, _session, socket) do
    songs = SongServer.list_songs()
    suggested_songs = Enum.filter(songs, & &1.status == :suggested)
    {:ok, assign(socket, songs: suggested_songs, search_term: "", updating_song: nil)}
  end

  @impl true
  def handle_event("search", %{"search" => %{"term" => term}}, socket) do
    songs = SongServer.list_songs()
    suggested_songs = Enum.filter(songs, & &1.status == :suggested)
    filtered_songs = filter_songs(suggested_songs, term)
    {:noreply, assign(socket, songs: filtered_songs, search_term: term)}
  end

  @impl true
  def handle_event("update_status", %{"title" => title, "value" => new_status}, socket) do
    # Mark this song as updating to avoid race conditions
    socket = assign(socket, updating_song: title)

    # Update the song's status
    result = SongServer.update_song_status(title, String.to_existing_atom(new_status))

    # Get updated song list
    songs = SongServer.list_songs()
    suggested_songs = Enum.filter(songs, & &1.status == :suggested)
    filtered_songs = filter_songs(suggested_songs, socket.assigns.search_term)

    # If the song status was updated to something other than :suggested,
    # it will be removed from the list automatically

    # Clear the updating flag
    socket = assign(socket, songs: filtered_songs, updating_song: nil)

    case result do
      :ok -> {:noreply, socket}
      {:error, reason} ->
        {:noreply, put_flash(socket, :error, "Failed to update song status: #{reason}")}
    end
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
end
