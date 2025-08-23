// Department data interfaces - Phase 2C Implementation

import { Timestamp } from 'firebase/firestore';

// Core Department interface
export interface Department {
  id: string;
  name: string;
  responsibleManagerId: string; // Employee reference (must be manager level)
  employeeIds: string[];        // Array of employee IDs in this department
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;            // Soft delete flag
}

// Firebase Firestore document structure
export interface FirebaseDepartment {
  name: string;
  responsibleManagerId: string;
  employeeIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

// Department with related data for display
export interface DepartmentWithEmployees {
  id: string;
  name: string;
  responsibleManagerId: string;
  employees: any[]; // Will be Employee[] when we have extended employee types
  responsibleManager: any | null; // Will be Employee when we have extended employee types
  employeeCount: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Department form data
export interface DepartmentFormData {
  name: string;
  responsibleManagerId: string;
  employeeIds?: string[];
}

// Department creation request
export interface CreateDepartmentRequest {
  name: string;
  responsibleManagerId: string;
  initialEmployeeIds?: string[]; // Optional employees to add during creation
}

// Department creation response
export interface CreateDepartmentResponse {
  id: string;
  department: Department;
  success: boolean;
  error?: string;
}

// Department update request
export interface UpdateDepartmentRequest {
  name?: string;
  responsibleManagerId?: string;
  employeeIds?: string[];
}

// Department validation result
export interface DepartmentValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export default Department;
