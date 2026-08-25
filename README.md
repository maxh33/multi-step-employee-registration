# Multi-Step Employee Registration & Management System

A comprehensive, enterprise-ready employee and department management system built with React, TypeScript, Material-UI, and Firebase. Features complete authentication, advanced employee management with bulk operations, department administration, and a modern double-line table interface for optimal space efficiency.

## 🚀 Key Features

### 🔐 **Authentication System**
- **Secure Login/Logout** with Firebase Authentication
- **Protected Routes** with JWT-based session management
- **User Session Persistence** across browser sessions
- **Error Recovery** with user-friendly messaging

### 👥 **Advanced Employee Management** 
- **Extended Employee Profiles**: Position, admission date, hierarchical levels, managers, salary
- **Manager Validation System**: Hierarchical level locking for managers with subordinates
- **Self-Assignment Prevention**: Employees cannot assign themselves as responsible managers  
- **Bulk Operations**: Multi-select and bulk deletion with confirmation
- **Smart Search & Filtering**: Real-time search across multiple fields
- **Enhanced Sorting**: Multi-field sorting (alphabetical, numeric, date, hierarchical)
- **Double-Line Header Interface**: 44% space reduction with logical data grouping
- **Data Integrity Tools**: Migration utilities and integrity reporting

### 🏢 **Department Management**
- **Full CRUD Operations**: Create, read, update, delete departments
- **Manager Assignment**: Link manager-level employees to departments
- **Employee Transfers**: Bulk and individual employee transfers between departments
- **Integrated Workflows**: Streamlined department-manager creation process

### 🎨 **Modern User Interface**
- **Mobile-First Responsive Design** optimized for all device sizes (320px+)
- **Material-UI Design System** with consistent theming across components
- **Professional Dialog Feedback** for user guidance and constraint explanations
- **Progressive Enhancement** with advanced features revealed contextually  
- **Touch-Friendly Controls** with 44px minimum touch targets
- **Accessibility** with keyboard navigation and screen reader support

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Material-UI, React Router
- **Authentication**: Firebase Auth with JWT
- **Database**: Firebase Firestore with security rules
- **State Management**: React Context & Hooks
- **Testing**: Playwright E2E testing, Jest unit tests
- **Deployment**: Vercel with automated CI/CD
- **Development**: ESLint, Prettier, TypeScript strict mode
- **Security**: [PhantomRaven](https://github.com/maxh33/phantom-raven-npm-vulnerability-scanner) npm supply-chain scanning (hidden-URL deps, typosquatting, malicious install scripts) on every push/PR touching `package.json`; AI-assisted PR review via Claude Code

## 📋 Employee Data Model

### **Personal Information**
- First Name, Email Address
- Account Activation Settings

### **Professional Information** 
- Department Assignment (required)
- Position/Job Title
- Admission Date with Portuguese formatting
- Hierarchical Level (Júnior, Pleno, Sênior, Gerente)
- Responsible Manager (manager-level employees)
- Base Salary with privacy controls

### **System Fields**
- Employee Status (Active/Inactive)
- Creation & Update Timestamps
- Unique Employee ID

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

1. **Create Firebase Project**: Visit [console.firebase.google.com](https://console.firebase.google.com)

2. **Enable Services**:
   - **Authentication**: Enable Email/Password provider
   - **Firestore Database**: Create database in production mode
   - **Security Rules**: Deploy the provided firestore.rules

3. **Configure Environment**: Copy values to `.env`:
   ```env
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   
   # Testing Credentials (Optional)
   REACT_APP_TEST_USER_EMAIL=test@example.com
   REACT_APP_TEST_USER_PASSWORD=testpassword123
   ```

4. **Initial Setup**: Create your first admin user through the Firebase Console

## 🧪 Testing

The project includes comprehensive testing infrastructure:

- **Unit Tests**: Component and utility function testing
- **E2E Tests**: Full application workflow testing with Playwright
- **CI/CD**: Automated testing, npm supply-chain security scanning (PhantomRaven), and AI-assisted code review on all pull requests

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

### **Project Overview**
- **[CLAUDE.md](./CLAUDE.md)** - Development guidelines and project overview
- **[PHASE_2_COMPLETE_SUMMARY.md](./PHASE_2_COMPLETE_SUMMARY.md)** - Comprehensive implementation summary
- **[README.md](./README.md)** - This file with setup and usage instructions

### **Technical Documentation**
- **[AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)** - Firebase Auth implementation guide
- **[DEPARTMENT_MANAGEMENT.md](./DEPARTMENT_MANAGEMENT.md)** - Department system specifications  
- **[EXTENDED_EMPLOYEE_FORM.md](./EXTENDED_EMPLOYEE_FORM.md)** - Employee form field specifications
- **[MANAGER_VALIDATION_SYSTEM.md](./MANAGER_VALIDATION_SYSTEM.md)** - Manager level locking and validation system
- **[RESPONSIVE_UI_GUIDE.md](./RESPONSIVE_UI_GUIDE.md)** - Mobile-first responsive design implementation
- **[PHASE_2C_IMPLEMENTATION_SUMMARY.md](./PHASE_2C_IMPLEMENTATION_SUMMARY.md)** - Department features implementation

### **Development Guides**
- **[PROJECT_GUIDELINES.md](./PROJECT_GUIDELINES.md)** - Comprehensive development guidelines
- **[PHASE_2_REQUIREMENTS.md](./PHASE_2_REQUIREMENTS.md)** - Detailed feature requirements
- **[PHASE_2_DEVELOPMENT_CHECKLIST.md](./PHASE_2_DEVELOPMENT_CHECKLIST.md)** - Implementation checklist

## 🆕 Recent Updates (August 2026)

### CI/CD Security Hardening
- ✅ **npm Supply-Chain Scanning**: [PhantomRaven](https://github.com/maxh33/phantom-raven-npm-vulnerability-scanner) runs on every push/PR touching `package.json` or `package-lock.json`, catching hidden-URL dependencies, typosquatting, and malicious install scripts
- ✅ **AI-Assisted Code Review**: Claude Code reviews every PR for bugs and security issues automatically
- ✅ **CI Timeout Hygiene**: Job-level `timeout-minutes` set on the review workflow (previously unset, defaulting to GitHub's 360-minute billed runner cap)

## 🆕 Recent Updates (August 2025)

### Manager Validation System
- ✅ **Hierarchical Level Locking**: Managers with subordinates cannot be demoted
- ✅ **Self-Assignment Prevention**: Employees cannot assign themselves as responsible managers
- ✅ **Multi-Layer Validation**: Frontend, client-side, and server-side protection
- ✅ **Data Migration Tools**: Utilities to fix existing inconsistent relationships

### Mobile-First Responsive Design  
- ✅ **Complete Mobile Optimization**: 320px+ screen support with touch-friendly controls
- ✅ **Responsive Tables**: Horizontal scrolling with optimized column widths
- ✅ **Enhanced Typography**: Natural text wrapping with improved readability
- ✅ **Performance Optimized**: <1.5s first contentful paint on mobile networks

### Code Quality & Security Enhancements
- ✅ **Type Safety Improvements**: Eliminated 'any' types across codebase  
- ✅ **Enhanced Security Rules**: Hardened Firebase database constraints
- ✅ **Performance Optimizations**: useCallback memoization and optimized re-renders
- ✅ **Error Handling**: Comprehensive error recovery and user feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

## 📄 License

This project is part of a technical challenge and is for educational purposes.
