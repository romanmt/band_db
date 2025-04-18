defmodule BandDb.Rehearsals.RehearsalPlan do
  use Ecto.Schema
  import Ecto.Changeset

  schema "rehearsal_plans" do
    field :date, :date
    field :rehearsal_songs, {:array, :string}
    field :set_songs, {:array, :string}
    field :duration, :integer  # Duration in minutes
    field :band_id, :binary_id  # Add band_id field

    # Calendar integration fields
    field :scheduled_date, :date
    field :start_time, :time
    field :end_time, :time
    field :location, :string
    field :calendar_event_id, :string

    timestamps()
  end

  def changeset(%__MODULE__{} = plan, params) when is_map(params) do
    plan
    |> cast(params, [:date, :rehearsal_songs, :set_songs, :duration, :band_id, :scheduled_date, :start_time, :end_time, :location, :calendar_event_id])
    |> validate_required([:date])
  end
end
