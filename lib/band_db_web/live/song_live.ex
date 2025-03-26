defmodule BandDbWeb.SongLive do
  use BandDbWeb, :live_view
  alias BandDb.{SongServer, Song}

  @impl true
  def mount(_params, _session, socket) do
    songs = SongServer.list_songs()
    {:ok,
      socket
      |> assign(
        songs: songs,
        search_term: "",
        show_modal: false,
        expanded_sections: %{},
        updating_song: nil
      )}
  end

  @impl true
  def handle_event("toggle_section", %{"status" => status}, socket) do
    status = String.to_existing_atom(status)
    expanded_sections = Map.update(
      socket.assigns.expanded_sections,
      status,
      true,
      &(not &1)
    )
    {:noreply, assign(socket, expanded_sections: expanded_sections)}
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
        {:noreply,
          socket
          |> assign(songs: songs, show_modal: false)
          |> put_flash(:info, "Song added successfully")}

      {:error, :song_already_exists} ->
        {:noreply,
          socket
          |> put_flash(:error, "A song with that title already exists")}
    end
  end

  @impl true
  def handle_event("search", %{"search" => %{"term" => term}}, socket) do
    filtered_songs = if term == "" do
      SongServer.list_songs()
    else
      term = String.downcase(term)

      SongServer.list_songs()
      |> Enum.filter(fn song ->
        String.contains?(String.downcase(song.title), term) ||
        String.contains?(String.downcase(song.band_name), term) ||
        (song.notes && String.contains?(String.downcase(song.notes), term))
      end)
    end

    {:noreply, assign(socket, songs: filtered_songs, search_term: term)}
  end

  @impl true
  def handle_event("update_status", %{"title" => title, "value" => new_status}, socket) do
    # Mark this song as updating to avoid race conditions
    socket = assign(socket, updating_song: title)

    # Update the status
    SongServer.update_song_status(title, String.to_existing_atom(new_status))

    # Get updated song list
    songs = SongServer.list_songs()

    # Reset the updating flag
    {:noreply, assign(socket, songs: songs, updating_song: nil)}
  end

  @impl true
  def handle_event("update_tuning", %{"title" => title, "value" => new_tuning}, socket) do
    # Mark this song as updating to avoid race conditions
    socket = assign(socket, updating_song: title)

    # Update the tuning
    SongServer.update_song_tuning(title, String.to_existing_atom(new_tuning))

    # Get updated song list
    songs = SongServer.list_songs()

    # Reset the updating flag
    {:noreply, assign(socket, songs: songs, updating_song: nil)}
  end

  def section_expanded?(expanded_sections, status) do
    Map.get(expanded_sections, status, false)
  end

  def group_songs_by_status(songs) do
    songs
    |> Enum.group_by(& &1.status)
    |> Enum.sort_by(fn {status, _} ->
      case status do
        :needs_learning -> 0
        :needs_rehearsal -> 1
        :ready -> 2
        :performed -> 3
        :suggested -> 4
        _ -> 5
      end
    end)
  end

  def format_duration(nil), do: ""
  def format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    :io_lib.format("~2..0B:~2..0B", [minutes, remaining_seconds])
  end

  def status_options do
    [
      {"Needs Learning", :needs_learning},
      {"Ready", :ready},
      {"Performed", :performed},
      {"Suggested", :suggested}
    ]
  end

  def tuning_options do
    [
      {"Standard", :standard},
      {"Drop D", :drop_d},
      {"E flat", :e_flat},
      {"Drop C#", :drop_c_sharp}
    ]
  end

  def display_tuning(tuning) do
    case tuning do
      :standard -> "Standard"
      :drop_d -> "Drop D"
      :e_flat -> "E♭"
      :drop_c_sharp -> "Drop C#"
      _ -> "Standard"
    end
  end

  def status_color(:needs_learning), do: "bg-yellow-100 text-yellow-800"
  def status_color(:ready), do: "bg-green-100 text-green-800"
  def status_color(:performed), do: "bg-blue-100 text-blue-800"
  def status_color(:suggested), do: "bg-purple-100 text-purple-800"
  def status_color(_), do: "bg-gray-100 text-gray-800"
end
