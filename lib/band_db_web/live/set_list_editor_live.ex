defmodule BandDbWeb.SetListEditorLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader
  alias BandDb.Songs.SongServer
  alias BandDb.SetLists.{SetListServer, SetList, Set}

  @impl true
  def mount(_params, _session, socket) do
    # Filter out suggested and needs_learning songs
    songs = SongServer.list_songs()
    |> Enum.filter(fn song ->
      song.status in [:ready, :performed]
    end)

    set_lists = SetListServer.list_set_lists()
    new_set_list = %SetList{
      name: "",
      sets: [
        %Set{
          name: "Set 1",
          songs: [],
          duration: 0,
          break_duration: nil,
          set_order: 1
        }
      ],
      total_duration: 0
    }

    {:ok, assign(socket,
      songs: songs,
      set_lists: set_lists,
      new_set_list: new_set_list,
      num_sets: 1,
      show_song_selector: false,
      selected_set_index: 0,
      selected_song: nil,
      show_break_duration: false,
      break_duration: 0,
      show_save_modal: false
    )}
  end

  @impl true
  def handle_event("add_set", _params, socket) do
    if socket.assigns.num_sets < 3 do
      new_set = %Set{
        name: "Set #{socket.assigns.num_sets + 1}",
        songs: [],
        duration: 0,
        break_duration: nil,
        set_order: socket.assigns.num_sets + 1
      }

      new_sets = socket.assigns.new_set_list.sets ++ [new_set]
      new_set_list = %{socket.assigns.new_set_list | sets: new_sets}

      {:noreply, assign(socket,
        new_set_list: new_set_list,
        num_sets: socket.assigns.num_sets + 1
      )}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("remove_set", _params, socket) do
    if socket.assigns.num_sets > 1 do
      new_sets = List.delete_at(socket.assigns.new_set_list.sets, -1)
      new_set_list = %{socket.assigns.new_set_list | sets: new_sets}

      {:noreply, assign(socket,
        new_set_list: new_set_list,
        num_sets: socket.assigns.num_sets - 1
      )}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("toggle_break_duration", %{"set-index" => set_index}, socket) do
    set_index = String.to_integer(set_index)
    new_sets = List.update_at(socket.assigns.new_set_list.sets, set_index, fn set ->
      %{set | break_duration: if(set.break_duration, do: nil, else: 0)}
    end)

    new_set_list = %{socket.assigns.new_set_list | sets: new_sets}

    {:noreply, assign(socket, new_set_list: new_set_list)}
  end

  @impl true
  def handle_event("update_break_duration", %{"set-index" => set_index, "duration" => duration}, socket) do
    set_index = String.to_integer(set_index)
    duration = String.to_integer(duration)

    new_sets = List.update_at(socket.assigns.new_set_list.sets, set_index, fn set ->
      %{set | break_duration: duration}
    end)

    new_set_list = %{socket.assigns.new_set_list | sets: new_sets}

    {:noreply, assign(socket, new_set_list: new_set_list)}
  end

  @impl true
  def handle_event("toggle_song_selector", %{"set-index" => set_index}, socket) do
    {:noreply, assign(socket,
      show_song_selector: true,
      selected_set_index: String.to_integer(set_index)
    )}
  end

  @impl true
  def handle_event("select_song", %{"set-index" => set_index, "song-uuid" => song_uuid}, socket) do
    set_index = String.to_integer(set_index)
    song = Enum.find(socket.assigns.songs, &(&1.uuid == song_uuid))

    if song do
      # Extract the song duration for later use
      song_duration = song.duration || 0

      updated_sets = List.update_at(socket.assigns.new_set_list.sets, set_index, fn set ->
        # Add only the song title, not the entire struct
        %{set |
          songs: [song.title | set.songs],
          duration: (set.duration || 0) + song_duration
        }
      end)

      {:noreply, assign(socket,
        new_set_list: %{socket.assigns.new_set_list | sets: updated_sets},
        songs: socket.assigns.songs |> Enum.filter(&(&1.uuid != song_uuid))
      )}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("remove_from_set", %{"song-id" => song_id, "set-index" => set_index}, socket) do
    set_index = String.to_integer(set_index)

    # Find the song's duration from the full song list
    song = Enum.find(SongServer.list_songs(), &(&1.title == song_id))
    song_duration = if song, do: song.duration || 0, else: 0

    new_sets = List.update_at(socket.assigns.new_set_list.sets, set_index, fn set ->
      new_songs = List.delete(set.songs, song_id)
      # Subtract the song's duration from the set's duration
      new_duration = (set.duration || 0) - song_duration
      %{set | songs: new_songs, duration: new_duration}
    end)

    # Calculate total duration including breaks
    total_duration = Enum.reduce(new_sets, 0, fn set, acc ->
      set_duration = (set.duration || 0)
      break_duration = (set.break_duration || 0)
      acc + set_duration + break_duration
    end)

    new_set_list = %{socket.assigns.new_set_list |
      sets: new_sets,
      total_duration: total_duration
    }

    {:noreply, assign(socket, new_set_list: new_set_list)}
  end

  @impl true
  def handle_event("move_up", %{"song-id" => _song_id, "set-index" => set_index, "song-index" => song_index}, socket) do
    set_index = String.to_integer(set_index)
    song_index = String.to_integer(song_index)

    if song_index > 0 do
      new_sets = List.update_at(socket.assigns.new_set_list.sets, set_index, fn set ->
        songs = set.songs
        {song, songs} = List.pop_at(songs, song_index)
        songs = List.insert_at(songs, song_index - 1, song)
        %{set | songs: songs}
      end)

      new_set_list = %{socket.assigns.new_set_list | sets: new_sets}

      {:noreply, assign(socket, new_set_list: new_set_list)}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("move_down", %{"song-id" => _song_id, "set-index" => set_index, "song-index" => song_index}, socket) do
    set_index = String.to_integer(set_index)
    song_index = String.to_integer(song_index)

    new_sets = List.update_at(socket.assigns.new_set_list.sets, set_index, fn set ->
      songs = set.songs
      if song_index < length(songs) - 1 do
        {song, songs} = List.pop_at(songs, song_index)
        songs = List.insert_at(songs, song_index + 1, song)
        %{set | songs: songs}
      else
        set
      end
    end)

    new_set_list = %{socket.assigns.new_set_list | sets: new_sets}

    {:noreply, assign(socket, new_set_list: new_set_list)}
  end

  @impl true
  def handle_event("save_set_list", _params, socket) do
    new_set_list = socket.assigns.new_set_list

    # Create proper Set structs for each set
    sets = Enum.map(new_set_list.sets, fn set ->
      %Set{
        name: set.name,
        duration: set.duration,
        break_duration: set.break_duration,
        songs: set.songs
      }
    end)

    case SetListServer.add_set_list(new_set_list.name, sets) do
      :ok ->
        {:noreply,
         socket
         |> put_flash(:info, "Set list saved successfully!")
         |> push_navigate(to: ~p"/set-list")}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply,
         socket
         |> put_flash(:error, error_message_from_changeset(changeset))
         |> assign(:changeset, changeset)}

      {:error, message} when is_binary(message) ->
        {:noreply,
         socket
         |> put_flash(:error, message)}

      {:error, _} ->
        {:noreply,
         socket
         |> put_flash(:error, "Failed to save set list. Please try again.")}
    end
  end

  @impl true
  def handle_event("show_save_modal", _params, socket) do
    {:noreply, assign(socket, show_save_modal: true)}
  end

  @impl true
  def handle_event("hide_save_modal", _params, socket) do
    {:noreply, assign(socket, show_save_modal: false)}
  end

  @impl true
  def handle_event("update_name", %{"name" => name}, socket) do
    new_set_list = %{socket.assigns.new_set_list | name: name}
    {:noreply, assign(socket, new_set_list: new_set_list)}
  end

  @impl true
  def handle_info(:update, socket) do
    set_lists = SetListServer.list_set_lists()

    # Get all songs that are currently in any set
    used_song_titles = socket.assigns.new_set_list.sets
    |> Enum.flat_map(& &1.songs)
    |> MapSet.new()

    # Filter out songs that are already in sets
    songs = SongServer.list_songs()
    |> Enum.filter(fn song ->
      song.status in [:ready, :performed] and
      not MapSet.member?(used_song_titles, song.title)
    end)

    {:noreply, assign(socket, set_lists: set_lists, songs: songs)}
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

  defp get_band_name(song_title, songs) do
    case Enum.find(songs, &(&1.title == song_title)) do
      nil -> nil
      song -> song.band_name
    end
  end

  defp get_tuning(song_title, songs) do
    case Enum.find(songs, &(&1.title == song_title)) do
      nil -> nil
      song -> song.tuning
    end
  end

  defp error_message_from_changeset(%Ecto.Changeset{} = changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
    |> Enum.map(fn {field, errors} ->
      "#{Phoenix.Naming.humanize(field)} #{Enum.join(errors, ", ")}"
    end)
    |> Enum.join(". ")
  end
end
