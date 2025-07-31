defmodule BandDbWeb.SongLive do
  use BandDbWeb, :live_view
  use BandDbWeb.Live.Lifecycle
  import BandDbWeb.Components.PageHeader
  import BandDbWeb.Components.SongForm
  import BandDbWeb.CoreComponents

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
                |> filter_songs_by_tab("accepted")

        # Load column preferences for the default tab
        visible_columns = SongServer.get_column_preferences(band_id, "accepted", song_server)

        socket = socket
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
            song_server: song_server,
            tab: "accepted",
            visible_columns: visible_columns,
            show_settings_menu: false,
            show_delete_modal: false,
            deleting_song: nil
          )
        
        # Schedule grid configuration after mount
        Process.send_after(self(), :configure_grid, 100)
        
        {:ok, socket}

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
            bulk_import_text: "",
            tab: "accepted",
            show_delete_modal: false,
            deleting_song: nil
          )
          |> push_navigate(to: "/")}
    end
  end

  @impl true
  def handle_event("switch_tab", %{"tab" => tab}, socket) do
    song_server = ServerLookup.get_song_server(socket.assigns.band_id)
    songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
            |> filter_songs_by_tab(tab)
    
    # Load column preferences for the new tab
    visible_columns = SongServer.get_column_preferences(socket.assigns.band_id, tab, song_server)
    
    {:noreply, 
      socket
      |> assign(tab: tab, songs: songs, search_term: "", visible_columns: visible_columns)
      |> push_event("update-grid-data", %{rowData: prepare_grid_data(songs)})
      |> push_event("update-column-visibility", %{columns: visible_columns})}
  end

  @impl true
  def handle_event("show_song_modal", _params, socket) do
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
                |> filter_songs_by_tab(socket.assigns.tab)
        {:noreply,
          socket
          |> assign(songs: songs, show_modal: false)
          |> push_event("update-grid-data", %{rowData: prepare_grid_data(songs)})
          |> put_flash(:info, "Song added successfully")}

      {:error, :song_already_exists} ->
        {:noreply,
          socket
          |> put_flash(:error, "A song with that title already exists")}
    end
  end

  @impl true
  def handle_event("search", %{"search" => %{"term" => term}}, socket) do
    # With AG Grid, we use the quick filter for simple text search
    {:noreply, 
      socket
      |> assign(search_term: term)
      |> push_event("update-quick-filter", %{quickFilterText: term})}
  end

  @impl true
  def handle_event("update_status", %{"title" => title, "value" => new_status}, socket) do
    # Mark this song as updating to avoid race conditions
    socket = assign(socket, updating_song: title)

    # Always get a fresh song_server reference
    song_server = ServerLookup.get_song_server(socket.assigns.band_id)
    SongServer.update_song_status(title, String.to_existing_atom(new_status), socket.assigns.band_id, song_server)
    songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
            |> filter_songs_by_tab(socket.assigns.tab)

    # Reset the updating flag and update grid
    {:noreply, 
      socket
      |> assign(songs: songs, updating_song: nil)
      |> push_event("update-grid-data", %{rowData: prepare_grid_data(songs)})}
  end

  @impl true
  def handle_event("update_tuning", %{"title" => title, "value" => new_tuning}, socket) do
    # Mark this song as updating to avoid race conditions
    socket = assign(socket, updating_song: title)

    song_server = ServerLookup.get_song_server(socket.assigns.band_id)
    SongServer.update_song_tuning(title, String.to_existing_atom(new_tuning), socket.assigns.band_id, song_server)
    songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
            |> filter_songs_by_tab(socket.assigns.tab)

    # Reset the updating flag
    {:noreply, assign(socket, songs: songs, updating_song: nil)}
  end

  @impl true
  def handle_event("clear_search", _params, socket) do
    song_server = ServerLookup.get_song_server(socket.assigns.band_id)
    songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
            |> filter_songs_by_tab(socket.assigns.tab)
    {:noreply, 
      socket
      |> assign(songs: songs, search_term: "")
      |> push_event("update-quick-filter", %{quickFilterText: ""})}
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
                |> filter_songs_by_tab(socket.assigns.tab)
        {:noreply,
          socket
          |> assign(songs: songs, show_bulk_import_modal: false, bulk_import_text: "")
          |> push_event("update-grid-data", %{rowData: prepare_grid_data(songs)})
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
                |> filter_songs_by_tab(socket.assigns.tab)
        {:noreply,
          socket
          |> assign(songs: songs, show_edit_modal: false, editing_song: nil)
          |> push_event("update-grid-data", %{rowData: prepare_grid_data(songs)})
          |> put_flash(:info, "Song updated successfully")}

      :ok ->
        songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
                |> filter_songs_by_tab(socket.assigns.tab)
        {:noreply,
          socket
          |> assign(songs: songs, show_edit_modal: false, editing_song: nil)
          |> push_event("update-grid-data", %{rowData: prepare_grid_data(songs)})
          |> put_flash(:info, "Song updated successfully")}

      {:error, :not_found} ->
        {:noreply,
          socket
          |> put_flash(:error, "Song not found")}
    end
  end

  @impl true
  def handle_event("row-clicked", %{"title" => title, "band_id" => band_id}, socket) do
    case Enum.find(socket.assigns.songs, &(&1.title == title && &1.band_id == band_id)) do
      nil ->
        {:noreply, socket}
      song ->
        {:noreply, assign(socket, show_edit_modal: true, editing_song: song)}
    end
  end

  @impl true
  def handle_event("toggle_column", %{"column" => column}, socket) do
    visible_columns = Map.update!(socket.assigns.visible_columns, column, &(!&1))
    
    # Save the preferences for the current tab
    song_server = ServerLookup.get_song_server(socket.assigns.band_id)
    SongServer.save_column_preferences(socket.assigns.band_id, socket.assigns.tab, visible_columns, song_server)
    
    {:noreply,
      socket
      |> assign(visible_columns: visible_columns)
      |> push_event("toggle-column", %{column: column, visible: visible_columns[column]})}
  end

  @impl true
  def handle_event("toggle_settings_menu", _params, socket) do
    {:noreply, assign(socket, show_settings_menu: !socket.assigns.show_settings_menu)}
  end

  @impl true
  def handle_event("close_settings_menu", _params, socket) do
    {:noreply, assign(socket, show_settings_menu: false)}
  end

  @impl true
  def handle_event("show_delete_modal", %{"title" => title}, socket) do
    case Enum.find(socket.assigns.songs, &(&1.title == title)) do
      nil ->
        {:noreply, socket}
      song ->
        {:noreply, assign(socket, show_delete_modal: true, deleting_song: song)}
    end
  end

  @impl true
  def handle_event("hide_delete_modal", _params, socket) do
    {:noreply, assign(socket, show_delete_modal: false, deleting_song: nil)}
  end

  @impl true
  def handle_event("delete_song", %{"title" => title}, socket) do
    song_server = ServerLookup.get_song_server(socket.assigns.band_id)
    
    case SongServer.delete_song(title, socket.assigns.band_id, song_server) do
      :ok ->
        songs = SongServer.list_songs_by_band(socket.assigns.band_id, song_server)
                |> filter_songs_by_tab(socket.assigns.tab)
        {:noreply,
          socket
          |> assign(songs: songs, show_delete_modal: false, deleting_song: nil)
          |> push_event("update-grid-data", %{rowData: prepare_grid_data(songs)})
          |> put_flash(:info, "Song deleted successfully")}
      
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

  defp filter_songs_by_tab(songs, "suggested") do
    Enum.filter(songs, &(&1.status == :suggested))
  end
  defp filter_songs_by_tab(songs, _) do
    # Default to "accepted" tab - show all non-suggested songs
    Enum.reject(songs, &(&1.status == :suggested))
  end

  
  @impl true
  def handle_info(:configure_grid, socket) do
    socket = configure_ag_grid(socket, socket.assigns.songs)
    # Apply saved column visibility
    {:noreply, push_event(socket, "update-column-visibility", %{columns: socket.assigns.visible_columns})}
  end

  defp configure_ag_grid(socket, songs) do
    grid_options = %{
      columnDefs: [
        %{
          field: "title",
          headerName: "Title",
          filter: true,
          sortable: true,
          resizable: true,
          flex: 2,
          cellRenderer: "agAnimateShowChangeCellRenderer",
          suppressMenu: false
        },
        %{
          field: "band_name",
          headerName: "Band",
          filter: true,
          sortable: true,
          resizable: true,
          flex: 1
        },
        %{
          field: "status",
          headerName: "Status",
          filter: true,
          sortable: true,
          resizable: true,
          width: 180,
          cellRenderer: "statusCellRenderer"
        },
        %{
          field: "tuning",
          headerName: "Tuning",
          filter: true,
          sortable: true,
          resizable: true,
          width: 130,
          valueFormatter: "tuningFormatter"
        },
        %{
          field: "duration",
          headerName: "Duration",
          filter: true,
          sortable: true,
          resizable: true,
          width: 110,
          valueFormatter: "durationFormatter"
        },
        %{
          field: "notes",
          headerName: "Notes",
          filter: true,
          sortable: true,
          resizable: true,
          flex: 2,
          wrapText: true
        },
        %{
          field: "actions",
          headerName: "Actions",
          width: 100,
          sortable: false,
          filter: false,
          cellRenderer: "actionsCellRenderer",
          cellRendererParams: %{
            hasNotes: false,
            hasYoutubeLink: true
          }
        }
      ],
      rowData: prepare_grid_data(songs),
      defaultColDef: %{
        filter: true,
        sortable: true,
        resizable: true
      },
      animateRows: true,
      rowSelection: "single",
      enableCellTextSelection: true,
      ensureDomOrder: true,
      suppressRowClickSelection: true,
      quickFilterText: "",
      cacheQuickFilter: true,
      onRowClicked: nil  # Will be set in JavaScript
    }

    push_event(socket, "load-grid", grid_options)
  end

  defp prepare_grid_data(songs) do
    Enum.map(songs, fn song ->
      %{
        title: song.title,
        band_name: song.band_name,
        status: Atom.to_string(song.status),
        tuning: Atom.to_string(song.tuning),
        duration: song.duration,
        notes: song.notes,
        youtube_link: song.youtube_link,
        band_id: song.band_id
      }
    end)
  end
end
