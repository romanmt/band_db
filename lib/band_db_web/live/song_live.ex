defmodule BandDbWeb.SongLive do
  use BandDbWeb, :live_view
  alias BandDb.{Song, SongServer}

  @impl true
  def mount(_params, _session, socket) do
    songs = SongServer.list_songs()
    {:ok, assign(socket,
      songs: songs,
      filtered_songs: songs,
      search_term: "",
      show_modal: false,
      expanded_sections: MapSet.new([:suggested]),  # Start with suggested songs expanded
      new_song: %{title: "", status: :needs_learning, band_name: "", duration: "", notes: ""}
    )}
  end

  @impl true
  def handle_event("add_song", %{"song" => song_params}, socket) do
    status = String.to_existing_atom(song_params["status"])
    duration = parse_duration(song_params["duration"])

    case SongServer.add_song(
      song_params["title"],
      status,
      song_params["band_name"],
      duration,
      song_params["notes"]
    ) do
      {:ok, _song} ->
        songs = SongServer.list_songs()
        {:noreply,
          socket
          |> assign(:songs, songs)
          |> assign(:filtered_songs, filter_songs(songs, socket.assigns.search_term))
          |> assign(:show_modal, false)
          |> put_flash(:info, "Song added successfully!")
          |> assign(:new_song, %{title: "", status: :needs_learning, band_name: "", duration: "", notes: ""})}

      {:error, :song_already_exists} ->
        {:noreply, put_flash(socket, :error, "Song already exists!")}
    end
  end

  @impl true
  def handle_event("show_modal", _, socket) do
    {:noreply, assign(socket, :show_modal, true)}
  end

  @impl true
  def handle_event("hide_modal", _, socket) do
    {:noreply, assign(socket, :show_modal, false)}
  end

  @impl true
  def handle_event("update_status", %{"title" => title, "status" => new_status}, socket) do
    status = String.to_existing_atom(new_status)
    case SongServer.update_song_status(title, status) do
      :ok ->
        songs = SongServer.list_songs()
        {:noreply,
          socket
          |> assign(:songs, songs)
          |> assign(:filtered_songs, filter_songs(songs, socket.assigns.search_term))
          |> put_flash(:info, "Status updated successfully!")}

      {:error, :not_found} ->
        {:noreply, put_flash(socket, :error, "Song not found!")}
    end
  end

  @impl true
  def handle_event("search", %{"search" => %{"term" => term}}, socket) do
    filtered_songs = filter_songs(socket.assigns.songs, term)
    {:noreply, assign(socket, filtered_songs: filtered_songs, search_term: term)}
  end

  @impl true
  def handle_event("toggle_section", %{"status" => status}, socket) do
    status = String.to_existing_atom(status)
    expanded_sections = socket.assigns.expanded_sections

    new_expanded_sections = if MapSet.member?(expanded_sections, status) do
      MapSet.delete(expanded_sections, status)
    else
      MapSet.put(expanded_sections, status)
    end

    {:noreply, assign(socket, :expanded_sections, new_expanded_sections)}
  end

  defp filter_songs(songs, search_term) do
    search_term = String.downcase(search_term)
    Enum.filter(songs, fn song ->
      String.contains?(String.downcase(song.title), search_term) ||
      String.contains?(String.downcase(song.band_name), search_term) ||
      (song.notes && String.contains?(String.downcase(song.notes), search_term))
    end)
  end

  def group_songs_by_status(songs) do
    songs
    |> Enum.group_by(& &1.status)
    |> Enum.sort_by(fn {status, _} -> status_order(status) end)
  end

  defp status_order(status) do
    case status do
      :suggested -> 0
      :needs_learning -> 1
      :needs_rehearsal -> 2
      :ready -> 3
      :performed -> 4
    end
  end

  def status_options do
    [
      {"Suggested", :suggested},
      {"Needs Learning", :needs_learning},
      {"Needs Rehearsal", :needs_rehearsal},
      {"Ready", :ready},
      {"Performed", :performed}
    ]
  end

  def status_color(status) do
    case status do
      :suggested -> "bg-purple-100 text-purple-800"
      :needs_learning -> "bg-red-100 text-red-800"
      :needs_rehearsal -> "bg-yellow-100 text-yellow-800"
      :ready -> "bg-blue-100 text-blue-800"
      :performed -> "bg-green-100 text-green-800"
    end
  end

  def section_expanded?(expanded_sections, status) do
    MapSet.member?(expanded_sections, status)
  end

  def format_duration(nil), do: ""
  def format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    :io_lib.format("~2..0B:~2..0B", [minutes, remaining_seconds])
  end

  defp parse_duration(""), do: nil
  defp parse_duration(duration_str) do
    case String.split(duration_str, ":") do
      [minutes, seconds] ->
        case {Integer.parse(minutes), Integer.parse(seconds)} do
          {{mins, ""}, {secs, ""}} when secs >= 0 and secs < 60 ->
            mins * 60 + secs
          _ -> nil
        end
      _ -> nil
    end
  end
end
