# Project Requirements - Multi-Step Employee Registration

## Project Prompt

The goal is to create a multi-step employee registration form using ReactJS and TypeScript. The project should be styled with Material UI. The data entered into the form needs to be persisted using Firebase, and the application should be deployed to Vercel for free showcase hosting.

## Technical Requirements

The project must meet the following requirements:

- The form should be a **multi-step process**, with a visual interface that matches the provided prototype
- **All form fields are required** and must include validations and feedback between steps
- The project must be **hosted on Vercel** (free tier) for showcase purposes and the link shared for evaluation
- The code must be uploaded to a **public GitHub repository**, which will also be shared for evaluation
- A **README file is required** to provide instructions on how to run the project locally

## Timeline

The deadline for completion is **7 calendar days**.

## Deployment Strategy

### Hosting Platform
- **Platform**: Vercel (free tier)
- **Domain**: Use Vercel's provided `.vercel.app` domain
- **Deployment**: Automatic deployment from GitHub repository
- **Build**: Optimized production build for React TypeScript

### Data Persistence
- **Database**: Firebase Firestore (recommended over Realtime Database)
- **Free Tier Strategy**: Stay within limits (1GB storage, 50k reads/day, 20k writes/day)
- **Configuration**: Environment variables configured in both local development and Vercel dashboard

### Environment Configuration
- **Local Development**: Use `.env` file (never commit to repository)
- **Production**: Configure Firebase credentials in Vercel environment variables
- **Security**: All Firebase configuration is safe to expose in frontend (use Firebase Security Rules for data protection)

## Firebase Integration

Firebase Firestore (recommended) will be used for data persistence in this showcase project. To stay within the free tier limits, the application will:

- Use a single Firestore collection for employee registrations
- Cache form data locally during the multi-step process
- Only persist to Firebase on final form submission
- Implement optimistic UI updates to minimize database reads

To connect your application to a Firebase project, you'll need to configure it with specific credentials. These credentials should be stored as **environment variables** and not hardcoded directly into your source code.

### Required Firebase Configuration Variables

Here's a list of the common secrets you'll need from your Firebase project's configuration:

- **FIREBASE_API_KEY**: A unique key that authenticates your requests to Firebase services
- **FIREBASE_AUTH_DOMAIN**: The domain for your Firebase project's authentication services
- **FIREBASE_PROJECT_ID**: The unique identifier for your Firebase project
- **FIREBASE_STORAGE_BUCKET**: The default bucket for Firebase Storage
- **FIREBASE_MESSAGING_SENDER_ID**: An ID for Firebase Cloud Messaging
- **FIREBASE_APP_ID**: The unique identifier for your web app within the Firebase project
- **FIREBASE_DATABASE_URL**: The URL for the Realtime Database, if you're using it instead of Firestore

## Design Reference

Visual interface should match the provided Figma prototype:
https://www.figma.com/proto/r7xOsboMOQlMpEx8D5kH3a/Desafio-Flugo?node-id=2101-9297&t=ZcgP4ZVsOtCzzCIN-1