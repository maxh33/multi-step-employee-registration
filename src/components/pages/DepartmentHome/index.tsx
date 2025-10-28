import React, { useCallback } from 'react';
import {
  Box,
  Paper,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Department } from '../../../types/department';
import {
  useDepartmentData,
  useDepartmentSearch,
  useDepartmentSorting,
  useDepartmentActions,
} from './hooks';
import {
  DepartmentSearchBar,
  DepartmentTableHeader,
  DepartmentTableRow,
  DepartmentActionMenu,
  EmptyState,
} from './components';

interface DepartmentHomeProps {
  onNavigateToEmployees?: (departmentId: string) => void;
  onNavigateToCreateManager?: (departmentId: string, departmentName: string) => void;
}

const DepartmentHome: React.FC<DepartmentHomeProps> = React.memo(({
  onNavigateToEmployees,
  onNavigateToCreateManager,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    departments,
    loading,
    error,
    managerNames,
    employeeCounts,
    refreshDepartments,
    clearError,
  } = useDepartmentData();

  const {
    searchTerm,
    filteredDepartments,
    handleSearchChange,
  } = useDepartmentSearch({ departments, managerNames });

  const {
    sortedDepartments,
    handleSort,
    getSortIndicator,
  } = useDepartmentSorting({ filteredDepartments, employeeCounts });

  const {
    selectedDepartments,
    isDeleteMode,
    hoveredRowId,
    menuPosition,
    setHoveredRowId,
    handleCheckboxChange,
    handleActionsMenuClick,
    handleActionsMenuClose,
    handleEdit,
    handleDelete,
    handleCancelDelete,
    handleConfirmDelete,
    handleRowClick,
  } = useDepartmentActions({
    departments,
    onRefresh: refreshDepartments,
    onEdit: (department: Department) => navigate(`/departamentos/editar/${department.id}`),
    onError: () => {},
  });

  const getGridColumns = useCallback((isDeleteMode: boolean): string => {
    if (isMobile) {
      return isDeleteMode ? '40px 1fr 80px' : '1fr 80px';
    }
    return isDeleteMode ? '40px 1fr 1fr 120px 60px' : '1fr 1fr 120px 60px';
  }, [isMobile]);

  const handleCreateNew = useCallback(() => {
    navigate('/departamentos/novo');
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ padding: theme.spacing(3) }}>
        <DepartmentSearchBar
          searchTerm=""
          onSearchChange={() => {}}
          onCreateNew={handleCreateNew}
        />
        <Paper
          sx={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: `1px solid ${theme.palette.grey[200]}`,
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box>Carregando departamentos...</Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: theme.spacing(3) }}>
      <DepartmentSearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onCreateNew={handleCreateNew}
      />

      <Paper
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        {sortedDepartments.length === 0 ? (
          <EmptyState
            searchTerm={searchTerm}
            onCreateNew={handleCreateNew}
          />
        ) : (
          <>
            <DepartmentTableHeader
              isDeleteMode={isDeleteMode}
              selectedDepartments={selectedDepartments}
              filteredDepartments={filteredDepartments}
              getGridColumns={getGridColumns}
              getSortIndicator={getSortIndicator}
              onSort={handleSort}
              onConfirmDelete={handleConfirmDelete}
              onCancelDelete={handleCancelDelete}
            />

            {sortedDepartments.map((department) => (
              <DepartmentTableRow
                key={department.id}
                department={department}
                isDeleteMode={isDeleteMode}
                isSelected={selectedDepartments.has(department.id)}
                isHovered={hoveredRowId === department.id}
                managerName={managerNames[department.id] || ''}
                employeeCount={employeeCounts[department.id] || 0}
                getGridColumns={getGridColumns}
                onCheckboxChange={handleCheckboxChange}
                onActionsMenuClick={handleActionsMenuClick}
                onRowClick={handleRowClick}
                onMouseEnter={() => setHoveredRowId(department.id)}
                onMouseLeave={() => setHoveredRowId(null)}
              />
            ))}
          </>
        )}
      </Paper>

      <DepartmentActionMenu
        anchorPosition={menuPosition}
        onClose={handleActionsMenuClose}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="error" onClose={clearError}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
});

DepartmentHome.displayName = 'DepartmentHome';

export default DepartmentHome;