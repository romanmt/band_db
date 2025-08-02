defmodule Mix.Tasks.Test.All do
  @moduledoc """
  A Mix task to run all tests including unit, integration, and E2E tests.

  ## Examples

      # Run all tests
      mix test.all

      # Run a specific test file
      mix test.all test/band_db/set_list_server_test.exs

      # Run tests matching a specific pattern
      mix test.all --only business_logic

  """
  use Mix.Task

  @preferred_cli_env :test

  @shortdoc "Run all tests including unit, integration, and E2E tests"
  def run(args) do
    # Use Mix.shell to run the command with the env var set
    Mix.shell().cmd("WALLABY_SERVER=true mix test --include db --include e2e #{Enum.join(args, " ")}")
  end
end
