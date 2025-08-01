defmodule BandDbWeb.E2E.RehearsalPlanTest do
  use BandDbWeb.E2ECase, async: false

  @tag :e2e
  test "user can create and accept a rehearsal plan", %{session: session} do
    %{user: user, band: band} = create_user_with_band()
    
    # Ensure user has band_id set
    assert user.band_id == band.id, "User should be associated with band"
    
    # Create test songs with different statuses and tunings
    create_rehearsal_test_songs(band)
    
    session
    |> login_user(user)
    |> visit("/rehearsal")
    |> wait_for_page_load()
    
    # Add a longer wait to ensure the page fully loads and servers are ready
    |> then(fn session ->
      Process.sleep(1000)
      session
    end)
    
    # Verify the rehearsal plan page loaded with key elements
    # The h1 might be uppercase based on the page_header component
    |> assert_has(css("h1", text: "REHEARSAL PLAN"))
    |> assert_has(css("button", text: "Generate New Plan"))
    |> assert_has(css("button", text: "Accept Plan"))
    
    # Verify total rehearsal time is displayed
    |> assert_has(css("h2", text: "Total Rehearsal Time"))
    
    # Verify rehearsal section shows songs that need learning
    |> assert_has(css("span", text: "Songs to Rehearse"))
    
    # Verify practice set list section
    |> assert_has(css("span", text: "Practice Set List"))
    
    # Click Accept Plan to open the modal
    |> click(css("button", text: "Accept Plan"))
    |> wait_for_page_load()
    
    # Verify modal opened
    |> assert_has(css("h3", text: "Save Rehearsal Plan"))
    
    # Fill in the date (required field)
    # Use JavaScript to set date value directly
    |> execute_script("document.querySelector('input[name=\"date\"]').value = '2025-08-10'")
    
    # For calendar integration, we'll test the UI but not actual API calls
    # Check if calendar option is available (user has calendar configured)
    |> then(fn session ->
      if has?(session, css("input#should_schedule")) do
        session
        # Calendar is available, but we won't actually create events in e2e tests
        # Just verify the UI works correctly
        |> click(css("input#should_schedule"))
        |> wait_for_page_load()
        # Verify calendar fields appear
        |> assert_has(css("input#start_time"))
        |> assert_has(css("input#end_time"))
        |> assert_has(css("input#location"))
        # Fill in calendar details
        |> fill_in(css("input#location"), with: "Practice Room")
      else
        # No calendar configured, continue without it
        session
      end
    end)
    
    # Submit the form
    |> click(css("button", text: "Save Plan"))
    |> wait_for_page_load()
    
    # Verify success and redirect to history
    |> assert_has(css("div[role='alert']", text: "Rehearsal plan saved"))
    |> assert_has(css("h1", text: "REHEARSAL HISTORY"))
  end

  @tag :e2e
  test "user can regenerate a rehearsal plan", %{session: session} do
    %{user: user, band: band} = create_user_with_band()
    create_rehearsal_test_songs(band)
    
    session
    |> login_user(user)
    |> visit("/rehearsal")
    |> wait_for_page_load()
    |> then(fn session ->
      Process.sleep(500)
      session
    end)
    
    # Note: Since the plan generation is somewhat random, we can't easily verify
    # that the content changed. Instead, we'll just verify the action completes
    # without errors and the page updates
    
    # Click regenerate
    |> click(css("button", text: "Generate New Plan"))
    |> wait_for_page_load()
    
    # Verify we're still on the rehearsal plan page with all elements
    |> assert_has(css("h1", text: "REHEARSAL PLAN"))
    |> assert_has(css("span", text: "Songs to Rehearse"))
    |> assert_has(css("span", text: "Practice Set List"))
  end

  @tag :e2e
  test "user can cancel plan acceptance", %{session: session} do
    %{user: user, band: band} = create_user_with_band()
    create_rehearsal_test_songs(band)
    
    session
    |> login_user(user)
    |> visit("/rehearsal")
    |> wait_for_page_load()
    |> then(fn session ->
      Process.sleep(500)
      session
    end)
    
    # Open the accept plan modal
    |> click(css("button", text: "Accept Plan"))
    |> wait_for_page_load()
    |> assert_has(css("h3", text: "Save Rehearsal Plan"))
    
    # Click cancel
    |> click(css("button", text: "Cancel"))
    |> wait_for_page_load()
    
    # Verify modal is closed and we're still on the rehearsal plan page
    |> refute_has(css("h3", text: "Save Rehearsal Plan"))
    |> assert_has(css("h1", text: "REHEARSAL PLAN"))
  end

  # Helper function to create songs specifically for rehearsal testing
  defp create_rehearsal_test_songs(band) do
    # Create a temporary user for the band to start servers
    temp_user = %{id: 999999, band_id: band.id}
    BandDb.Accounts.ServerLifecycle.on_user_login(temp_user)
    
    # Wait for servers to start
    Process.sleep(300)
    
    # Get the song server for this band
    song_server = BandDb.ServerLookup.get_song_server(band.id)
    
    # Create songs that need learning (will appear in rehearsal section)
    Enum.each(1..3, fn i ->
      BandDb.Songs.SongServer.add_song(
        "Learn Song #{i}",
        :needs_learning,
        "Test Band #{i}",
        180 + i * 10,
        "Needs practice",
        :standard,
        nil,
        band.id,
        song_server
      )
    end)
    
    # Create one more song with different tuning that needs learning
    BandDb.Songs.SongServer.add_song(
      "Drop D Song",
      :needs_learning,
      "Heavy Band",
      240,
      "In drop D tuning",
      :drop_d,
      nil,
      band.id,
      song_server
    )
    
    # Create ready songs (will appear in set list)
    Enum.each(1..5, fn i ->
      BandDb.Songs.SongServer.add_song(
        "Ready Song #{i}",
        :ready,
        "Cover Band #{i}",
        200 + i * 10,
        "Ready to perform",
        :standard,
        nil,
        band.id,
        song_server
      )
    end)
    
    # Create some performed songs with different tunings
    BandDb.Songs.SongServer.add_song(
      "Performed Drop D",
      :performed,
      "Rock Band",
      210,
      "Already performed",
      :drop_d,
      nil,
      band.id,
      song_server
    )
    
    BandDb.Songs.SongServer.add_song(
      "Performed E Flat",
      :performed,
      "Metal Band",
      195,
      "Already performed",
      :e_flat,
      nil,
      band.id,
      song_server
    )
    
    # Give the server time to process
    Process.sleep(100)
  end
end