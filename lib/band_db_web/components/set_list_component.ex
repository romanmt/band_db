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
    <div id={@id} class="bg-white shadow rounded-lg overflow-hidden">
      <%= if @show_header_actions do %>
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <div class="flex items-center gap-2">
              <.icon name="hero-musical-note" class="h-5 w-5 text-gray-400" />
              <span class="text-lg font-medium text-gray-900">
                <%= @set_list.name %>
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              <%= length(@set_list.sets) %> <%= Inflex.inflect("set", length(@set_list.sets)) %>
            </span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <%= format_duration(@set_list.total_duration) %>
            </span>
            <%= if @set_list.calendar_event_id do %>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <.icon name="hero-calendar" class="h-3 w-3 mr-1" />
                Scheduled
              </span>
            <% end %>
            <button
              phx-click={JS.dispatch("print", to: "##{@id}")}
              class="ml-2 text-gray-400 hover:text-gray-500"
            >
              <.icon name="hero-printer" class="h-5 w-5" />
            </button>
          </div>
        </div>
      <% end %>

      <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div class="space-y-6">
          <%= if @show_calendar_details && Map.get(@set_list, :calendar_event_id) do %>
            <div class="bg-blue-50 rounded-md p-4 border border-blue-100">
              <h2 class="text-lg font-semibold text-blue-800 flex items-center">
                <.icon name="hero-calendar" class="h-5 w-5 mr-2" />
                Scheduled Performance
              </h2>
              <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div class="text-sm text-gray-500">Date</div>
                  <div class="text-gray-900"><%= if @set_list.date, do: Date.to_string(@set_list.date), else: "TBD" %></div>
                </div>
                <%= if @set_list.start_time && @set_list.end_time do %>
                  <div>
                    <div class="text-sm text-gray-500">Time</div>
                    <div class="text-gray-900">
                      <%= Time.to_string(@set_list.start_time) %> - <%= Time.to_string(@set_list.end_time) %>
                    </div>
                  </div>
                <% end %>
                <%= if @set_list.location && @set_list.location != "" do %>
                  <div class="md:col-span-2">
                    <div class="text-sm text-gray-500">Location</div>
                    <div class="text-gray-900"><%= @set_list.location %></div>
                  </div>
                <% end %>
              </div>
            </div>
          <% end %>

          <%= if is_list(@set_list.sets) do %>
            <%= for {set, index} <- Enum.with_index(@set_list.sets) do %>
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                  <.icon name="hero-musical-note" class="h-5 w-5 mr-2 text-gray-500" />
                  <%= set.name %>
                  <span class="ml-2 text-sm text-gray-500">(<%= format_duration(set.duration) %>)</span>
                </h2>

                <div class="mt-4">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Song</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuning</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <%= for {song, song_index} <- Enum.with_index(set.songs) do %>
                        <tr>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500"><%= song_index + 1 %></td>
                          <td class="px-4 py-3 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900"><%= get_song_title(song) %></div>
                          </td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500"><%= get_song_tuning(song) %></td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right"><%= format_song_duration(song) %></td>
                        </tr>
                      <% end %>
                    </tbody>
                  </table>
                </div>

                <%= if set.break_duration && set.break_duration > 0 && index < length(@set_list.sets) - 1 do %>
                  <div class="mt-4 bg-gray-50 p-2 rounded text-center text-sm text-gray-500">
                    Break: <%= format_duration(set.break_duration) %>
                  </div>
                <% end %>
              </div>
            <% end %>
          <% else %>
            <div class="p-4 bg-yellow-50 text-yellow-700 rounded-md">
              <p>No sets found or invalid set list format.</p>
            </div>
          <% end %>

          <div class="mt-4 flex justify-between border-t border-gray-200 pt-4">
            <div class="text-sm text-gray-500">Total Duration</div>
            <div class="font-medium text-gray-900"><%= format_duration(@set_list.total_duration) %></div>
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
