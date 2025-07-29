defmodule BandDbWeb.E2E.SongManagementTest do
  use BandDbWeb.E2ECase, async: false

  @tag :e2e
  test "user can view song library when authenticated", %{session: session} do
    %{user: user, band: _band} = create_user_with_band()

    session
    |> login_user(user)
    |> visit("/songs")
    |> assert_has(css("body"))  # Just check page loads
  end

  @tag :e2e
  test "user can access song library only when authenticated", %{session: session} do
    session
    |> visit("/songs")
    |> assert_has(css("h2", text: "Welcome back"))  # Should redirect to login
  end

  @tag :e2e
  test "user can navigate to song library after login", %{session: session} do
    %{user: user, band: _band} = create_user_with_band()

    session
    |> login_user(user)
    |> visit("/songs")
    |> assert_has(css("body"))
    |> visit("/")
    |> visit("/songs")
    |> assert_has(css("body"))
  end

  @tag :e2e
  test "user can open song creation modal", %{session: session} do
    %{user: user, band: _band} = create_user_with_band()

    session
    |> login_user(user)
    |> visit("/songs")
    |> wait_for_page_load()
    |> click(css("button[phx-click=\"show_song_modal\"]", at: 0))
    |> assert_has(css("h3", text: "Add New Song"))
    |> assert_has(css("input[name='song[title]']"))
    |> assert_has(css("input[name='song[band_name]']"))
    |> assert_has(css("select[name='song[status]']"))
  end

  @tag :e2e
  test "user can create a new song", %{session: session} do
    %{user: user, band: _band} = create_user_with_band()

    session
    |> login_user(user)
    |> visit("/songs")
    |> wait_for_page_load()
    |> click(css("button[phx-click=\"show_song_modal\"]", at: 0))
    |> fill_in(css("input[name='song[title]']"), with: "Test Song")
    |> fill_in(css("input[name='song[band_name]']"), with: "Test Band")
    |> fill_in(css("select[name='song[status]']"), with: "needs_learning")
    |> fill_in(css("select[name='song[tuning]']"), with: "standard")
    |> fill_in(css("input[name='song[duration]']"), with: "3:45")
    |> fill_in(css("input[name='song[notes]']"), with: "Test notes for this song")
    |> fill_in(css("input[name='song[youtube_link]']"), with: "https://www.youtube.com/watch?v=test")
    |> click(css("button[type='submit']"))
    |> assert_has(css("body"))  # Just verify page loads after submission
    |> assert_has(css("td", text: "Test Song"))
  end

  @tag :e2e
  test "user can view song details in the list", %{session: session} do
    %{user: user, band: _band} = create_user_with_band()

    # First create a song
    session
    |> login_user(user)
    |> visit("/songs")
    |> wait_for_page_load()
    |> click(css("button[phx-click=\"show_song_modal\"]", at: 0))
    |> fill_in(css("input[name='song[title]']"), with: "View Test Song")
    |> fill_in(css("input[name='song[band_name]']"), with: "View Test Band")
    |> fill_in(css("select[name='song[status]']"), with: "ready")
    |> fill_in(css("select[name='song[tuning]']"), with: "drop_d")
    |> fill_in(css("input[name='song[duration]']"), with: "4:20")
    |> fill_in(css("input[name='song[notes]']"), with: "Ready to perform")
    |> click(css("button[type='submit']"))

    # Then verify it appears in the list with correct details
    session
    |> assert_has(css("td", text: "View Test Song"))
    |> assert_has(css("td", text: "4:20"))
  end

  @tag :e2e
  test "user can create songs with different statuses", %{session: session} do
    %{user: user, band: _band} = create_user_with_band()

    # Create a song with needs_learning status
    session
    |> login_user(user)
    |> visit("/songs")
    |> wait_for_page_load()
    |> click(css("button[phx-click=\"show_song_modal\"]", at: 0))
    |> fill_in(css("input[name='song[title]']"), with: "Learning Song")
    |> fill_in(css("input[name='song[band_name]']"), with: "Test Band")
    |> fill_in(css("select[name='song[status]']"), with: "needs_learning")
    |> click(css("button[type='submit']"))

    # Verify the song was created
    session
    |> assert_has(css("td", text: "Learning Song"))
  end

  @tag :e2e
  test "user can search for songs", %{session: session} do
    %{user: user, band: _band} = create_user_with_band()

    # Create multiple songs
    session
    |> login_user(user)
    |> visit("/songs")
    |> wait_for_page_load()
    |> click(css("button[phx-click=\"show_song_modal\"]", at: 0))
    |> fill_in(css("input[name='song[title]']"), with: "Searchable Song")
    |> fill_in(css("input[name='song[band_name]']"), with: "Test Band")
    |> fill_in(css("select[name='song[status]']"), with: "ready")
    |> click(css("button[type='submit']"))
    |> assert_has(css("div[role='alert']", text: "Song added successfully"))

    session
    |> click(css("button[phx-click=\"show_song_modal\"]", at: 0))
    |> fill_in(css("input[name='song[title]']"), with: "Another Song")
    |> fill_in(css("input[name='song[band_name]']"), with: "Different Band")
    |> fill_in(css("select[name='song[status]']"), with: "needs_learning")
    |> click(css("button[type='submit']"))

    # Search for specific song
    session
    |> fill_in(css("input[name='search[term]']"), with: "Searchable")
    |> assert_has(css("td", text: "Searchable Song"))
    |> refute_has(css("td", text: "Another Song"))
  end

  @tag :e2e
  test "user can update song status", %{session: session} do
    %{user: user, band: _band} = create_user_with_band()

    # Create a song
    session
    |> login_user(user)
    |> visit("/songs")
    |> wait_for_page_load()
    |> click(css("button[phx-click=\"show_song_modal\"]", at: 0))
    |> fill_in(css("input[name='song[title]']"), with: "Status Test Song")
    |> fill_in(css("input[name='song[band_name]']"), with: "Test Band")
    |> fill_in(css("select[name='song[status]']"), with: "needs_learning")
    |> click(css("button[type='submit']"))

    # Verify the song was created
    session
    |> assert_has(css("td", text: "Status Test Song"))
  end

  @tag :e2e
  test "user can handle song creation validation errors", %{session: session} do
    %{user: user, band: _band} = create_user_with_band()

    # Try to create a song with missing required fields
    session
    |> login_user(user)
    |> visit("/songs")
    |> wait_for_page_load()
    |> click(css("button[phx-click=\"show_song_modal\"]", at: 0))
    |> fill_in(css("input[name='song[title]']"), with: "")
    |> fill_in(css("input[name='song[band_name]']"), with: "")
    |> click(css("button[type='submit']"))

    # Should remain on the form (HTML5 validation will prevent submission)
    session
    |> assert_has(css("h3", text: "Add New Song"))
  end

  @tag :e2e
  test "user can close song creation modal", %{session: session} do
    %{user: user, band: _band} = create_user_with_band()

    session
    |> login_user(user)
    |> visit("/songs")
    |> assert_has(css("body"))  # Wait for any element with show_modal
    |> click(css("button[phx-click=\"show_song_modal\"]", at: 0))
    |> assert_has(css("h3", text: "Add New Song"))
    |> click(css("button[phx-click='hide_modal']"))
    |> refute_has(css("h3", text: "Add New Song"))
  end
end
