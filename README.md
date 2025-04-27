# BandDb

[![Test](https://github.com/romanmt/band_db/actions/workflows/test.yml/badge.svg)](https://github.com/romanmt/band_db/actions/workflows/test.yml)

To start your Phoenix server:

  * Run `mix setup` to install and setup dependencies
  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

# Current Features

1. **User Authentication**
   - Secure login and registration system
   - Session management with remember-me functionality
   - Password reset capabilities

2. **Song Management**
   - Add, edit, and organize songs in the library
   - Track song details (title, band, duration, tuning, etc.)
   - Categorize songs by status (suggested, needs learning, ready, performed)
   - Filter and search functionality
   - Bulk import capability for quickly adding multiple songs

3. **Rehearsal Planning**
   - Automatic generation of rehearsal plans
   - Intelligent song selection based on learning status and tuning
   - Organize rehearsal songs by tuning for efficient practice
   - Save and manage rehearsal history
   - View and print detailed rehearsal schedules

4. **Set List Management**
   - Create and save multiple set lists
   - Organize songs into multiple sets
   - Track set durations and breaks
   - Optimize set lists based on song tunings
   - Flexible reordering of songs within sets

5. **Performance Features**
   - Tuning organization to minimize instrument changes
   - Duration tracking for sets and individual songs
   - YouTube integration for reference recordings

6. **Google Calendar Integration**
   - Connect to Google Calendar to manage rehearsal plans and show schedules
   - Two-way sync between app events and calendar
   - Share calendar with band members

# Google Calendar Integration

## Setup Instructions

### Prerequisites

1. A Google account
2. A Google Cloud project with the Calendar API enabled
3. OAuth credentials (client ID and client secret)

### Configuration Steps

1. Create a `.env` file based on the `.env.example` template
2. Fill in your Google Cloud credentials:
   ```
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
   ```
3. Create a `.env.exs` file with the same credentials for Phoenix to load:
   ```elixir
   # This file loads environment variables directly for development
   System.put_env("GOOGLE_CLIENT_ID", "your-client-id-here")
   System.put_env("GOOGLE_CLIENT_SECRET", "your-client-secret-here")
   System.put_env("GOOGLE_REDIRECT_URI", "http://localhost:4000/auth/google/callback")
   ```

### Security Note

The `.env` and `.env.exs` files contain sensitive credentials and should never be committed to version control. They are automatically excluded by the `.gitignore` file. Always keep your Google API credentials secure and never share them publicly.

For production deployment, use environment variables or a secure secrets management system rather than files.

### Usage

1. Log in as an admin user
2. Navigate to "Admin" -> "Calendar Settings"
3. Click "Connect Google Calendar"
4. Follow the Google authentication flow
5. Once connected, you can create a band calendar
6. Rehearsal plans and set lists will automatically sync with this calendar

## Implementation Details

The integration follows these key steps:

1. **Authentication**: OAuth 2.0 flow connecting band admin to Google
2. **Calendar Creation**: Custom calendar for band events  
3. **Event Sync**: Two-way sync between app events and calendar
4. **Sharing**: Band members get access to the shared calendar

# Development Guidelines

For detailed development rules, date/time handling guidelines, and architectural strategy, please refer to the `.cursor/rules` directory.

# Band Server Lifecycle Management

The application includes a band server lifecycle management system that optimizes resource usage by:

1. Starting band-specific servers when a user logs in
2. Stopping band servers when all band members log out

## Implementation Details

- **ServerLifecycle Module**: Manages starting/stopping band servers on login/logout events
- **Process Monitoring**: Uses Elixir process monitoring to detect disconnected LiveView sessions
- **Resource Optimization**: Prevents unnecessary server processes from running when not in use

## Adding Lifecycle Management to LiveView Modules

When creating new LiveView modules, add lifecycle management support:

```elixir
defmodule BandDbWeb.YourLiveView do
  use BandDbWeb, :live_view
  use BandDbWeb.Live.Lifecycle  # Add this line
  
  # Your LiveView implementation
end
```

This ensures proper cleanup of band servers when users disconnect or their sessions timeout.