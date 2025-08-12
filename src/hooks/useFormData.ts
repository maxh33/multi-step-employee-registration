import { useState, useCallback, useEffect } from 'react';
import { EmployeeFormData, FormState, ValidationResult } from '../types/employee';

const STORAGE_KEY = 'employee-form-data';

// Initial form data
const initialFormData: Partial<EmployeeFormData> = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    activateOnCreate: false,
  },
  professionalInfo: {
    position: '',
    department: '',
    startDate: '',
    salary: 0,
  },
  additionalInfo: {
    emergencyContact: '',
    notes: '',
  },
};

// Basic validation rules
const validateStep = (step: number, formData: Partial<EmployeeFormData>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (step === 1) {
    // Step 1: Personal Info validation
    if (!formData.personalInfo?.firstName?.trim()) {
      errors['personalInfo.firstName'] = 'Nome é obrigatório';
    }
    if (!formData.personalInfo?.email?.trim()) {
      errors['personalInfo.email'] = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalInfo.email)) {
      errors['personalInfo.email'] = 'E-mail deve ter um formato válido';
    }
  }

  if (step === 2) {
    // Step 2: Professional Info validation
    if (!formData.professionalInfo?.department?.trim()) {
      errors['professionalInfo.department'] = 'Departamento é obrigatório';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Calculate progress based on filled fields
const calculateProgress = (formData: Partial<EmployeeFormData>): number => {
  const fields = [
    formData.personalInfo?.firstName,
    formData.personalInfo?.email,
    true, // Toggle always counts as filled
    formData.professionalInfo?.department,
  ];

  const filledFields = fields.filter((field) =>
    typeof field === 'string' ? field.trim() !== '' : Boolean(field)
  ).length;

  return Math.round((filledFields / fields.length) * 100);
};

export const useFormData = (initialData?: Partial<EmployeeFormData>) => {
  const [formState, setFormState] = useState<FormState>(() => {
    // If initialData is provided (editing mode), use it
    if (initialData) {
      return {
        currentStep: 1,
        formData: { ...initialFormData, ...initialData },
        errors: {},
        isSubmitting: false,
        isValid: false,
      };
    }

    // Try to load from localStorage (create mode)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        return {
          currentStep: 1,
          formData: { ...initialFormData, ...parsedData },
          errors: {},
          isSubmitting: false,
          isValid: false,
        };
      } catch (error) {
        console.warn('Failed to parse saved form data:', error);
      }
    }

    return {
      currentStep: 1,
      formData: initialFormData,
      errors: {},
      isSubmitting: false,
      isValid: false,
    };
  });

  // Save to localStorage whenever formData changes (but only in create mode)
  useEffect(() => {
    if (!initialData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formState.formData));
    }
  }, [formState.formData, initialData]);

  // Update form data
  const updateFormData = useCallback((newData: Partial<EmployeeFormData>) => {
    setFormState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        ...newData,
      },
    }));
  }, []);

  // Update personal info
  const updatePersonalInfo = useCallback(
    (personalInfo: Partial<EmployeeFormData['personalInfo']>) => {
      setFormState((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          personalInfo: {
            ...prev.formData.personalInfo,
            ...personalInfo,
          } as EmployeeFormData['personalInfo'],
        },
      }));
    },
    []
  );

  // Update professional info
  const updateProfessionalInfo = useCallback(
    (professionalInfo: Partial<EmployeeFormData['professionalInfo']>) => {
      setFormState((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          professionalInfo: {
            ...prev.formData.professionalInfo,
            ...professionalInfo,
          } as EmployeeFormData['professionalInfo'],
        },
      }));
    },
    []
  );

  // Validate current step
  const validateCurrentStep = useCallback(() => {
    const validation = validateStep(formState.currentStep, formState.formData);
    setFormState((prev) => ({
      ...prev,
      errors: validation.errors,
      isValid: validation.isValid,
    }));
    return validation.isValid;
  }, [formState.currentStep, formState.formData]);

  // Move to next step
  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      setFormState((prev) => ({
        ...prev,
        currentStep: Math.min(prev.currentStep + 1, 2),
        errors: {},
      }));
      return true;
    }
    return false;
  }, [validateCurrentStep]);

  // Move to previous step
  const previousStep = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
      errors: {},
    }));
  }, []);

  // Go to specific step
  const goToStep = useCallback((step: number) => {
    setFormState((prev) => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, 2)),
      errors: {},
    }));
  }, []);

  // Set submitting state
  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState((prev) => ({
      ...prev,
      isSubmitting,
    }));
  }, []);

  // Clear form data
  const clearFormData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFormState({
      currentStep: 1,
      formData: initialFormData,
      errors: {},
      isSubmitting: false,
      isValid: false,
    });
  }, []);

  // Calculate current progress
  const currentProgress = calculateProgress(formState.formData);

  return {
    // State
    formData: formState.formData,
    currentStep: formState.currentStep,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    progress: currentProgress,

    // Actions
    updateFormData,
    updatePersonalInfo,
    updateProfessionalInfo,
    validateCurrentStep,
    nextStep,
    previousStep,
    goToStep,
    setSubmitting,
    clearFormData,
  };
};

export default useFormData;
