defmodule BandDb.Songs.Song do
  use Ecto.Schema
  import Ecto.Changeset
  alias BandDb.Accounts.Band

  @type status :: :performed | :needs_learning | :needs_rehearsal | :ready | :suggested
  @type tuning :: :standard | :drop_d | :e_flat | :drop_c_sharp

  schema "songs" do
    field :title, :string
    field :status, Ecto.Enum, values: [:performed, :needs_learning, :needs_rehearsal, :ready, :suggested]
    field :notes, :string
    field :band_name, :string
    field :duration, :integer
    field :tuning, Ecto.Enum, values: [:standard, :drop_d, :e_flat, :drop_c_sharp], default: :standard
    field :youtube_link, :string
    field :uuid, Ecto.UUID
    belongs_to :band, Band

    timestamps()
  end

  @type t :: %__MODULE__{
    title: String.t(),
    status: status(),
    notes: String.t() | nil,
    band_name: String.t(),
    duration: non_neg_integer() | nil,  # Duration in seconds
    tuning: tuning(),
    youtube_link: String.t() | nil,
    uuid: String.t(),
    band_id: integer() | nil,
    band: Band.t() | Ecto.Association.NotLoaded.t() | nil,
    inserted_at: NaiveDateTime.t() | nil,
    updated_at: NaiveDateTime.t() | nil
  }

  def changeset(%__MODULE__{} = song, params) when is_map(params) do
    song
    |> cast(params, [:title, :status, :notes, :band_name, :duration, :tuning, :youtube_link, :uuid, :band_id])
    |> validate_required([:title, :status, :band_name, :uuid, :band_id])
    |> unique_constraint([:title, :band_id])
    |> unique_constraint(:uuid)
    |> foreign_key_constraint(:band_id)
  end
end
