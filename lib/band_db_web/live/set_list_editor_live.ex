defmodule BandDbWeb.SetListEditorLive do
  use BandDbWeb, :live_view
  use BandDbWeb.Live.Lifecycle
  import BandDbWeb.Components.PageHeader
  alias BandDb.Songs.SongServer
  alias BandDb.SetLists.{SetListServer, SetList, Set}
  alias BandDb.Accounts.ServerLifecycle
  alias BandDb.ServerLookup
  require Logger

  @default_break_duration 900  # 15 minutes in seconds

  @impl true
  def mount(_params, _session, socket) do
    user = socket.assigns.current_user
    
    case user do
      %{band_id: band_id} when not is_nil(band_id) ->
        # Start band servers if needed
        ServerLifecycle.on_user_login(user)
        setup_cleanup(user)
        
        # Get server references
        song_server = ServerLookup.get_song_server(band_id)
        set_list_server = ServerLookup.get_set_list_server(band_id)
        
        # Filter out suggested and needs_learning songs
        songs = SongServer.list_songs(song_server)
        |> Enum.filter(fn song ->
          song.status in [:ready, :performed]
        end)

        set_lists = SetListServer.list_set_lists(set_list_server)
        
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
          band_id: band_id,
          song_server: song_server,
          set_list_server: set_list_server,
          songs: songs,
          set_lists: set_lists,
          new_set_list: new_set_list,
          num_sets: 1,
          show_song_selector: false,
          selected_set_index: 0,
          selected_song: nil,
          show_break_duration: false,
          break_duration: 0,
          show_save_modal: false,
          date: Date.utc_today(),
          should_schedule: false,
          start_time: ~T[19:00:00],
          end_time: ~T[22:00:00],
          location: "",
          has_calendar: BandDb.Calendar.calendar_available?(socket.assigns.current_user),
          show_calendar: false
        )}
        
      _ ->
        {:ok, 
          socket
          |> put_flash(:error, "You must be associated with a band to create set lists")
          |> push_navigate(to: ~p"/")
        }
    end
  end

  @impl true
  def handle_event("add_set", _params, socket) do
    if socket.assigns.num_sets < 3 do
      # First, ensure the previous set has a break duration
      new_sets = if socket.assigns.num_sets > 0 do
        # Update the last set to have a default break duration of 15 minutes if not already set
        List.update_at(socket.assigns.new_set_list.sets, socket.assigns.num_sets - 1, fn set ->
          if set.break_duration == nil do
            %{set | break_duration: @default_break_duration}
          else
            set
          end
        end)
      else
        socket.assigns.new_set_list.sets
      end

      # Then add the new set
      new_set = %Set{
        name: "Set #{socket.assigns.num_sets + 1}",
        songs: [],
        duration: 0,
        break_duration: nil,
        set_order: socket.assigns.num_sets + 1
      }

      new_sets = new_sets ++ [new_set]
      total_duration = recalculate_total_duration(new_sets)
      new_set_list = %{socket.assigns.new_set_list |
        sets: new_sets,
        total_duration: total_duration
      }

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
      total_duration = recalculate_total_duration(new_sets)
      new_set_list = %{socket.assigns.new_set_list |
        sets: new_sets,
        total_duration: total_duration
      }

      {:noreply, assign(socket,
        new_set_list: new_set_list,
        num_sets: socket.assigns.num_sets - 1
      )}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("toggle_song_selector", %{"set-index" => set_index}, socket) do
    {:noreply, assign(socket,
      show_song_selector: true,
      selected_set_index: String.to_integer(set_index)
    )}
  end

  @impl true
  def handle_event("hide_song_selector", _, socket) do
    {:noreply, assign(socket, show_song_selector: false)}
  end

  @impl true
  def handle_event("select_song", %{"set-index" => set_index, "song-uuid" => song_uuid}, socket) do
    set_index = String.to_integer(set_index)
    song = Enum.find(socket.assigns.songs, &(&1.uuid == song_uuid))

    if song do
      # Extract the song duration for later use
      song_duration = song.duration || 0

      # Store song info as a map with title, tuning, and duration
      song_info = %{
        title: song.title,
        tuning: song.tuning,
        duration: song.duration
      }

      updated_sets = List.update_at(socket.assigns.new_set_list.sets, set_index, fn set ->
        # Add song info map instead of just the title
        %{set |
          songs: [song_info | set.songs],
          duration: (set.duration || 0) + song_duration
        }
      end)

      # Calculate total duration including breaks
      total_duration = recalculate_total_duration(updated_sets)

      {:noreply, assign(socket,
        new_set_list: %{socket.assigns.new_set_list |
          sets: updated_sets,
          total_duration: total_duration
        },
        songs: socket.assigns.songs |> Enum.filter(&(&1.uuid != song_uuid))
      )}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("remove_from_set", %{"song-id" => song_id, "set-index" => set_index}, socket) do
    set_index = String.to_integer(set_index)
    song_id = String.to_integer(song_id)

    # Get the song info from the set
    set = Enum.at(socket.assigns.new_set_list.sets, set_index)
    song_info = Enum.at(set.songs, song_id)
    
    # Extract duration from stored song info
    song_duration = case song_info do
      %{duration: duration} when is_number(duration) -> duration || 0
      _ -> 0  # Fallback for legacy data without duration
    end

    new_sets = List.update_at(socket.assigns.new_set_list.sets, set_index, fn set ->
      # Remove song at the given index
      new_songs = List.delete_at(set.songs, song_id)
      # Subtract the song's duration from the set's duration
      new_duration = (set.duration || 0) - song_duration
      %{set | songs: new_songs, duration: new_duration}
    end)

    # Calculate total duration including breaks
    total_duration = recalculate_total_duration(new_sets)

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

      total_duration = recalculate_total_duration(new_sets)
      new_set_list = %{socket.assigns.new_set_list |
        sets: new_sets,
        total_duration: total_duration
      }

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

    total_duration = recalculate_total_duration(new_sets)
    new_set_list = %{socket.assigns.new_set_list |
      sets: new_sets,
      total_duration: total_duration
    }

    {:noreply, assign(socket, new_set_list: new_set_list)}
  end

  @impl true
  def handle_event("reorder_song", %{"song_id" => song_id_str, "old_index" => old_index_str,
                                      "new_index" => new_index_str, "set_index" => set_index_str}, socket) do
    # Convert string values to integers
    _song_id = if is_binary(song_id_str), do: String.to_integer(song_id_str), else: song_id_str
    old_index = if is_binary(old_index_str), do: String.to_integer(old_index_str), else: old_index_str
    new_index = if is_binary(new_index_str), do: String.to_integer(new_index_str), else: new_index_str
    set_index = if is_binary(set_index_str), do: String.to_integer(set_index_str), else: set_index_str

    # Update the song order in the set
    new_sets = List.update_at(socket.assigns.new_set_list.sets, set_index, fn set ->
      songs = set.songs
      # Remove the song from its old position
      {song, songs} = List.pop_at(songs, old_index)
      # Insert the song at its new position
      songs = List.insert_at(songs, new_index, song)
      %{set | songs: songs}
    end)

    total_duration = recalculate_total_duration(new_sets)
    new_set_list = %{socket.assigns.new_set_list |
      sets: new_sets,
      total_duration: total_duration
    }

    {:noreply, assign(socket, new_set_list: new_set_list)}
  end

  @impl true
  def handle_event("save_set_list", _params, socket) do
    new_set_list = socket.assigns.new_set_list
    _date = socket.assigns.date  # Variable not used, prefix with underscore

    # Create proper Set structs for each set
    sets = Enum.map(new_set_list.sets, fn set ->
      %Set{
        name: set.name,
        duration: set.duration,
        break_duration: set.break_duration,
        songs: set.songs
      }
    end)

    case SetListServer.add_set_list(socket.assigns.set_list_server, new_set_list.name, sets) do
      :ok ->
        # If scheduling is enabled and connected to calendar, create calendar event
        if socket.assigns.should_schedule && socket.assigns.has_calendar do
          user = socket.assigns.current_user

          # Create calendar event with deep link to this specific set list
            app_url = BandDbWeb.Endpoint.url()
            set_list_url = "#{app_url}/set-list/#{URI.encode(new_set_list.name)}"

            # Format song list for description
            song_list = new_set_list.sets
            |> Enum.flat_map(fn set ->
              songs = Enum.map(set.songs, fn song ->
                if is_map(song), do: song.title, else: song
              end)
              ["#{set.name}:"] ++ songs ++ [""]
            end)
            |> Enum.join("\n")

            # Use plain text for better compatibility
            description = """
            #{new_set_list.name} set list includes #{Enum.count(new_set_list.sets)} sets with a total of #{Enum.sum(Enum.map(new_set_list.sets, fn set -> length(set.songs) end))} songs.

            #{song_list}
            """

            # Format date if needed
            date_str = socket.assigns.date
            {:ok, date} = if is_binary(date_str), do: Date.from_iso8601(date_str), else: {:ok, date_str}

            event_params = %{
              title: "Show: #{new_set_list.name}",
              description: description,
              location: socket.assigns.location,
              date: date,
              start_time: socket.assigns.start_time,
              end_time: socket.assigns.end_time,
              event_type: "show",
              set_list_name: new_set_list.name,
              source_url: set_list_url,
              source_title: "View Set List in BandDb"
            }

            # Log the event params
            Logger.debug("Create event with params: #{inspect(event_params)}")

            case BandDb.Calendar.create_calendar_event(user, event_params) do
              {:ok, event_id} ->
                # Update set list with event info (using a map with key as set list name)
                SetListServer.update_set_list(socket.assigns.set_list_server, new_set_list.name, %{
                  sets: sets,
                  date: socket.assigns.date,
                  start_time: socket.assigns.start_time,
                  end_time: socket.assigns.end_time,
                  location: socket.assigns.location,
                  calendar_event_id: event_id
                })

                {:noreply,
                  socket
                  |> put_flash(:info, "Set list saved and added to calendar")
                  |> push_navigate(to: ~p"/set-list")}

              {:error, reason} ->
                # Set list saved but calendar event failed
                {:noreply,
                  socket
                  |> put_flash(:error, "Set list saved but calendar event failed: #{reason}")
                  |> push_navigate(to: ~p"/set-list")}
            end
        else
          {:noreply,
            socket
            |> put_flash(:info, "Set list saved successfully!")
            |> push_navigate(to: ~p"/set-list")}
        end

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
  def handle_event("toggle_scheduling", _, socket) do
    {:noreply, assign(socket, should_schedule: !socket.assigns.should_schedule)}
  end

  @impl true
  def handle_event("update_form", params, socket) do
    # Extract date from params, default to existing value if not present
    date = case params do
      %{"date" => d} when is_binary(d) and d != "" ->
        Date.from_iso8601!(d)
      _ ->
        socket.assigns.date
    end

    start_time = case params do
      %{"start_time" => time} when time != "" ->
        Time.from_iso8601!(time)
      _ ->
        socket.assigns.start_time
    end

    end_time = case params do
      %{"end_time" => time} when time != "" ->
        Time.from_iso8601!(time)
      _ ->
        socket.assigns.end_time
    end

    location = Map.get(params, "location", socket.assigns.location)

    {:noreply, assign(socket,
      date: date,
      start_time: start_time,
      end_time: end_time,
      location: location
    )}
  end

  @impl true
  def handle_event("toggle_calendar_event", _params, socket) do
    {:noreply, socket |> assign(:show_calendar, !socket.assigns.show_calendar)}
  end

  @impl true
  def handle_event("update_title", %{"title" => title}, socket) do
    {:noreply, assign(socket, :title, title)}
  end

  @impl true
  def handle_event("add_to_calendar", _params, socket) do
    user = socket.assigns.current_user
    set_list = socket.assigns.new_set_list

    # Check if user has calendar available
    if BandDb.Calendar.calendar_available?(user) do
      # Format the date for Google Calendar
          date_str = socket.assigns.date
          {:ok, date} = if is_binary(date_str), do: Date.from_iso8601(date_str), else: {:ok, date_str}

          # Prepare times
          start_time = socket.assigns.start_time
          end_time = socket.assigns.end_time

          # Prepare title
          title = if socket.assigns[:title] && socket.assigns.title != "", do: socket.assigns.title, else: "Show: #{set_list.name}"

          # Generate a description with the songs
          description = generate_calendar_description(set_list)

          # Create deep link URL to the specific set list
          app_url = BandDbWeb.Endpoint.url()
          set_list_url = "#{app_url}/set-list/#{URI.encode(set_list.name)}"

          # Add the event to Google Calendar
          event_params = %{
            title: title,
            description: description,
            location: socket.assigns.location,
            date: date,
            start_time: start_time,
            end_time: end_time,
            event_type: "show",
            set_list_name: set_list.name,
            source_url: set_list_url,
            source_title: "View Set List in BandDb"
          }

          # Log the event params
          Logger.debug("Create event with params: #{inspect(event_params)}")
          Logger.debug("Event includes set_list_name: #{event_params.set_list_name}")

          case BandDb.Calendar.create_calendar_event(user, event_params) do
            {:ok, _event} ->
              {:noreply, socket
                |> assign(:show_calendar, false)
                |> put_flash(:info, "Event added to calendar successfully.")}

            {:error, reason} ->
              Logger.error("Failed to add event to calendar: #{inspect(reason)}")
              {:noreply, socket |> put_flash(:error, "Failed to add event to calendar.")}
          end
    else
      {:noreply, socket |> put_flash(:error, "No calendar configured. Please set up your calendar first.")}
    end
  end

  @impl true
  def handle_info(:update, socket) do
    set_lists = SetListServer.list_set_lists(socket.assigns.set_list_server)

    # Get all songs that are currently in any set
    used_song_titles = socket.assigns.new_set_list.sets
    |> Enum.flat_map(fn set ->
      Enum.map(set.songs, fn song ->
        if is_map(song), do: song.title, else: song
      end)
    end)
    |> MapSet.new()

    # Filter out songs that are already in sets
    songs = SongServer.list_songs(socket.assigns.song_server)
    |> Enum.filter(fn song ->
      song.status in [:ready, :performed] and
      not MapSet.member?(used_song_titles, song.title)
    end)

    {:noreply, assign(socket, set_lists: set_lists, songs: songs)}
  end

  @impl true
  def handle_info({:sets_updated, _sets}, socket) do
    # Not currently doing anything with this message
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

  defp get_song_title(song) do
    cond do
      is_map(song) and Map.has_key?(song, :title) -> song.title
      is_binary(song) -> song
      true -> nil
    end
  end

  defp get_song_tuning(song) do
    cond do
      is_map(song) and Map.has_key?(song, :tuning) -> song.tuning
      true -> nil
    end
  end

  defp get_band_name(song, songs) do
    song_title = get_song_title(song)
    case Enum.find(songs, &(&1.title == song_title)) do
      nil -> nil
      song -> song.band_name
    end
  end

  defp get_tuning(song, songs) do
    # First try to get tuning directly from the song data
    tuning = get_song_tuning(song)
    if tuning, do: tuning, else: do_get_tuning(song, songs)
  end

  defp do_get_tuning(song, songs) do
    song_title = get_song_title(song)
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

  defp recalculate_total_duration(sets) do
    Enum.reduce(sets, 0, fn set, acc ->
      set_duration = (set.duration || 0)
      break_duration = (set.break_duration || 0)
      acc + set_duration + break_duration
    end)
  end

  defp generate_calendar_description(set_list) do
    sets_descriptions = Enum.map_join(set_list.sets, "\n\n", fn set ->
      songs = Enum.map_join(set.songs, "\n", fn song ->
        "- #{get_song_title(song)}"
      end)

      "#{set.name}:\n#{songs}"
    end)

    "Set List: #{set_list.name}\n\nTotal Duration: #{format_duration(set_list.total_duration)}\n\n#{sets_descriptions}"
  end
end
