import { useState, useCallback, useEffect } from 'react';
import validator from 'validator';
import { EmployeeFormData, FormState, ValidationResult } from '../types/employee';
import { validateHierarchicalLevelChange } from '../services/firebase';

const STORAGE_KEY = 'employee-form-data';

// Initial form data - Only implemented fields
const initialFormData: Partial<EmployeeFormData> = {
  personalInfo: {
    firstName: '',
    email: '',
    activateOnCreate: false,
  },
  professionalInfo: {
    department: '', // Ensure empty string default to avoid invalid values
    position: '',
    admissionDate: '',
    hierarchicalLevel: 'junior' as const,
    responsibleManager: '',
    baseSalary: 0,
  },
};

// Basic validation rules - All 8 fields are required (3 personal + 5 professional)
const validateStep = (step: number, formData: Partial<EmployeeFormData>, employeeId?: string): ValidationResult => {
  const errors: Record<string, string> = {};

  if (step === 1) {
    // Step 1: Personal Info validation (3 required fields)
    if (!formData.personalInfo?.firstName?.trim()) {
      errors['personalInfo.firstName'] = 'Nome é obrigatório';
    }
    if (!formData.personalInfo?.email?.trim()) {
      errors['personalInfo.email'] = 'E-mail é obrigatório';
    } else if (!validator.isEmail(formData.personalInfo.email)) {
      errors['personalInfo.email'] = 'E-mail deve ter um formato válido';
    }
    if (formData.personalInfo?.activateOnCreate === undefined) {
      errors['personalInfo.activateOnCreate'] = 'Definir status de ativação é obrigatório';
    }
  }

  if (step === 2) {
    // Step 2: Professional Info validation (6 required fields)
    if (!formData.professionalInfo?.department?.trim()) {
      errors['professionalInfo.department'] = 'Departamento é obrigatório';
    }
    if (!formData.professionalInfo?.position?.trim()) {
      errors['professionalInfo.position'] = 'Cargo é obrigatório';
    }
    // admissionDate is now optional
    // if (!formData.professionalInfo?.admissionDate?.trim()) {
    //   errors['professionalInfo.admissionDate'] = 'Data de admissão é obrigatória';
    // }
    if (!formData.professionalInfo?.hierarchicalLevel) {
      errors['professionalInfo.hierarchicalLevel'] = 'Nível hierárquico é obrigatório';
    }
    // Responsible manager is only required for non-manager levels
    if (formData.professionalInfo?.hierarchicalLevel && 
        formData.professionalInfo.hierarchicalLevel !== 'manager' &&
        !formData.professionalInfo?.responsibleManager?.trim()) {
      errors['professionalInfo.responsibleManager'] = 'Responsável é obrigatório para este nível';
    }
    
    // Prevent self-assignment as responsible manager
    if (employeeId && 
        formData.professionalInfo?.responsibleManager && 
        formData.professionalInfo.responsibleManager === employeeId) {
      errors['professionalInfo.responsibleManager'] = 'Um colaborador não pode ser responsável por si mesmo';
    }
    if (!formData.professionalInfo?.baseSalary || formData.professionalInfo.baseSalary <= 0) {
      errors['professionalInfo.baseSalary'] = 'Salário base deve ser maior que zero';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Calculate progress based on filled fields - 8 required fields total (3 personal + 5 professional)
const calculateProgress = (formData: Partial<EmployeeFormData>): number => {
  const fields = [
    // Personal Info (3 fields)
    formData.personalInfo?.firstName, // Required
    formData.personalInfo?.email, // Required
    formData.personalInfo?.activateOnCreate !== undefined ? 'set' : '', // Required (boolean)
    
    // Professional Info (5 fields - responsibleManager is conditional)
    formData.professionalInfo?.department, // Required
    formData.professionalInfo?.position, // Required
    // formData.professionalInfo?.admissionDate, // Optional now
    formData.professionalInfo?.hierarchicalLevel, // Required
    formData.professionalInfo?.baseSalary && formData.professionalInfo.baseSalary > 0 ? 'set' : '', // Required (number > 0)
  ];

  const filledFields = fields.filter((field) =>
    typeof field === 'string' ? field.trim() !== '' : Boolean(field)
  ).length;

  return Math.round((filledFields / fields.length) * 100);
};

// Async validation for hierarchical level changes in edit mode
const validateHierarchicalLevelAsync = async (
  employeeId: string | undefined,
  currentLevel: string | undefined,
  newLevel: string | undefined
): Promise<{ isValid: boolean; error?: string }> => {
  if (!employeeId || !currentLevel || !newLevel || currentLevel === newLevel) {
    return { isValid: true };
  }

  try {
    const validation = await validateHierarchicalLevelChange(employeeId, currentLevel, newLevel);
    return {
      isValid: validation.isValid,
      error: validation.reason,
    };
  } catch (error) {
    console.error('Error validating hierarchical level:', error);
    return {
      isValid: false,
      error: 'Erro ao validar mudança de nível hierárquico. Tente novamente.',
    };
  }
};

export const useFormData = (
  initialData?: Partial<EmployeeFormData>,
  employeeId?: string
) => {
  const [formState, setFormState] = useState<FormState>(() => {
    // If initialData is provided (editing mode), use it
    if (initialData) {
      return {
        currentStep: 1,
        formData: { ...initialFormData, ...initialData },
        errors: {},
        isSubmitting: false,
        isValid: false,
        localStorageError: null, // Initialize new state
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
          localStorageError: null, // No error
        };
      } catch (error) {
        console.warn('Failed to parse saved form data:', error);
        return {
          currentStep: 1,
          formData: initialFormData, // Reset to initial if corrupted
          errors: {},
          isSubmitting: false,
          isValid: false,
          localStorageError: 'Dados salvos corrompidos. O formulário foi resetado.', // Set error message
        };
      }
    }

    return {
      currentStep: 1,
      formData: initialFormData,
      errors: {},
      isSubmitting: false,
      isValid: false,
      localStorageError: null, // No error
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

  // Update professional info - department only
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
    const validation = validateStep(formState.currentStep, formState.formData, employeeId);
    setFormState((prev) => ({
      ...prev,
      errors: validation.errors,
      isValid: validation.isValid,
    }));
    return validation.isValid;
  }, [formState.currentStep, formState.formData, employeeId]);

  // Async validation for hierarchical level changes (for edit mode)
  const validateHierarchicalLevel = useCallback(async () => {
    if (!employeeId || !initialData?.professionalInfo?.hierarchicalLevel) {
      return true; // Skip validation for create mode
    }

    const currentLevel = initialData.professionalInfo.hierarchicalLevel;
    const newLevel = formState.formData.professionalInfo?.hierarchicalLevel;

    if (!newLevel || currentLevel === newLevel) {
      return true; // No change, validation passes
    }

    const validation = await validateHierarchicalLevelAsync(employeeId, currentLevel, newLevel);
    
    if (!validation.isValid) {
      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          'professionalInfo.hierarchicalLevel': validation.error || 'Mudança de nível hierárquico não permitida',
        },
        isValid: false,
      }));
      return false;
    }

    // Clear any existing hierarchical level errors if validation passes
    setFormState((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors['professionalInfo.hierarchicalLevel'];
      return {
        ...prev,
        errors: newErrors,
      };
    });

    return true;
  }, [employeeId, initialData?.professionalInfo?.hierarchicalLevel, formState.formData.professionalInfo?.hierarchicalLevel]);

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
      localStorageError: null, // Clear error on reset
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
    localStorageError: formState.localStorageError, // Return new state

    // Actions
    updateFormData,
    updatePersonalInfo,
    updateProfessionalInfo,
    validateCurrentStep,
    validateHierarchicalLevel,
    nextStep,
    previousStep,
    goToStep,
    setSubmitting,
    clearFormData,
  };
};

export default useFormData;
