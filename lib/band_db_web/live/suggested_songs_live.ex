defmodule BandDbWeb.SuggestedSongsLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader
  import BandDbWeb.Components.SongForm

  alias BandDb.ServerLookup
  alias BandDb.Songs.SongServer
  alias BandDb.Accounts

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    band_id = socket.assigns.current_user.band_id

    case get_songs_for_band(band_id) do
      {:ok, songs, song_server} ->
        suggested_songs = Enum.filter(songs, & &1.status == :suggested)
        {:ok, assign(socket,
                     songs: suggested_songs,
                     search_term: "",
                     updating_song: nil,
                     show_modal: false,
                     show_edit_modal: false,
                     editing_song: nil,
                     band_id: band_id,
                     song_server: song_server,
                     error_message: nil)}

      {:error, reason} ->
        {:ok,
          socket
          |> assign(songs: [],
                   search_term: "",
                   updating_song: nil,
                   show_modal: false,
                   show_edit_modal: false,
                   editing_song: nil,
                   band_id: nil,
                   song_server: nil,
                   error_message: reason)}
    end
  end

  # Get songs for a band, handling the case where the band doesn't exist
  defp get_songs_for_band(nil), do: {:error, "Your user account is not associated with any band. Please contact an administrator."}
  defp get_songs_for_band(band_id) do
    # Check if the band exists first
    case Accounts.get_band(band_id) do
      nil ->
        {:error, "Band not found. Please contact an administrator."}
      _band ->
        # Now it's safe to get the song server since we know the band exists
        song_server = ServerLookup.get_song_server(band_id)
        try do
          songs = SongServer.list_songs(song_server)
          {:ok, songs, song_server}
        rescue
          _error in ArgumentError ->
            {:error, "Failed to load songs. Please try again later."}
          # Handle any other exceptions
          _ ->
            {:error, "Failed to load songs. Please try again later."}
        end
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
    if socket.assigns.song_server == nil do
      {:noreply, socket |> put_flash(:error, "Please select a band first")}
    else
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
        tuning,
        nil,
        socket.assigns.band_id,
        socket.assigns.song_server
      ) do
        {:ok, _song} ->
          songs = SongServer.list_songs(socket.assigns.song_server)
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
  end

  @impl true
  def handle_event("search", %{"search" => %{"term" => term}}, socket) do
    case socket.assigns.songs do
      nil ->
        {:noreply, socket}
      [] when socket.assigns.error_message != nil ->
        {:noreply, socket}
      songs ->
        filtered_songs = filter_songs(songs, term)
        {:noreply, assign(socket, songs: filtered_songs, search_term: term)}
    end
  end

  @impl true
  def handle_event("update_status", %{"title" => title, "value" => new_status}, socket) do
    if socket.assigns.song_server == nil do
      {:noreply, socket |> put_flash(:error, "Please select a band first")}
    else
      socket = assign(socket, updating_song: title)
      SongServer.update_song_status(title, String.to_existing_atom(new_status), socket.assigns.song_server)
      songs = SongServer.list_songs(socket.assigns.song_server)
      suggested_songs = Enum.filter(songs, & &1.status == :suggested)
      filtered_songs = filter_songs(suggested_songs, socket.assigns.search_term)
      {:noreply, assign(socket, songs: filtered_songs, updating_song: nil)}
    end
  end

  @impl true
  def handle_event("show_edit_modal", %{"title" => title}, socket) do
    song = Enum.find(socket.assigns.songs, & &1.title == title)
    {:noreply, assign(socket, show_edit_modal: true, editing_song: song)}
  end

  @impl true
  def handle_event("hide_edit_modal", _params, socket) do
    {:noreply, assign(socket, show_edit_modal: false, editing_song: nil)}
  end

  @impl true
  def handle_event("update_song", %{"song" => song_params}, socket) do
    if socket.assigns.song_server == nil do
      {:noreply, socket |> put_flash(:error, "Please select a band first")}
    else
      duration_seconds = case song_params["duration"] do
        "" -> nil
        nil -> nil
        duration_str ->
          [minutes_str, seconds_str] = String.split(duration_str, ":")
          String.to_integer(minutes_str) * 60 + String.to_integer(seconds_str)
      end

      status = String.to_existing_atom(song_params["status"])
      tuning = String.to_existing_atom(song_params["tuning"] || "standard")
      original_title = song_params["original_title"]

      case SongServer.update_song(original_title, %{
        title: song_params["title"],
        band_name: song_params["band_name"],
        duration: duration_seconds,
        notes: song_params["notes"],
        status: status,
        tuning: tuning,
        youtube_link: song_params["youtube_link"]
      }, socket.assigns.song_server) do
        {:ok, _song} ->
          songs = SongServer.list_songs(socket.assigns.song_server)
          suggested_songs = Enum.filter(songs, & &1.status == :suggested)
          filtered_songs = filter_songs(suggested_songs, socket.assigns.search_term)
          {:noreply,
            socket
            |> assign(songs: filtered_songs, show_edit_modal: false, editing_song: nil)
            |> put_flash(:info, "Song updated successfully")}

        {:error, :not_found} ->
          {:noreply,
            socket
            |> put_flash(:error, "Song not found")}
      end
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

  defp tuning_options do
    [
      {"Standard", :standard},
      {"Drop D", :drop_d},
      {"E flat", :e_flat},
      {"Drop C#", :drop_c_sharp}
    ]
  end



  defp status_color(:needs_learning), do: "bg-yellow-100 text-yellow-800"
  defp status_color(:needs_rehearsing), do: "bg-orange-100 text-orange-800"
  defp status_color(:ready), do: "bg-green-100 text-green-800"
  defp status_color(:performed), do: "bg-blue-100 text-blue-800"
  defp status_color(:suggested), do: "bg-purple-100 text-purple-800"
  defp status_color(_), do: "bg-gray-100 text-gray-800"
end
