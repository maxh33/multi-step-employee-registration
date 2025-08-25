// Global type definitions for TypeScript

// Extend Window interface for development utilities
declare global {
  interface Window {
    repairDepartmentCounts?: () => Promise<void>;
    testFirebaseAuth?: () => Promise<void>;
  }
}

// API Error interfaces
export interface ApiError extends Error {
  code?: string;
  status?: number;
  details?: unknown;
}

export interface ValidationError extends Error {
  field?: string;
  value?: unknown;
}

export interface AuthError extends Error {
  code?: string;
  userFriendlyMessage?: string;
}

export interface NetworkError extends Error {
  status?: number;
  statusText?: string;
}

// Firebase specific error types
export interface FirebaseError extends Error {
  code: string;
  customData?: unknown;
  serverResponse?: unknown;
}

export interface FirebaseAuthError extends FirebaseError {
  credential?: unknown;
  email?: string;
}

// Form and UI error types
export interface FormError {
  field: string;
  message: string;
  value?: unknown;
}

export interface SubmissionError extends Error {
  formData?: unknown;
  validationErrors?: FormError[];
}

// Make this file a module
export {};