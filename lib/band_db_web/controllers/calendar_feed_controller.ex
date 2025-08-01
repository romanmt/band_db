defmodule BandDbWeb.CalendarFeedController do
  use BandDbWeb, :controller
  
  alias BandDb.Accounts
  alias BandDb.Calendar.ICSGenerator
  
  @doc """
  Serves the ICS calendar feed for a band.
  Requires band_id and token parameters.
  """
  def show(conn, %{"band_id" => band_id, "token" => token}) do
    with {:ok, band} <- get_band(band_id),
         :ok <- validate_token(band, token) do
      # Generate the ICS feed
      ics_content = ICSGenerator.generate_feed(band)
      
      # Send the response with appropriate headers
      conn
      |> put_resp_content_type("text/calendar")
      |> put_resp_header("content-disposition", "attachment; filename=\"#{band.name}_calendar.ics\"")
      |> put_resp_header("cache-control", "no-cache, no-store, must-revalidate")
      |> send_resp(200, ics_content)
    else
      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> text("Calendar not found")
        
      {:error, :invalid_token} ->
        conn
        |> put_status(:unauthorized)
        |> text("Invalid token")
    end
  end
  
  defp get_band(band_id) do
    case Accounts.get_band(band_id) do
      nil -> {:error, :not_found}
      band -> {:ok, band}
    end
  end
  
  defp validate_token(band, token) do
    if ICSGenerator.validate_token(band, token) do
      :ok
    else
      {:error, :invalid_token}
    end
  end
end