import React, { memo } from 'react';
import { Box, Checkbox, Typography } from '@mui/material';
import { Employee } from '../../../../types/employee';
import { StyledTable, StyledTableHeader, StyledSortableHeader } from '../../../ui/styled';
import { EmployeeTableRow } from './EmployeeTableRow';

interface EmployeeTableProps {
  employees: Employee[];
  isDeleteMode: boolean;
  selectedEmployees: Set<string>;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  hoveredRowId: string | null;
  onSelectAll: (checked: boolean) => void;
  onToggleEmployeeSelection: (employeeId: string) => void;
  onRowHover: (employeeId: string | null) => void;
  onSort: (field: keyof Employee) => void;
  getSortIndicator: (field: keyof Employee) => string;
  showSalaries: boolean;
  onActionsMenuClick: (event: React.MouseEvent<HTMLElement>, employeeId: string) => void;
  formatSalary: (salary?: number) => string;
  formatAdmissionDate: (date?: Date | string) => string;
  getDepartmentName: (departmentId: string) => string;
  getManagerName: (managerId: string) => string;
  getHierarchicalLevelColor: (level?: string) => string;
  getHierarchicalLevelTextColor: (level?: string) => string;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = memo(({
  employees,
  isDeleteMode,
  selectedEmployees,
  isAllSelected,
  isPartiallySelected,
  hoveredRowId,
  onSelectAll,
  onToggleEmployeeSelection,
  onRowHover,
  onSort,
  getSortIndicator,
  showSalaries,
  onActionsMenuClick,
  formatSalary,
  formatAdmissionDate,
  getDepartmentName,
  getManagerName,
  getHierarchicalLevelColor,
  getHierarchicalLevelTextColor,
}) => {
  return (
    <StyledTable hasCheckbox={isDeleteMode} tableType="employee">
      {/* Table Headers */}
      <StyledTableHeader hasCheckbox={isDeleteMode} tableType="employee">
        {/* Checkbox column header - only in delete mode */}
        {isDeleteMode && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px' }}>
            <Checkbox
              checked={isAllSelected}
              indeterminate={isPartiallySelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              size="small"
            />
          </Box>
        )}

        {/* Employee info header (name + email) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', minHeight: '60px', justifyContent: 'center' }}>
          <StyledSortableHeader
            isActive={false}
            onClick={() => onSort('firstName')}
          >
            Colaborador {getSortIndicator('firstName')}
          </StyledSortableHeader>
        </Box>

        {/* Department header */}
        <Box sx={{ minHeight: '60px', display: 'flex', alignItems: 'center' }}>
          <StyledSortableHeader
            onClick={() => onSort('department')}
          >
            Departamento {getSortIndicator('department')}
          </StyledSortableHeader>
        </Box>

        {/* Position & Level header */}
        <Box sx={{ minHeight: '60px', display: 'flex', alignItems: 'center' }}>
          <StyledSortableHeader
            onClick={() => onSort('position')}
          >
            Cargo/Nível {getSortIndicator('position')}
          </StyledSortableHeader>
        </Box>

        {/* Manager & Salary header */}
        <Box sx={{ minHeight: '60px', display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Gerente/Salário
          </Typography>
        </Box>

        {/* Actions header */}
        <Box sx={{ minHeight: '60px', display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Ações
          </Typography>
        </Box>
      </StyledTableHeader>

      {/* Table Rows */}
      {employees.map((employee) => (
        <EmployeeTableRow
          key={employee.id}
          employee={employee}
          isDeleteMode={isDeleteMode}
          isSelected={selectedEmployees.has(employee.id)}
          isHovered={hoveredRowId === employee.id}
          onToggleSelection={() => onToggleEmployeeSelection(employee.id)}
          onHover={() => onRowHover(employee.id)}
          onHoverLeave={() => onRowHover(null)}
          showSalaries={showSalaries}
          onActionsMenuClick={onActionsMenuClick}
          formatSalary={formatSalary}
          formatAdmissionDate={formatAdmissionDate}
          getDepartmentName={getDepartmentName}
          getManagerName={getManagerName}
          getHierarchicalLevelColor={getHierarchicalLevelColor}
          getHierarchicalLevelTextColor={getHierarchicalLevelTextColor}
        />
      ))}
    </StyledTable>
  );
});