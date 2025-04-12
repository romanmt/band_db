# BandDb

To start your Phoenix server:

  * Run `mix setup` to install and setup dependencies
  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

# Development Rules
1. State should be managed in memeory and persisted only for server restarts and resiliencey. 
2. Keep state management, business logic and persistance code separate
3. All migrations should have an up and down so that we can safely migrate down
4. Always develop in small steps and find ways to test your code. 
5. Always use conventional commit messages