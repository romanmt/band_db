# BandDb

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

# Development Guidelines

For detailed development rules, date/time handling guidelines, and architectural strategy, please refer to the `.cursorrules` file in the project root.