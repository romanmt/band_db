defmodule BandDbWeb.PageControllerTest do
  use BandDbWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, ~p"/")
    assert redirected_to(conn) == "/users/log_in"
  end
end
