defmodule BandDb.Calendar.GoogleAuth do
  use Ecto.Schema
  import Ecto.Changeset

  schema "google_auths" do
    field :refresh_token, :string
    field :access_token, :string
    field :expires_at, :utc_datetime
    field :calendar_id, :string
    field :user_id, :id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(google_auth, attrs) do
    google_auth
    |> cast(attrs, [:refresh_token, :access_token, :expires_at, :calendar_id])
    |> validate_required([:refresh_token, :access_token, :expires_at])
  end
end
