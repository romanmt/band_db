defmodule BandDbWeb.SuggestedSongsLive do
  use BandDbWeb, :live_view
  alias BandDb.SongServer

  @impl true
  def mount(_params, _session, socket) do
    songs = SongServer.list_songs()
    suggested_songs = Enum.filter(songs, & &1.status == :suggested)
    {:ok, assign(socket, songs: suggested_songs, search_term: "", updating_song: nil, show_modal: false)}
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
  def handle_event("add_song", %{"song" => song_params}, socket) do
    duration_seconds = case song_params["duration"] do
      "" -> nil
      nil -> nil
      duration_str ->
        [minutes_str, seconds_str] = String.split(duration_str, ":")
        String.to_integer(minutes_str) * 60 + String.to_integer(seconds_str)
    end

    status = String.to_existing_atom(song_params["status"])
    tuning = String.to_existing_atom(song_params["tuning"] || "standard")

    case SongServer.add_song(
      song_params["title"],
      status,
      song_params["band_name"],
      duration_seconds,
      song_params["notes"],
      tuning
    ) do
      {:ok, _song} ->
        songs = SongServer.list_songs()
        suggested_songs = Enum.filter(songs, & &1.status == :suggested)
        filtered_songs = filter_songs(suggested_songs, socket.assigns.search_term)
        {:noreply,
          socket
          |> assign(songs: filtered_songs, show_modal: false)
          |> put_flash(:info, "Song added successfully")}

      {:error, :song_already_exists} ->
        {:noreply,
          socket
          |> put_flash(:error, "A song with that title already exists")}
    end
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
    socket = assign(socket, updating_song: title)
    SongServer.update_song_status(title, String.to_existing_atom(new_status))
    songs = SongServer.list_songs()
    suggested_songs = Enum.filter(songs, & &1.status == :suggested)
    filtered_songs = filter_songs(suggested_songs, socket.assigns.search_term)
    {:noreply, assign(socket, songs: filtered_songs, updating_song: nil)}
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

  defp tuning_options do
    [
      {"Standard", :standard},
      {"Drop D", :drop_d},
      {"E flat", :e_flat},
      {"Drop C#", :drop_c_sharp}
    ]
  end

  defp display_tuning(tuning) do
    case tuning do
      :standard -> "Standard"
      :drop_d -> "Drop D"
      :e_flat -> "E♭"
      :drop_c_sharp -> "Drop C#"
      _ -> "Standard"
    end
  end

  # defp status_color(:needs_learning), do: "bg-yellow-100 text-yellow-800"
  # defp status_color(:ready), do: "bg-green-100 text-green-800"
  # defp status_color(:performed), do: "bg-blue-100 text-blue-800"
  # defp status_color(:suggested), do: "bg-purple-100 text-purple-800"
end
