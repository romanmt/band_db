defmodule BandDbWeb.Components.RehearsalPlanComponent do
  use Phoenix.Component
  alias Phoenix.LiveView.JS
  import BandDbWeb.CoreComponents

  attr :plan, :map, required: true
  attr :id, :string, required: true
  attr :show_header_actions, :boolean, default: true
  attr :show_calendar_details, :boolean, default: true

  def rehearsal_plan(assigns) do
    ~H"""
    <div id={@id} class="bg-white shadow rounded-lg overflow-hidden">
      <%= if @show_header_actions do %>
        <div class="px-3 py-4 sm:px-4 sm:py-5 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div class="flex items-center space-x-4">
            <div class="flex items-center gap-2">
              <.icon name="hero-calendar" class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <span class="text-base sm:text-lg font-medium text-gray-900">
                <%= Calendar.strftime(@plan.date, "%B %d, %Y") %>
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-2 flex-wrap">
            <span class="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              <%= length(@plan.rehearsal_songs) %> rehearsal songs
            </span>
            <span class="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <%= length(@plan.set_songs) %> set list songs
            </span>
            <span class="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <%= format_duration(@plan.duration) %>
            </span>
            <%= if @plan.calendar_event_id do %>
              <span class="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <.icon name="hero-calendar" class="h-3 w-3 mr-1" />
                Scheduled
              </span>
            <% end %>
            <button
              phx-click={JS.dispatch("print", to: "##{@id}")}
              class="ml-2 text-gray-400 hover:text-gray-500 p-1"
            >
              <.icon name="hero-printer" class="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      <% end %>

      <div class="border-t border-gray-200 px-3 py-4 sm:px-4 sm:py-5 sm:px-6">
        <div class="space-y-4 sm:space-y-6">
          <%= if @show_calendar_details && @plan.calendar_event_id do %>
            <div class="bg-blue-50 rounded-md p-3 sm:p-4 border border-blue-100">
              <h2 class="text-base sm:text-lg font-semibold text-blue-800 flex items-center">
                <.icon name="hero-calendar" class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Scheduled Rehearsal
              </h2>
              <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <div class="text-sm text-gray-500">Date</div>
                  <div class="text-gray-900"><%= Date.to_string(@plan.scheduled_date) %></div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Time</div>
                  <div class="text-gray-900">
                    <%= Time.to_string(@plan.start_time) %> - <%= Time.to_string(@plan.end_time) %>
                  </div>
                </div>
                <%= if @plan.location && @plan.location != "" do %>
                  <div class="sm:col-span-2">
                    <div class="text-sm text-gray-500">Location</div>
                    <div class="text-gray-900"><%= @plan.location %></div>
                  </div>
                <% end %>
              </div>
            </div>
          <% end %>

          <%= if Map.get(@plan, :notes, "") != "" do %>
            <div>
              <h2 class="text-base sm:text-lg font-semibold text-gray-900">Notes</h2>
              <div class="mt-2 text-gray-700 whitespace-pre-wrap text-sm sm:text-base"><%= @plan.notes %></div>
            </div>
          <% end %>

          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Songs to Work On</h2>
            <%= for {tuning, songs} <- Enum.group_by(@plan.rehearsal_songs, & &1.tuning) do %>
              <div class="mt-3 sm:mt-4">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Tuning: <%= display_tuning(tuning) %></h3>

                <!-- Mobile: Card layout -->
                <div class="sm:hidden space-y-2">
                  <%= for song <- songs do %>
                    <div class="bg-gray-50 rounded-lg p-3">
                      <div class="flex items-start justify-between">
                        <div class="flex-1 min-w-0">
                          <div class="font-medium text-gray-900 text-sm truncate"><%= song.title %></div>
                          <div class="text-xs text-gray-500 mt-0.5">by <%= song.band_name %></div>
                          <%= if song.notes do %>
                            <div class="text-xs text-gray-500 mt-1 truncate"><%= song.notes %></div>
                          <% end %>
                        </div>
                        <div class="text-xs text-gray-500 ml-2">
                          <%= format_duration(song.duration) %>
                        </div>
                      </div>
                    </div>
                  <% end %>
                </div>

                <!-- Desktop: List layout -->
                <ul class="hidden sm:block space-y-2">
                  <%= for song <- songs do %>
                    <li class="flex items-center justify-between py-2">
                      <div class="flex items-center gap-2 flex-1 min-w-0">
                        <.icon name="hero-musical-note" class="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span class="text-gray-700 truncate"><%= song.title %></span>
                        <span class="text-gray-500 text-sm">- <%= song.band_name %></span>
                        <%= if song.notes do %>
                          <span class="text-gray-500 text-sm truncate">- <%= song.notes %></span>
                        <% end %>
                      </div>
                      <span class="text-gray-500 text-sm ml-4"><%= format_duration(song.duration) %></span>
                    </li>
                  <% end %>
                </ul>
              </div>
            <% end %>
          </div>

          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Set List</h2>
            <%= for {tuning, songs} <- Enum.group_by(@plan.set_songs, & &1.tuning) do %>
              <div class="mt-3 sm:mt-4">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Tuning: <%= display_tuning(tuning) %></h3>

                <!-- Mobile: Card layout -->
                <div class="sm:hidden space-y-2">
                  <%= for {song, index} <- Enum.with_index(songs) do %>
                    <div class="bg-gray-50 rounded-lg p-3">
                      <div class="flex items-start justify-between">
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center space-x-2 mb-1">
                            <span class="text-sm font-medium text-gray-600"><%= index + 1 %>.</span>
                            <div class="font-medium text-gray-900 text-sm truncate"><%= song.title %></div>
                          </div>
                          <div class="text-xs text-gray-500">by <%= song.band_name %></div>
                          <%= if song.notes do %>
                            <div class="text-xs text-gray-500 mt-1 truncate"><%= song.notes %></div>
                          <% end %>
                        </div>
                        <div class="text-xs text-gray-500 ml-2">
                          <%= format_duration(song.duration) %>
                        </div>
                      </div>
                    </div>
                  <% end %>
                </div>

                <!-- Desktop: List layout -->
                <div class="hidden sm:block space-y-2">
                  <%= for {song, index} <- Enum.with_index(songs) do %>
                    <div class="flex items-center justify-between py-2">
                      <div class="flex items-center gap-2 flex-1 min-w-0">
                        <span class="text-sm font-medium text-gray-500 w-6"><%= index + 1 %>.</span>
                        <.icon name="hero-musical-note" class="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span class="text-gray-700 truncate"><%= song.title %></span>
                        <span class="text-gray-500 text-sm">- <%= song.band_name %></span>
                        <%= if song.notes do %>
                          <span class="text-gray-500 text-sm truncate">- <%= song.notes %></span>
                        <% end %>
                      </div>
                      <span class="text-gray-500 text-sm ml-4"><%= format_duration(song.duration) %></span>
                    </div>
                  <% end %>
                </div>
              </div>
            <% end %>
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp format_duration(nil), do: ""
  defp format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    :io_lib.format("~2..0B:~2..0B", [minutes, remaining_seconds])
  end

  defp display_tuning(:standard), do: "Standard"
  defp display_tuning(:drop_d), do: "Drop D"
  defp display_tuning(:e_flat), do: "Eb"
  defp display_tuning(:drop_c_sharp), do: "Drop C#"
  defp display_tuning(tuning) when is_atom(tuning), do: String.capitalize(to_string(tuning))
  defp display_tuning(tuning) when is_binary(tuning), do: tuning
  defp display_tuning(_), do: "Standard"
end
