defmodule BandDb.Repo.Migrations.CreateServiceAccounts do
  use Ecto.Migration

  def up do
    create table(:service_accounts) do
      add :name, :string, null: false
      add :credentials, :text, null: false
      add :project_id, :string
      add :active, :boolean, default: true, null: false
      
      timestamps(type: :utc_datetime)
    end

    create unique_index(:service_accounts, [:name])
    create index(:service_accounts, [:active])
  end

  def down do
    drop index(:service_accounts, [:active])
    drop unique_index(:service_accounts, [:name])
    drop table(:service_accounts)
  end
end