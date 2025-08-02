defmodule Mix.Tasks.Test.E2e do
  @moduledoc """
  A Mix task to run E2E tests with Wallaby.

  ## Examples

      # Run all E2E tests
      mix test.e2e

      # Run a specific E2E test file
      mix test.e2e test/e2e/song_management_test.exs

  """
  use Mix.Task

  @preferred_cli_env :test

  @shortdoc "Run E2E tests with Wallaby"
  def run(args) do
    # Use Mix.shell to run the command with the env var set
    Mix.shell().cmd("WALLABY_SERVER=true mix test --only e2e #{Enum.join(args, " ")}")
  end
end