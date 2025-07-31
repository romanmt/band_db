defmodule BandDb.Encrypted.Binary do
  @moduledoc """
  A custom Ecto type for storing encrypted binary data.
  """
  use Cloak.Ecto.Binary, vault: BandDb.Vault
end