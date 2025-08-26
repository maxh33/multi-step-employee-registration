#!/bin/bash

# Docker Test Runner Script
# Run Playwright tests in a Docker environment similar to GitHub Actions

echo "Running Playwright tests in Docker..."

# The docker-compose.test.yml file will load credentials from your .env file.
# We only need to set variables that aren't in the .env file.
export PLAYWRIGHT_BASE_URL=http://localhost:3000
export CI=true

# Build and run tests with docker-compose
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Copy test results to host if needed
echo "Test run completed. Check test-results/ and playwright-report/ for details."