import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { tableStyles } from '../../../theme/tableStyles';
import { useResponsiveGrid } from '../../../theme/responsiveHelpers';

interface StyledTableProps {
  children: React.ReactNode;
  hasCheckbox?: boolean;
  tableType?: 'employee' | 'department';
}

interface StyledTableContainerProps {
  children: React.ReactNode;
}

interface StyledTableHeaderProps {
  children: React.ReactNode;
  hasCheckbox?: boolean;
  tableType?: 'employee' | 'department';
}

interface StyledTableRowProps {
  children: React.ReactNode;
  hasCheckbox?: boolean;
  tableType?: 'employee' | 'department';
  isHovered?: boolean;
  onClick?: () => void;
}

interface StyledTableCellProps {
  children: React.ReactNode;
  variant?: 'default' | 'avatar' | 'name' | 'email' | 'chip';
}

interface StyledEmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  description?: string;
  children?: React.ReactNode;
}

// Main table wrapper component
export const StyledTable: React.FC<StyledTableProps> = ({ 
  children, 
  hasCheckbox = false, 
  tableType = 'employee' 
}) => {
  const theme = useTheme();
  const { isMobile } = useResponsiveGrid();

  return (
    <Box sx={tableStyles.tableContainer(theme)}>
      <Paper
        elevation={0}
        sx={tableStyles.tablePaper(theme, isMobile)}
      >
        {children}
      </Paper>
    </Box>
  );
};

// Table container component (for scroll area)
export const StyledTableContainer: React.FC<StyledTableContainerProps> = ({ children }) => {
  return (
    <Box>
      {children}
    </Box>
  );
};

// Table header component
export const StyledTableHeader: React.FC<StyledTableHeaderProps> = ({ 
  children, 
  hasCheckbox = false, 
  tableType = 'employee' 
}) => {
  const theme = useTheme();
  const { getEmployeeTableColumns, getDepartmentTableColumns } = useResponsiveGrid();
  
  const gridColumns = tableType === 'employee' 
    ? getEmployeeTableColumns(hasCheckbox)
    : getDepartmentTableColumns(hasCheckbox);

  return (
    <Box sx={tableStyles.tableHeader(theme, gridColumns)}>
      {children}
    </Box>
  );
};

// Table row component
export const StyledTableRow: React.FC<StyledTableRowProps> = ({ 
  children, 
  hasCheckbox = false, 
  tableType = 'employee', 
  isHovered = false, 
  onClick 
}) => {
  const theme = useTheme();
  const { getEmployeeTableColumns, getDepartmentTableColumns } = useResponsiveGrid();
  
  const gridColumns = tableType === 'employee' 
    ? getEmployeeTableColumns(hasCheckbox)
    : getDepartmentTableColumns(hasCheckbox);

  return (
    <Box 
      sx={tableStyles.tableRow(theme, gridColumns, isHovered)} 
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

// Table cell components
export const StyledTableCell: React.FC<StyledTableCellProps> = ({ 
  children, 
  variant = 'default' 
}) => {
  const theme = useTheme();

  const getCellStyles = () => {
    switch (variant) {
      case 'avatar':
        return tableStyles.avatarCell(theme);
      case 'name':
        return tableStyles.employeeName(theme);
      case 'email':
        return tableStyles.employeeEmail(theme);
      case 'chip':
        return { display: 'flex', alignItems: 'center' };
      default:
        return { 
          display: 'flex', 
          alignItems: 'center',
          fontSize: '0.875rem',
          color: theme.palette.text.primary,
        };
    }
  };

  return (
    <Box sx={getCellStyles()}>
      {children}
    </Box>
  );
};

// Employee info cell (combines name + email)
export const StyledEmployeeInfoCell: React.FC<{ name: string; email: string }> = ({ 
  name, 
  email 
}) => {
  const theme = useTheme();

  return (
    <Box sx={tableStyles.employeeInfo}>
      <Typography sx={tableStyles.employeeName(theme)}>
        {name}
      </Typography>
      <Typography sx={tableStyles.employeeEmail(theme)}>
        {email}
      </Typography>
    </Box>
  );
};

// Empty state component
export const StyledEmptyState: React.FC<StyledEmptyStateProps> = ({ 
  icon, 
  message, 
  description,
  children 
}) => {
  const theme = useTheme();

  return (
    <Box sx={tableStyles.emptyState(theme)}>
      {icon && (
        <Box sx={tableStyles.emptyStateIcon(theme)}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" sx={{ marginBottom: 1, color: theme.palette.text.secondary }}>
        {message}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {description}
        </Typography>
      )}
      {children}
    </Box>
  );
};

// Sortable header cell component
interface StyledSortableHeaderProps {
  children: React.ReactNode;
  isActive?: boolean;
  direction?: 'asc' | 'desc';
  onClick?: () => void;
}

export const StyledSortableHeader: React.FC<StyledSortableHeaderProps> = ({ 
  children, 
  isActive = false, 
  direction, 
  onClick 
}) => {
  const theme = useTheme();

  return (
    <Box 
      sx={tableStyles.sortableHeader(theme, isActive, direction)} 
      onClick={onClick}
    >
      <Typography variant="body2" sx={{ fontWeight: 'inherit', color: 'inherit' }}>
        {children}
      </Typography>
      {isActive && (
        <Box 
          className="sort-icon" 
          sx={{ 
            ml: 0.5, 
            display: 'flex', 
            alignItems: 'center',
            fontSize: '0.875rem'
          }}
        >
          {direction === 'desc' ? '↓' : '↑'}
        </Box>
      )}
    </Box>
  );
};