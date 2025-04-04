defmodule BandDbWeb.Components.ExpandableSection do
  use Phoenix.Component
  import BandDbWeb.CoreComponents

  attr :id, :string, required: true
  attr :icon_name, :string, required: true
  attr :title, :string, required: true
  attr :meta_fields, :list, required: true
  attr :expanded, :boolean, default: false
  attr :on_toggle, :any, required: true

  slot :actions
  slot :inner_block, required: true

  def expandable_section(assigns) do
    ~H"""
      <div class="bg-white shadow rounded-lg justify-between">
        <div class="hover:bg-gray-50">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center">
              <button phx-click={@on_toggle} class="text-gray-400 hover:text-gray-500 mr-4">
                <.icon
                  name={if @expanded, do: "hero-chevron-down", else: "hero-chevron-right"}
                  class="h-5 w-5"
                />
              </button>
              <div class="flex-shrink-0 mr-4">
                <.icon name={@icon_name} class="h-5 w-5 text-gray-400" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <h3 class="text-lg font-medium text-indigo-600 truncate">{@title}</h3>
                    <div class="flex items-center space-x-2 text-sm text-gray-500">
                      <%= for {field, index} <- Enum.with_index(@meta_fields) do %>
                        <span>{field}</span>
                        <%= if index < length(@meta_fields) - 1 do %>
                          <span>•</span>
                        <% end %>
                      <% end %>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    {render_slot(@actions)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <%= if @expanded do %>
          <div class="border-t border-gray-200">
            <div class="px-4 py-4 sm:px-6">
              {render_slot(@inner_block)}
            </div>
          </div>
        <% end %>
      </div>
    """
  end
end
