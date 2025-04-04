defmodule BandDbWeb.RehearsalHistoryLive do
  use BandDbWeb, :live_view
  alias BandDb.RehearsalPlanServer
  import BandDbWeb.Components.PageHeader

  @impl true
  def mount(_params, _session, socket) do
    plans = RehearsalPlanServer.list_plans()
    # Add expanded state to each plan
    plans = Enum.map(plans, &Map.put(&1, :expanded, false))
    {:ok, assign(socket, plans: plans)}
  end

  @impl true
  def handle_event("toggle_plan", %{"id" => date_str}, socket) do
    date = Date.from_iso8601!(date_str)
    plans = Enum.map(socket.assigns.plans, fn plan ->
      if plan.date == date do
        Map.put(plan, :expanded, !plan.expanded)
      else
        plan
      end
    end)
    {:noreply, assign(socket, plans: plans)}
  end

  @impl true
  def handle_event("print_plan", %{"id" => date_str}, socket) do
    date = Date.from_iso8601!(date_str)
    # First expand the plan
    plans = Enum.map(socket.assigns.plans, fn plan ->
      if plan.date == date do
        Map.put(plan, :expanded, true)
      else
        plan
      end
    end)
    # Then trigger print after a short delay to ensure the content is expanded
    {:noreply,
      socket
      |> assign(plans: plans)
      |> push_event("print_plan", %{date: date_str})}
  end

  defp format_duration(nil), do: ""
  defp format_duration(seconds) when is_integer(seconds) do
    minutes = div(seconds, 60)
    remaining_seconds = rem(seconds, 60)
    :io_lib.format("~2..0B:~2..0B", [minutes, remaining_seconds])
  end

  defp status_color(:needs_learning), do: "bg-yellow-100 text-yellow-800"
  defp status_color(:ready), do: "bg-green-100 text-green-800"
  defp status_color(:performed), do: "bg-blue-100 text-blue-800"
  defp status_color(:suggested), do: "bg-purple-100 text-purple-800"
end
