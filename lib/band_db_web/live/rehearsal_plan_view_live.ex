defmodule BandDbWeb.RehearsalPlanViewLive do
  use BandDbWeb, :live_view
  import BandDbWeb.Components.PageHeader
  alias BandDb.Rehearsals.RehearsalServer
  alias BandDbWeb.Components.RehearsalPlanComponent

  on_mount {BandDbWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(%{"id" => id}, _session, socket) do
    # Get all plans
    plans = RehearsalServer.list_plans()

    # Try to find the plan by ID
    case find_plan_by_id(plans, id) do
      nil ->
        {:ok,
          socket
          |> put_flash(:error, "Rehearsal plan not found")
          |> push_redirect(to: ~p"/rehearsal/history")}

      plan ->
        {:ok, assign(socket, plan: plan, plan_id: id)}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <.page_header title={"Rehearsal Plan: " <> Calendar.strftime(@plan.date, "%B %d, %Y")}>
        <:action>
          <.link
            navigate={~p"/rehearsal/history"}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <.icon name="hero-arrow-left" class="mr-2 h-4 w-4" />
            Back to History
          </.link>
        </:action>
      </.page_header>

      <div class="mt-6">
        <RehearsalPlanComponent.rehearsal_plan
          plan={@plan}
          id={"plan-view-#{@plan_id}"}
          show_header_actions={false}
          show_calendar_details={true}
        />
      </div>
    </div>
    """
  end

  defp find_plan_by_id(plans, id) do
    # Try to interpret the ID as a date first, as that's our most reliable identifier
    case Date.from_iso8601(id) do
      {:ok, date} ->
        # If it's a valid date, find a plan with that date
        Enum.find(plans, fn plan ->
          plan.date == date
        end)
      _ ->
        # Otherwise try other methods (ID or string date)
        Enum.find(plans, fn plan ->
          plan_id = Map.get(plan, :id)
          date_str = Date.to_iso8601(plan.date)

          to_string(plan_id) == id || date_str == id
        end)
    end
  end
end
