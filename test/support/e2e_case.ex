defmodule BandDbWeb.E2ECase do
  @moduledoc """
  This module defines the test case to be used by
  end-to-end tests using Wallaby.

  You may define functions here to be used as helpers in
  your e2e tests.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      use Wallaby.DSL

      import Ecto.Changeset
      import Ecto.Query
      import BandDb.AccountsFixtures
      import BandDbWeb.E2ECase
      import Wallaby.Query

      alias BandDb.Repo
    end
  end

  setup tags do
    pid = Ecto.Adapters.SQL.Sandbox.start_owner!(BandDb.Repo, shared: not tags[:async])
    on_exit(fn -> Ecto.Adapters.SQL.Sandbox.stop_owner(pid) end)

    # Stop all band servers before each test to ensure clean state
    cleanup_band_servers()

    # Start the server for e2e tests
    {:ok, _} = Application.ensure_all_started(:wallaby)

    # Create a session
    {:ok, session} = Wallaby.start_session()

    on_exit(fn ->
      # Clean up band servers after test
      cleanup_band_servers()
    end)

    {:ok, session: session}
  end

  def login_user(session, user) do
    session
    |> Wallaby.Browser.visit("/users/log_in")
    |> Wallaby.Browser.fill_in(Wallaby.Query.css("input[name='user[email]']"), with: user.email)
    |> Wallaby.Browser.fill_in(Wallaby.Query.css("input[name='user[password]']"), with: BandDb.AccountsFixtures.valid_user_password())
    |> Wallaby.Browser.click(Wallaby.Query.css("button", text: "Log in"))
    |> wait_for_band_server(user)
  end

  defp wait_for_band_server(session, user) do
    # Wait for band server to be fully initialized after login
    if user && user.band_id do
      # Give the band server time to start
      Process.sleep(200)
    end
    session
  end

  def create_user_with_band(attrs \\ %{}) do
    band = BandDb.AccountsFixtures.band_fixture()
    user = BandDb.AccountsFixtures.user_fixture(Map.put(attrs, :band_id, band.id))
    %{user: user, band: band}
  end

  def wait_for_page_load(session) do
    # Wait for the page to be fully loaded
    Process.sleep(300)
    session
  end

  defp cleanup_band_servers do
    # Stop all band servers registered in the BandRegistry
    case Registry.lookup(BandDb.BandRegistry, :all_bands) do
      [] -> :ok
      _ ->
        # Get all registered band servers
        Registry.select(BandDb.BandRegistry, [{{:"$1", :"$2", :"$3"}, [], [{{:"$1", :"$2", :"$3"}}]}])
        |> Enum.each(fn {{_, _band_id}, pid, _} when is_pid(pid) ->
          try do
            DynamicSupervisor.terminate_child(BandDb.BandSupervisor, pid)
          rescue
            _ -> :ok
          catch
            _, _ -> :ok
          end
        end)
    end
    
    # Give processes time to shut down
    Process.sleep(200)
  end

  def create_test_songs(band, count) do
    # Create a temporary user for the band to start servers
    temp_user = %{id: 999999, band_id: band.id}
    BandDb.Accounts.ServerLifecycle.on_user_login(temp_user)
    
    # Get the song server for this band
    song_server = BandDb.ServerLookup.get_song_server(band.id)
    
    # Create test songs
    Enum.map(1..count, fn i ->
      BandDb.Songs.SongServer.add_song(
        "Test Song #{i}",
        :ready,
        "Test Band",
        180 + i * 10, # 3 minutes plus some variation
        "Test song for e2e testing",
        :standard,
        nil,
        band.id,
        song_server
      )
    end)
    
    # Give the server time to process
    Process.sleep(100)
  end

  def wait_for_setlist_editor(session) do
    # Wait for the setlist editor to be fully loaded
    Process.sleep(500)
    session
    |> Wallaby.Browser.has?(Wallaby.Query.css("h1", text: "SET LIST EDITOR"))
    session
  end
end
