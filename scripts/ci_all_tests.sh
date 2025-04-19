#!/bin/bash
# This script runs all tests, including those that interact with the database

# Run all tests by including the db-tagged tests
mix test --include db $@ 