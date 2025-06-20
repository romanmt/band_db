defmodule BandDbWeb.SongLive do
  use BandDbWeb, :live_view
  use BandDbWeb.Live.Lifecycle
  import BandDbWeb.Components.PageHeader
  import BandDbWeb.Components.SongForm

  alias BandDb.Songs.SongServer
  alias BandDb.ServerLookup

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    # Ensure the current user has a band association
    case socket.assigns.current_user do
      %{band_id: band_id, band: band} when not is_nil(band_id) ->
        # Get songs filtered by band_id - use ServerLookup
        song_server = ServerLookup.get_song_server(band_id)
        songs = SongServer.list_songs_by_band(band_id, song_server)
                |> Enum.reject(&(&1.status == :suggested))

        {:ok,
          socket
          |> assign(
            songs: songs,
            search_term: "",
            show_modal: false,
            updating_song: nil,
            show_edit_modal: false,
            editing_song: nil,
            edit_changeset: nil,
            show_bulk_import_modal: false,
            bulk_import_text: "",
            band_id: band_id,
            band_name: band.name,
            song_server: song_server
          )}

      _ ->
        # Handle case where band is not loaded or user has no band
        {:ok,
          socket
          |> assign(
            songs: [],
            search_term: "",
            show_modal: false,
            updating_song: nil,
            show_edit_modal: false,
            editing_song: nil,
            edit_changeset: nil,
            show_bulk_import_modal: false,
            bulk_import_text: ""
          )
          |> push_navigate(to: "/")}
    end
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

    # Only convert to atom if it's a string
    status = case song_params["status"] do
      status when is_binary(status) -> String.to_existing_atom(status)
      status -> status  # Already an atom
    end

    # Only convert to atom if it's a string
    tuning = case song_params["tuning"] do
      tuning when is_binary(tuning) -> String.to_existing_atom(tuning)
      tuning -> tuning  # Already an atom
    end

    song_server = ServerLookup.get_song_server(socket.assigns.band_id)
    case SongServer.add_song(
      song_params["title"],
      status,
      socket.assigns.band_name,
      duration_seconds,
      song_params["notes"],
      tuning,
      song_params["youtube_link"],
      socket.assigns.band_id,
      song_server
    ) do
      {:ok, _song} ->
        songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
                |> Enum.reject(&(&1.status == :suggested))
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
    song_server = ServerLookup.get_song_server(socket.assigns.band_id)
    filtered_songs = if term == "" do
      SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
      |> Enum.reject(&(&1.status == :suggested))
    else
      term = String.downcase(term)
      SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
      |> Enum.reject(&(&1.status == :suggested))
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

    # Always get a fresh song_server reference
    song_server = ServerLookup.get_song_server(socket.assigns.band_id)
    SongServer.update_song_status(title, String.to_existing_atom(new_status), socket.assigns.band_id, song_server)
    songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
            |> Enum.reject(&(&1.status == :suggested))

    # Reset the updating flag
    {:noreply, assign(socket, songs: songs, updating_song: nil)}
  end

  @impl true
  def handle_event("update_tuning", %{"title" => title, "value" => new_tuning}, socket) do
    # Mark this song as updating to avoid race conditions
    socket = assign(socket, updating_song: title)

    song_server = ServerLookup.get_song_server(socket.assigns.band_id)
    SongServer.update_song_tuning(title, String.to_existing_atom(new_tuning), socket.assigns.band_id, song_server)
    songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
            |> Enum.reject(&(&1.status == :suggested))

    # Reset the updating flag
    {:noreply, assign(socket, songs: songs, updating_song: nil)}
  end

  @impl true
  def handle_event("clear_search", _params, socket) do
    song_server = ServerLookup.get_song_server(socket.assigns.band_id)
    songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
            |> Enum.reject(&(&1.status == :suggested))
    {:noreply, assign(socket, songs: songs, search_term: "")}
  end

  @impl true
  def handle_event("show_edit_modal", %{"title" => title}, socket) do
    case Enum.find(socket.assigns.songs, &(&1.title == title)) do
      nil ->
        {:noreply, socket}
      song ->
        {:noreply, assign(socket, show_edit_modal: true, editing_song: song)}
    end
  end

  @impl true
  def handle_event("hide_edit_modal", _params, socket) do
    {:noreply, assign(socket, show_edit_modal: false, editing_song: nil)}
  end

  @impl true
  def handle_event("show_bulk_import_modal", _params, socket) do
    {:noreply, assign(socket, show_bulk_import_modal: true)}
  end

  @impl true
  def handle_event("hide_bulk_import_modal", _params, socket) do
    {:noreply, assign(socket, show_bulk_import_modal: false, bulk_import_text: "")}
  end

  @impl true
  def handle_event("update_bulk_import_text", %{"text" => text}, socket) do
    {:noreply, assign(socket, bulk_import_text: text)}
  end

  @impl true
  def handle_event("bulk_import_songs", _params, socket) do
    # Modify the bulk import to add the current band's ID to each song
    bulk_import_text = socket.assigns.bulk_import_text

    song_server = ServerLookup.get_song_server(socket.assigns.band_id)
    case SongServer.bulk_import_songs(bulk_import_text, socket.assigns.band_id, song_server) do
      {:ok, count} ->
        songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
                |> Enum.reject(&(&1.status == :suggested))
        {:noreply,
          socket
          |> assign(songs: songs, show_bulk_import_modal: false, bulk_import_text: "")
          |> put_flash(:info, "Successfully imported #{count} songs")}
      {:error, reason} ->
        {:noreply,
          socket
          |> put_flash(:error, "Failed to import songs: #{reason}")}
    end
  end

  @impl true
  def handle_event("update_song", %{"song" => song_params}, socket) do
    # Convert duration from MM:SS to seconds
    duration_seconds = case song_params["duration"] do
      "" -> nil
      nil -> nil
      duration_str ->
        [minutes_str, seconds_str] = String.split(duration_str, ":")
        String.to_integer(minutes_str) * 60 + String.to_integer(seconds_str)
    end

    # Only convert to atom if it's a string
    status = case song_params["status"] do
      status when is_binary(status) -> String.to_existing_atom(status)
      status -> status  # Already an atom
    end

    # Only convert to atom if it's a string
    tuning = case song_params["tuning"] do
      tuning when is_binary(tuning) -> String.to_existing_atom(tuning)
      tuning -> tuning  # Already an atom
    end

    original_title = song_params["original_title"]
    song_server = ServerLookup.get_song_server(socket.assigns.band_id)

    case SongServer.update_song(
      original_title,
      %{
        title: song_params["title"],
        band_name: song_params["band_name"],
        duration: duration_seconds,
        notes: song_params["notes"],
        status: status,
        tuning: tuning,
        youtube_link: song_params["youtube_link"]
      },
      socket.assigns.band_id,
      song_server
    ) do
      {:ok, _updated_song} ->
        songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
                |> Enum.reject(&(&1.status == :suggested))
        {:noreply,
          socket
          |> assign(songs: songs, show_edit_modal: false, editing_song: nil)
          |> put_flash(:info, "Song updated successfully")}

      :ok ->
        songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
                |> Enum.reject(&(&1.status == :suggested))
        {:noreply,
          socket
          |> assign(songs: songs, show_edit_modal: false, editing_song: nil)
          |> put_flash(:info, "Song updated successfully")}

      {:error, :not_found} ->
        {:noreply,
          socket
          |> put_flash(:error, "Song not found")}
    end
  end



  def format_duration(nil), do: ""
  def format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    :io_lib.format("~2..0B:~2..0B", [minutes, remaining_seconds])
  end

  def status_options do
    [
      {"Suggested", :suggested},
      {"Needs Learning", :needs_learning},
      {"Needs Rehearsing", :needs_rehearsing},
      {"Ready", :ready},
      {"Performed", :performed}
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
  def status_color(:needs_rehearsing), do: "bg-orange-100 text-orange-800"
  def status_color(:ready), do: "bg-green-100 text-green-800"
  def status_color(:performed), do: "bg-blue-100 text-blue-800"
  def status_color(:suggested), do: "bg-purple-100 text-purple-800"
  def status_color(_), do: "bg-gray-100 text-gray-800"

  def highlight_matches(text, search_term) when is_binary(text) and is_binary(search_term) and search_term != "" do
    regex = Regex.compile!(Regex.escape(String.downcase(search_term)), "i")
    Regex.replace(regex, text, fn match ->
      ~s|<mark class="bg-yellow-100 not-italic font-normal">#{match}</mark>|
    end)
  end
  def highlight_matches(text, _), do: text
end
