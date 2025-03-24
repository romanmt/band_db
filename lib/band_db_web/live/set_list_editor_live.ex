defmodule BandDbWeb.SetListEditorLive do
  use BandDbWeb, :live_view
  alias BandDb.{SongServer, SetListServer}

  @impl true
  def mount(_params, _session, socket) do
    songs = SongServer.list_songs()
    # Get songs that are ready or have been performed
    available_songs = Enum.filter(songs, & &1.status in [:ready, :performed])
    # Sort by status (ready first) and title
    available_songs = Enum.sort_by(available_songs, & {if(&1.status == :ready, do: 0, else: 1), &1.title})

    {:ok, assign(socket,
      available_songs: available_songs,
      set_list: [],
      total_duration: 0,
      show_save_modal: false,
      set_list_name: "",
      drag_over: false,
      dragged_id: nil
    )}
  end

  @impl true
  def handle_event("dragstart", %{"id" => id}, socket) do
    IO.inspect("Dragstart event", label: "Dragstart")
    {:noreply, assign(socket, dragged_id: id)}
  end

  @impl true
  def handle_event("dragend", _params, socket) do
    IO.inspect("Dragend event", label: "Dragend")
    {:noreply, assign(socket, dragged_id: nil)}
  end

  @impl true
  def handle_event("dragover", _params, socket) do
    IO.inspect("Dragover event", label: "Dragover")
    {:noreply, assign(socket, drag_over: true)}
  end

  @impl true
  def handle_event("dragleave", _params, socket) do
    IO.inspect("Dragleave event", label: "Dragleave")
    {:noreply, assign(socket, drag_over: false)}
  end

  @impl true
  def handle_event("drop", %{"id" => id, "target" => target}, socket) do
    IO.inspect(%{id: id, target: target}, label: "Drop event")

    {source_list, target_list} = case target do
      "set-list" -> {:available_songs, :set_list}
      "available" -> {:set_list, :available_songs}
    end

    song = Enum.find(socket.assigns[source_list], & &1.title == id)

    if song do
      new_source = Enum.reject(socket.assigns[source_list], & &1.title == id)
      new_target = [song | socket.assigns[target_list]]

      total_duration = calculate_total_duration(new_target)

      {:noreply, assign(socket,
        available_songs: if(source_list == :available_songs, do: new_source, else: new_target),
        set_list: if(source_list == :set_list, do: new_source, else: new_target),
        total_duration: total_duration,
        drag_over: false,
        dragged_id: nil
      )}
    else
      {:noreply, assign(socket, drag_over: false, dragged_id: nil)}
    end
  end

  @impl true
  def handle_event("reorder", %{"id" => id, "target" => target}, socket) do
    song = Enum.find(socket.assigns.set_list, & &1.title == id)
    new_set_list = socket.assigns.set_list
      |> Enum.reject(& &1.title == id)
      |> List.insert_at(String.to_integer(target), song)

    {:noreply, assign(socket,
      set_list: new_set_list,
      total_duration: calculate_total_duration(new_set_list)
    )}
  end

  @impl true
  def handle_event("add_to_set", %{"song-id" => title}, socket) do
    song = Enum.find(socket.assigns.available_songs, & &1.title == title)
    if song do
      new_available = Enum.reject(socket.assigns.available_songs, & &1.title == title)
      new_set_list = socket.assigns.set_list ++ [song]
      new_total = calculate_total_duration(new_set_list)

      {:noreply, assign(socket,
        available_songs: new_available,
        set_list: new_set_list,
        total_duration: new_total
      )}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("remove_from_set", %{"song-id" => title}, socket) do
    song = Enum.find(socket.assigns.set_list, & &1.title == title)
    if song do
      new_set_list = Enum.reject(socket.assigns.set_list, & &1.title == title)
      new_available = [song | socket.assigns.available_songs]
        |> Enum.sort_by(& {if(&1.status == :ready, do: 0, else: 1), &1.title})
      new_total = calculate_total_duration(new_set_list)

      {:noreply, assign(socket,
        set_list: new_set_list,
        available_songs: new_available,
        total_duration: new_total
      )}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("move_up", %{"song-id" => title}, socket) do
    set_list = socket.assigns.set_list
    case Enum.find_index(set_list, & &1.title == title) do
      0 -> {:noreply, socket}  # Already at top
      nil -> {:noreply, socket}  # Not found
      index ->
        # Get the elements to swap
        current = Enum.at(set_list, index)
        previous = Enum.at(set_list, index - 1)
        # Replace both elements
        new_set_list = set_list
          |> List.replace_at(index - 1, current)
          |> List.replace_at(index, previous)
        {:noreply, assign(socket, set_list: new_set_list)}
    end
  end

  @impl true
  def handle_event("move_down", %{"song-id" => title}, socket) do
    set_list = socket.assigns.set_list
    case Enum.find_index(set_list, & &1.title == title) do
      nil -> {:noreply, socket}  # Not found
      index when index == length(set_list) - 1 -> {:noreply, socket}  # Already at bottom
      index ->
        # Get the elements to swap
        current = Enum.at(set_list, index)
        next = Enum.at(set_list, index + 1)
        # Replace both elements
        new_set_list = set_list
          |> List.replace_at(index, next)
          |> List.replace_at(index + 1, current)
        {:noreply, assign(socket, set_list: new_set_list)}
    end
  end

  @impl true
  def handle_event("show_save_modal", _, socket) do
    {:noreply, assign(socket, show_save_modal: true)}
  end

  @impl true
  def handle_event("hide_save_modal", _, socket) do
    {:noreply, assign(socket, show_save_modal: false)}
  end

  @impl true
  def handle_event("save_set_list", %{"name" => name}, socket) do
    SetListServer.save_set_list(name, socket.assigns.set_list, socket.assigns.total_duration)
    {:noreply,
      socket
      |> assign(show_save_modal: false)
      |> put_flash(:info, "Set list '#{name}' saved successfully")
      |> push_navigate(to: ~p"/set-list/history")}
  end

  defp calculate_total_duration(songs) do
    songs
    |> Enum.map(& &1.duration)
    |> Enum.reject(&is_nil/1)
    |> Enum.sum()
  end

  defp format_duration(nil), do: ""
  defp format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    :io_lib.format("~2..0B:~2..0B", [minutes, remaining_seconds])
  end

  defp status_color(:ready), do: "bg-green-100 text-green-800"
  defp status_color(:performed), do: "bg-blue-100 text-blue-800"
  defp status_color(:suggested), do: "bg-purple-100 text-purple-800"
end
