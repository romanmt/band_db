defmodule BandDbWeb.Components.SongForm do
  use Phoenix.Component

  attr :title, :string, required: true, doc: "The title of the form"
  attr :song, :map, required: true, doc: "The song data to edit"
  attr :original_title, :string, default: nil, doc: "The original title of the song (for editing)"
  attr :on_submit, :string, required: true, doc: "The event to trigger on form submit"
  attr :on_close, :string, required: true, doc: "The event to trigger when closing the form"
  attr :submit_button_text, :string, required: true, doc: "The text to display on the submit button"
  attr :status_options, :list, required: true, doc: "List of {label, value} tuples for status options"
  attr :tuning_options, :list, required: true, doc: "List of {label, value} tuples for tuning options"
  attr :format_duration, :fun, required: true, doc: "Function to format duration in seconds to MM:SS"

  def song_form(assigns) do
    ~H"""
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-2 sm:px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-3 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="absolute top-0 right-0 pt-3 pr-3 sm:pt-4 sm:pr-4">
            <button phx-click={@on_close} type="button" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-1">
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="sm:flex sm:items-start">
            <div class="mt-2 sm:mt-3 text-center sm:text-left w-full">
              <h3 class="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4" id="modal-title">
                <%= @title %>
              </h3>

              <form phx-submit={@on_submit} class="space-y-3 sm:space-y-4">
                <%= if @original_title do %>
                  <input type="hidden" name="song[original_title]" value={@original_title} />
                <% end %>

                <div class="space-y-3 sm:space-y-4">
                  <!-- Title and Band Name - Stack on mobile, side by side on desktop -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input type="text" name="song[title]" value={@song.title} required
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base py-2 px-3" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Band Name</label>
                      <input type="text" name="song[band_name]" value={@song.band_name} required
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base py-2 px-3" />
                    </div>
                  </div>

                  <!-- Duration, Status, and Tuning - Stack on mobile -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Duration (MM:SS)</label>
                      <input type="text" name="song[duration]" value={@format_duration.(@song.duration)}
                        pattern="[0-9]{1,2}:[0-9]{2}" placeholder="03:30"
                        title="Duration in format MM:SS (e.g., 03:45)"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base py-2 px-3" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select name="song[status]" required class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base py-2 px-3">
                        <%= for {label, value} <- @status_options do %>
                          <option value={value} selected={value == @song.status}><%= label %></option>
                        <% end %>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Tuning</label>
                      <select name="song[tuning]" required class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base py-2 px-3">
                        <%= for {label, value} <- @tuning_options do %>
                          <option value={value} selected={value == @song.tuning}><%= label %></option>
                        <% end %>
                      </select>
                    </div>
                  </div>

                  <!-- Notes - Full width -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <input type="text" name="song[notes]" value={@song.notes}
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base py-2 px-3" />
                  </div>

                  <!-- YouTube URL - Full width -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                    <input type="url" name="song[youtube_link]" value={Map.get(@song, :youtube_link)} placeholder="https://www.youtube.com/watch?v=..."
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base py-2 px-3" />
                  </div>
                </div>

                <div class="mt-4 sm:mt-6">
                  <button type="submit"
                    class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2.5 sm:py-2 bg-indigo-600 text-sm sm:text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <%= @submit_button_text %>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    """
  end
end
