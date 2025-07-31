defmodule BandDb.Accounts.Band do
  use Ecto.Schema
  import Ecto.Changeset
  alias BandDb.Accounts.User
  alias BandDb.Songs.Song
  alias BandDb.Rehearsals.RehearsalPlan
  alias BandDb.SetLists.SetList

  schema "bands" do
    field :name, :string
    field :description, :string
    field :calendar_id, :string
    field :ical_token, :string

    has_many :users, User
    has_many :songs, Song
    has_many :rehearsal_plans, RehearsalPlan
    has_many :set_lists, SetList

    timestamps()
  end

  @doc """
  Creates a changeset for a band.
  """
  def changeset(band, attrs) do
    band
    |> cast(attrs, [:name, :description, :calendar_id, :ical_token])
    |> validate_required([:name])
    |> unique_constraint(:name)
    |> unique_constraint(:ical_token)
  end

  @doc """
  Generates a secure token for iCal feeds.
  """
  def generate_ical_token do
    :crypto.strong_rand_bytes(32)
    |> Base.url_encode64(padding: false)
  end
end
