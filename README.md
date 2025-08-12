# Multi-Step Employee Registration

A modern, responsive employee registration application built with React, TypeScript, Material-UI, and Firebase. Features a streamlined 4-field MVP with comprehensive validation, real-time feedback, and automated testing infrastructure.

## 🚀 Features

- **Multi-step form** with intuitive navigation and progress tracking
- **Real-time validation** with contextual error messages
- **Firebase integration** for secure data persistence
- **Responsive design** following Material-UI design system
- **TypeScript** for enhanced type safety and developer experience
- **Comprehensive testing** with Playwright E2E test suite
- **CI/CD pipeline** with automated testing on pull requests

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Material-UI
- **Backend**: Firebase (Firestore)
- **Testing**: Playwright for E2E testing
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 📋 Form Fields

The application implements a focused 4-field MVP:
1. **Personal Info**: First Name, Email
2. **Settings**: Activate on Create toggle
3. **Professional Info**: Department selection

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (see setup below)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   ```bash
   cp .env.example .env
   # Add your Firebase config values to .env
   ```

4. Start development server:
   ```bash
   npm start
   ```

## 🔧 Available Scripts

### Development
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve production build locally

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript checks
- `npm run format` - Format code with Prettier

### Testing
- `npm test` - Run unit tests
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run E2E tests with UI

## 🔥 Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Copy configuration values to `.env`:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

## 🧪 Testing

The project includes comprehensive testing infrastructure:

- **Unit Tests**: Component and utility function testing
- **E2E Tests**: Full application workflow testing with Playwright
- **CI/CD**: Automated testing on all pull requests

Run E2E tests locally:
```bash
npm run test:e2e
```

## 🚀 Deployment

The application is configured for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Development guidelines and project overview
- **[PROJECT_GUIDELINES.md](./PROJECT_GUIDELINES.md)** - Comprehensive development guidelines
- **[DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md)** - Step-by-step implementation guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

## 📄 License

This project is part of a technical challenge and is for educational purposes.
