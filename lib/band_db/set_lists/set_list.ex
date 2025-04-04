defmodule BandDb.SetList do
  @moduledoc """
  Schema representing a set list, which is a collection of sets.
  """
  use Ecto.Schema
  import Ecto.Changeset
  alias BandDb.Set

  schema "set_lists" do
    field :name, :string
    embeds_many :sets, Set
    field :total_duration, :integer  # Total duration including breaks in seconds

    timestamps()
  end

  @doc """
  Creates a changeset for a set list.
  """
  def changeset(%__MODULE__{} = set_list, params) when is_map(params) do
    set_list
    |> cast(params, [:name, :total_duration])
    |> cast_embed(:sets)
    |> validate_required([:name])
    |> unique_constraint(:name)
    |> validate_number(:total_duration, greater_than_or_equal_to: 0)
  end
end
