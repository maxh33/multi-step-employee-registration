#!/bin/bash

# Docker Test Runner Script
# Run Playwright tests in a Docker environment similar to GitHub Actions

echo "Running Playwright tests in Docker..."

# Export environment variables
export REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
export REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
export REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
export REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
export REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
export REACT_APP_FIREBASE_APP_ID=your_app_id_here
export REACT_APP_TEST_USER_EMAIL=test@example.com
export REACT_APP_TEST_USER_PASSWORD=test123456
export TEST_USER_EMAIL=test@example.com
export TEST_USER_PASSWORD=test123456
export PLAYWRIGHT_BASE_URL=http://localhost:3000
export CI=true

# Build and run tests with docker-compose
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Copy test results to host if needed
echo "Test run completed. Check test-results/ and playwright-report/ for details."