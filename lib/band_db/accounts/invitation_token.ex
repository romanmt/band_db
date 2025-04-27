defmodule BandDb.Accounts.InvitationToken do
  use Ecto.Schema
  import Ecto.Changeset
  alias BandDb.Accounts.Band

  schema "invitation_tokens" do
    field :token, :string
    field :expires_at, :utc_datetime
    field :used_at, :utc_datetime
    belongs_to :created_by, BandDb.Accounts.User
    belongs_to :band, Band

    timestamps(type: :utc_datetime)
  end

  def changeset(invitation_token, attrs) do
    invitation_token
    |> cast(attrs, [:token, :expires_at, :used_at, :created_by_id, :band_id])
    |> validate_required([:token, :expires_at])
    |> unique_constraint(:token)
    |> foreign_key_constraint(:band_id)
  end
end
