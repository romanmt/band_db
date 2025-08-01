defmodule BandDbWeb.E2E.SmokeTest do
  use BandDbWeb.E2ECase, async: false
  
  @tag :e2e
  test "homepage loads without errors", %{session: session} do
    session
    |> visit("/")
    |> assert_has(css("body"))
  end
  
  @tag :e2e
  test "login page loads successfully", %{session: session} do
    session
    |> visit("/users/log_in")
    |> wait_for_page_load()
    |> assert_has(css("h2", text: "Welcome back"))
    |> assert_has(css("input[name='user[email]']"))
    |> assert_has(css("input[name='user[password]']"))
  end
  
  @tag :e2e
  test "registration page loads successfully", %{session: session} do
    session
    |> visit("/users/register")
    |> wait_for_page_load()
    |> assert_has(css("input[name='user[email]']"))
    |> assert_has(css("input[name='user[password]']"))
  end
  
  @tag :e2e
  test "basic navigation works", %{session: session} do
    session
    |> visit("/")
    |> wait_for_page_load()
    |> visit("/users/log_in")
    |> wait_for_page_load()
    |> visit("/users/register")
    |> wait_for_page_load()
    |> assert_has(css("input[name='user[email]']"))
  end
end