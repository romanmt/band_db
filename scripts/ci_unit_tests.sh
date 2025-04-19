#!/bin/bash
# This script runs only the pure unit tests that don't interact with the database

# Set the SKIP_DB environment variable to true to prevent database connections
export SKIP_DB=true

# Include only tests with the :unit tag, exclude tests with the :db tag
mix test --only unit --exclude db --trace $@ 