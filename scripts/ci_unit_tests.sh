#!/bin/bash
# This script runs only the pure unit tests that don't interact with the database or browser

# Set the SKIP_DB environment variable to true to prevent database connections
export SKIP_DB=true

# Run unit tests using the test.unit task
mix test.unit --trace $@ 