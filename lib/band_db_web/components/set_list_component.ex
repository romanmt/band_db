defmodule BandDbWeb.Components.SetListComponent do
  use Phoenix.Component
  alias Phoenix.LiveView.JS
  import BandDbWeb.CoreComponents

  attr :set_list, :map, required: true
  attr :id, :string, required: true
  attr :show_header_actions, :boolean, default: true
  attr :show_calendar_details, :boolean, default: true

  def set_list(assigns) do
    ~H"""
    <div id={@id} class="card fade-in">
      <%= if @show_header_actions do %>
        <div class="card-header flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <div class="flex items-center gap-2">
              <.icon name="hero-musical-note" class="h-5 w-5 text-primary-500" />
              <h2 class="text-lg font-medium text-gray-900">
                <%= @set_list.name %>
              </h2>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="badge-primary">
              <%= length(@set_list.sets) %> <%= Inflex.inflect("set", length(@set_list.sets)) %>
            </span>
            <span class="badge-neutral">
              <%= format_duration(@set_list.total_duration) %>
            </span>
            <%= if @set_list.calendar_event_id do %>
              <span class="badge bg-blue-100 text-blue-800">
                <.icon name="hero-calendar" class="h-3 w-3 mr-1" />
                Scheduled
              </span>
            <% end %>
            <button
              phx-click={JS.dispatch("print", to: "##{@id}")}
              class="ml-2 text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Print"
            >
              <.icon name="hero-printer" class="h-5 w-5" />
            </button>
          </div>
        </div>
      <% end %>

      <div class="card-body">
        <div class="space-y-6">
          <%= if @show_calendar_details && Map.get(@set_list, :calendar_event_id) do %>
            <div class="bg-blue-50 rounded-md p-4 border border-blue-100 slide-in">
              <h3 class="text-lg font-semibold text-blue-800 flex items-center">
                <.icon name="hero-calendar" class="h-5 w-5 mr-2" />
                Scheduled Performance
              </h3>
              <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div class="text-sm text-gray-500 font-medium">Date</div>
                  <div class="text-gray-900"><%= if @set_list.date, do: Date.to_string(@set_list.date), else: "TBD" %></div>
                </div>
                <%= if @set_list.start_time && @set_list.end_time do %>
                  <div>
                    <div class="text-sm text-gray-500 font-medium">Time</div>
                    <div class="text-gray-900">
                      <%= Time.to_string(@set_list.start_time) %> - <%= Time.to_string(@set_list.end_time) %>
                    </div>
                  </div>
                <% end %>
                <%= if @set_list.location && @set_list.location != "" do %>
                  <div class="md:col-span-2">
                    <div class="text-sm text-gray-500 font-medium">Location</div>
                    <div class="text-gray-900"><%= @set_list.location %></div>
                  </div>
                <% end %>
              </div>
            </div>
          <% end %>

          <%= if is_list(@set_list.sets) do %>
            <%= for {set, index} <- Enum.with_index(@set_list.sets) do %>
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center border-b border-gray-200 pb-2">
                  <.icon name="hero-musical-note" class="h-5 w-5 mr-2 text-primary-500" />
                  <%= set.name %>
                  <span class="ml-2 text-sm text-gray-500">(<%= format_duration(set.duration) %>)</span>
                </h3>

                <div class="mt-4 table-container">
                  <table class="table-default">
                    <thead>
                      <tr>
                        <th scope="col" class="w-12">#</th>
                        <th scope="col">Song</th>
                        <th scope="col">Tuning</th>
                        <th scope="col" class="text-right">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <%= for {song, song_index} <- Enum.with_index(set.songs) do %>
                        <tr>
                          <td class="font-medium"><%= song_index + 1 %></td>
                          <td>
                            <div class="font-medium text-gray-900"><%= get_song_title(song) %></div>
                          </td>
                          <td><%= get_song_tuning(song) %></td>
                          <td class="text-right"><%= format_song_duration(song) %></td>
                        </tr>
                      <% end %>
                    </tbody>
                  </table>
                </div>

                <%= if set.break_duration && set.break_duration > 0 && index < length(@set_list.sets) - 1 do %>
                  <div class="mt-4 bg-gray-50 p-3 rounded-md text-center text-sm font-medium text-gray-500 border border-gray-100">
                    Break: <%= format_duration(set.break_duration) %>
                  </div>
                <% end %>
              </div>
            <% end %>
          <% else %>
            <div class="p-4 bg-yellow-50 text-yellow-700 rounded-md border border-yellow-100">
              <p class="flex items-center">
                <.icon name="hero-exclamation-triangle" class="h-5 w-5 mr-2" />
                No sets found or invalid set list format.
              </p>
            </div>
          <% end %>

          <div class="card-footer flex justify-between items-center mt-6">
            <div class="text-sm font-medium text-gray-700">Total Duration</div>
            <div class="text-lg font-semibold text-primary-700"><%= format_duration(@set_list.total_duration) %></div>
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp format_duration(nil), do: "00:00"
  defp format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    :io_lib.format("~2..0B:~2..0B", [minutes, remaining_seconds])
  end

  defp get_song_title(song) when is_binary(song), do: song
  defp get_song_title(%{title: title}), do: title
  defp get_song_title(song) when is_map(song), do: Map.get(song, :title, "Unknown Song")
  defp get_song_title(_), do: "Unknown Song"

  defp get_song_tuning(%{tuning: tuning}) when not is_nil(tuning), do: tuning
  defp get_song_tuning(%{tuning: _}), do: "Standard"
  defp get_song_tuning(_), do: "Standard"

  defp format_song_duration(%{duration: duration}) when not is_nil(duration), do: format_duration(duration)
  defp format_song_duration(_), do: "00:00"
end
