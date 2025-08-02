#!/bin/bash
# This script runs all tests including unit, integration, and E2E tests

# Set WALLABY_SERVER for E2E tests
export WALLABY_SERVER=true

# Run all tests using the test.all task
mix test.all $@ 