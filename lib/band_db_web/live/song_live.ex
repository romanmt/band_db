defmodule BandDbWeb.SongLive do
  use BandDbWeb, :live_view
  alias BandDb.{Song, SongServer}

  @impl true
  def mount(_params, _session, socket) do
    songs = SongServer.list_songs()
    {:ok, assign(socket, songs: songs, new_song: %{title: "", status: :needs_learning, notes: ""})}
  end

  @impl true
  def handle_event("add_song", %{"song" => song_params}, socket) do
    status = String.to_existing_atom(song_params["status"])
    case SongServer.add_song(song_params["title"], status, song_params["notes"]) do
      {:ok, _song} ->
        songs = SongServer.list_songs()
        {:noreply,
          socket
          |> assign(:songs, songs)
          |> put_flash(:info, "Song added successfully!")
          |> assign(:new_song, %{title: "", status: :needs_learning, notes: ""})}

      {:error, :song_already_exists} ->
        {:noreply, put_flash(socket, :error, "Song already exists!")}
    end
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
          |> put_flash(:info, "Status updated successfully!")}

      {:error, :not_found} ->
        {:noreply, put_flash(socket, :error, "Song not found!")}
    end
  end

  def status_options do
    [
      {"Needs Learning", :needs_learning},
      {"Needs Rehearsal", :needs_rehearsal},
      {"Ready", :ready},
      {"Performed", :performed}
    ]
  end

  def status_color(status) do
    case status do
      :needs_learning -> "bg-red-100 text-red-800"
      :needs_rehearsal -> "bg-yellow-100 text-yellow-800"
      :ready -> "bg-blue-100 text-blue-800"
      :performed -> "bg-green-100 text-green-800"
    end
  end
end
