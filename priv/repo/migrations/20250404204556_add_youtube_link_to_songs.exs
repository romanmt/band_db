defmodule BandDb.Repo.Migrations.AddYoutubeLinkToSongs do
  use Ecto.Migration

  def change do
    alter table(:songs) do
      add :youtube_link, :string
    end
  end
end
