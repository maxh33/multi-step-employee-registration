# Vercel Integration Setup

## Overview
This project uses GitHub Actions with the official Vercel CLI for automated deployment to Vercel with proper environment separation between staging and production environments.

The workflows follow Vercel's official documentation and use the Vercel CLI directly instead of third-party GitHub Actions.

## Required GitHub Repository Secrets

### Vercel Integration Secrets
Add these secrets to your GitHub repository settings (Settings → Secrets and variables → Actions):

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API token for GitHub Actions | Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens) → Create new token |
| `VERCEL_ORG_ID` | Organization/Team ID for Vercel | Found in Vercel Team Settings → General → Team ID |
| `VERCEL_STAGING_PROJECT_ID` | Current staging project ID | Found in Vercel Project Settings → General → Project ID |
| `VERCEL_PRODUCTION_PROJECT_ID` | Production project ID (when created) | Found in Vercel Project Settings → General → Project ID |

### Firebase Environment Variables (Already Configured)
✅ **Staging Environment** (for staging.yml):
- `STAGING_REACT_APP_FIREBASE_API_KEY`
- `STAGING_REACT_APP_FIREBASE_AUTH_DOMAIN`
- `STAGING_REACT_APP_FIREBASE_PROJECT_ID`
- `STAGING_REACT_APP_FIREBASE_STORAGE_BUCKET`
- `STAGING_REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `STAGING_REACT_APP_FIREBASE_APP_ID`

✅ **Production Environment** (for production.yml):
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

## Deployment Workflows

### Staging Deployment
**Workflow**: `.github/workflows/staging.yml`
**Trigger**: Push to `staging` branch
**Firebase Config**: Uses `STAGING_*` environment variables
**Vercel Project**: Uses `VERCEL_STAGING_PROJECT_ID`

### Production Deployment
**Workflow**: `.github/workflows/production.yml`
**Trigger**: Push to `main` branch
**Firebase Config**: Uses non-prefixed environment variables
**Vercel Project**: Uses `VERCEL_PRODUCTION_PROJECT_ID`

## Setup Instructions

### Step 1: Get Vercel Token
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create" → Name it "GitHub Actions"
3. Copy the token
4. Add to GitHub repository secrets as `VERCEL_TOKEN`

### Step 2: Get Organization ID
1. Go to Vercel Team Settings → General
2. Copy the "Team ID" value
3. Add to GitHub repository secrets as `VERCEL_ORG_ID`
   - Note: Vercel dashboard shows "Team ID" but GitHub Actions expects "VERCEL_ORG_ID"

### Step 3: Get Project IDs
1. Go to your Vercel project dashboard
2. Click on your staging project
3. Go to Settings → General
4. Copy the Project ID
5. Add to GitHub repository secrets as `VERCEL_STAGING_PROJECT_ID`

### Step 4: Test Staging Deployment
1. Push changes to `staging` branch
2. Check GitHub Actions tab for workflow execution
3. Verify deployment succeeds with proper Firebase connection

### Step 5: Create Production Project (Future)
1. Create separate Vercel project for production
2. Configure to deploy from `main` branch
3. Add production project ID as `VERCEL_PRODUCTION_PROJECT_ID`

## Current Issue Resolution

### Problem
Current Vercel deployment shows Firebase connection errors:
```
GET https://firestore.googleapis.com/...projects/undefined/databases/...
```

### Root Cause
Vercel deployment lacks Firebase environment variables, causing `projectId` to be `undefined`.

### Solution
Enhanced GitHub Actions integration using official Vercel CLI automatically:
1. ✅ Uses official Vercel CLI commands (install → pull → build → deploy)
2. ✅ Builds app with correct Firebase config through Vercel's environment handling
3. ✅ Deploys to Vercel with proper environment variables included
4. ✅ Eliminates manual Vercel environment configuration
5. ✅ Maintains environment separation (staging vs production)
6. ✅ Follows Vercel's official deployment recommendations

## Benefits
- **Official Approach**: Uses Vercel-recommended CLI deployment method
- **Automated Deployments**: No manual Vercel configuration needed
- **Environment Consistency**: Vercel CLI handles environment variables properly
- **Proper Separation**: Staging and production environments isolated
- **Security**: Firebase credentials managed through GitHub secrets only
- **CI/CD Best Practices**: Install → Pull → Build → Deploy pipeline

## Troubleshooting

### Common Issues
1. **Missing VERCEL_TOKEN**: Workflow will fail at deployment step
2. **Missing VERCEL_ORG_ID**: Workflow will fail with authentication errors
3. **Wrong Project ID**: Deployment may succeed but go to wrong project
4. **Missing Firebase secrets**: App will show Firebase connection errors
5. **Team ID vs ORG_ID confusion**: Use Team ID value for VERCEL_ORG_ID secret

### Verification Steps
1. Check GitHub Actions logs for workflow execution
2. Verify Vercel deployment dashboard shows successful deployment
3. Test application Firebase connectivity in browser
4. Check browser console for any remaining environment variable issues