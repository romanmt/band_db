defmodule BandDb.SetLists.SetList do
  @moduledoc """
  Schema representing a set list, which is a collection of sets.
  """
  use Ecto.Schema
  import Ecto.Changeset

  schema "set_lists" do
    field :name, :string
    field :total_duration, :integer
    field :date, :date
    field :location, :string
    field :start_time, :time
    field :end_time, :time
    field :calendar_event_id, :string
    has_many :sets, BandDb.SetLists.Set

    timestamps()
  end

  @doc """
  Creates a changeset for a set list.
  """
  def changeset(set_list, attrs) do
    set_list
    |> cast(attrs, [:name, :total_duration, :date, :location, :start_time, :end_time, :calendar_event_id])
    |> validate_required([:name])
    |> unique_constraint(:name)
  end
end
