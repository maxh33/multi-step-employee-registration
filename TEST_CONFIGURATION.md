# Test Configuration for GitHub Actions

## Required GitHub Secrets

To make the tests pass in GitHub Actions, you need to configure the following secrets in your repository:

### 1. Firebase Configuration (Staging)
These should already be set based on your staging Firebase project:
- `STAGING_REACT_APP_FIREBASE_API_KEY`
- `STAGING_REACT_APP_FIREBASE_AUTH_DOMAIN`
- `STAGING_REACT_APP_FIREBASE_PROJECT_ID`
- `STAGING_REACT_APP_FIREBASE_STORAGE_BUCKET`
- `STAGING_REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `STAGING_REACT_APP_FIREBASE_APP_ID`

### 2. Test User Credentials (REQUIRED - ADD THESE)
You need to add these secrets to your GitHub repository:
- `REACT_APP_TEST_USER_EMAIL` - Set to: `test@example.com`
- `REACT_APP_TEST_USER_PASSWORD` - Set to: `test123456`

## How to Add GitHub Secrets

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its name and value

## Firebase Test User Setup

### Create Test User in Staging Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your **staging** project: `multi-step-employee-reg-stagin`
3. Go to **Authentication** → **Users**
4. Click **Add user**
5. Create a user with:
   - Email: `test@example.com`
   - Password: `test123456`

### Important: Create Test User in Both Projects

You need the test user in BOTH Firebase projects:
- **Staging**: `multi-step-employee-reg-stagin` (for CI/CD tests)
- **Production**: `multi-step-employee-reg` (for local development)

## Test Environment Variables

The tests use these environment variables in order of priority:
1. `REACT_APP_TEST_USER_EMAIL` / `REACT_APP_TEST_USER_PASSWORD`
2. `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`
3. Fallback: `test@example.com` / `test123456`

## Local Testing

### Using Docker (Recommended for CI simulation)
```bash
# Make sure Docker Desktop is running
# Run tests in Docker environment
./run-tests-docker.sh

# Or using docker-compose directly
docker-compose -f docker-compose.test.yml up --build
```

### Direct Testing
```bash
# Run all tests
npm run test:e2e

# Run specific test
npm run test:e2e -- tests/core/authentication.spec.ts

# Run with UI for debugging
npm run test:e2e:ui
```

## Troubleshooting

### Tests Failing with "Cannot find Login"
- The test user doesn't exist in Firebase
- Create the user as described above

### Tests Failing with "Invalid credentials"
- Wrong email/password in GitHub Secrets
- Verify the secrets match the Firebase user

### Tests Timing Out
- Firebase project might be offline
- Check Firebase Console for any issues
- Verify the Firebase configuration is correct

## Security Notes

1. The test credentials are only for automated testing
2. Never use real user credentials for testing
3. The fallback values (`test@example.com` / `test123456`) are safe defaults
4. These credentials should only work in staging/test environments
5. Consider rotating test passwords periodically

## Verification Checklist

- [ ] Test user created in staging Firebase project
- [ ] Test user created in production Firebase project (for local dev)
- [ ] GitHub Secrets configured for test credentials
- [ ] GitHub Actions workflow includes test credential environment variables
- [ ] Tests pass locally with `npm run test:e2e`
