# BandDb

To start your Phoenix server:

  * Run `mix setup` to install and setup dependencies
  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

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