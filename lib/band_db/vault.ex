defmodule BandDb.Vault do
  @moduledoc """
  Encryption vault for securing sensitive data like service account credentials.
  Uses AES-256-GCM encryption via Cloak.
  """
  
  use Cloak.Vault, otp_app: :band_db

  @impl GenServer
  def init(config) do
    config =
      Keyword.put(config, :ciphers, [
        default: {
          Cloak.Ciphers.AES.GCM,
          tag: "AES.GCM.V1",
          key: decode_env_key(),
          iv_length: 12
        }
      ])

    {:ok, config}
  end

  defp decode_env_key do
    System.get_env("CLOAK_KEY") ||
      Application.get_env(:band_db, __MODULE__)[:key] ||
      raise """
      Encryption key not found. Please set CLOAK_KEY environment variable or
      configure the key in your config files.
      
      Generate a key with: mix phx.gen.secret 32
      """
  end
end