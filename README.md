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

# Development Rules
1. State should be managed in memory and persisted only for server restarts and resilience. 
2. Keep state management, business logic and persistence code separate
3. All migrations should have an up and down so that we can safely migrate down
4. Always develop in small steps and find ways to test your code
5. Always use conventional commit messages
6. Write tests for all new functionality, including both unit tests and integration tests
7. Document public functions and modules with clear descriptions and examples
8. Handle errors gracefully and log them appropriately
9. Follow consistent naming conventions:
   - Use snake_case for variables and functions
   - Use PascalCase for modules
   - Use @moduledoc and @doc for documentation
10. Keep functions small and focused on a single responsibility
11. Use pattern matching and guards to make function clauses clear and maintainable
12. Prefer immutable data structures and pure functions where possible
13. Write unit tests for business logic
14. Don't make unncessary changes without asking

# Date and Time Handling Rules

1. **Data Types**:
   - Use Elixir's built-in `Date`, `Time`, and `DateTime` structs for all date and time operations
   - Avoid working with string representations of dates/times except at API boundaries

2. **Time Zone Handling**:
   - All `DateTime` structs should include explicit time zone information
   - Use "America/New_York" as the default time zone for all events
   - Keep the original timezone information when working with external services
   - Create datetimes in their intended timezone rather than converting between timezones
   - Always include explicit timezone information when sending data to external services
   - For data received from external services, preserve the timezone information provided

3. **Data Exchange Formats**:
   - Use ISO 8601 format with timezone information (e.g., `2023-06-15T18:30:00-04:00`) for all date/time serialization
   - When reading from external APIs, validate and parse timestamps using `DateTime.from_iso8601/1`
   - When sending to external APIs, include explicit timezone information using `DateTime.to_iso8601/1`
   - Log both the original and formatted timestamps during integration debugging

4. **Event Modeling**:
   - Support both all-day events (date only) and time-specific events
   - For all-day events, store only the `date` field
   - For time-specific events, store `date`, `start_time`, and `end_time` with timezone information
   - All-day events should end on the following day in Google Calendar (end date = start date + 1)

5. **External Calendar Integration**:
   - Store event type and related IDs in calendar event extended properties
   - Include appropriate metadata for different event types (rehearsal, show, etc.)
   - Log all date/time transformations when debugging calendar integration issues

6. **Error Handling**:
   - Use safe parsing functions (e.g., `Date.from_iso8601!/1`) only when input is validated
   - Handle timezone conversion errors gracefully
   - Provide reasonable defaults when date/time information is incomplete

# Architectural Strategy

## Separation of Concerns

Our application follows a clear separation of concerns with the following layers:

1. **State Management Layer**
   - Implemented as GenServers (e.g., `SongServer`, `RehearsalPlanServer`)
   - Manages in-memory state
   - Handles concurrent access to state
   - Provides atomic operations on state
   - Example: `SongServer` manages the list of songs in memory

2. **Business Logic Layer**
   - Contains pure functions that implement business rules
   - No side effects
   - Can be tested independently
   - Example: `RehearsalPlanLive.generate_plan/2` contains the logic for creating rehearsal plans

3. **Persistence Layer**
   - Handles saving and loading state
   - Only used for server restarts and resilience
   - Example: `RehearsalPlanServer.save_plan/4` and `list_plans/0`

## Communication Flow

1. LiveViews receive user input and events
2. LiveViews call appropriate GenServer functions for state changes
3. GenServers update their state and may trigger persistence
4. Business logic functions are called by either LiveViews or GenServers
5. Persistence is handled asynchronously and only when necessary

## Benefits

- Clear separation makes code easier to test and maintain
- Business logic can be tested without mocking state or persistence
- State management is centralized and thread-safe
- Persistence is an implementation detail that can be changed without affecting business logic
- LiveViews remain focused on presentation and user interaction