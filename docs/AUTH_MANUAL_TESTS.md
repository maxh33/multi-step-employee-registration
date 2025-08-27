# Authentication Manual Test Checklist

## Test Date: [Current Date]
## Tester: [Your Name]

### Pre-requisites
- [ ] Firebase Auth Email/Password enabled
- [ ] Test user created in Firebase Console
- [ ] API key restrictions set to "None" or includes localhost

### Test Cases

#### 1. Unauthenticated Access
- [ ] Navigate to http://localhost:3000
- [ ] Verify redirect to /unauthorized page
- [ ] Verify "401" error page displays correctly

#### 2. Login Flow
- [ ] Click "Ir para Login" button
- [ ] Verify /login page loads
- [ ] Enter invalid email format
- [ ] Verify validation error appears
- [ ] Enter valid email, short password (<6 chars)
- [ ] Verify validation error appears
- [ ] Enter wrong credentials
- [ ] Verify error message appears
- [ ] Enter correct credentials
- [ ] Verify redirect to main dashboard
- [ ] Verify user email shows in header

#### 3. Authenticated Navigation
- [ ] Navigate to /colaboradores
- [ ] Verify page loads without redirect
- [ ] Navigate to /colaboradores/novo
- [ ] Verify form page loads

#### 4. Logout Flow
- [ ] Click user avatar in header
- [ ] Click "Sair" option
- [ ] Verify redirect to /login
- [ ] Try to navigate to /colaboradores
- [ ] Verify redirect to /unauthorized

#### 5. Session Persistence
- [ ] Login successfully
- [ ] Refresh the page (F5)
- [ ] Verify still authenticated
- [ ] Close browser tab
- [ ] Open new tab to http://localhost:3000
- [ ] Verify still authenticated

### Test Results
- Total Tests: 20
- Passed: [ ]
- Failed: [ ]
- Blocked: [ ]

### Issues Found
1. [Description of any issues]

### Notes
- Firebase Auth handles JWT token management automatically
- Sessions persist across browser refreshes
- Tokens expire after 1 hour by default