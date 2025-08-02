defmodule Mix.Tasks.Test.Integration do
  @moduledoc """
  A Mix task to run unit and integration tests (excludes E2E tests).

  ## Examples

      # Run unit and integration tests
      mix test.integration

      # Run a specific test file
      mix test.integration test/band_db/accounts_test.exs

      # Run tests matching a specific pattern
      mix test.integration --only business_logic

  """
  use Mix.Task

  @preferred_cli_env :test

  @shortdoc "Run unit and integration tests (no E2E)"
  def run(args) do
    # Run tests including db but excluding e2e
    Mix.Task.run("test", ["--include", "db", "--exclude", "e2e"] ++ args)
  end
end