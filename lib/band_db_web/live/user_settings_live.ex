defmodule BandDbWeb.UserSettingsLive do
  use BandDbWeb, :live_view

  alias BandDb.Accounts
  alias BandDb.Calendar

  def render(assigns) do
    ~H"""
    <.header class="text-center">
      Account Settings
      <:subtitle>Manage your account email address and password settings</:subtitle>
    </.header>

    <div class="bg-white rounded-lg shadow mb-8">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-4" aria-label="Tabs">
          <button
            phx-click="switch_tab"
            phx-value-tab="account"
            class={"px-3 py-2 text-sm font-medium border-b-2 #{if @active_tab == "account", do: "text-blue-600 border-blue-600", else: "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"}"}
          >
            Account
          </button>
          <button
            phx-click="switch_tab"
            phx-value-tab="calendar"
            class={"px-3 py-2 text-sm font-medium border-b-2 #{if @active_tab == "calendar", do: "text-blue-600 border-blue-600", else: "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"}"}
          >
            Google Calendar
          </button>
        </nav>
      </div>
    </div>

    <%= if @active_tab == "account" do %>
      <div class="space-y-12 divide-y">
        <div>
          <.simple_form
            for={@email_form}
            id="email_form"
            phx-submit="update_email"
            phx-change="validate_email"
          >
            <.input field={@email_form[:email]} type="email" label="Email" required />
            <.input
              field={@email_form[:current_password]}
              name="current_password"
              id="current_password_for_email"
              type="password"
              label="Current password"
              value={@email_form_current_password}
              required
            />
            <:actions>
              <.button phx-disable-with="Changing...">Change Email</.button>
            </:actions>
          </.simple_form>
        </div>
        <div>
          <.simple_form
            for={@password_form}
            id="password_form"
            action={~p"/users/log_in?_action=password_updated"}
            method="post"
            phx-change="validate_password"
            phx-submit="update_password"
            phx-trigger-action={@trigger_submit}
          >
            <input
              name={@password_form[:email].name}
              type="hidden"
              id="hidden_user_email"
              value={@current_email}
            />
            <.input field={@password_form[:password]} type="password" label="New password" required />
            <.input
              field={@password_form[:password_confirmation]}
              type="password"
              label="Confirm new password"
            />
            <.input
              field={@password_form[:current_password]}
              name="current_password"
              type="password"
              label="Current password"
              id="current_password_for_password"
              value={@current_password}
              required
            />
            <:actions>
              <.button phx-disable-with="Changing...">Change Password</.button>
            </:actions>
          </.simple_form>
        </div>
      </div>
    <% else %>
      <div class="space-y-6 bg-white rounded-lg shadow p-6">
        <!-- Google Calendar Connection -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Google Calendar Connection
          </h3>

          <%= if @connected do %>
            <div class="rounded-md bg-green-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">
                    Connected to Google Calendar
                  </h3>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <.link href={~p"/auth/google/disconnect"} class="text-red-600 hover:text-red-900 text-sm">
                Disconnect from Google Calendar
              </.link>
            </div>
          <% else %>
            <div class="rounded-md bg-blue-50 p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    You need to connect your Google account to use calendar features.
                  </p>
                </div>
              </div>
            </div>

            <.link href={~p"/auth/google"} class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Connect Google Calendar
            </.link>
          <% end %>
        </div>

        <!-- Create Calendar Section -->
        <%= if @connected && !@has_calendar do %>
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Create Band Calendar
            </h3>

            <p class="text-gray-600 text-sm mb-4">
              Create a new calendar for your band's rehearsals and performances.
            </p>

            <%= if @calendar_error do %>
              <div class="rounded-md bg-red-50 p-4 mb-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-700">
                      <%= @calendar_error %>
                    </p>
                  </div>
                </div>
              </div>
            <% end %>

            <form phx-submit="create_calendar">
              <div class="mb-4">
                <label for="band_name" class="block text-sm font-medium text-gray-700 mb-1">
                  Band Name
                </label>
                <input
                  type="text"
                  name="band_name"
                  id="band_name"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="My Awesome Band"
                  required
                />
              </div>

              <button
                type="submit"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Create Calendar
              </button>
            </form>
          </div>
        <% end %>

        <!-- Calendars List -->
        <%= if @connected && length(@calendars) > 0 do %>
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Your Calendars
            </h3>

            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-md">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900">Name</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Type</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <%= for calendar <- @calendars do %>
                    <tr class={if @google_auth && @google_auth.calendar_id == calendar.id, do: "bg-blue-50", else: ""}>
                      <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900">
                        <%= calendar.summary %>
                        <%= if @google_auth && @google_auth.calendar_id == calendar.id do %>
                          <span class="text-xs text-blue-600 ml-2">(active)</span>
                        <% end %>
                      </td>
                      <td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                        <%= if calendar.primary, do: "Primary", else: "Secondary" %>
                      </td>
                    </tr>
                  <% end %>
                </tbody>
              </table>
            </div>
          </div>
        <% end %>
      </div>
    <% end %>
    """
  end

  def mount(%{"token" => token}, _session, socket) do
    socket =
      case Accounts.update_user_email(socket.assigns.current_user, token) do
        :ok ->
          put_flash(socket, :info, "Email changed successfully.")

        :error ->
          put_flash(socket, :error, "Email change link is invalid or it has expired.")
      end

    {:ok, push_navigate(socket, to: ~p"/users/settings")}
  end

  def mount(_params, _session, socket) do
    user = socket.assigns.current_user
    email_changeset = Accounts.change_user_email(user)
    password_changeset = Accounts.change_user_password(user)

    # Check Google Calendar connection status
    connected = has_valid_google_auth?(user)

    # Check if user has a band calendar configured
    has_calendar = connected && has_band_calendar?(user)

    # Get calendars list if connected
    calendars = if connected, do: get_calendars(user), else: []

    # Get active tab from params
    active_tab = if Map.has_key?(socket.assigns, :active_tab), do: socket.assigns.active_tab, else: "account"

    socket =
      socket
      |> assign(:current_password, nil)
      |> assign(:email_form_current_password, nil)
      |> assign(:current_email, user.email)
      |> assign(:email_form, to_form(email_changeset))
      |> assign(:password_form, to_form(password_changeset))
      |> assign(:trigger_submit, false)
      |> assign(:active_tab, active_tab)
      |> assign(:connected, connected)
      |> assign(:has_calendar, has_calendar)
      |> assign(:calendars, calendars)
      |> assign(:calendar_error, nil)
      |> assign(:google_auth, Calendar.get_google_auth(user))

    {:ok, socket}
  end

  @impl true
  def handle_params(params, _uri, socket) do
    # Set active tab from params
    active_tab = Map.get(params, "tab", socket.assigns.active_tab)
    {:noreply, assign(socket, active_tab: active_tab)}
  end

  def handle_event("validate_email", params, socket) do
    %{"current_password" => password, "user" => user_params} = params

    email_form =
      socket.assigns.current_user
      |> Accounts.change_user_email(user_params)
      |> Map.put(:action, :validate)
      |> to_form()

    {:noreply, assign(socket, email_form: email_form, email_form_current_password: password)}
  end

  def handle_event("update_email", params, socket) do
    %{"current_password" => password, "user" => user_params} = params
    user = socket.assigns.current_user

    case Accounts.apply_user_email(user, password, user_params) do
      {:ok, applied_user} ->
        Accounts.deliver_user_update_email_instructions(
          applied_user,
          user.email,
          &url(~p"/users/settings/confirm_email/#{&1}")
        )

        info = "A link to confirm your email change has been sent to the new address."
        {:noreply, socket |> put_flash(:info, info) |> assign(email_form_current_password: nil)}

      {:error, changeset} ->
        {:noreply, assign(socket, :email_form, to_form(Map.put(changeset, :action, :insert)))}
    end
  end

  def handle_event("validate_password", params, socket) do
    %{"current_password" => password, "user" => user_params} = params

    password_form =
      socket.assigns.current_user
      |> Accounts.change_user_password(user_params)
      |> Map.put(:action, :validate)
      |> to_form()

    {:noreply, assign(socket, password_form: password_form, current_password: password)}
  end

  def handle_event("update_password", params, socket) do
    %{"current_password" => password, "user" => user_params} = params
    user = socket.assigns.current_user

    case Accounts.update_user_password(user, password, user_params) do
      {:ok, user} ->
        password_form =
          user
          |> Accounts.change_user_password(user_params)
          |> to_form()

        {:noreply, assign(socket, trigger_submit: true, password_form: password_form)}

      {:error, changeset} ->
        {:noreply, assign(socket, password_form: to_form(changeset))}
    end
  end

  def handle_event("switch_tab", %{"tab" => tab}, socket) do
    {:noreply, assign(socket, active_tab: tab)}
  end

  def handle_event("create_calendar", %{"band_name" => band_name}, socket) do
    user = socket.assigns.current_user

    case Calendar.create_band_calendar(user, band_name) do
      {:ok, _calendar_id} ->
        # Refresh the calendars list
        calendars = get_calendars(user)

        # Update google_auth to get the new calendar_id
        google_auth = Calendar.get_google_auth(user)

        {:noreply, socket
          |> assign(
            calendars: calendars,
            calendar_error: nil,
            google_auth: google_auth,
            has_calendar: true
          )
          |> put_flash(:info, "Calendar created successfully!")}

      {:error, reason} ->
        {:noreply, assign(socket, calendar_error: reason)}
    end
  end

  # Helper function to check if a user has valid Google Auth
  defp has_valid_google_auth?(user) do
    google_auth = Calendar.get_google_auth(user)
    google_auth != nil && !Calendar.is_expired?(google_auth)
  end

  # Helper function to check if a user has a band calendar
  defp has_band_calendar?(user) do
    google_auth = Calendar.get_google_auth(user)
    google_auth != nil && google_auth.calendar_id != nil
  end

  # Get the list of calendars for the user
  defp get_calendars(user) do
    case Calendar.list_calendars(user) do
      {:ok, calendars} -> calendars
      {:error, _} -> []
    end
  end
end
