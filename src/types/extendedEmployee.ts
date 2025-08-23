// Extended Employee form data interfaces - Phase 2B/2C Implementation

import { Timestamp } from 'firebase/firestore';

// Hierarchical levels for employees
export type HierarchicalLevel = 'junior' | 'mid-level' | 'senior' | 'manager';

// PersonalInfo: Only fields actually implemented in PersonalInfoStep.tsx
export interface PersonalInfo {
  firstName: string;
  email: string;
  activateOnCreate: boolean; // Required toggle field for "Ativar ao criar"
}

// Extended ProfessionalInfo for Phase 2B
export interface ExtendedProfessionalInfo {
  // Existing field
  department: string;
  
  // New required fields (Phase 2B)
  position: string;                      // Job title/position
  admissionDate: string;                 // Start date (ISO format)
  hierarchicalLevel: HierarchicalLevel;  // Employee level
  baseSalary: number;                    // Base salary amount
  
  // New optional field
  responsibleManager?: string;           // Manager employee ID (required for non-managers)
}

// Keep backward compatibility with existing code
export interface ProfessionalInfo {
  department: string;
}

// Extended EmployeeFormData for Phase 2B
export interface ExtendedEmployeeFormData {
  personalInfo: PersonalInfo;
  professionalInfo: ExtendedProfessionalInfo;
}

// Original EmployeeFormData for backward compatibility
export interface EmployeeFormData {
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
}

// Form state management
export interface FormState {
  currentStep: number;
  formData: Partial<EmployeeFormData | ExtendedEmployeeFormData>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
  localStorageError: string | null;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Extended Employee display data for Phase 2B/2C
export interface ExtendedEmployee {
  id: string;
  firstName: string;
  email: string;
  department: string;
  departmentId: string;              // Reference to department (Phase 2C)
  position: string;                  // Phase 2B
  admissionDate: Date;              // Phase 2B
  hierarchicalLevel: HierarchicalLevel; // Phase 2B
  baseSalary: number;               // Phase 2B
  responsibleManager?: {            // Phase 2B
    id: string;
    name: string;
  };
  status: 'Ativo' | 'Inativo';
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

// Original Employee for backward compatibility
export interface Employee {
  id: string;
  firstName: string;
  email: string;
  department: string;
  status: 'Ativo' | 'Inativo';
  avatar: string; // Avatar color
  createdAt: Date;
}

// Employee with department relationship (Phase 2C)
export interface EmployeeWithDepartment extends Employee {
  departmentId: string;        // Required reference to department
  departmentName?: string;     // Denormalized for display performance
}

// Firebase operations interface - extended for Phase 2B/2C
export interface ExtendedFirebaseOperations {
  // Employee operations
  createEmployee: (data: ExtendedEmployeeFormData) => Promise<string>;
  updateEmployee: (id: string, data: Partial<ExtendedEmployeeFormData>) => Promise<void>;
  getEmployee: (id: string) => Promise<ExtendedEmployee | null>;
  getAllEmployees: () => Promise<ExtendedEmployee[]>;
  deleteEmployee: (id: string) => Promise<void>;
  getManagerLevelEmployees: () => Promise<ExtendedEmployee[]>;
  updateEmployeeDepartment: (employeeId: string, departmentId: string) => Promise<void>;
  
  // Department operations
  createDepartment: (data: any) => Promise<string>;
  updateDepartment: (id: string, data: any) => Promise<void>;
  getDepartment: (id: string) => Promise<any>;
  getAllDepartments: () => Promise<any[]>;
  deleteDepartment: (id: string, transferToDepartmentId?: string) => Promise<void>;
}

// Original Firebase operations for backward compatibility
export interface FirebaseOperations {
  createEmployee: (data: EmployeeFormData) => Promise<string>;
  updateEmployee: (id: string, data: Partial<EmployeeFormData>) => Promise<void>;
  getEmployee: (id: string) => Promise<Employee | null>;
  getAllEmployees: () => Promise<Employee[]>;
  deleteEmployee: (id: string) => Promise<void>;
}

export default EmployeeFormData;
