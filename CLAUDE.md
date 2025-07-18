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

### Testing
- `mix test` - Run all tests (with database setup)
- `mix test.unit` - Run unit tests only (no database)
- `mix test.all` - Run all tests including database tests
- `WALLABY_SERVER=true mix test.e2e` - Run end-to-end tests with Wallaby
- `./scripts/ci_unit_tests.sh` - Run unit tests in CI mode
- `./scripts/ci_all_tests.sh` - Run all tests in CI mode

### CI/CD Testing
GitHub Actions automatically runs:
1. Unit tests (`mix test --only unit --exclude e2e`)
2. Integration tests (`mix test --include db --exclude e2e`)
3. E2E tests (`WALLABY_SERVER=true mix test.e2e`) - requires Chrome installation in CI

### Assets
- `mix assets.setup` - Install Tailwind and esbuild
- `mix assets.build` - Build assets for development
- `mix assets.deploy` - Build minified assets for production

### Custom Mix Tasks
- `mix generate_reset_link` - Generate password reset links for users
- `mix test.all` - Run all tests including database-dependent tests
- `mix test.unit` - Run only unit tests without database

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
- Unit tests: Fast, isolated tests without database (tag: `:unit`)
- Integration tests: Full stack tests with database (tag: `:db`)
- Use `test/support/unit_case.ex` for unit tests
- Use `test/support/data_case.ex` for database tests
- Follow TDD approach with Arrange-Act-Assert pattern
- Test public interfaces, not implementation details
- Keep tests independent and idempotent

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