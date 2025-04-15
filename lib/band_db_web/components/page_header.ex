defmodule BandDbWeb.Components.PageHeader do
  use Phoenix.Component

  @doc """
  Renders a page header with a title and optional action buttons.

  ## Examples

      <.page_header title="Song Library">
        <:action>
          <button phx-click="show_modal">Add New Song</button>
        </:action>
      </.page_header>
  """
  attr :title, :string, required: true, doc: "The title of the page"
  attr :subtitle, :string, default: nil, doc: "Optional subtitle for the page"
  slot :action, doc: "Optional action buttons to display on the right side"

  def page_header(assigns) do
    ~H"""
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold tracking-wider uppercase text-gray-400"><%= @title %></h1>
          <%= if @subtitle do %>
            <p class="text-sm text-gray-500 mt-1"><%= @subtitle %></p>
          <% end %>
        </div>
        <div class="flex items-center space-x-3">
          <%= render_slot(@action) %>
        </div>
      </div>
    </div>
    """
  end
end
