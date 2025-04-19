defmodule BandDb.UnitCase do
  @moduledoc """
  This module defines the test case to be used by pure unit tests
  that don't interact with the database.

  These tests focus on business logic and use mocks for persistence.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      import BandDb.UnitCase

      # Tag these tests as pure unit tests
      @moduletag :unit
    end
  end

  setup _tags do
    :ok
  end
end
