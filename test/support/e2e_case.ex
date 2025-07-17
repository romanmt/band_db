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

    # Start the server for e2e tests
    {:ok, _} = Application.ensure_all_started(:wallaby)

    # Create a session
    {:ok, session} = Wallaby.start_session()

    {:ok, session: session}
  end

  def login_user(session, user) do
    session
    |> Wallaby.Browser.visit("/users/log_in")
    |> Wallaby.Browser.fill_in(Wallaby.Query.css("input[name='user[email]']"), with: user.email)
    |> Wallaby.Browser.fill_in(Wallaby.Query.css("input[name='user[password]']"), with: BandDb.AccountsFixtures.valid_user_password())
    |> Wallaby.Browser.click(Wallaby.Query.css("button", text: "Log in"))
  end

  def create_user_with_band(attrs \\ %{}) do
    band = BandDb.AccountsFixtures.band_fixture()
    user = BandDb.AccountsFixtures.user_fixture(Map.put(attrs, :band_id, band.id))
    %{user: user, band: band}
  end
end
