defmodule BandDb.Repo do
  use Ecto.Repo,
    otp_app: :band_db,
    adapter: Ecto.Adapters.Postgres
end
