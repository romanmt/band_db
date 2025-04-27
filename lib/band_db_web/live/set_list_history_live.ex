defmodule BandDbWeb.SetListHistoryLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader
  alias BandDb.{SetLists.SetListServer, Songs.SongServer, ServerLookup, Accounts}
  import BandDbWeb.Components.ExpandableSection
  require Logger

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    # Get the band_id from the current_user
    band_id = socket.assigns.current_user.band_id

    case get_set_lists_for_band(band_id) do
      {:ok, set_lists, songs} ->
        expanded_sets = %{}
        {:ok, assign(socket,
                   set_lists: set_lists,
                   expanded_sets: expanded_sets,
                   songs: songs,
                   band_id: band_id,
                   set_list_server: ServerLookup.get_set_list_server(band_id),
                   song_server: ServerLookup.get_song_server(band_id),
                   error_message: nil)}

      {:error, reason} ->
        {:ok,
          socket
          |> assign(set_lists: [],
                   songs: [],
                   expanded_sets: %{},
                   band_id: nil,
                   set_list_server: nil,
                   song_server: nil,
                   error_message: reason)}
    end
  end

  # Get set lists for a band, handling the case where the band doesn't exist
  defp get_set_lists_for_band(nil), do: {:error, "Your user account is not associated with any band. Please contact an administrator."}
  defp get_set_lists_for_band(band_id) do
    # Check if the band exists first
    case Accounts.get_band(band_id) do
      nil ->
        {:error, "Band not found. Please contact an administrator."}
      _band ->
        # Now it's safe to get the servers since we know the band exists
        set_list_server = ServerLookup.get_set_list_server(band_id)
        song_server = ServerLookup.get_song_server(band_id)

        try do
          set_lists = SetListServer.list_set_lists(set_list_server)
          songs = SongServer.list_songs(song_server)
          {:ok, set_lists, songs}
        rescue
          error in ArgumentError ->
            Logger.error("Error getting set lists: #{inspect(error)}")
            []
          # Handle any other exceptions
          _ ->
            {:error, "Failed to load set lists. Please try again later."}
        end
    end
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
    if socket.assigns.set_list_server do
      set_lists = SetListServer.list_set_lists(socket.assigns.set_list_server)
      {:noreply, assign(socket, set_lists: set_lists)}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_info({:monitor_for_cleanup, _user}, socket) do
    # Just implement the handler to avoid warnings
    {:noreply, socket}
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

  defp get_band_name(song, songs) when is_map(song) do
    get_band_name(song.title, songs)
  end

  defp get_band_name(song_title, songs) when is_binary(song_title) do
    case Enum.find(songs, &(&1.title == song_title)) do
      nil -> nil
      song -> song.band_name
    end
  end

  # Helper function to safely get song title regardless of format
  defp get_song_title(song) when is_map(song), do: song.title
  defp get_song_title(song) when is_binary(song), do: song

  defp get_tuning(song, songs) when is_map(song) do
    # First try to get tuning directly from the song
    case song.tuning do
      nil -> get_tuning(song.title, songs)
      tuning -> tuning
    end
  end

  defp get_tuning(song_title, songs) when is_binary(song_title) do
    case Enum.find(songs, &(&1.title == song_title)) do
      nil -> nil
      song -> song.tuning
    end
  end
end
