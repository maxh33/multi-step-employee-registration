// Employee form data interfaces
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ProfessionalInfo {
  position: string;
  department: string;
  startDate: string;
  salary: number;
}

export interface AdditionalInfo {
  emergencyContact: string;
  notes: string;
}

export interface EmployeeFormData {
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  additionalInfo: AdditionalInfo;
}

// Form state management
export interface FormState {
  currentStep: number;
  formData: Partial<EmployeeFormData>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
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

// Firebase related types
export interface FirebaseEmployee extends EmployeeFormData {
  id: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
  status: 'pending' | 'approved' | 'rejected';
}

export interface FirebaseOperations {
  createEmployee: (data: EmployeeFormData) => Promise<string>;
  updateEmployee: (id: string, data: Partial<EmployeeFormData>) => Promise<void>;
  getEmployee: (id: string) => Promise<FirebaseEmployee | null>;
}

// Step configuration
export interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
  component: string;
  fields: string[];
}

// Form step props
export interface FormStepProps {
  formData: Partial<EmployeeFormData>;
  errors: Record<string, string>;
  onUpdate: (data: Partial<EmployeeFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export default EmployeeFormData;