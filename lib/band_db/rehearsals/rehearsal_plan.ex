defmodule BandDb.Rehearsals.RehearsalPlan do
  use Ecto.Schema
  import Ecto.Changeset
  alias BandDb.Accounts.Band

  schema "rehearsal_plans" do
    field :date, :date
    field :rehearsal_songs, {:array, :string}
    field :set_songs, {:array, :string}
    field :duration, :integer  # Duration in minutes

    # Calendar integration fields
    field :scheduled_date, :date
    field :start_time, :time
    field :end_time, :time
    field :location, :string
    field :calendar_event_id, :string
    belongs_to :band, Band

    timestamps()
  end

  def changeset(%__MODULE__{} = plan, params) when is_map(params) do
    plan
    |> cast(params, [:date, :rehearsal_songs, :set_songs, :duration, :scheduled_date, :start_time, :end_time, :location, :calendar_event_id, :band_id])
    |> validate_required([:date, :band_id])
    |> foreign_key_constraint(:band_id)
  end
end
