defmodule BandDbWeb.AdminLayout do
  use BandDbWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <.link
                  navigate={~p"/admin/users"}
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Users
                </.link>
              </div>
            </div>
            <div class="flex items-center">
              <.link
                navigate={~p"/"}
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Back to App
              </.link>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <%= @inner_content %>
      </main>
    </div>
    """
  end
end
