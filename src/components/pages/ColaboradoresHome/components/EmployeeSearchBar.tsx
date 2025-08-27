import React from 'react';
import { Box, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { StyledSearchBar, StyledSearchContainer } from '../../../ui/styled';

interface EmployeeSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showSalaries: boolean;
  onToggleSalaryVisibility: () => void;
  resultCount: number;
  totalCount: number;
  departmentFilter?: string;
  onClearDepartmentFilter?: () => void;
  getDepartmentName: (departmentId: string) => string;
}

export const EmployeeSearchBar: React.FC<EmployeeSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  showSalaries,
  onToggleSalaryVisibility,
  resultCount,
  totalCount,
  departmentFilter,
  onClearDepartmentFilter,
  getDepartmentName,
}) => {
  const subtitle = departmentFilter 
    ? `Filtrado por: ${getDepartmentName(departmentFilter)} • ${resultCount} colaborador${resultCount !== 1 ? 'es' : ''} encontrado${resultCount !== 1 ? 's' : ''}`
    : `${totalCount} colaborador${totalCount !== 1 ? 'es' : ''} cadastrado${totalCount !== 1 ? 's' : ''}`;

  const salaryToggleButton = (
    <IconButton
      onClick={onToggleSalaryVisibility}
      size="small"
      sx={{
        backgroundColor: showSalaries ? 'primary.light' : 'grey.100',
        color: showSalaries ? 'primary.main' : 'text.secondary',
        '&:hover': {
          backgroundColor: showSalaries ? 'primary.main' : 'grey.200',
          color: showSalaries ? 'white' : 'text.primary',
        },
      }}
      title={showSalaries ? 'Ocultar salários' : 'Mostrar salários'}
    >
      {showSalaries ? <VisibilityOffIcon /> : <VisibilityIcon />}
    </IconButton>
  );

  const actions = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {salaryToggleButton}
      {departmentFilter && onClearDepartmentFilter && (
        <Box
          component="button"
          onClick={onClearDepartmentFilter}
          sx={{
            background: 'none',
            border: 'none',
            color: 'primary.main',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.875rem',
            padding: 0,
            '&:hover': {
              color: 'primary.dark',
            },
          }}
        >
          Limpar filtro
        </Box>
      )}
    </Box>
  );

  return (
    <StyledSearchContainer
      title="Colaboradores"
      subtitle={subtitle}
      actions={actions}
    >
      <StyledSearchBar
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Buscar por nome, email, departamento, cargo, nível ou gerente..."
        onClear={() => onSearchChange('')}
      />
    </StyledSearchContainer>
  );
};