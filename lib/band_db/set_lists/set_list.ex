defmodule BandDb.SetLists.SetList do
  @moduledoc """
  Schema representing a set list, which is a collection of sets.
  """
  defstruct [:id, :name, :sets, :total_duration]

  @doc """
  Creates a new SetList with the given attributes.
  Generates a UUID for the set list and sets default values.
  """
  def new(attrs \\ %{}) do
    struct!(__MODULE__, Map.merge(%{
      id: Ecto.UUID.generate(),
      name: nil,
      sets: [],
      total_duration: nil
    }, attrs))
  end

  @doc """
  Creates a changeset for a set list.
  This is kept for compatibility with the existing code and future database migration.
  """
  def changeset(%__MODULE__{} = set_list, params) when is_map(params) do
    set_list
    |> Map.from_struct()
    |> Map.merge(params)
    |> new()
  end
end
