# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BandDb is a Phoenix LiveView application for managing band operations including song libraries, rehearsal planning, set list management, and Google Calendar integration. Built with Elixir/Phoenix and PostgreSQL.

## Development Commands

### Setup & Database
- `mix setup` - Install dependencies and set up database
- `mix ecto.create` - Create database
- `mix ecto.migrate` - Run migrations
- `mix ecto.reset` - Drop and recreate database
- `mix phx.server` - Start Phoenix server (http://localhost:4000)
- `iex -S mix phx.server` - Start server in interactive mode


### Test Execution Commands

#### Local Development
```bash
# Run only unit tests (fastest, no database required)
mix test.unit

# Run unit + integration tests (no E2E)
mix test.integration

# Run only E2E tests (automatically sets WALLABY_SERVER)
mix test.e2e

# Run ALL tests including E2E (automatically sets WALLABY_SERVER)
mix test.all

# Run specific test file
mix test test/band_db/song_server_test.exs

# Run tests matching a pattern
mix test --only business_logic
```

#### CI/CD Pipeline
GitHub Actions automatically runs tests in stages:
1. Unit tests (`mix test --only unit --exclude e2e`)
2. Integration tests (`mix test --include db --exclude e2e`)
3. E2E tests (`mix test.e2e`) - requires Chrome installation

```bash
# CI scripts
./scripts/ci_unit_tests.sh    # No database required
./scripts/ci_all_tests.sh      # Requires PostgreSQL service
```

### Test Organization

```
test/
├── band_db/              # Unit tests for business logic
│   ├── song_server_test.exs
│   ├── set_list_server_test.exs
│   └── rehearsal_server_test.exs
├── band_db_web/          # Integration tests for web layer
│   ├── controllers/
│   └── live/
├── e2e/                  # End-to-end browser tests
│   ├── song_management_test.exs
│   └── set_list_management_test.exs
└── support/              # Test helpers and utilities
    ├── conn_case.ex      # Web integration test helpers
    ├── data_case.ex      # Database test helpers
    ├── unit_case.ex      # Unit test helpers
    ├── e2e_case.ex       # E2E test helpers
    └── mocks/            # Mock implementations
```

### Performance Optimization

1. **Parallel Execution**: Unit tests run with `async: true`
2. **Database Sandboxing**: Each test gets isolated transaction
3. **Shared Setup**: Use `setup_all` for expensive operations
4. **Lazy Loading**: Only start services needed for specific tests
5. **CI Caching**: Cache dependencies and build artifacts

### Debugging Failed Tests

1. **Unit Test Failures**: Check mock configurations and function signatures
2. **Integration Test Failures**: Verify database migrations and constraints
3. **E2E Test Failures**: Check for timing issues and JavaScript errors
4. **Flaky Tests**: Add explicit waits or use more specific selectors

### Assets
- `mix assets.setup` - Install Tailwind, esbuild, and npm dependencies
- `mix assets.build` - Build assets for development
- `mix assets.deploy` - Build minified assets for production
- `npm install --prefix assets <package>` - Add new JavaScript dependencies
- `npm list --prefix assets` - List installed npm packages

### Custom Mix Tasks
- `mix generate_reset_link` - Generate password reset links for users
- `mix test.unit` - Run only unit tests without database
- `mix test.integration` - Run unit and integration tests (no E2E)
- `mix test.e2e` - Run E2E tests with Wallaby (automatically sets WALLABY_SERVER)
- `mix test.all` - Run ALL tests including unit, integration, and E2E

## Architecture Overview

### Multi-Tenant Band System
The application uses a multi-tenant architecture where each band has its own set of servers:
- **Band Servers**: Dynamically created per band using `DynamicSupervisor`
- **Band Registry**: Manages band server instances via `Registry`
- **Server Lifecycle**: Automatically starts/stops band servers on user login/logout

Key files:
- `lib/band_db/accounts/server_lifecycle.ex` - Manages band server lifecycle
- `lib/band_db/accounts/band_server.ex` - Band-specific server management
- `lib/band_db_web/live/lifecycle.ex` - LiveView process cleanup

### Core Domain Models
- **Songs**: Song library with status tracking (suggested/needs learning/ready/performed)
- **Rehearsal Plans**: Auto-generated practice schedules organized by tuning
- **Set Lists**: Performance set organization with duration tracking
- **Users/Accounts**: Authentication with band membership and admin roles
- **Google Calendar**: Two-way sync for rehearsals and shows

### Phoenix LiveView Structure
- All user-facing pages are LiveView modules in `lib/band_db_web/live/`
- Authentication handled via `BandDbWeb.UserAuth`
- Admin functionality separated with pipeline guards
- Real-time updates using Phoenix PubSub
- JavaScript dependencies managed via `assets/package.json`
- ag-grid-community used for advanced data tables

### Data Layer
- **Persistence**: Custom persistence layer with DETS/database abstraction
- **Servers**: GenServer-based domain servers for songs, set lists, rehearsals
- **Ecto**: PostgreSQL integration for user accounts and core data

## Key Patterns

### Adding LiveView Lifecycle Management
When creating new LiveView modules, add lifecycle management:
```elixir
defmodule BandDbWeb.YourLiveView do
  use BandDbWeb, :live_view
  use BandDbWeb.Live.Lifecycle  # Add this line
  
  # Your LiveView implementation
end
```

### Architecture Layers
The application follows strict separation of concerns:
- **State Management**: GenServers manage in-memory state and concurrent access
- **Business Logic**: Pure functions with no side effects, independently testable
- **Persistence**: Asynchronous saving/loading for server restarts and resilience
- **Communication Flow**: LiveViews → GenServers → Business Logic → Persistence

### Testing Strategy

BandDb follows a comprehensive testing pyramid approach with three distinct test levels:

#### Test Categories

##### 1. Unit Tests (Base of Pyramid - Most Tests)
- **Purpose**: Test business logic in isolation without external dependencies
- **Location**: Tests using `BandDb.UnitCase`
- **Characteristics**:
  - No database connections
  - Use mocked persistence layers
  - Fast execution (< 0.1s per test)
  - Can run asynchronously
  - Tagged with `:unit`
- **Example**: Testing GenServer business logic, pure functions, data transformations

##### 2. Integration Tests (Middle Layer)
- **Purpose**: Test component interactions with real database
- **Location**: Tests using `BandDb.DataCase` or `BandDbWeb.ConnCase`
- **Characteristics**:
  - Real PostgreSQL database with sandboxed transactions
  - Test Ecto queries, changesets, and data persistence
  - Moderate execution time
  - Tagged with `:db`
- **Example**: Testing Accounts context, database queries, API endpoints

##### 3. E2E Tests (Top of Pyramid - Fewest Tests)
- **Purpose**: Test complete user workflows through the browser
- **Location**: Tests in `test/e2e/` using `BandDbWeb.E2ECase`
- **Characteristics**:
  - Full browser automation with Wallaby/ChromeDriver
  - Test JavaScript interactions and LiveView updates
  - Slowest execution (several seconds per test)
  - Must run synchronously (async: false)
  - Tagged with `:e2e`
- **Example**: User registration flow, song management, set list creation

#### Mocking and Stubbing Guidelines

##### When to Mock
1. **External Services**: Always mock external APIs (Google Calendar, OAuth)
2. **Persistence Layer**: Mock for unit tests to avoid database dependencies
3. **Time-based Operations**: Mock time functions for deterministic tests
4. **Network Calls**: Mock HTTP clients for reliability

##### When NOT to Mock
1. **Pure Functions**: Test directly without mocks
2. **GenServer State**: Test actual state management behavior
3. **Business Logic**: Test real implementations
4. **Data Transformations**: Test with real data structures

##### Mock Configuration
The application uses configuration-based dependency injection:

```elixir
# In unit tests (test_helper.exs)
Application.put_env(:band_db, :song_persistence, BandDb.Songs.SongPersistenceMock)

# In production code
defp persistence_module do
  Application.get_env(:band_db, :song_persistence, BandDb.Songs.SongPersistence)
end
```

#### Testing Pyramid Best Practices

##### Unit Test Guidelines (70% of tests)
- Test one thing per test
- Use descriptive test names: `test "add_song/4 returns error when song already exists"`
- Isolate GenServer instances with unique names
- Mock all external dependencies
- Aim for < 100ms execution time
- Group related tests with `describe` blocks

##### Integration Test Guidelines (20% of tests)
- Test database constraints and validations
- Verify data persistence and retrieval
- Test transaction boundaries
- Use database sandbox for isolation
- Clean up test data in `setup` callbacks

##### E2E Test Guidelines (10% of tests)
- Focus on critical user paths only
- Test happy paths and key error scenarios
- Wait for asynchronous operations explicitly
- Use page object pattern for maintainability
- Run synchronously to avoid flaky tests

#### Common Testing Patterns

##### Testing GenServers
```elixir
setup do
  # Use unique server names to avoid conflicts
  server_name = :"test_server_#{System.unique_integer([:positive])}"
  start_supervised!({ServerModule, server_name})
  {:ok, server: server_name}
end
```

##### Testing with Time
```elixir
# Use explicit time values instead of current time
test_time = ~U[2024-01-01 12:00:00Z]
# Pass time as parameter rather than calling DateTime.utc_now()
```

##### Testing Async Operations
```elixir
# For E2E tests, wait explicitly
|> wait_for_page_load()
|> assert_has(css(".element"))

# For unit tests, use message assertions
assert_receive {:some_message, _}, 1000
```

### Environment Configuration
- Development: Uses `.env.exs` for Google OAuth credentials
- Production: Uses environment variables
- Test: Minimal setup with mocked services

## Google Calendar Integration

Requires Google Cloud project with Calendar API enabled:
- OAuth flow for band admin authentication
- Creates dedicated band calendars
- Syncs rehearsal plans and set lists as events
- Configuration via admin interface

## Development Guidelines

### Core Principles
- State managed in memory, persisted only for restarts/resilience
- Keep state management, business logic, and persistence code separate
- All migrations must have both up and down functions
- Develop in small, testable steps
- Use conventional commit messages
- Fix all compiler warnings before committing

### Coding Conventions
- snake_case for variables and functions
- PascalCase for modules
- Use @moduledoc and @doc for documentation
- Small, focused functions with single responsibility
- Use pattern matching and guards effectively
- Prefer immutable data structures and pure functions

### Date/Time Handling
- Use Elixir's built-in `Date`, `Time`, and `DateTime` structs
- All `DateTime` structs must include explicit time zone information
- Use "America/New_York" as the default time zone
- Use ISO 8601 format with timezone information for data exchange
- Support all-day events (date only) and time-specific events
- All-day events in Google Calendar should end on following day (start date + 1)

## Deployment

### Platform
- Application deployed to fly.io using the free tier
- All deployments managed through fly.io CLI
- Production secrets set using fly secrets
- Prioritize free tier usage and resource optimization

### Release Process
- Verify all tests pass before deployment
- Run database migrations as part of release process
- Monitor deployment logs for errors
- Optimize for minimal resource consumption to stay within free limits

## Security Notes

- Never commit `.env` or `.env.exs` files (contain OAuth secrets)
- Admin access controlled via `is_admin` user field
- Band isolation enforced through server architecture
- CSRF protection enabled for all forms

## External API Testing Strategies

### CI/CD-Includable Tests

1. Mock/Stub Tests
   - Test integration logic with mocked API responses
   - Verify request formatting and data transformation
   - Test error handling for various API failure scenarios
   - Validate authentication/authorization flows with mocked tokens
   - Test retry logic and timeout handling

2. Contract Tests
   - Verify your code sends correctly formatted requests
   - Ensure response parsing handles all expected formats
   - Test edge cases (empty responses, missing fields, etc.)

3. Integration Tests with Test Doubles
   - Use in-memory test doubles that simulate external service behavior
   - Test complete user flows with predictable responses
   - Verify state changes and side effects

### CI/CD-Excludable Tests

1. Real External API Calls
   - Requires real credentials (security risk)
   - Depends on external service availability
   - Subject to rate limits and quotas
   - Creates test data in production systems
   - Network latency causes slow, flaky tests

2. OAuth/SSO Flow Tests
   - Requires real user interaction
   - Needs actual user accounts
   - Security concerns with storing credentials

3. Webhook/Callback Tests
   - Requires publicly accessible endpoints
   - Difficult to control timing
   - May need ngrok or similar tools

### Best Practices

1. Environment-Based Test Execution
   ```elixir
   @tag :external_api
   test "real API call" do
     # Test only runs when explicitly enabled
   end
   ```

2. Feature Flags for External Services
   - Use flags to disable external calls in test environment
   - Allow local development with/without external services

3. Separate Test Suites
   - `mix test` - runs unit and integration tests with mocks
   - `mix test.external` - runs tests requiring external services (manual/local only)

4. Record and Replay
   - Use tools like VCR to record real API responses
   - Replay recorded responses in CI for consistency

5. Health Check Tests
   - Create separate smoke tests for production
   - Run after deployment to verify external integrations
   - Keep these minimal and non-destructive

These testing strategies ensure fast, reliable CI/CD pipelines while maintaining confidence in external integrations.