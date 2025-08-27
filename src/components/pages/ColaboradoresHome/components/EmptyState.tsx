import React from 'react';
import { Box, Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { StyledEmptyState } from '../../../ui/styled';

interface EmptyStateProps {
  type: 'no-employees' | 'no-results';
  searchTerm?: string;
  departmentFilter?: string;
  onCreateNew?: () => void;
  onClearFilters?: () => void;
  getDepartmentName?: (departmentId: string) => string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchTerm,
  departmentFilter,
  onCreateNew,
  onClearFilters,
  getDepartmentName,
}) => {
  if (type === 'no-employees') {
    return (
      <StyledEmptyState
        icon={<PersonAddIcon />}
        message="Nenhum colaborador cadastrado"
        description="Comece adicionando o primeiro colaborador ao sistema."
      >
        <Box sx={{ mt: 3 }}>
          {onCreateNew && (
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={onCreateNew}
              size="large"
            >
              Adicionar Colaborador
            </Button>
          )}
        </Box>
      </StyledEmptyState>
    );
  }

  if (type === 'no-results') {
    const hasSearchTerm = searchTerm && searchTerm.trim() !== '';
    const hasDepartmentFilter = departmentFilter && departmentFilter.trim() !== '';
    
    let message = 'Nenhum resultado encontrado';
    let description = 'Tente ajustar os filtros de busca.';
    
    if (hasSearchTerm && hasDepartmentFilter && getDepartmentName) {
      description = `Nenhum colaborador encontrado para "${searchTerm}" no departamento ${getDepartmentName(departmentFilter)}.`;
    } else if (hasSearchTerm) {
      description = `Nenhum colaborador encontrado para "${searchTerm}".`;
    } else if (hasDepartmentFilter && getDepartmentName) {
      description = `Nenhum colaborador encontrado no departamento ${getDepartmentName(departmentFilter)}.`;
    }

    return (
      <StyledEmptyState
        icon={<SearchOffIcon />}
        message={message}
        description={description}
      >
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {onClearFilters && (
            <Button
              variant="outlined"
              onClick={onClearFilters}
              size="large"
            >
              Limpar Filtros
            </Button>
          )}
          
          {onCreateNew && (
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={onCreateNew}
              size="large"
            >
              Adicionar Colaborador
            </Button>
          )}
        </Box>
      </StyledEmptyState>
    );
  }

  return null;
};