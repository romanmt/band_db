defmodule BandDb.RepoMock do
  @moduledoc """
  Mock implementation of Repo for unit testing.
  This module mimics the behavior of BandDb.Repo without touching the database.
  """
  require Logger

  def all(_query) do
    []
  end

  def get(_schema, _id) do
    nil
  end

  def get_by(_schema, _clauses) do
    nil
  end

  def one(_query) do
    nil
  end

  def insert(_struct_or_changeset, _opts \\ []) do
    {:ok, %{id: "mock-id-#{:rand.uniform(1000)}"}}
  end

  def insert!(_struct_or_changeset, _opts \\ []) do
    %{id: "mock-id-#{:rand.uniform(1000)}"}
  end

  def update(_changeset, _opts \\ []) do
    {:ok, %{}}
  end

  def update!(_changeset, _opts \\ []) do
    %{}
  end

  def delete(_struct_or_changeset, _opts \\ []) do
    {:ok, %{}}
  end

  def delete!(_struct_or_changeset) do
    %{}
  end

  def delete_all(_query) do
    {0, nil}
  end

  def transaction(fun, _opts \\ []) do
    try do
      result = fun.()
      {:ok, result}
    rescue
      error -> {:error, error}
    end
  end

  def rollback(value) do
    throw({:rollback, value})
  end
end
