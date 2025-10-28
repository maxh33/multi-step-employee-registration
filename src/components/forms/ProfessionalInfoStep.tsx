import React from 'react';
import { Box, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { ProfessionalInfo } from '../../types/employee';
import {
  DepartmentField,
  PositionField,
  AdmissionDateField,
  HierarchicalLevelField,
  ResponsibleManagerField,
  BaseSalaryField,
} from './fields';
import { HierarchicalLevelLockDialog } from './components/HierarchicalLevelLockDialog';
import { useDepartmentIntegration } from '../../hooks/forms/useDepartmentIntegration';
import { useManagerSelection } from '../../hooks/forms/useManagerSelection';
import { useHierarchicalLevelValidation } from '../../hooks/forms/useHierarchicalLevelValidation';

interface ProfessionalInfoStepProps {
  data: Partial<ProfessionalInfo>;
  errors: Record<string, string>;
  onChange: (data: Partial<ProfessionalInfo>) => void;
  isDepartmentLocked?: boolean;
  isHierarchicalLevelLocked?: boolean;
  onHierarchicalLevelChange?: () => Promise<boolean>;
  employeeId?: string; // For checking if manager has subordinates
  currentHierarchicalLevel?: string; // Current level for comparison
}

const ProfessionalInfoStep: React.FC<ProfessionalInfoStepProps> = React.memo(({ 
  data, 
  errors, 
  onChange, 
  isDepartmentLocked, 
  isHierarchicalLevelLocked, 
  onHierarchicalLevelChange, 
  employeeId, 
  currentHierarchicalLevel 
}) => {
  // Custom hooks for business logic
  const {
    departments,
    loadingDepartments,
    departmentError,
    getDepartmentName,
    fetchDepartments,
  } = useDepartmentIntegration({ data, onChange });

  const { managers, loadingManagers } = useManagerSelection({
    hierarchicalLevel: data.hierarchicalLevel,
    employeeId,
  });

  const {
    hasSubordinates,
    checkingSubordinates,
    hierarchicalLevelLockedBySubordinates,
    showLockDialog,
    handleLockedHierarchicalLevelClick,
    handleCloseLockDialog,
  } = useHierarchicalLevelValidation({
    employeeId,
    currentHierarchicalLevel,
  });

  // Event handlers
  const handleFieldChange =
    (field: keyof ProfessionalInfo) => (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      onChange({
        ...data,
        [field]: value,
      });
    };

  const handleHierarchicalLevelChange = async (event: SelectChangeEvent<string>) => {
    const newLevel = event.target.value as 'junior' | 'mid-level' | 'senior' | 'manager';
    
    // Update the value first
    onChange({
      ...data,
      hierarchicalLevel: newLevel,
      // Clear responsible manager if changing to manager level
      responsibleManager: newLevel === 'manager' ? '' : data.responsibleManager,
    });

    // Run async validation if provided
    if (onHierarchicalLevelChange) {
      await onHierarchicalLevelChange();
    }
  };



  const getFieldError = (field: string) => {
    return errors[`professionalInfo.${field}`] || '';
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
        Informações Profissionais
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Adicione informações profissionais do colaborador
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <DepartmentField
          value={data.department || ''}
          onChange={handleFieldChange('department')}
          error={getFieldError('department')}
          departments={departments}
          loadingDepartments={loadingDepartments}
          departmentError={departmentError}
          isDepartmentLocked={isDepartmentLocked}
          onRetryFetch={fetchDepartments}
        />

        <PositionField
          value={data.position || ''}
          onChange={(value) => onChange({ ...data, position: value })}
          error={getFieldError('position')}
        />

        <AdmissionDateField
          value={data.admissionDate || ''}
          onChange={(value) => onChange({ ...data, admissionDate: value })}
          error={getFieldError('admissionDate')}
        />

        <HierarchicalLevelField
          value={data.hierarchicalLevel || ''}
          onChange={handleHierarchicalLevelChange}
          error={getFieldError('hierarchicalLevel')}
          disabled={isHierarchicalLevelLocked || checkingSubordinates}
          locked={hierarchicalLevelLockedBySubordinates}
          lockReason={hierarchicalLevelLockedBySubordinates ? "Bloqueado - possui subordinados" : undefined}
          onLockedClick={handleLockedHierarchicalLevelClick}
        />

        <ResponsibleManagerField
          value={data.responsibleManager || ''}
          onChange={(e) => onChange({ ...data, responsibleManager: e.target.value })}
          error={getFieldError('responsibleManager')}
          managers={managers}
          loadingManagers={loadingManagers}
          getDepartmentName={getDepartmentName}
          hierarchicalLevel={data.hierarchicalLevel}
        />

        <BaseSalaryField
          value={data.baseSalary || 0}
          onChange={(value) => onChange({ ...data, baseSalary: value })}
          error={getFieldError('baseSalary')}
        />
      </Box>

      <HierarchicalLevelLockDialog
        open={showLockDialog}
        onClose={handleCloseLockDialog}
        hasSubordinates={hasSubordinates}
      />
    </Box>
  );
});

ProfessionalInfoStep.displayName = 'ProfessionalInfoStep';

export default ProfessionalInfoStep;
