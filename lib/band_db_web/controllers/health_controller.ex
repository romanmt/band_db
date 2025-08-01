defmodule BandDbWeb.HealthController do
  use BandDbWeb, :controller
  
  alias BandDb.Calendar
  
  def index(conn, _params) do
    health_data = %{
      status: "ok",
      service_account: %{
        enabled: Calendar.use_service_account?(),
        configured: Calendar.service_account_available?()
      }
    }
    
    json(conn, health_data)
  end
end