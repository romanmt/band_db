defmodule BandDbWeb.UserLoginLive do
  use BandDbWeb, :live_view

  def render(assigns) do
    ~H"""
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <div class="flex justify-center">
            <img src={~p"/images/logo.png"} class="h-24 w-auto" />
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
        </div>

        <.simple_form for={@form} id="login_form" action={~p"/users/log_in"} phx-update="ignore" class="mt-8 space-y-6">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <.input
                field={@form[:email]}
                type="email"
                label="Email address"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <.input
                field={@form[:password]}
                type="password"
                label="Password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <.input
                field={@form[:remember_me]}
                type="checkbox"
                label="Remember me"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>

            <div class="text-sm">
              <.link href={~p"/users/reset_password"} class="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </.link>
            </div>
          </div>

          <div>
            <.button phx-disable-with="Logging in..." class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <.icon name="hero-lock-closed" class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              Log in
            </.button>
          </div>
        </.simple_form>
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    email = Phoenix.Flash.get(socket.assigns.flash, :email)
    form = to_form(%{"email" => email}, as: "user")
    {:ok, assign(socket, form: form), temporary_assigns: [form: form]}
  end
end
