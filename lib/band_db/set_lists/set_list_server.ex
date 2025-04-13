defmodule BandDb.SetLists.SetListServer do
  @moduledoc """
  GenServer for managing set lists.
  """
  use GenServer
  require Logger
  alias BandDb.{Repo, SetLists.SetList, SetLists.Set}
  import Ecto.Query

  # Client API

  @doc """
  Starts the SetListServer with the given name.
  """
  def start_link(name \\ __MODULE__) do
    GenServer.start_link(__MODULE__, name, name: name)
  end

  @doc """
  Adds a new set list.
  """
  def add_set_list(server \\ __MODULE__, name, sets) do
    GenServer.call(server, {:add_set_list, name, sets})
  end

  @doc """
  Lists all set lists.
  """
  def list_set_lists(server \\ __MODULE__) do
    GenServer.call(server, :list_set_lists)
  end

  @doc """
  Gets a set list by name.
  """
  def get_set_list(server \\ __MODULE__, name) do
    GenServer.call(server, {:get_set_list, name})
  end

  @doc """
  Updates a set list.
  """
  def update_set_list(server \\ __MODULE__, name, sets) do
    GenServer.call(server, {:update_set_list, name, sets})
  end

  @doc """
  Deletes a set list.
  """
  def delete_set_list(server \\ __MODULE__, name) do
    GenServer.call(server, {:delete_set_list, name})
  end

  # Server Callbacks

  @impl true
  def init(_name) do
    {:ok, %{}}
  end

  @impl true
  def handle_call({:add_set_list, name, sets}, _from, state) do
    # Handle both single set and list of sets
    sets = if is_list(sets), do: sets, else: [sets]

    # Calculate total duration
    total_duration = calculate_total_duration(sets)

    # Create the set list with Ecto
    result = Repo.transaction(fn ->
      # Create the set list
      set_list_changeset = SetList.changeset(%SetList{}, %{
        name: name,
        total_duration: total_duration
      })

      case Repo.insert(set_list_changeset) do
        {:ok, set_list} ->
          # Create the sets with proper set_list_id and set_order
          sets_with_order = Enum.with_index(sets, 1)

          set_results = Enum.map(sets_with_order, fn {set, index} ->
            set_attrs = %{
              name: set.name || "Set #{index}",
              duration: set.duration || 0,
              break_duration: set.break_duration || 0,
              songs: set.songs || [],
              set_list_id: set_list.id,
              set_order: index
            }

            %Set{}
            |> Set.changeset(set_attrs)
            |> Repo.insert()
          end)

          case Enum.find(set_results, &match?({:error, _}, &1)) do
            nil -> set_list
            {:error, changeset} -> Repo.rollback({:error, changeset})
          end

        {:error, changeset} ->
          Repo.rollback({:error, changeset})
      end
    end)

    case result do
      {:ok, _set_list} -> {:reply, :ok, state}
      {:error, {:error, changeset}} -> {:reply, {:error, format_changeset_errors(changeset)}, state}
      {:error, reason} -> {:reply, {:error, reason}, state}
    end
  end

  @impl true
  def handle_call(:list_set_lists, _from, state) do
    set_lists = SetList
    |> preload(:sets)
    |> order_by([sl], sl.name)
    |> Repo.all()

    {:reply, set_lists, state}
  end

  @impl true
  def handle_call({:get_set_list, name}, _from, state) do
    case Repo.get_by(SetList, name: name) |> Repo.preload(:sets) do
      nil -> {:reply, {:error, "Set list not found"}, state}
      set_list -> {:reply, {:ok, set_list}, state}
    end
  end

  @impl true
  def handle_call({:update_set_list, name, sets}, _from, state) do
    # Handle both single set and list of sets
    sets = if is_list(sets), do: sets, else: [sets]

    result = Repo.transaction(fn ->
      case Repo.get_by(SetList, name: name) do
        nil ->
          Repo.rollback({:error, "Set list not found"})
        set_list ->
          # Delete existing sets
          Repo.delete_all(from s in Set, where: s.set_list_id == ^set_list.id)

          # Calculate new total duration
          total_duration = calculate_total_duration(sets)

          # Update set list
          case SetList.changeset(set_list, %{total_duration: total_duration})
               |> Repo.update() do
            {:ok, updated_set_list} ->
              # Create new sets with proper set_list_id and set_order
              sets_with_order = Enum.with_index(sets, 1)

              set_results = Enum.map(sets_with_order, fn {set, index} ->
                set_attrs = %{
                  name: set.name || "Set #{index}",
                  duration: set.duration || 0,
                  break_duration: set.break_duration || 0,
                  songs: set.songs || [],
                  set_list_id: updated_set_list.id,
                  set_order: index
                }

                %Set{}
                |> Set.changeset(set_attrs)
                |> Repo.insert()
              end)

              case Enum.find(set_results, &match?({:error, _}, &1)) do
                nil -> updated_set_list
                {:error, changeset} -> Repo.rollback({:error, changeset})
              end

            {:error, changeset} ->
              Repo.rollback({:error, changeset})
          end
      end
    end)

    case result do
      {:ok, _set_list} -> {:reply, :ok, state}
      {:error, {:error, changeset}} when is_map(changeset) ->
        {:reply, {:error, format_changeset_errors(changeset)}, state}
      {:error, reason} -> {:reply, {:error, reason}, state}
    end
  end

  @impl true
  def handle_call({:delete_set_list, name}, _from, state) do
    case Repo.get_by(SetList, name: name) do
      nil ->
        {:reply, {:error, "Set list not found"}, state}
      set_list ->
        # Delete the set list (sets will be deleted via foreign key constraint)
        case Repo.delete(set_list) do
          {:ok, _} -> {:reply, :ok, state}
          {:error, changeset} -> {:reply, {:error, changeset}, state}
        end
    end
  end

  defp calculate_total_duration(sets) do
    Enum.reduce(sets, 0, fn set, total ->
      total + (set.duration || 0) + (set.break_duration || 0)
    end)
  end

  defp format_changeset_errors(changeset) do
    changeset
    |> errors_on()
    |> Map.to_list()
    |> Enum.map_join(", ", fn {key, errors} ->
      errors_text = errors |> Enum.join(", ")
      "#{key} #{errors_text}"
    end)
  end

  # Implementation borrowed from Phoenix framework's test helpers
  # This completely avoids the String.Chars protocol issue
  defp errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {message, opts} ->
      Regex.replace(~r"%{(\w+)}", message, fn _, key ->
        opts
        |> Keyword.get(String.to_existing_atom(key), key)
        |> stringify_value()
      end)
    end)
  end

  defp stringify_value(value) when is_tuple(value), do: inspect(value)
  defp stringify_value(value) when is_atom(value), do: Atom.to_string(value)
  defp stringify_value(value) when is_list(value), do: inspect(value)
  defp stringify_value(value) when is_map(value), do: inspect(value)
  defp stringify_value(value), do: to_string(value)
end
