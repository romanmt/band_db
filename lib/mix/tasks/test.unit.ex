defmodule Mix.Tasks.Test.Unit do
  @moduledoc """
  A Mix task to run unit tests with the proper configuration.

  ## Examples

      # Run all unit tests
      mix test.unit

      # Run a specific test file
      mix test.unit test/band_db/set_list_server_test.exs

      # Run tests matching a specific pattern
      mix test.unit --only business_logic

  """
  use Mix.Task

  @preferred_cli_env :test

  @shortdoc "Run unit tests with mock database"
  def run(args) do
    # Run the tests with the exclude db tag
    Mix.Task.run("test", ["--exclude", "db"] ++ args)
  end
end
