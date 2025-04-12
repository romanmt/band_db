defmodule BandDb.SetLists.Set do
  @moduledoc """
  Schema representing a set within a set list.
  A set is a collection of songs with metadata like duration and break time.
  """
  use Ecto.Schema
  import Ecto.Changeset

  schema "sets" do
    field :name, :string
    field :songs, {:array, :string}
    field :duration, :integer
    field :break_duration, :integer
    field :set_order, :integer
    belongs_to :set_list, BandDb.SetLists.SetList

    timestamps()
  end

  @doc """
  Creates a changeset for a set.
  """
  def changeset(set, attrs) do
    set
    |> cast(attrs, [:name, :songs, :duration, :break_duration, :set_order, :set_list_id])
    |> validate_required([:name, :songs, :set_order, :set_list_id])
    |> foreign_key_constraint(:set_list_id)
  end
end
