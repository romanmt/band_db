defmodule BandDbWeb.AdminCalendarLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader

  alias BandDb.Calendar

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    user = socket.assigns.current_user
    google_auth = Calendar.get_google_auth(user)

    connected = google_auth != nil

    # Only get the band calendar instead of all calendars
    band_calendar = if connected && google_auth.calendar_id do
      case get_band_calendar(user, google_auth.calendar_id) do
        {:ok, calendar} -> [calendar]
        _ -> []
      end
    else
      []
    end

    # Get selected calendar ID if there is one
    calendar_id = if google_auth, do: google_auth.calendar_id, else: nil

    # Get calendar shares if we have a selected calendar
    calendar_shares = if calendar_id, do: get_calendar_shares(user, calendar_id), else: []

    # Get shareable link if we have a calendar
    shareable_link = if calendar_id, do: get_shareable_link(calendar_id), else: nil

    socket = assign(socket,
      google_connected: connected,
      google_auth: google_auth,
      calendars: band_calendar,
      show_create_calendar_modal: false,
      band_name: "",
      calendar_error: nil,
      calendar_shares: calendar_shares,
      shareable_link: shareable_link,
      show_share_modal: false,
      share_email: "",
      share_role: "reader",
      share_error: nil
    )

    {:ok, socket, temporary_assigns: []}
  end

  @impl true
  def handle_event("show_create_calendar_modal", _params, socket) do
    {:noreply, assign(socket, show_create_calendar_modal: true)}
  end

  @impl true
  def handle_event("hide_create_calendar_modal", _params, socket) do
    {:noreply, assign(socket, show_create_calendar_modal: false, calendar_error: nil)}
  end

  @impl true
  def handle_event("create_calendar", %{"band_name" => band_name}, socket) do
    user = socket.assigns.current_user

    case Calendar.create_band_calendar(user, band_name) do
      {:ok, _calendar_id} ->
        # Refresh the calendars list
        calendars = get_calendars(user)

        # Update google_auth to get the new calendar_id
        google_auth = Calendar.get_google_auth(user)
        calendar_id = google_auth.calendar_id

        # Get shareable link for the new calendar
        shareable_link = get_shareable_link(calendar_id)

        {:noreply, socket
          |> assign(
            show_create_calendar_modal: false,
            calendars: calendars,
            calendar_error: nil,
            google_auth: google_auth,
            shareable_link: shareable_link,
            calendar_shares: []
          )
          |> put_flash(:info, "Calendar created successfully!")}

      {:error, reason} ->
        {:noreply, assign(socket, calendar_error: reason)}
    end
  end

  @impl true
  def handle_event("show_share_modal", _params, socket) do
    {:noreply, assign(socket,
      show_share_modal: true,
      share_email: "",
      share_role: "reader",
      share_error: nil
    )}
  end

  @impl true
  def handle_event("hide_share_modal", _params, socket) do
    {:noreply, assign(socket, show_share_modal: false)}
  end

  @impl true
  def handle_event("share_calendar", %{"email" => email, "role" => role}, socket) do
    user = socket.assigns.current_user
    google_auth = socket.assigns.google_auth
    calendar_id = google_auth.calendar_id

    case Calendar.share_calendar_with_user(user, calendar_id, email, role) do
      :ok ->
        # Refresh calendar shares
        calendar_shares = get_calendar_shares(user, calendar_id)

        {:noreply, socket
          |> assign(
            show_share_modal: false,
            calendar_shares: calendar_shares
          )
          |> put_flash(:info, "Calendar shared successfully with #{email}")}

      {:error, reason} ->
        {:noreply, assign(socket, share_error: reason)}
    end
  end

  @impl true
  def handle_event("remove_share", %{"rule_id" => rule_id}, socket) do
    user = socket.assigns.current_user
    google_auth = socket.assigns.google_auth
    calendar_id = google_auth.calendar_id

    case Calendar.remove_calendar_share(user, calendar_id, rule_id) do
      :ok ->
        # Refresh calendar shares
        calendar_shares = get_calendar_shares(user, calendar_id)

        {:noreply, socket
          |> assign(calendar_shares: calendar_shares)
          |> put_flash(:info, "Calendar access removed successfully")}

      {:error, reason} ->
        {:noreply, put_flash(socket, :error, "Failed to remove calendar access: #{reason}")}
    end
  end

  @impl true
  def handle_event("copy_link", _params, socket) do
    link = socket.assigns.shareable_link

    {:noreply,
      socket
      |> push_event("copy-to-clipboard", %{text: link})
      |> put_flash(:info, "Shareable link copied to clipboard")}
  end

  defp get_calendars(user) do
    case Calendar.list_calendars(user) do
      {:ok, calendars} -> calendars
      {:error, _reason} -> []
    end
  end

  defp get_calendar_shares(user, calendar_id) do
    case Calendar.list_calendar_shares(user, calendar_id) do
      {:ok, shares} -> shares
      {:error, _reason} -> []
    end
  end

  defp get_shareable_link(calendar_id) do
    case Calendar.get_shareable_link(calendar_id) do
      {:ok, link} -> link
      {:error, _reason} -> nil
    end
  end

  # Get only the band calendar by ID
  defp get_band_calendar(user, calendar_id) do
    case Calendar.get_access_token(user) do
      {:ok, access_token} ->
        Calendar.get_calendar(access_token, calendar_id)
      {:error, _reason} ->
        {:error, "Failed to get access token"}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="max-w-7xl mx-auto">
      <.page_header title="Calendar Settings">
        <:action>
          <%= if @google_connected do %>
            <button phx-click="show_create_calendar_modal" class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <.icon name="hero-calendar-days" class="h-5 w-5 mr-2" />
              Create Band Calendar
            </button>
          <% end %>
        </:action>
      </.page_header>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Google Calendar Integration
          </h3>
          <div class="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Connect your Google account to manage and sync rehearsal plans and set lists with Google Calendar.
            </p>
          </div>

          <!-- Connection Status -->
          <div class="mt-5">
            <%= if @google_connected do %>
              <div class="rounded-md bg-green-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <.icon name="hero-check-circle" class="h-5 w-5 text-green-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">
                      Connected to Google Calendar
                    </h3>
                    <div class="mt-2 text-sm text-green-700">
                      <p>Your Google Calendar integration is active. You can now create and manage calendars.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-5">
                <.link href={~p"/auth/google/disconnect"} class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Disconnect from Google Calendar
                </.link>
              </div>
            <% else %>
              <div class="rounded-md bg-blue-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <.icon name="hero-information-circle" class="h-5 w-5 text-blue-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-blue-800">
                      Connect to Google Calendar
                    </h3>
                    <div class="mt-2 text-sm text-blue-700">
                      <p>You need to connect your Google account to use calendar features.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-5">
                <.link href={~p"/auth/google"} class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <.icon name="hero-calendar" class="h-5 w-5 mr-2" />
                  Connect Google Calendar
                </.link>
              </div>
            <% end %>
          </div>

          <!-- Calendars List -->
          <%= if @google_connected and length(@calendars) > 0 do %>
            <div class="mt-8">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Your Calendars
              </h3>
              <div class="mt-2 max-w-xl text-sm text-gray-500">
                <p>These are the calendars available in your Google account.</p>
              </div>

              <div class="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <%= for calendar <- @calendars do %>
                      <tr>
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <%= calendar.summary %>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <%= calendar.description || "-" %>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <%= if calendar.primary, do: "Primary", else: "Secondary" %>
                        </td>
                      </tr>
                    <% end %>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Calendar Sharing Section -->
            <%= if @google_auth && @google_auth.calendar_id do %>
              <div class="mt-10 sm:mt-12">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Calendar Sharing
                </h3>
                <div class="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Share your band calendar with band members or view the shareable link.</p>
                </div>

                <div class="mt-5 flex flex-col sm:flex-row sm:space-x-4">
                  <button
                    phx-click="show_share_modal"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <.icon name="hero-user-plus" class="h-5 w-5 mr-2" />
                    Share with Band Member
                  </button>

                  <%= if @shareable_link do %>
                    <div class="mt-3 sm:mt-0 flex-1 relative">
                      <input
                        type="text"
                        readonly
                        value={@shareable_link}
                        class="block w-full pr-12 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <div class="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                        <button
                          type="button"
                          phx-click="copy_link"
                          class="inline-flex items-center px-2 border border-gray-200 text-sm font-medium rounded text-indigo-600 hover:bg-gray-50"
                          data-clipboard-text={@shareable_link}
                          id="copy-link-button"
                        >
                          <.icon name="hero-clipboard-document" class="h-4 w-4" />
                          <span class="sr-only">Copy</span>
                        </button>
                      </div>
                    </div>
                  <% end %>
                </div>

                <%= if length(@calendar_shares) > 0 do %>
                  <div class="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                      <thead class="bg-gray-50">
                        <tr>
                          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Email</th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Access Level</th>
                          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span class="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 bg-white">
                        <%= for share <- @calendar_shares do %>
                          <%= if share.scope_type == "user" && share.email do %>
                            <tr>
                              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                <%= share.email %>
                              </td>
                              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <%= case share.role do %>
                                  <% "reader" -> %>See events
                                  <% "writer" -> %>Edit events
                                  <% "owner" -> %>Full access
                                  <% _ -> %><%= share.role %>
                                <% end %>
                              </td>
                              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                  phx-click="remove_share"
                                  phx-value-rule_id={share.id}
                                  class="text-red-600 hover:text-red-900"
                                  data-confirm="Are you sure you want to remove this access?"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          <% end %>
                        <% end %>
                      </tbody>
                    </table>
                  </div>
                <% else %>
                  <div class="mt-6 bg-gray-50 p-4 rounded-md text-sm text-gray-500">
                    Your calendar is not shared with any band members yet.
                  </div>
                <% end %>
              </div>
            <% end %>
          <% end %>
        </div>
      </div>
    </div>

    <!-- Create Calendar Modal -->
    <%= if @show_create_calendar_modal do %>
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50" phx-capture-click="hide_create_calendar_modal">
        <div class="bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl max-w-md w-full" phx-click-away="hide_create_calendar_modal">
          <div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Create Band Calendar
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Enter your band's name to create a new calendar for rehearsals and performances.
                </p>
              </div>
            </div>
          </div>

          <%= if @calendar_error do %>
            <div class="mt-4">
              <div class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <.icon name="hero-x-circle" class="h-5 w-5 text-red-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">
                      Error creating calendar
                    </h3>
                    <div class="mt-2 text-sm text-red-700">
                      <p><%= @calendar_error %></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <% end %>

          <form phx-submit="create_calendar" class="mt-5 sm:mt-6">
            <div>
              <label for="band_name" class="block text-sm font-medium text-gray-700">
                Band Name
              </label>
              <div class="mt-1">
                <input type="text" name="band_name" id="band_name" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="My Awesome Band" required />
              </div>
            </div>

            <div class="mt-5 sm:mt-6 flex justify-end space-x-3">
              <button type="button" phx-click="hide_create_calendar_modal" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                Cancel
              </button>
              <button type="submit" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                Create Calendar
              </button>
            </div>
          </form>
        </div>
      </div>
    <% end %>

    <!-- Share Calendar Modal -->
    <%= if @show_share_modal do %>
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50" phx-capture-click="hide_share_modal">
        <div class="bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl max-w-md w-full" phx-click-away="hide_share_modal">
          <div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-share-title">
                Share Band Calendar
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Enter the email address of the person you want to share the calendar with.
                </p>
              </div>
            </div>
          </div>

          <%= if @share_error do %>
            <div class="mt-4">
              <div class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <.icon name="hero-x-circle" class="h-5 w-5 text-red-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">
                      Error sharing calendar
                    </h3>
                    <div class="mt-2 text-sm text-red-700">
                      <p><%= @share_error %></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <% end %>

          <form phx-submit="share_calendar" class="mt-5 sm:mt-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div class="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="bandmember@example.com"
                  required
                />
              </div>
            </div>

            <div class="mt-4">
              <label for="role" class="block text-sm font-medium text-gray-700">
                Access Level
              </label>
              <div class="mt-1">
                <select
                  name="role"
                  id="role"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="reader">View only (see events)</option>
                  <option value="writer">Can edit (make changes to events)</option>
                  <option value="owner">Full access (manage calendar and sharing)</option>
                </select>
              </div>
            </div>

            <div class="mt-5 sm:mt-6 flex justify-end space-x-3">
              <button type="button" phx-click="hide_share_modal" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                Cancel
              </button>
              <button type="submit" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                Share Calendar
              </button>
            </div>
          </form>
        </div>
      </div>
    <% end %>

    <script>
    window.addEventListener("phx:copy-to-clipboard", (event) => {
      const el = document.createElement("textarea");
      el.value = event.detail.text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    </script>
    """
  end
end
