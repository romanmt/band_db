defmodule BandDb.Repo.Migrations.CreateSongs do
  use Ecto.Migration

  def change do
    create table(:songs) do
      add :title, :string, null: false
      add :status, :string, null: false
      add :notes, :text
      add :band_name, :string, null: false
      add :duration, :integer
      add :tuning, :string, null: false, default: "standard"

      timestamps()
    end

    create unique_index(:songs, [:title])
  end
end
