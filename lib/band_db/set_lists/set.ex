defmodule BandDb.Set do
  @moduledoc """
  Schema representing a set within a set list.
  A set is a collection of songs with metadata like duration and break time.
  """
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  embedded_schema do
    field :name, :string
    field :songs, {:array, :string}
    field :duration, :integer  # Duration in seconds
    field :break_duration, :integer  # Break duration in seconds after this set (nil for last set)
    field :set_order, :integer  # Order of the set in the set list
  end

  @doc """
  Creates a changeset for a set.
  """
  def changeset(%__MODULE__{} = set, params) when is_map(params) do
    set
    |> cast(params, [:name, :songs, :duration, :break_duration, :set_order])
    |> validate_required([:name, :songs, :set_order])
    |> validate_number(:duration, greater_than_or_equal_to: 0)
    |> validate_number(:break_duration, greater_than_or_equal_to: 0)
    |> validate_number(:set_order, greater_than: 0)
  end
end
