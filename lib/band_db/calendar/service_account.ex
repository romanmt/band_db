defmodule BandDb.Calendar.ServiceAccount do
  use Ecto.Schema
  import Ecto.Changeset

  schema "service_accounts" do
    field :name, :string
    field :credentials, :string
    field :project_id, :string
    field :active, :boolean, default: true

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(service_account, attrs) do
    service_account
    |> cast(attrs, [:name, :credentials, :project_id, :active])
    |> validate_required([:name, :credentials])
    |> unique_constraint(:name)
    |> validate_credentials()
  end

  defp validate_credentials(changeset) do
    case get_change(changeset, :credentials) do
      nil -> changeset
      credentials ->
        case Jason.decode(credentials) do
          {:ok, json} ->
            if valid_service_account_json?(json) do
              changeset
            else
              add_error(changeset, :credentials, "invalid service account JSON structure")
            end
          {:error, _} ->
            add_error(changeset, :credentials, "invalid JSON format")
        end
    end
  end

  defp valid_service_account_json?(json) do
    required_fields = ["type", "project_id", "private_key_id", "private_key", 
                       "client_email", "client_id", "auth_uri", "token_uri"]
    
    Enum.all?(required_fields, &Map.has_key?(json, &1)) &&
      json["type"] == "service_account"
  end
end