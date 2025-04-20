defmodule Mix.Tasks.Test.All do
  @moduledoc """
  A Mix task to run all tests including database tests.

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

  @shortdoc "Run all tests including database tests"
  def run(args) do
    # Run the tests with the include db tag
    Mix.Task.run("test", ["--include", "db"] ++ args)
  end
end
