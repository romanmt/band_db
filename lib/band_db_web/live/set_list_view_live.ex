defmodule BandDbWeb.SetListViewLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader
  alias BandDb.SetLists.SetListServer
  alias BandDbWeb.Components.SetListComponent

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(%{"name" => name}, _session, socket) do
    # Get all set lists
    set_lists = SetListServer.list_set_lists()

    # Log info for debugging
    require Logger
    Logger.info("Looking for set list with name: #{name}")

    # Try to find the set list by name
    case find_set_list_by_name(set_lists, name) do
      nil ->
        # Log the failure for debugging
        Logger.error("Set list not found: '#{name}'. Available set lists: #{inspect(Enum.map(set_lists, & &1.name))}")

        {:ok,
          socket
          |> put_flash(:error, "Set list not found")
          |> push_redirect(to: ~p"/set-list/history")}

      set_list ->
        Logger.info("Found set list: #{set_list.name}")

        {:ok,
          socket
          |> assign(set_list: set_list, set_list_name: set_list.name)
          |> assign(:page_title, "Set List: #{set_list.name}")
        }
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <.page_header title={"Set List: " <> @set_list.name}>
        <:action>
          <.link
            navigate={~p"/set-list/history"}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <.icon name="hero-arrow-left" class="mr-2 h-4 w-4" />
            Back to Set Lists
          </.link>
        </:action>
      </.page_header>

      <div class="mt-6">
        <SetListComponent.set_list
          set_list={@set_list}
          id={"set-list-view-#{@set_list_name}"}
          show_header_actions={false}
          show_calendar_details={true}
        />
      </div>
    </div>
    """
  end

  defp find_set_list_by_name(set_lists, name) do
    # First try an exact match
    exact_match = Enum.find(set_lists, fn set_list ->
      set_list.name == name
    end)

    if exact_match do
      exact_match
    else
      # Try URL-decoded name (handle potential double encoding)
      decoded_name =
        try do
          URI.decode(name)
        rescue
          _ -> name
        end

      # Try another level of decoding if the first one didn't work
      double_decoded_name =
        try do
          URI.decode(decoded_name)
        rescue
          _ -> decoded_name
        end

      # Try all variations
      Enum.find(set_lists, nil, fn set_list ->
        set_list.name == decoded_name || set_list.name == double_decoded_name
      end)
    end
  end
end
