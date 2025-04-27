defmodule BandDb.Repo.Migrations.ModifySongTitleUniqueConstraint do
  use Ecto.Migration

  def up do
    # Drop the existing unique index on title
    drop_if_exists index(:songs, [:title])

    # Create a new composite unique index on title and band_id
    create unique_index(:songs, [:title, :band_id])
  end

  def down do
    # Revert to original constraint
    drop index(:songs, [:title, :band_id])
    create unique_index(:songs, [:title])
  end
end
