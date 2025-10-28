# Extended Employee Form - New Fields Specifications

## Overview

This document defines the extended employee registration form fields for Phase 2, implementing the professional information additions specified in SecondStep.md while maintaining the existing 2-step form structure and patterns.

## Requirements Analysis

Based on SecondStep.md:
- *"the following fields must be added to their professional information: Position, admission date, hierarchical level (whether junior, mid-level, senior, or manager), responsible manager (who will be another already registered employee, with a manager hierarchical level), and base salary"*
- *"other levels of employee should be filtered to not be displayed, only manager for this responsible employee"*

## Current vs Extended Data Model

### Current Employee Data (Phase 1)
```typescript
interface PersonalInfo {
  firstName: string;
  email: string;
  activateOnCreate: boolean;
}

interface ProfessionalInfo {
  department: string; // Selected from predefined list
}
```

### Extended Employee Data (Phase 2)
```typescript
interface PersonalInfo {
  firstName: string;     // ✅ Existing
  email: string;         // ✅ Existing  
  activateOnCreate: boolean; // ✅ Existing
}

interface ExtendedProfessionalInfo {
  // Existing fields
  department: string;                    // ✅ Keep existing
  
  // New required fields
  position: string;                      // 🆕 Job title/position
  admissionDate: string;                 // 🆕 Start date (ISO format)
  hierarchicalLevel: HierarchicalLevel;  // 🆕 Employee level
  baseSalary: number;                    // 🆕 Base salary amount
  
  // New optional field
  responsibleManager?: string;           // 🆕 Manager employee ID (required for non-managers)
}

type HierarchicalLevel = 'junior' | 'mid-level' | 'senior' | 'manager';
```

### Complete Employee Interface (Phase 2)
```typescript
interface EmployeeFormData {
  personalInfo: PersonalInfo;
  professionalInfo: ExtendedProfessionalInfo;
}

// Display interface with relationships
interface Employee {
  id: string;
  firstName: string;
  email: string;
  department: string;
  departmentId: string;
  position: string;
  admissionDate: Date;
  hierarchicalLevel: HierarchicalLevel;
  baseSalary: number;
  responsibleManager?: {
    id: string;
    name: string;
  };
  status: 'Ativo' | 'Inativo';
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Form Structure & Flow

### Maintained 2-Step Structure
The form maintains the existing 2-step pattern to preserve usability and testing compatibility:

#### Step 1: Personal Information (Unchanged)
- **firstName**: Text input (required)
- **email**: Email input with validation (required)
- **activateOnCreate**: Boolean toggle (required)

#### Step 2: Professional Information (Extended)
```typescript
// Professional Information Step - Extended Fields
interface ProfessionalInfoStepProps {
  formData: Partial<ExtendedProfessionalInfo>;
  errors: Record<string, string>;
  onChange: (field: keyof ExtendedProfessionalInfo, value: any) => void;
  onValidate: () => boolean;
  availableManagers: Employee[]; // Filtered manager-level employees
  departments: Department[];
}
```

**Extended Step 2 Fields:**
1. **Department** (existing): Dropdown selection
2. **Position** (new): Text input for job title  
3. **Admission Date** (new): Date picker
4. **Hierarchical Level** (new): Radio buttons or dropdown
5. **Responsible Manager** (new): Filtered autocomplete dropdown
6. **Base Salary** (new): Formatted number input

## New Field Specifications

### 1. Position Field
```typescript
interface PositionFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

// Validation rules
const positionValidation = {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[a-zA-ZÀ-ÿ\s\-\.]+$/, // Letters, spaces, hyphens, dots
  sanitize: (value: string) => value.trim(),
  errorMessages: {
    required: 'Cargo é obrigatório',
    minLength: 'Cargo deve ter pelo menos 2 caracteres',
    maxLength: 'Cargo deve ter no máximo 100 caracteres',
    pattern: 'Cargo deve conter apenas letras, espaços e hífens'
  }
};
```

**UI Component:**
```tsx
<TextField
  fullWidth
  label="Cargo *"
  placeholder="ex: Desenvolvedor Frontend"
  value={formData.position}
  onChange={(e) => onChange('position', e.target.value)}
  error={!!errors.position}
  helperText={errors.position || 'Informe o cargo do colaborador'}
  inputProps={{ maxLength: 100 }}
  variant="outlined"
/>
```

### 2. Admission Date Field
```typescript
interface AdmissionDateFieldProps {
  value: string; // ISO date string
  onChange: (value: string) => void;
  error?: string;
  maxDate?: Date; // Default to today
}

// Validation rules
const admissionDateValidation = {
  required: true,
  maxDate: new Date(), // Cannot be in the future
  minDate: new Date('1900-01-01'), // Reasonable minimum
  format: 'YYYY-MM-DD',
  errorMessages: {
    required: 'Data de admissão é obrigatória',
    maxDate: 'Data de admissão não pode ser no futuro',
    minDate: 'Data de admissão inválida',
    format: 'Formato de data inválido'
  }
};
```

**UI Component:**
```tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
  <DatePicker
    label="Data de Admissão *"
    value={formData.admissionDate ? new Date(formData.admissionDate) : null}
    onChange={(date) => onChange('admissionDate', date?.toISOString().split('T')[0] || '')}
    maxDate={new Date()}
    slotProps={{
      textField: {
        fullWidth: true,
        error: !!errors.admissionDate,
        helperText: errors.admissionDate || 'Selecione a data de início do colaborador',
        variant: 'outlined'
      }
    }}
  />
</LocalizationProvider>
```

### 3. Hierarchical Level Field
```typescript
interface HierarchicalLevelFieldProps {
  value: HierarchicalLevel | '';
  onChange: (value: HierarchicalLevel) => void;
  error?: string;
}

const hierarchicalLevels: Array<{
  value: HierarchicalLevel;
  label: string;
  description: string;
}> = [
  { 
    value: 'junior', 
    label: 'Júnior', 
    description: 'Profissional iniciante (0-2 anos)' 
  },
  { 
    value: 'mid-level', 
    label: 'Pleno', 
    description: 'Profissional intermediário (2-5 anos)' 
  },
  { 
    value: 'senior', 
    label: 'Sênior', 
    description: 'Profissional experiente (5+ anos)' 
  },
  { 
    value: 'manager', 
    label: 'Gerente', 
    description: 'Liderança e gestão de equipe' 
  }
];

// Validation rules
const hierarchicalLevelValidation = {
  required: true,
  validOptions: ['junior', 'mid-level', 'senior', 'manager'],
  errorMessages: {
    required: 'Nível hierárquico é obrigatório',
    invalid: 'Nível hierárquico inválido'
  }
};
```

**UI Component:**
```tsx
<FormControl fullWidth error={!!errors.hierarchicalLevel}>
  <FormLabel component="legend">Nível Hierárquico *</FormLabel>
  <RadioGroup
    value={formData.hierarchicalLevel}
    onChange={(e) => onChange('hierarchicalLevel', e.target.value as HierarchicalLevel)}
    row
  >
    {hierarchicalLevels.map((level) => (
      <FormControlLabel
        key={level.value}
        value={level.value}
        control={<Radio />}
        label={
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {level.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {level.description}
            </Typography>
          </Box>
        }
      />
    ))}
  </RadioGroup>
  {errors.hierarchicalLevel && (
    <FormHelperText>{errors.hierarchicalLevel}</FormHelperText>
  )}
</FormControl>
```

### 4. Responsible Manager Field
```typescript
interface ResponsibleManagerFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hierarchicalLevel: HierarchicalLevel | '';
  currentEmployeeId?: string; // For edit mode, prevent self-selection
  availableManagers: Employee[];
}

// Validation rules
const responsibleManagerValidation = {
  required: (hierarchicalLevel: HierarchicalLevel) => hierarchicalLevel !== 'manager',
  validManager: (managerId: string, availableManagers: Employee[]) => 
    availableManagers.some(m => m.id === managerId),
  notSelf: (managerId: string, currentEmployeeId?: string) => 
    !currentEmployeeId || managerId !== currentEmployeeId,
  errorMessages: {
    required: 'Responsável é obrigatório para este nível hierárquico',
    invalid: 'Responsável selecionado não é válido',
    self: 'Colaborador não pode ser responsável por si mesmo'
  }
};
```

**UI Component:**
```tsx
<Autocomplete
  options={availableManagers}
  getOptionLabel={(option) => `${option.firstName} (${option.department})`}
  value={availableManagers.find(m => m.id === formData.responsibleManager) || null}
  onChange={(_, newValue) => onChange('responsibleManager', newValue?.id || '')}
  disabled={formData.hierarchicalLevel === 'manager'}
  renderInput={(params) => (
    <TextField
      {...params}
      label={formData.hierarchicalLevel === 'manager' ? 'Responsável (N/A para Gerentes)' : 'Responsável *'}
      error={!!errors.responsibleManager}
      helperText={
        errors.responsibleManager || 
        (formData.hierarchicalLevel === 'manager' 
          ? 'Gerentes não possuem responsável direto'
          : 'Selecione o gerente responsável por este colaborador'
        )
      }
      variant="outlined"
    />
  )}
  renderOption={(props, option) => (
    <Box component="li" {...props}>
      <Avatar sx={{ mr: 2, bgcolor: option.avatar }}>
        {option.firstName.charAt(0).toUpperCase()}
      </Avatar>
      <Box>
        <Typography variant="body2">{option.firstName}</Typography>
        <Typography variant="caption" color="text.secondary">
          {option.department} • {option.position}
        </Typography>
      </Box>
    </Box>
  )}
  noOptionsText="Nenhum gerente disponível"
/>
```

### 5. Base Salary Field
```typescript
interface BaseSalaryFieldProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  currency?: string; // Default 'BRL'
}

// Validation rules
const baseSalaryValidation = {
  required: true,
  min: 1000, // Minimum wage consideration
  max: 1000000, // Reasonable maximum
  currency: 'BRL',
  errorMessages: {
    required: 'Salário base é obrigatório',
    min: 'Salário deve ser maior que R$ 1.000',
    max: 'Salário deve ser menor que R$ 1.000.000',
    invalid: 'Valor de salário inválido'
  }
};

// Utility functions
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value);
};

const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
};
```

**UI Component:**
```tsx
import { NumericFormat } from 'react-number-format';

<NumericFormat
  customInput={TextField}
  fullWidth
  label="Salário Base *"
  value={formData.baseSalary}
  onValueChange={(values) => onChange('baseSalary', values.floatValue || 0)}
  thousandSeparator="."
  decimalSeparator ","
  prefix="R$ "
  decimalScale={2}
  fixedDecimalScale
  allowNegative={false}
  error={!!errors.baseSalary}
  helperText={errors.baseSalary || 'Informe o salário base mensal'}
  variant="outlined"
  inputProps={{
    inputMode: 'numeric',
    pattern: '[0-9]*'
  }}
/>
```

## Form Validation Logic

### Extended Validation Hook
```typescript
// src/hooks/useFormData.ts - Extended validation
interface ExtendedFormValidation {
  validatePersonalInfo: (data: PersonalInfo) => ValidationResult;
  validateProfessionalInfo: (
    data: ExtendedProfessionalInfo,
    availableManagers: Employee[]
  ) => ValidationResult;
  validateStep: (
    step: number,
    formData: Partial<EmployeeFormData>,
    availableManagers: Employee[]
  ) => ValidationResult;
}

const useExtendedFormValidation = (): ExtendedFormValidation => {
  const validatePersonalInfo = useCallback((data: PersonalInfo): ValidationResult => {
    const errors: Record<string, string> = {};

    // Existing validations
    if (!data.firstName?.trim()) {
      errors.firstName = 'Nome é obrigatório';
    }
    
    if (!data.email?.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else if (!validator.isEmail(data.email)) {
      errors.email = 'E-mail deve ter um formato válido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  const validateProfessionalInfo = useCallback((
    data: ExtendedProfessionalInfo,
    availableManagers: Employee[]
  ): ValidationResult => {
    const errors: Record<string, string> = {};

    // Department validation (existing)
    if (!data.department?.trim()) {
      errors.department = 'Departamento é obrigatório';
    }

    // Position validation (new)
    if (!data.position?.trim()) {
      errors.position = 'Cargo é obrigatório';
    } else if (data.position.trim().length < 2) {
      errors.position = 'Cargo deve ter pelo menos 2 caracteres';
    } else if (data.position.trim().length > 100) {
      errors.position = 'Cargo deve ter no máximo 100 caracteres';
    }

    // Admission date validation (new)
    if (!data.admissionDate) {
      errors.admissionDate = 'Data de admissão é obrigatória';
    } else {
      const admissionDate = new Date(data.admissionDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      
      if (admissionDate > today) {
        errors.admissionDate = 'Data de admissão não pode ser no futuro';
      } else if (admissionDate < new Date('1900-01-01')) {
        errors.admissionDate = 'Data de admissão inválida';
      }
    }

    // Hierarchical level validation (new)
    const validLevels: HierarchicalLevel[] = ['junior', 'mid-level', 'senior', 'manager'];
    if (!data.hierarchicalLevel) {
      errors.hierarchicalLevel = 'Nível hierárquico é obrigatório';
    } else if (!validLevels.includes(data.hierarchicalLevel)) {
      errors.hierarchicalLevel = 'Nível hierárquico inválido';
    }

    // Responsible manager validation (new)
    if (data.hierarchicalLevel && data.hierarchicalLevel !== 'manager') {
      if (!data.responsibleManager) {
        errors.responsibleManager = 'Responsável é obrigatório para este nível hierárquico';
      } else if (!availableManagers.some(m => m.id === data.responsibleManager)) {
        errors.responsibleManager = 'Responsável selecionado não é válido';
      }
    }

    // Base salary validation (new)
    if (!data.baseSalary || data.baseSalary <= 0) {
      errors.baseSalary = 'Salário base é obrigatório';
    } else if (data.baseSalary < 1000) {
      errors.baseSalary = 'Salário deve ser maior que R$ 1.000';
    } else if (data.baseSalary > 1000000) {
      errors.baseSalary = 'Salário deve ser menor que R$ 1.000.000';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  const validateStep = useCallback((
    step: number,
    formData: Partial<EmployeeFormData>,
    availableManagers: Employee[]
  ): ValidationResult => {
    switch (step) {
      case 1:
        return validatePersonalInfo(formData.personalInfo as PersonalInfo);
      case 2:
        return validateProfessionalInfo(
          formData.professionalInfo as ExtendedProfessionalInfo,
          availableManagers
        );
      default:
        return { isValid: true, errors: {} };
    }
  }, [validatePersonalInfo, validateProfessionalInfo]);

  return {
    validatePersonalInfo,
    validateProfessionalInfo,
    validateStep
  };
};
```

## Manager Selection Logic

### Manager Filtering Hook
```typescript
// src/hooks/useManagerSelection.ts
interface UseManagerSelectionReturn {
  availableManagers: Employee[];
  loading: boolean;
  error: string | null;
  refreshManagers: () => Promise<void>;
}

const useManagerSelection = (currentEmployeeId?: string): UseManagerSelectionReturn => {
  const [availableManagers, setAvailableManagers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManagers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allEmployees = await getAllEmployees();
      
      // Filter to only manager-level employees
      const managers = allEmployees.filter(employee => 
        employee.hierarchicalLevel === 'manager' &&
        employee.status === 'Ativo' &&
        employee.id !== currentEmployeeId // Prevent self-selection
      );
      
      setAvailableManagers(managers);
    } catch (err) {
      setError('Erro ao carregar lista de gerentes');
      console.error('Error fetching managers:', err);
    } finally {
      setLoading(false);
    }
  }, [currentEmployeeId]);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  return {
    availableManagers,
    loading,
    error,
    refreshManagers: fetchManagers
  };
};
```

## Updated Form Components

### Enhanced ProfessionalInfoStep Component
```typescript
// src/components/forms/ProfessionalInfoStep.tsx
import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import DepartmentSelect from './fields/DepartmentSelect';
import PositionField from './fields/PositionField';
import AdmissionDateField from './fields/AdmissionDateField';
import HierarchicalLevelField from './fields/HierarchicalLevelField';
import ResponsibleManagerField from './fields/ResponsibleManagerField';
import BaseSalaryField from './fields/BaseSalaryField';
import { ExtendedProfessionalInfo, Employee } from '../../types/employee';
import { useManagerSelection } from '../../hooks/useManagerSelection';

interface ProfessionalInfoStepProps {
  formData: Partial<ExtendedProfessionalInfo>;
  errors: Record<string, string>;
  onChange: (field: keyof ExtendedProfessionalInfo, value: any) => void;
  currentEmployeeId?: string; // For edit mode
}

const ProfessionalInfoStep: React.FC<ProfessionalInfoStepProps> = ({
  formData,
  errors,
  onChange,
  currentEmployeeId
}) => {
  const { availableManagers, loading: managersLoading } = useManagerSelection(currentEmployeeId);

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Informações Profissionais
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Informe os dados profissionais do colaborador
      </Typography>

      <Grid container spacing={3}>
        {/* Existing department field */}
        <Grid item xs={12} md={6}>
          <DepartmentSelect
            value={formData.department || ''}
            onChange={(value) => onChange('department', value)}
            error={errors.department}
          />
        </Grid>

        {/* New position field */}
        <Grid item xs={12} md={6}>
          <PositionField
            value={formData.position || ''}
            onChange={(value) => onChange('position', value)}
            error={errors.position}
          />
        </Grid>

        {/* New admission date field */}
        <Grid item xs={12} md={6}>
          <AdmissionDateField
            value={formData.admissionDate || ''}
            onChange={(value) => onChange('admissionDate', value)}
            error={errors.admissionDate}
          />
        </Grid>

        {/* New base salary field */}
        <Grid item xs={12} md={6}>
          <BaseSalaryField
            value={formData.baseSalary || 0}
            onChange={(value) => onChange('baseSalary', value)}
            error={errors.baseSalary}
          />
        </Grid>

        {/* New hierarchical level field */}
        <Grid item xs={12}>
          <HierarchicalLevelField
            value={formData.hierarchicalLevel || ''}
            onChange={(value) => {
              onChange('hierarchicalLevel', value);
              // Clear manager selection if changing to manager level
              if (value === 'manager' && formData.responsibleManager) {
                onChange('responsibleManager', '');
              }
            }}
            error={errors.hierarchicalLevel}
          />
        </Grid>

        {/* New responsible manager field */}
        <Grid item xs={12}>
          <ResponsibleManagerField
            value={formData.responsibleManager || ''}
            onChange={(value) => onChange('responsibleManager', value)}
            error={errors.responsibleManager}
            hierarchicalLevel={formData.hierarchicalLevel || ''}
            availableManagers={availableManagers}
            loading={managersLoading}
            currentEmployeeId={currentEmployeeId}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfessionalInfoStep;
```

## Testing Strategy

### Extended Test Data
```typescript
// tests/utils/test-data.ts - Extended for new fields
export interface ExtendedTestEmployeeData extends TestEmployeeData {
  position: string;
  admissionDate: string;
  hierarchicalLevel: HierarchicalLevel;
  responsibleManager?: string;
  baseSalary: number;
}

export const extendedValidEmployeeData: ExtendedTestEmployeeData = {
  // Existing fields
  firstName: 'João Silva',
  email: 'joao.silva@test.com',
  activateOnCreate: true,
  department: 'Desenvolvimento',
  
  // New fields
  position: 'Desenvolvedor Frontend',
  admissionDate: '2024-01-15',
  hierarchicalLevel: 'mid-level',
  responsibleManager: 'manager-id-123',
  baseSalary: 5000
};

export const createManagerEmployee = (): ExtendedTestEmployeeData => ({
  firstName: 'Maria Manager',
  email: 'maria.manager@test.com',
  activateOnCreate: true,
  department: 'Desenvolvimento',
  position: 'Gerente de Desenvolvimento',
  admissionDate: '2020-01-01',
  hierarchicalLevel: 'manager',
  baseSalary: 15000
  // No responsibleManager for manager level
});
```

### Extended Form Tests
```typescript
// tests/core/extended-form-validation.spec.ts
test.describe('Extended Form Validation', () => {
  test('should validate all new professional fields', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Novo Colaborador');
    
    // Complete step 1
    await page.fill('input[placeholder="João da Silva"]', 'Test User');
    await page.fill('input[placeholder="e.g. john@gmail.com"]', 'test@example.com');
    await page.click('text=Ativar ao criar');
    await page.click('text=Próximo');
    
    // Try to submit step 2 without new required fields
    await page.click('text=Concluir');
    
    // Should show validation errors for new fields
    await expect(page.locator('text=Cargo é obrigatório')).toBeVisible();
    await expect(page.locator('text=Data de admissão é obrigatória')).toBeVisible();
    await expect(page.locator('text=Nível hierárquico é obrigatório')).toBeVisible();
    await expect(page.locator('text=Salário base é obrigatório')).toBeVisible();
  });
  
  test('should require responsible manager for non-manager levels', async ({ page }) => {
    // Complete form with junior level
    await fillCompleteForm(page, { hierarchicalLevel: 'junior' });
    await page.click('text=Concluir');
    
    // Should require responsible manager
    await expect(page.locator('text=Responsável é obrigatório')).toBeVisible();
  });
  
  test('should not require responsible manager for manager level', async ({ page }) => {
    // Complete form with manager level
    await fillCompleteForm(page, { hierarchicalLevel: 'manager' });
    await page.click('text=Concluir');
    
    // Should not require responsible manager
    await expect(page.locator('text=Responsável é obrigatório')).toBeHidden();
  });
});
```

## Migration Strategy

### Data Migration for Existing Employees
```typescript
// src/services/migration.ts
interface EmployeeMigrationData {
  position: string;
  admissionDate: string;
  hierarchicalLevel: HierarchicalLevel;
  baseSalary: number;
  responsibleManager?: string;
}

const migrateExistingEmployees = async () => {
  const employees = await getAllEmployees();
  
  for (const employee of employees) {
    // Add default values for new fields
    const migrationData: EmployeeMigrationData = {
      position: 'Cargo não especificado',
      admissionDate: employee.createdAt.toISOString().split('T')[0],
      hierarchicalLevel: 'mid-level', // Default level
      baseSalary: 3000, // Default salary
      // responsibleManager will be set manually by admin
    };
    
    await updateEmployee(employee.id, {
      professionalInfo: {
        ...employee.professionalInfo,
        ...migrationData
      }
    });
  }
};
```

## Performance Considerations

### Form Optimization
1. **Debounced Validation**: Avoid excessive validation calls
2. **Lazy Manager Loading**: Load managers only when needed
3. **Memoized Components**: React.memo for field components
4. **Virtual Scrolling**: For large manager selection lists

### Bundle Size Impact
New dependencies:
- `@mui/x-date-pickers` for date selection
- `react-number-format` for currency input
- Additional form validation logic

Estimated bundle size increase: ~50KB gzipped

## Implementation Checklist

### Data Model Updates
- [ ] Extend TypeScript interfaces
- [ ] Update Firebase service functions
- [ ] Create migration scripts for existing data
- [ ] Update security rules

### Form Components
- [ ] Create individual field components
- [ ] Update ProfessionalInfoStep component
- [ ] Implement manager selection logic
- [ ] Add comprehensive validation

### Testing
- [ ] Extend test data factory
- [ ] Create validation tests for all new fields
- [ ] Test manager selection filtering
- [ ] Test form submission with extended data

### UI/UX
- [ ] Maintain design consistency
- [ ] Responsive design for all new fields
- [ ] Loading states for manager selection
- [ ] Error handling and user feedback

This extended form specification provides a comprehensive implementation plan for the new professional information fields while maintaining compatibility with existing patterns and ensuring proper validation and user experience.