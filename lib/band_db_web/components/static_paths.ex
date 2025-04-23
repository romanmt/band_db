defmodule BandDbWeb.StaticPaths do
  @moduledoc """
  Static path helpers for BandDbWeb.
  """

  def static_paths do
    ~w(
      assets
      favicon.ico
      favicon-16x16.png
      favicon-32x32.png
      apple-touch-icon.png
      android-chrome-192x192.png
      robots.txt
      images
    )
  end
end
