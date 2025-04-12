defmodule BandDb.Songs.Song do
  use Ecto.Schema
  import Ecto.Changeset

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
    inserted_at: NaiveDateTime.t() | nil,
    updated_at: NaiveDateTime.t() | nil
  }

  def changeset(%__MODULE__{} = song, params) when is_map(params) do
    song
    |> cast(params, [:title, :status, :notes, :band_name, :duration, :tuning, :youtube_link, :uuid])
    |> validate_required([:title, :status, :band_name, :uuid])
    |> unique_constraint(:title)
    |> unique_constraint(:uuid)
  end
end
