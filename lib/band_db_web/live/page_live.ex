defmodule BandDbWeb.PageLive do
  use BandDbWeb, :live_view

  on_mount {BandDbWeb.UserAuth, :mount_current_user}

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to BandDB
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          Your all-in-one solution for managing your band's songs, rehearsals, and set lists.
        </p>
        <%= if @current_user do %>
          <p class="mt-4 text-sm text-gray-600">
            Logged in as <%= @current_user.email %>
          </p>
        <% end %>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <%= if @current_user do %>
            <.link
              navigate={~p"/songs"}
              class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go to Dashboard
            </.link>
          <% else %>
            <.link
              navigate={~p"/users/log_in"}
              class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </.link>
          <% end %>
          <.link
            href="#"
            class="text-sm font-semibold leading-6 text-gray-900"
          >
            Learn more <span aria-hidden="true">→</span>
          </.link>
        </div>
      </div>
    </div>
    """
  end
end
