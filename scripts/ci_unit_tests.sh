#!/bin/bash
# This script runs only the pure unit tests that don't interact with the database

# Include only tests with the :unit tag, exclude tests with the :db tag
mix test --only unit --exclude db --trace $@ 