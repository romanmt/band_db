defmodule BandDbWeb.UserRegistrationLive do
  use BandDbWeb, :live_view

  alias BandDb.Accounts
  alias BandDb.Accounts.User

  def render(assigns) do
    ~H"""
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Already registered?
            <.link navigate={~p"/users/log_in"} class="font-medium text-indigo-600 hover:text-indigo-500">
              Log in
            </.link>
          </p>
        </div>

        <.simple_form
          for={@form}
          id="registration_form"
          phx-submit="save"
          phx-change="validate"
          phx-trigger-action={@trigger_submit}
          action={~p"/users/log_in?_action=registered"}
          method="post"
          class="mt-8 space-y-6"
        >
          <.error :if={@check_errors}>
            <div class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <.icon name="hero-exclamation-circle" class="h-5 w-5 text-red-400" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">
                    Oops, something went wrong!
                  </h3>
                  <div class="mt-2 text-sm text-red-700">
                    Please check the errors below.
                  </div>
                </div>
              </div>
            </div>
          </.error>

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

          <input type="hidden" name="user[invitation_token]" value={@invitation_token} />

          <div>
            <.button phx-disable-with="Creating account..." class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <.icon name="hero-user-plus" class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              Create account
            </.button>
          </div>
        </.simple_form>
      </div>
    </div>
    """
  end

  def mount(%{"token" => token}, _session, socket) do
    case Accounts.valid_invitation_token?(token) do
      true ->
        changeset = Accounts.change_user_registration(%User{})

        socket =
          socket
          |> assign(trigger_submit: false, check_errors: false)
          |> assign(:invitation_token, token)
          |> assign_form(changeset)

        {:ok, socket, temporary_assigns: [form: nil]}

      false ->
        {:ok,
          socket
          |> put_flash(:error, "Invalid or expired invitation link")
          |> redirect(to: ~p"/users/log_in")
        }
    end
  end

  # Fallback mount for direct access without token
  def mount(_params, _session, socket) do
    {:ok,
      socket
      |> put_flash(:error, "An invitation is required to register")
      |> redirect(to: ~p"/users/log_in")
    }
  end

  def handle_event("save", %{"user" => user_params}, socket) do
    # Add the invitation token from the socket assigns
    user_params = Map.put(user_params, "invitation_token", socket.assigns.invitation_token)

    case Accounts.register_user(user_params) do
      {:ok, user} ->
        # Mark the invitation token as used
        {:ok, _} = Accounts.mark_invitation_token_used(socket.assigns.invitation_token)

        {:ok, _} =
          Accounts.deliver_user_confirmation_instructions(
            user,
            &url(~p"/users/confirm/#{&1}")
          )

        changeset = Accounts.change_user_registration(user)
        {:noreply, socket |> assign(trigger_submit: true) |> assign_form(changeset)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, socket |> assign(check_errors: true) |> assign_form(changeset)}
    end
  end

  def handle_event("validate", %{"user" => user_params}, socket) do
    changeset = Accounts.change_user_registration(%User{}, user_params)
    {:noreply, assign_form(socket, Map.put(changeset, :action, :validate))}
  end

  defp assign_form(socket, %Ecto.Changeset{} = changeset) do
    form = to_form(changeset, as: "user")

    if changeset.valid? do
      assign(socket, form: form, check_errors: false)
    else
      assign(socket, form: form)
    end
  end
end
