import React, { memo, useCallback } from 'react';
import { Box, Checkbox, Avatar, Typography, Chip, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Employee } from '../../../../types/employee';
import { StyledTableRow, StyledTableCell, StyledEmployeeInfoCell } from '../../../ui/styled';

interface EmployeeTableRowProps {
  employee: Employee;
  isDeleteMode: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onToggleSelection: () => void;
  onHover: () => void;
  onHoverLeave: () => void;
  showSalaries: boolean;
  onActionsMenuClick: (event: React.MouseEvent<HTMLElement>, employeeId: string) => void;
  formatSalary: (salary?: number) => string;
  formatAdmissionDate: (date?: Date | string) => string;
  getDepartmentName: (departmentId: string) => string;
  getManagerName: (managerId: string) => string;
  getHierarchicalLevelColor: (level?: string) => string;
  getHierarchicalLevelTextColor: (level?: string) => string;
}

export const EmployeeTableRow: React.FC<EmployeeTableRowProps> = memo(({
  employee,
  isDeleteMode,
  isSelected,
  isHovered,
  onToggleSelection,
  onHover,
  onHoverLeave,
  showSalaries,
  onActionsMenuClick,
  formatSalary,
  formatAdmissionDate,
  getDepartmentName,
  getManagerName,
  getHierarchicalLevelColor,
  getHierarchicalLevelTextColor,
}) => {
  const handleActionsClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    onActionsMenuClick(event, employee.id);
  }, [onActionsMenuClick, employee.id]);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getHierarchicalLevelLabel = (level?: string): string => {
    switch (level) {
      case 'junior': return 'Júnior';
      case 'mid-level': return 'Pleno';
      case 'senior': return 'Sênior';
      case 'manager': return 'Gerente';
      default: return level || '';
    }
  };

  return (
    <StyledTableRow
      hasCheckbox={isDeleteMode}
      tableType="employee"
      isHovered={isHovered}
    >
      <Box
        onMouseEnter={onHover}
        onMouseLeave={onHoverLeave}
        sx={{ 
          display: 'contents',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
      >
        {/* Checkbox column - only in delete mode */}
        {isDeleteMode && (
          <StyledTableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Checkbox
                checked={isSelected}
                onChange={onToggleSelection}
                size="small"
                onClick={(e) => e.stopPropagation()}
              />
            </Box>
          </StyledTableCell>
        )}

        {/* Employee info (avatar + name + email) */}
        <StyledTableCell variant="avatar">
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: 'primary.main',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {getInitials(employee.firstName)}
          </Avatar>
          <StyledEmployeeInfoCell 
            name={employee.firstName} 
            email={employee.email} 
          />
        </StyledTableCell>

        {/* Department */}
        <StyledTableCell>
          <Chip
            label={getDepartmentName(employee.department)}
            size="small"
            sx={{
              backgroundColor: (theme) => theme.palette.primary.light + '20',
              color: (theme) => theme.palette.primary.main,
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          />
        </StyledTableCell>

        {/* Position and Hierarchical Level */}
        <StyledTableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {employee.position && (
              <Typography sx={{ fontSize: '0.875rem', color: 'text.primary', lineHeight: 1.2 }}>
                {employee.position}
              </Typography>
            )}
            {employee.hierarchicalLevel && (
              <Chip
                label={getHierarchicalLevelLabel(employee.hierarchicalLevel)}
                size="small"
                sx={{
                  backgroundColor: getHierarchicalLevelColor(employee.hierarchicalLevel),
                  color: getHierarchicalLevelTextColor(employee.hierarchicalLevel),
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  height: '20px',
                }}
              />
            )}
          </Box>
        </StyledTableCell>

        {/* Manager and Salary */}
        <StyledTableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {employee.responsibleManager && (
              <Typography 
                sx={{ 
                  fontSize: '0.75rem', 
                  color: 'text.secondary', 
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                👤 {getManagerName(employee.responsibleManager)}
              </Typography>
            )}
            {showSalaries && employee.baseSalary && (
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: 'success.main',
                  lineHeight: 1.2,
                  fontFamily: 'monospace',
                  fontWeight: 600,
                }}
              >
                💰 {formatSalary(employee.baseSalary)}
              </Typography>
            )}
            {employee.admissionDate && (
              <Typography 
                sx={{ 
                  fontSize: '0.75rem', 
                  color: 'text.secondary', 
                  lineHeight: 1.2 
                }}
              >
                📅 {formatAdmissionDate(employee.admissionDate)}
              </Typography>
            )}
          </Box>
        </StyledTableCell>

        {/* Actions */}
        <StyledTableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton
              onClick={handleActionsClick}
              size="small"
              sx={{
                opacity: isHovered ? 1 : 0.6,
                transition: 'opacity 0.2s ease',
                '&:hover': {
                  opacity: 1,
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </StyledTableCell>
      </Box>
    </StyledTableRow>
  );
});