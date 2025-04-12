defmodule BandDb.Rehearsals.RehearsalPlan do
  use Ecto.Schema
  import Ecto.Changeset

  schema "rehearsal_plans" do
    field :date, :date
    field :rehearsal_songs, {:array, :string}
    field :set_songs, {:array, :string}
    field :duration, :integer  # Duration in minutes

    timestamps()
  end

  def changeset(%__MODULE__{} = plan, params) when is_map(params) do
    plan
    |> cast(params, [:date, :rehearsal_songs, :set_songs, :duration])
    |> validate_required([:date])
  end
end
