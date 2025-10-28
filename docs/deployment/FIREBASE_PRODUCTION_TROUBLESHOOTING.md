# Firebase Production Troubleshooting Guide

## Problem
Getting "Missing or insufficient permissions" errors in production when trying to access Firebase collections (employees and departments).

## Root Cause
Firebase Firestore security rules require authentication (`allow read: if isAuthenticated()`), but the production environment is making requests without authentication tokens. This is typically caused by missing Firebase configuration environment variables in Vercel.

## Diagnostic Steps

### Step 1: Access Debug Page
1. Navigate to your production URL: `https://your-app.vercel.app/debug`
2. The debug page will show:
   - ✅/❌ Environment variable status
   - ✅/❌ Firebase initialization status
   - ✅/❌ Authentication status

### Step 2: Check Environment Variables in Vercel

**Required Environment Variables:**
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
```

**How to Add/Verify in Vercel:**
1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify all 6 Firebase variables are present
5. If missing, add them with values from your Firebase Console

**Where to Find Firebase Values:**
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Click the gear icon → **Project Settings**
4. Scroll to "Your apps" section
5. Click the web app (</>) icon
6. Copy the config values

### Step 3: Verify Correct Firebase Project
Make sure you're using the **same Firebase project** in production as in development:
- Check the `REACT_APP_FIREBASE_PROJECT_ID` matches your Firebase Console project
- Verify the Firebase Console shows the correct data (employees and departments)

## Quick Fixes

### Fix 1: Add Missing Environment Variables
```bash
# In Vercel Dashboard → Settings → Environment Variables
# Add each variable for Production, Preview, and Development scopes:

REACT_APP_FIREBASE_API_KEY="your-api-key"
REACT_APP_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
REACT_APP_FIREBASE_PROJECT_ID="your-project-id"
REACT_APP_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
REACT_APP_FIREBASE_APP_ID="your-app-id"
```

### Fix 2: Redeploy After Adding Variables
After adding/updating environment variables in Vercel:
1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Select **Redeploy**
4. Check the box "Use existing Build Cache" if you want faster builds
5. Click **Redeploy**

### Fix 3: Clear Browser Cache
If environment variables are correct but still failing:
1. Open browser DevTools (F12)
2. Go to **Application** → **Storage**
3. Click "Clear site data"
4. Reload the page

## Verification

After applying fixes:
1. Visit `/debug` route to verify all systems are operational
2. Try to access `/login` and authenticate
3. Navigate to the main app and verify data loads correctly
4. Check browser console for any remaining errors

## Common Issues

### Issue: "All environment variables show as configured but still getting permission errors"
**Solution:** The user might not be logged in. Navigate to `/login` and authenticate with valid credentials.

### Issue: "Environment variables are undefined in debug page"
**Solution:**
1. Verify variables are added in Vercel Dashboard
2. Make sure they have the `REACT_APP_` prefix
3. Redeploy the application (environment variables are baked into the build)

### Issue: "Authentication works locally but not in production"
**Solution:**
1. Check if Firebase Auth Domain is correct in production
2. Verify Authorized Domains in Firebase Console:
   - Go to **Authentication** → **Settings** → **Authorized Domains**
   - Add your Vercel domain: `your-app.vercel.app`

### Issue: "Getting CORS errors"
**Solution:**
1. Add your production domain to Firebase Authorized Domains
2. Check Firebase project settings for CORS configuration

## Security Checklist

Before going to production:
- [ ] Remove the `/debug` route from [App.tsx](src/App.tsx)
- [ ] Delete [FirebaseConfigDebug.tsx](src/components/debug/FirebaseConfigDebug.tsx)
- [ ] Verify Firebase Security Rules are properly configured
- [ ] Test authentication flow in production
- [ ] Verify all protected routes require authentication
- [ ] Check that test credentials are removed from environment variables

## Testing Authentication in Production

### Method 1: Create Test User in Firebase Console
1. Go to Firebase Console → **Authentication** → **Users**
2. Click "Add user"
3. Enter email and password
4. Use these credentials to log in to production app

### Method 2: Use Firebase Auth Emulator (Development)
```bash
# Run locally with Firebase emulator
firebase emulators:start --only auth
npm start
```

## Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Vercel Environment Variables Guide](https://vercel.com/docs/environment-variables)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)

## Still Having Issues?

If you've followed all steps and still experiencing issues:
1. Check the browser console for detailed error messages
2. Verify Firebase service status: https://status.firebase.google.com
3. Check Vercel deployment logs for build errors
4. Test with a fresh incognito/private browser window
5. Try clearing all browser storage and cookies

## Contact & Support

For project-specific issues:
- Review [CLAUDE.md](CLAUDE.md) for project structure
- Check [PROJECT_GUIDELINES.md](PROJECT_GUIDELINES.md) for architecture patterns
- Review [AUTHENTICATION_ARCHITECTURE.md](AUTHENTICATION_ARCHITECTURE.md) for auth implementation details

---

**Last Updated:** 2025-10-28
**Status:** Diagnostic tools added - awaiting production verification
