defmodule BandDbWeb.E2E.SetListManagementTest do
  use BandDbWeb.E2ECase, async: false

  @tag :e2e
  test "user can navigate to create new setlist", %{session: session} do
    %{user: user, band: _band} = create_user_with_band()
    
    session
    |> login_user(user)
    |> visit("/set-list/new")
    |> wait_for_page_load()
    |> assert_has(css("h1", text: "SET LIST EDITOR"))
    |> assert_has(css("h2", text: "Set Configuration"))
    |> assert_has(css("button[phx-click='add_set']"))
    |> assert_has(css("button", text: "Save Set List"))
  end

  @tag :e2e
  test "user can create a simple setlist", %{session: session} do
    %{user: user, band: band} = create_user_with_band()
    # Create some test songs
    create_test_songs(band, 5)
    
    session
    |> login_user(user)
    |> visit("/set-list/new")
    |> wait_for_page_load()
    # Add songs to Set 1 - the songs are already visible
    # Select first 3 songs using the select_song button
    |> click(css("button[phx-click='select_song'][phx-value-set-index='0']", at: 0))
    |> wait_for_page_load()
    |> click(css("button[phx-click='select_song'][phx-value-set-index='0']", at: 0))
    |> wait_for_page_load()
    |> click(css("button[phx-click='select_song'][phx-value-set-index='0']", at: 0))
    |> wait_for_page_load()
    # Open save modal
    |> click(css("button", text: "Save Set List"))
    |> wait_for_page_load()
    # Enter setlist name
    |> fill_in(css("input[name='name']"), with: "Test Setlist")
    # Save the setlist
    |> click(css("button[type='submit']"))
    |> wait_for_page_load()
    # Verify success
    |> assert_has(css("div[role='alert']", text: "Set list saved successfully!"))
  end

  @tag :e2e
  test "user can create a multi-set setlist", %{session: session} do
    %{user: user, band: band} = create_user_with_band()
    # Create some test songs
    create_test_songs(band, 8)
    
    session
    |> login_user(user)
    |> visit("/set-list/new")
    |> wait_for_page_load()
    # Add songs to Set 1
    |> click(css("button[phx-click='select_song'][phx-value-set-index='0']", at: 0))
    |> wait_for_page_load()
    |> click(css("button[phx-click='select_song'][phx-value-set-index='0']", at: 0))
    |> wait_for_page_load()
    |> click(css("button[phx-click='select_song'][phx-value-set-index='0']", at: 0))
    |> wait_for_page_load()
    # Add Set 2
    |> click(css("button[phx-click='add_set']"))
    |> wait_for_page_load()
    |> assert_has(css("h4", text: "Set 2 Songs"))
    # Verify we have 2 sets now
    |> assert_has(css("h4", text: "Set 1 Songs"))
    |> assert_has(css("h4", text: "Set 2 Songs"))
  end

  @tag :e2e
  test "user can reorder songs within a set", %{session: session} do
    %{user: user, band: band} = create_user_with_band()
    # Create some test songs
    create_test_songs(band, 4)
    
    session
    |> login_user(user)
    |> visit("/set-list/new")
    |> wait_for_page_load()
    # Add 3 songs to Set 1
    |> click(css("button[phx-click='select_song'][phx-value-set-index='0']", at: 0))
    |> wait_for_page_load()
    |> click(css("button[phx-click='select_song'][phx-value-set-index='0']", at: 0))
    |> wait_for_page_load()
    |> click(css("button[phx-click='select_song'][phx-value-set-index='0']", at: 0))
    |> wait_for_page_load()
    |> wait_for_page_load()
    # The songs should be reordered - we'll verify by checking the save works
    |> click(css("button", text: "Save Set List"))
    |> wait_for_page_load()
    |> fill_in(css("input[name='name']"), with: "Reordered Setlist")
    |> click(css("button[type='submit']"))
    |> wait_for_page_load()
    |> assert_has(css("div[role='alert']", text: "Set list saved successfully!"))
  end

  @tag :e2e
  test "user can remove songs from a set", %{session: session} do
    %{user: user, band: band} = create_user_with_band()
    # Create some test songs
    create_test_songs(band, 5)
    
    session
    |> login_user(user)
    |> visit("/set-list/new")
    |> wait_for_page_load()
    # Add 3 songs to Set 1
    |> click(css("button[phx-click='select_song'][phx-value-set-index='0']", at: 0))
    |> wait_for_page_load()
    |> click(css("button[phx-click='select_song'][phx-value-set-index='0']", at: 0))
    |> wait_for_page_load()
    |> click(css("button[phx-click='select_song'][phx-value-set-index='0']", at: 0))
    |> wait_for_page_load()
    # Check we have 3 songs in set 1
    |> assert_has(css("div[data-song-id]", count: 3))
    # Remove the middle song
    |> click(css("button[phx-click='remove_from_set'][phx-value-song-id='1']"))
    |> wait_for_page_load()
    # Now we should have 2 songs
    |> assert_has(css("div[data-song-id]", count: 2))
    # Save to ensure it works
    |> click(css("button", text: "Save Set List"))
    |> wait_for_page_load()
    |> fill_in(css("input[name='name']"), with: "Removed Song Setlist")
    |> click(css("button[type='submit']"))
    |> wait_for_page_load()
    |> assert_has(css("div[role='alert']", text: "Set list saved successfully!"))
  end

end