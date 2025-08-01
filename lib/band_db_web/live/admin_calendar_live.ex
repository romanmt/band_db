defmodule BandDbWeb.AdminCalendarLive do
  use BandDbWeb, :live_view
  use BandDbWeb.Live.Lifecycle
  import BandDbWeb.Components.PageHeader

  alias BandDb.Calendar
  alias BandDb.Calendar.{ServiceAccountManager, GoogleAPI}

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    user = socket.assigns.current_user
    band = user.band
    
    # Check if service account mode is enabled and configured
    use_service_account = Calendar.use_service_account?()
    service_account_configured = use_service_account && Calendar.service_account_available?()
    
    # Check if band has a calendar
    has_calendar = band && band.calendar_id != nil
    
    # Get calendar shares if we have a calendar and service account is configured
    calendar_shares = if has_calendar && service_account_configured do
      case Calendar.list_calendar_shares_with_service_account(band.calendar_id) do
        {:ok, shares} -> shares
        {:error, _} -> []
      end
    else
      []
    end
    
    # Generate calendar URLs
    {shareable_link, ical_url} = if has_calendar do
      google_link = case Calendar.get_shareable_link(band.calendar_id) do
        {:ok, link} -> link
        _ -> nil
      end
      ical_link = generate_ical_url(socket, band)
      {google_link, ical_link}
    else
      {nil, nil}
    end

    socket = assign(socket,
      use_service_account: use_service_account,
      service_account_configured: service_account_configured,
      band: band,
      has_calendar: has_calendar,
      calendar_shares: calendar_shares,
      shareable_link: shareable_link,
      ical_url: ical_url,
      show_create_calendar_modal: false,
      calendar_error: nil,
      show_share_modal: false,
      share_email: "",
      share_role: "reader",
      share_error: nil,
      show_service_account_modal: false,
      service_account_name: "",
      service_account_credentials: "",
      service_account_error: nil
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
  def handle_event("create_calendar", _params, socket) do
    band = socket.assigns.band
    
    if Calendar.service_account_available?() do
      case Calendar.create_band_calendar_with_service_account(band) do
        {:ok, updated_band} ->
          # Get calendar shares
          calendar_shares = case Calendar.list_calendar_shares_with_service_account(updated_band.calendar_id) do
            {:ok, shares} -> shares
            {:error, _} -> []
          end
          
          # Generate URLs
          shareable_link = case Calendar.get_shareable_link(updated_band.calendar_id) do
            {:ok, link} -> link
            _ -> nil
          end
          ical_url = generate_ical_url(socket, updated_band)
          
          {:noreply, socket
            |> assign(
              show_create_calendar_modal: false,
              band: updated_band,
              has_calendar: true,
              calendar_error: nil,
              shareable_link: shareable_link,
              ical_url: ical_url,
              calendar_shares: calendar_shares
            )
            |> put_flash(:info, "Calendar created successfully!")}
            
        {:error, reason} ->
          {:noreply, assign(socket, calendar_error: reason)}
      end
    else
      {:noreply, socket
        |> assign(calendar_error: "Service account not configured. Please configure a service account first.")
        |> put_flash(:error, "Service account not configured")}
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
    band = socket.assigns.band

    case GoogleAPI.share_calendar_with_service_account(band.calendar_id, email, role) do
      :ok ->
        # Refresh calendar shares
        calendar_shares = case Calendar.list_calendar_shares_with_service_account(band.calendar_id) do
          {:ok, shares} -> shares
          {:error, _} -> []
        end

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
    band = socket.assigns.band

    case Calendar.remove_calendar_share_with_service_account(band.calendar_id, rule_id) do
      :ok ->
        # Refresh calendar shares
        calendar_shares = case Calendar.list_calendar_shares_with_service_account(band.calendar_id) do
          {:ok, shares} -> shares
          {:error, _} -> []
        end

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
  
  @impl true
  def handle_event("show_service_account_modal", _params, socket) do
    {:noreply, assign(socket, show_service_account_modal: true)}
  end
  
  @impl true
  def handle_event("hide_service_account_modal", _params, socket) do
    {:noreply, assign(socket, show_service_account_modal: false, service_account_error: nil)}
  end
  
  @impl true
  def handle_event("save_service_account", %{"name" => name, "credentials" => credentials}, socket) do
    case ServiceAccountManager.create_service_account(%{name: name, credentials: credentials}) do
      {:ok, service_account} ->
        # Activate the new service account
        case ServiceAccountManager.activate_service_account(service_account) do
          {:ok, _} ->
            # Restart the Goth process with new credentials
            Process.whereis(BandDb.Goth) && GenServer.stop(BandDb.Goth)
            ServiceAccountManager.start_link([])
            
            {:noreply, socket
              |> assign(
                show_service_account_modal: false,
                service_account_configured: true,
                service_account_error: nil
              )
              |> put_flash(:info, "Service account configured successfully!")}
              
          {:error, reason} ->
            {:noreply, assign(socket, service_account_error: "Failed to activate: #{inspect(reason)}")}
        end
        
      {:error, changeset} ->
        errors = Ecto.Changeset.traverse_errors(changeset, fn {msg, _} -> msg end)
        {:noreply, assign(socket, service_account_error: "Failed to save: #{inspect(errors)}")}
    end
  end
  
  @impl true
  def handle_event("copy_ical_url", _params, socket) do
    url = socket.assigns.ical_url
    
    {:noreply,
      socket
      |> push_event("copy-to-clipboard", %{text: url})
      |> put_flash(:info, "iCal URL copied to clipboard")}
  end
  
  defp generate_ical_url(socket, band) do
    scheme = if socket.host_uri.scheme == "https", do: "https", else: "http"
    port = if socket.host_uri.port in [80, 443], do: "", else: ":#{socket.host_uri.port}"
    "#{scheme}://#{socket.host_uri.host}#{port}/bands/#{band.id}/calendar.ics?token=#{band.ical_token}"
  end




  @impl true
  def render(assigns) do
    ~H"""
    <div class="max-w-7xl mx-auto">
      <.page_header title="Calendar Settings">
        <:action>
          <%= if @service_account_configured do %>
            <%= if !@has_calendar do %>
              <button phx-click="show_create_calendar_modal" class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <.icon name="hero-calendar-days" class="h-5 w-5 mr-2" />
                Create Band Calendar
              </button>
            <% end %>
          <% else %>
            <button phx-click="show_service_account_modal" class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <.icon name="hero-cog-6-tooth" class="h-5 w-5 mr-2" />
              Configure Service Account
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
              <%= if @use_service_account do %>
                Band Boss manages calendars using a Google Service Account for enhanced privacy and security.
              <% else %>
                Connect your Google account to manage and sync rehearsal plans and set lists with Google Calendar.
                <span class="block mt-2 text-xs text-gray-400">
                  Note: OAuth mode is deprecated. Please contact your administrator to enable Service Account mode.
                </span>
              <% end %>
            </p>
          </div>

          <!-- Service Account Status -->
          <div class="mt-5">
            <%= if @service_account_configured do %>
              <div class="rounded-md bg-green-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <.icon name="hero-check-circle" class="h-5 w-5 text-green-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">
                      Service Account Configured
                    </h3>
                    <div class="mt-2 text-sm text-green-700">
                      <p>Google Calendar integration is active. Band calendars are managed centrally.</p>
                    </div>
                  </div>
                </div>
              </div>
            <% else %>
              <div class="rounded-md bg-yellow-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <.icon name="hero-exclamation-triangle" class="h-5 w-5 text-yellow-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">
                      Service Account Not Configured
                    </h3>
                    <div class="mt-2 text-sm text-yellow-700">
                      <p>Configure a Google Service Account to enable calendar features.</p>
                    </div>
                  </div>
                </div>
              </div>
            <% end %>
          </div>

          <!-- Band Calendar Status -->
          <%= if @service_account_configured && @band do %>
            <div class="mt-8">
              <h4 class="text-base leading-6 font-medium text-gray-900">
                Band Calendar
              </h4>
              <%= if @has_calendar do %>
                <div class="mt-4 space-y-4">
                  <!-- Calendar Access Options -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h5 class="text-sm font-medium text-gray-900 mb-3">Calendar Access Options</h5>
                    
                    <!-- Google Calendar Link -->
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Google Calendar Link</label>
                      <div class="flex items-center space-x-2">
                        <input type="text" readonly value={@shareable_link} class="block w-full pr-10 sm:text-sm border-gray-300 rounded-md bg-white" />
                        <button phx-click="copy_link" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <.icon name="hero-clipboard-document" class="h-4 w-4" />
                        </button>
                      </div>
                      <p class="mt-1 text-xs text-gray-500">Share this link for users to add the calendar to their Google Calendar</p>
                    </div>
                    
                    <!-- iCal Feed URL -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">iCal Feed URL</label>
                      <div class="flex items-center space-x-2">
                        <input type="text" readonly value={@ical_url} class="block w-full pr-10 sm:text-sm border-gray-300 rounded-md bg-white" />
                        <button phx-click="copy_ical_url" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <.icon name="hero-clipboard-document" class="h-4 w-4" />
                        </button>
                      </div>
                      <p class="mt-1 text-xs text-gray-500">Use this URL in Apple Calendar, Outlook, or other calendar apps</p>
                    </div>
                  </div>

                  <!-- Calendar Shares -->
                  <div class="mt-6">
                    <div class="flex items-center justify-between mb-3">
                      <h5 class="text-sm font-medium text-gray-900">Calendar Permissions</h5>
                      <button phx-click="show_share_modal" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <.icon name="hero-user-plus" class="h-4 w-4 mr-1" />
                        Share Calendar
                      </button>
                    </div>

                    <%= if length(@calendar_shares) > 0 do %>
                      <div class="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul role="list" class="divide-y divide-gray-200">
                          <%= for share <- @calendar_shares do %>
                            <li class="px-4 py-4 sm:px-6">
                              <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                  <.icon name="hero-user" class="h-5 w-5 text-gray-400 mr-3" />
                                  <div>
                                    <p class="text-sm font-medium text-gray-900">
                                      <%= share.email || "Unknown" %>
                                    </p>
                                    <p class="text-sm text-gray-500">
                                      <%= String.capitalize(share.role) %> access
                                    </p>
                                  </div>
                                </div>
                                <button phx-click="remove_share" phx-value-rule_id={share.id} class="ml-4 text-sm text-red-600 hover:text-red-900">
                                  Remove
                                </button>
                              </div>
                            </li>
                          <% end %>
                        </ul>
                      </div>
                    <% else %>
                      <p class="text-sm text-gray-500">No calendar shares yet. Band members can use the iCal URL above.</p>
                    <% end %>
                  </div>
                </div>
              <% else %>
                <div class="mt-4 rounded-md bg-blue-50 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <.icon name="hero-information-circle" class="h-5 w-5 text-blue-400" />
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-blue-800">
                        No Calendar Created
                      </h3>
                      <div class="mt-2 text-sm text-blue-700">
                        <p>Create a band calendar to sync rehearsals and shows.</p>
                      </div>
                    </div>
                  </div>
                </div>
              <% end %>
            </div>
          <% end %>
        </div>
      </div>

      <!-- Create Calendar Modal -->
      <%= if @show_create_calendar_modal do %>
        <div class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div phx-click="hide_create_calendar_modal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all mt-12 max-w-lg w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <.icon name="hero-calendar-days" class="h-6 w-6 text-blue-600" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Create Band Calendar
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        This will create a dedicated Google Calendar for <%= @band && @band.name %> that will be shared with all band members.
                      </p>
                      <%= if @calendar_error do %>
                        <div class="mt-3 rounded-md bg-red-50 p-3">
                          <p class="text-sm text-red-800"><%= @calendar_error %></p>
                        </div>
                      <% end %>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button phx-click="create_calendar" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Create Calendar
                </button>
                <button phx-click="hide_create_calendar_modal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      <% end %>

      <!-- Share Calendar Modal -->
      <%= if @show_share_modal do %>
        <div class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div phx-click="hide_share_modal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all mt-12 max-w-lg w-full">
              <form phx-submit="share_calendar">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Share Calendar</h3>
                  
                  <div class="space-y-4">
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                      <input type="email" name="email" id="email" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    
                    <div>
                      <label for="role" class="block text-sm font-medium text-gray-700">Permission level</label>
                      <select name="role" id="role" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="reader">Reader (view only)</option>
                        <option value="writer">Writer (create and edit events)</option>
                      </select>
                    </div>
                  </div>
                  
                  <%= if @share_error do %>
                    <div class="mt-3 rounded-md bg-red-50 p-3">
                      <p class="text-sm text-red-800"><%= @share_error %></p>
                    </div>
                  <% end %>
                </div>
                
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Share
                  </button>
                  <button phx-click="hide_share_modal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      <% end %>

      <!-- Service Account Configuration Modal -->
      <%= if @show_service_account_modal do %>
        <div class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div phx-click="hide_service_account_modal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all mt-12 max-w-2xl w-full">
              <form phx-submit="save_service_account">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Configure Service Account</h3>
                  
                  <div class="space-y-4">
                    <div>
                      <label for="sa_name" class="block text-sm font-medium text-gray-700">Service Account Name</label>
                      <input type="text" name="name" id="sa_name" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Band Boss Calendar" />
                    </div>
                    
                    <div>
                      <label for="sa_credentials" class="block text-sm font-medium text-gray-700">Service Account JSON</label>
                      <textarea name="credentials" id="sa_credentials" rows="10" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono text-xs" placeholder="Paste the entire service account JSON file here"></textarea>
                      <p class="mt-1 text-xs text-gray-500">
                        Download this from Google Cloud Console > IAM & Admin > Service Accounts
                      </p>
                    </div>
                  </div>
                  
                  <%= if @service_account_error do %>
                    <div class="mt-3 rounded-md bg-red-50 p-3">
                      <p class="text-sm text-red-800"><%= @service_account_error %></p>
                    </div>
                  <% end %>
                </div>
                
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Save Configuration
                  </button>
                  <button phx-click="hide_service_account_modal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      <% end %>
    </div>

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
