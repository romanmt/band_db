defmodule BandDb.SetLists.SetList do
  @moduledoc """
  Schema representing a set list, which is a collection of sets.
  """
  use Ecto.Schema
  import Ecto.Changeset
  alias BandDb.Accounts.Band

  schema "set_lists" do
    field :name, :string
    field :total_duration, :integer
    field :date, :date
    field :location, :string
    field :start_time, :time
    field :end_time, :time
    field :calendar_event_id, :string
    has_many :sets, BandDb.SetLists.Set
    belongs_to :band, Band

    timestamps()
  end

  @doc """
  Creates a changeset for a set list.
  """
  def changeset(set_list, attrs) do
    set_list
    |> cast(attrs, [:name, :total_duration, :date, :location, :start_time, :end_time, :calendar_event_id, :band_id])
    |> validate_required([:name, :band_id])
    |> unique_constraint(:name)
    |> foreign_key_constraint(:band_id)
  end
end
