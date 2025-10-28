import React, { useState, useCallback, useMemo, memo } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Employee } from '../../../types/employee';
import { SecondaryButton, DestructiveButton } from '../../ui/styled';

// Import our extracted hooks
import {
  useEmployeeSearch,
  useEmployeeSelection,
  useEmployeeSorting,
  useEmployeeActions,
} from './hooks';

// Import our sub-components
import {
  EmployeeSearchBar,
  BulkActionToolbar,
  EmployeeTable,
  EmployeeActionMenu,
  EmptyState,
} from './components';

interface ColaboradoresHomeProps {
  onCreateNew: () => void;
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployees: (employeeIds: string[]) => void;
  departmentFilter?: string;
  onClearDepartmentFilter?: () => void;
}

export const ColaboradoresHome: React.FC<ColaboradoresHomeProps> = memo(({
  onCreateNew,
  employees,
  onEditEmployee,
  onDeleteEmployees,
  departmentFilter,
  onClearDepartmentFilter,
}) => {
  // Hover state for table rows
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  // Employee actions hook (provides data utilities and menu handling)
  const {
    menuPosition,
    actionsMenuEmployeeId,
    handleActionsMenuClick,
    handleActionsMenuClose,
    handleEdit,
    handleDelete,
    handleActualDelete,
    getDepartmentName,
    getManagerName,
    showSalaries,
    toggleSalaryVisibility,
    formatSalary,
    formatAdmissionDate,
    getHierarchicalLevelColor,
    getHierarchicalLevelTextColor,
  } = useEmployeeActions({
    employees,
    onEditEmployee,
    onDeleteEmployees,
  });

  // Employee search hook
  const {
    searchTerm,
    setSearchTerm,
    filteredEmployees,
    resultCount,
    hasActiveSearch,
    clearSearch,
  } = useEmployeeSearch({
    employees,
    departmentFilter,
    getDepartmentName,
    getManagerName,
  });

  // Employee selection hook
  const {
    selectedEmployees,
    isDeleteMode,
    setIsDeleteMode,
    showDeleteConfirmation,
    setShowDeleteConfirmation,
    isAllSelected,
    isPartiallySelected,
    handleSelectAll,
    toggleEmployeeSelection,
    clearSelection,
    handleBulkDelete,
    handleConfirmDelete,
    getSelectedCount,
    selectEmployee,
  } = useEmployeeSelection({
    filteredEmployees,
  }) as any; // Type assertion for the extended interface

  // Employee sorting hook
  const {
    sortedEmployees,
    handleSort,
    getSortIndicator,
  } = useEmployeeSorting({
    filteredEmployees,
    getDepartmentName,
    getManagerName,
  });

  // Handle individual employee delete from action menu
  const handleDeleteFromMenu = useCallback(() => {
    handleDelete(); // This will trigger the menu close
    // The actual selection will be handled by the parent component
    if (actionsMenuEmployeeId && typeof selectEmployee === 'function') {
      selectEmployee(actionsMenuEmployeeId);
    }
  }, [handleDelete, actionsMenuEmployeeId, selectEmployee]);

  // Handle actual deletion after confirmation
  const handleConfirmedDelete = useCallback(() => {
    const selectedIds = Array.from(selectedEmployees) as string[];
    handleActualDelete(selectedIds);
    clearSelection();
  }, [selectedEmployees, handleActualDelete, clearSelection]);

  // Handle delete mode cancellation
  const handleCancelDeleteMode = useCallback(() => {
    if (isDeleteMode) {
      setIsDeleteMode(false);
      clearSelection();
    }
  }, [isDeleteMode, setIsDeleteMode, clearSelection]);

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    clearSearch();
    if (onClearDepartmentFilter) {
      onClearDepartmentFilter();
    }
  }, [clearSearch, onClearDepartmentFilter]);

  // Memoized empty state check
  const shouldShowEmptyState = useMemo(() => {
    if (employees.length === 0) return 'no-employees';
    if (sortedEmployees.length === 0) return 'no-results';
    return null;
  }, [employees.length, sortedEmployees.length]);

  // Memoized search bar props
  const searchBarProps = useMemo(() => ({
    searchTerm,
    onSearchChange: setSearchTerm,
    showSalaries,
    onToggleSalaryVisibility: toggleSalaryVisibility,
    resultCount,
    totalCount: employees.length,
    departmentFilter,
    onClearDepartmentFilter,
    getDepartmentName,
  }), [
    searchTerm,
    setSearchTerm,
    showSalaries,
    toggleSalaryVisibility,
    resultCount,
    employees.length,
    departmentFilter,
    onClearDepartmentFilter,
    getDepartmentName,
  ]);

  // Memoized table props
  const tableProps = useMemo(() => ({
    employees: sortedEmployees,
    isDeleteMode,
    selectedEmployees,
    isAllSelected,
    isPartiallySelected,
    hoveredRowId,
    onSelectAll: handleSelectAll,
    onToggleEmployeeSelection: toggleEmployeeSelection,
    onRowHover: setHoveredRowId,
    onSort: handleSort,
    getSortIndicator,
    showSalaries,
    onActionsMenuClick: handleActionsMenuClick,
    formatSalary,
    formatAdmissionDate,
    getDepartmentName,
    getManagerName,
    getHierarchicalLevelColor,
    getHierarchicalLevelTextColor,
  }), [
    sortedEmployees,
    isDeleteMode,
    selectedEmployees,
    isAllSelected,
    isPartiallySelected,
    hoveredRowId,
    handleSelectAll,
    toggleEmployeeSelection,
    setHoveredRowId,
    handleSort,
    getSortIndicator,
    showSalaries,
    handleActionsMenuClick,
    formatSalary,
    formatAdmissionDate,
    getDepartmentName,
    getManagerName,
    getHierarchicalLevelColor,
    getHierarchicalLevelTextColor,
  ]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Search Bar */}
      <EmployeeSearchBar {...searchBarProps} />

      {/* Delete Mode Action Buttons */}
      {isDeleteMode && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <SecondaryButton
            startIcon={<CloseIcon />}
            onClick={handleCancelDeleteMode}
          >
            Cancelar
          </SecondaryButton>
          
          <DestructiveButton
            startIcon={<CheckIcon />}
            onClick={handleConfirmDelete}
            disabled={getSelectedCount() === 0}
          >
            Confirmar Exclusão ({getSelectedCount()})
          </DestructiveButton>
        </Box>
      )}

      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={getSelectedCount()}
        onClearSelection={clearSelection}
        onBulkDelete={handleBulkDelete}
      />

      {/* Main Content */}
      {shouldShowEmptyState ? (
        <EmptyState
          type={shouldShowEmptyState}
          searchTerm={searchTerm}
          departmentFilter={departmentFilter}
          onCreateNew={onCreateNew}
          onClearFilters={
            hasActiveSearch || departmentFilter 
              ? handleClearAllFilters 
              : undefined
          }
          getDepartmentName={getDepartmentName}
        />
      ) : (
        <EmployeeTable {...tableProps} />
      )}

      {/* Action Menu */}
      <EmployeeActionMenu
        anchorPosition={menuPosition}
        open={Boolean(menuPosition && actionsMenuEmployeeId)}
        onClose={handleActionsMenuClose}
        onEdit={handleEdit}
        onDelete={handleDeleteFromMenu}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
          Confirmar Exclusão
        </DialogTitle>
        
        <DialogContent>
          Tem certeza que deseja excluir {getSelectedCount()} colaborador
          {getSelectedCount() !== 1 ? 'es' : ''}? Esta ação não pode ser desfeita.
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <SecondaryButton
            onClick={() => setShowDeleteConfirmation(false)}
            fullWidth
          >
            Cancelar
          </SecondaryButton>
          
          <DestructiveButton
            onClick={handleConfirmedDelete}
            fullWidth
          >
            Excluir
          </DestructiveButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

ColaboradoresHome.displayName = 'ColaboradoresHome';

export default ColaboradoresHome;