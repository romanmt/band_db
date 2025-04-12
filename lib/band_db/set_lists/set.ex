defmodule BandDb.SetLists.Set do
  @moduledoc """
  Schema representing a set within a set list.
  A set is a collection of songs with metadata like duration and break time.
  """
  defstruct [:id, :name, :songs, :duration, :break_duration, :set_order, :set_list_id]

  @doc """
  Creates a new Set with the given attributes.
  Generates a UUID for the set and sets default values.
  """
  def new(attrs \\ %{}) do
    struct!(__MODULE__, Map.merge(%{
      id: Ecto.UUID.generate(),
      name: nil,
      songs: [],
      duration: nil,
      break_duration: nil,
      set_order: nil,
      set_list_id: nil
    }, attrs))
  end

  @doc """
  Creates a changeset for a set.
  This is kept for compatibility with the existing code and future database migration.
  """
  def changeset(%__MODULE__{} = set, params) when is_map(params) do
    set
    |> Map.from_struct()
    |> Map.merge(params)
    |> new()
  end
end
