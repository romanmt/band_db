# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Or from IEx:
#     Code.eval_file("priv/repo/seeds.exs")

alias BandDb.SongServer

# Helper function to convert "MM:SS" to seconds
defmodule Seeds.Helper do
  def duration_to_seconds(duration) when is_binary(duration) do
    case String.split(duration, ":") do
      [minutes, seconds] ->
        String.to_integer(minutes) * 60 + String.to_integer(seconds)
      _ ->
        nil
    end
  end
end

# Sample songs with various statuses and durations
songs = [
  # Ready to play
  {"Sweet Caroline", :ready, "Neil Diamond", "03:23", "Crowd favorite, great for sing-alongs"},
  {"Brown Eyed Girl", :ready, "Van Morrison", "03:03", "Classic party song"},
  {"Wonderwall", :ready, "Oasis", "04:18", "Acoustic version"},

  # Needs learning
  {"Take Me Home, Country Roads", :needs_learning, "John Denver", "03:10", "Need to practice harmonies"},
  {"Piano Man", :needs_learning, "Billy Joel", "05:39", "Need to work on piano part"},

  # Suggested
  {"Don't Stop Believin'", :suggested, "Journey", "04:09", "Great for closing sets"},
  {"Hey Jude", :suggested, "The Beatles", "07:11", "Perfect for sing-alongs"},
  {"Sweet Home Alabama", :suggested, "Lynyrd Skynyrd", "04:43", "Classic rock crowd pleaser"},

  # Performed
  {"All of Me", :performed, "John Legend", "04:29", "Went well at last gig"},
  {"Hallelujah", :performed, "Leonard Cohen", "04:39", "Acoustic version, great reception"}
]

# Add each song to the database
Enum.each(songs, fn {title, status, band_name, duration, notes} ->
  seconds = Seeds.Helper.duration_to_seconds(duration)
  case SongServer.add_song(title, status, band_name, seconds, notes) do
    {:ok, song} -> IO.puts("Added: #{song.title} by #{song.band_name} (#{duration})")
    {:error, reason} -> IO.puts("Failed to add #{title}: #{reason}")
  end
end)

IO.puts("\nSeeding complete!")
