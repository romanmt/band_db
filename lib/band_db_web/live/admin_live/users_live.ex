defmodule BandDbWeb.AdminLive.UsersLive do
  use BandDbWeb, :live_view
  alias BandDb.Accounts
  alias BandDb.Accounts.User

  def mount(_params, _session, socket) do
    {:ok, assign(socket, users: list_users(), invitation_link: nil, invitation_expires_at: nil)}
  end

  def handle_event("delete", %{"id" => id}, socket) do
    user = Accounts.get_user!(id)
    {:ok, _} = Accounts.delete_user(user)
    {:noreply, assign(socket, users: list_users())}
  end

  def handle_event("toggle_admin", %{"id" => id}, socket) do
    user = Accounts.get_user!(id)
    {:ok, _updated_user} = Accounts.update_user_admin_status(user, !user.is_admin)
    {:noreply, assign(socket, users: list_users())}
  end

  def handle_event("generate_invite", _params, socket) do
    base_url = BandDbWeb.Endpoint.url()
    {_token, url, expires_at} = Accounts.generate_invitation_link(base_url)
    {:noreply, assign(socket, invitation_link: url, invitation_expires_at: expires_at)}
  end

  def handle_event("clear_invite", _params, socket) do
    {:noreply, assign(socket, invitation_link: nil, invitation_expires_at: nil)}
  end

  defp list_users do
    Accounts.list_users()
  end

  def render(assigns) do
    ~H"""
    <div class="space-y-6">
      <%= if @invitation_link do %>
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900">Invitation Link Generated</h3>
                <p class="mt-1 text-sm text-gray-500">Share this link with the person you want to invite:</p>
                <p class="mt-1 text-sm text-gray-500">
                  Expires at: <%= Calendar.strftime(@invitation_expires_at, "%Y-%m-%d %H:%M:%S UTC") %>
                </p>
              </div>
              <div class="flex items-start space-x-4">
                <div class="min-w-0 flex-1">
                  <div class="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      readonly
                      value={@invitation_link}
                      class="block w-full min-w-[40rem] pr-10 sm:text-sm border-gray-300 rounded-md"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        phx-click={JS.dispatch("clipboard-copy", to: "#invitation-link")}
                        data-clipboard-text={@invitation_link}
                        class="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <span class="sr-only">Copy</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  phx-click="clear_invite"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      <% end %>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Users</h3>
          <button
            phx-click="generate_invite"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Invite Link
          </button>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <%= for user <- @users do %>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  <%= user.email %>
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div class="flex items-center space-x-4">
                    <button
                      phx-click="toggle_admin"
                      phx-value-id={user.id}
                      class={"inline-flex items-center px-3 py-1 rounded-full text-sm font-medium #{if user.is_admin, do: "bg-green-100 text-green-800", else: "bg-gray-100 text-gray-800"}"}
                    >
                      <%= if user.is_admin, do: "Admin", else: "Regular User" %>
                    </button>
                    <button
                      phx-click="delete"
                      phx-value-id={user.id}
                      data-confirm="Are you sure you want to delete this user?"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </dd>
              </div>
            <% end %>
          </dl>
        </div>
      </div>
    </div>

    <script>
    document.addEventListener("clipboard-copy", (event) => {
      const text = event.target.dataset.clipboardText;
      navigator.clipboard.writeText(text).then(() => {
        // Optional: Show a brief success message
        const button = event.target;
        const originalHTML = button.innerHTML;
        button.innerHTML = `<svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>`;
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      });
    });
    </script>
    """
  end
end
