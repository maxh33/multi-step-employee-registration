// Employee form data interfaces - Aligned with actual frontend implementation

// PersonalInfo: Only fields actually implemented in PersonalInfoStep.tsx
export interface PersonalInfo {
  firstName: string;
  email: string;
  activateOnCreate: boolean; // Required toggle field for "Ativar ao criar"
}

// ProfessionalInfo: Only fields actually implemented in ProfessionalInfoStep.tsx
export interface ProfessionalInfo {
  department: string;
}

// EmployeeFormData: 2-step form with only implemented fields
export interface EmployeeFormData {
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
}

// Form state management
export interface FormState {
  currentStep: number;
  formData: Partial<EmployeeFormData>;
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

// Employee display data for the list - Only implemented fields
export interface Employee {
  id: string;
  firstName: string;
  email: string;
  department: string;
  status: 'Ativo' | 'Inativo';
  avatar: string; // Avatar color
  createdAt: Date;
  // Note: lastName, phone, position removed as not implemented in frontend
}

// Firebase operations interface - simplified for our 4-field implementation
export interface FirebaseOperations {
  createEmployee: (data: EmployeeFormData) => Promise<string>;
  updateEmployee: (id: string, data: Partial<EmployeeFormData>) => Promise<void>;
  getEmployee: (id: string) => Promise<Employee | null>;
  getAllEmployees: () => Promise<Employee[]>;
  deleteEmployee: (id: string) => Promise<void>;
}

export default EmployeeFormData;
