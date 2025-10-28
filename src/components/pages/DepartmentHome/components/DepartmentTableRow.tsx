import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  Chip,
  useTheme,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { Department } from '../../../../types/department';

interface DepartmentTableRowProps {
  department: Department;
  isDeleteMode: boolean;
  isSelected: boolean;
  isHovered: boolean;
  managerName: string;
  employeeCount: number;
  getGridColumns: (isDeleteMode: boolean) => string;
  onCheckboxChange: (departmentId: string, checked: boolean) => void;
  onActionsMenuClick: (event: React.MouseEvent<HTMLElement>, departmentId: string) => void;
  onRowClick: (department: Department) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const DepartmentTableRow: React.FC<DepartmentTableRowProps> = React.memo(({
  department,
  isDeleteMode,
  isSelected,
  isHovered,
  managerName,
  employeeCount,
  getGridColumns,
  onCheckboxChange,
  onActionsMenuClick,
  onRowClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const theme = useTheme();

  const handleRowClick = () => {
    if (!isDeleteMode) {
      onRowClick(department);
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: getGridColumns(isDeleteMode),
        gap: theme.spacing(2),
        padding: theme.spacing(2, 3),
        alignItems: 'center',
        backgroundColor: isSelected
          ? 'rgba(25, 118, 210, 0.08)'
          : isHovered && !isDeleteMode
            ? 'rgba(0, 0, 0, 0.04)'
            : '#ffffff',
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        cursor: isDeleteMode ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: isSelected
            ? 'rgba(25, 118, 210, 0.12)'
            : isDeleteMode
              ? '#ffffff'
              : 'rgba(0, 0, 0, 0.04)',
        },
      }}
      onClick={handleRowClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Checkbox column - only in delete mode */}
      {isDeleteMode && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={isSelected}
            onChange={(e) => onCheckboxChange(department.id, e.target.checked)}
            size="small"
            sx={{
              color: theme.palette.grey[400],
              '&.Mui-checked': {
                color: '#1976d2',
              },
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
      )}

      {/* Department Name */}
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: theme.palette.text.primary,
          fontSize: '14px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {department.name}
      </Typography>

      {/* Manager Name */}
      <Box>
        {managerName ? (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '14px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {managerName}
          </Typography>
        ) : (
          <Chip
            label="Sem responsável"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 193, 7, 0.1)',
              color: '#F57C00',
              fontSize: '12px',
              height: '24px',
              fontWeight: 500,
              border: '1px solid rgba(255, 193, 7, 0.3)',
            }}
          />
        )}
      </Box>

      {/* Employee Count */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Chip
          label={`${employeeCount} funcionário${employeeCount !== 1 ? 's' : ''}`}
          size="small"
          sx={{
            backgroundColor: employeeCount > 0 ? 'rgba(46, 125, 50, 0.1)' : 'rgba(158, 158, 158, 0.1)',
            color: employeeCount > 0 ? '#2E7D32' : theme.palette.grey[600],
            fontSize: '12px',
            height: '24px',
            fontWeight: 500,
            border: employeeCount > 0 
              ? '1px solid rgba(46, 125, 50, 0.3)' 
              : `1px solid ${theme.palette.grey[300]}`,
          }}
        />
      </Box>

      {/* Actions */}
      {!isDeleteMode && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            size="small"
            onClick={(e) => onActionsMenuClick(e, department.id)}
            sx={{
              opacity: isHovered ? 1 : 0.6,
              transition: 'opacity 0.2s ease',
              color: theme.palette.grey[600],
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                color: theme.palette.text.primary,
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
});

DepartmentTableRow.displayName = 'DepartmentTableRow';

export { DepartmentTableRow };