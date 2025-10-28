import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Department } from '../../../../types/department';

interface DepartmentTableHeaderProps {
  isDeleteMode: boolean;
  selectedDepartments: Set<string>;
  filteredDepartments: Department[];
  getGridColumns: (isDeleteMode: boolean) => string;
  getSortIndicator: (field: keyof Department) => string;
  onSort: (field: keyof Department) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

const DepartmentTableHeader: React.FC<DepartmentTableHeaderProps> = React.memo(({
  isDeleteMode,
  selectedDepartments,
  filteredDepartments,
  getGridColumns,
  getSortIndicator,
  onSort,
  onConfirmDelete,
  onCancelDelete,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: getGridColumns(isDeleteMode),
        gap: theme.spacing(2),
        padding: theme.spacing(2, 3),
        alignItems: 'center',
        backgroundColor: '#f4f6f8',
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        transition: 'grid-template-columns 0.3s ease',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Checkbox column header - only in delete mode */}
      {isDeleteMode && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Empty space for checkbox column */}
        </Box>
      )}

      <Typography
        variant="body2"
        onClick={() => onSort('name')}
        sx={{
          fontWeight: 500,
          color: theme.palette.text.secondary,
          fontSize: '14px',
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': {
            color: theme.palette.text.primary,
          },
        }}
      >
        Nome {getSortIndicator('name')}
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: theme.palette.text.secondary,
          fontSize: '14px',
        }}
      >
        Responsável
      </Typography>
      
      <Typography
        variant="body2"
        onClick={() => onSort('employeeIds')}
        sx={{
          fontWeight: 500,
          color: theme.palette.text.secondary,
          fontSize: '14px',
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': {
            color: theme.palette.text.primary,
          },
        }}
      >
        Funcionários {getSortIndicator('employeeIds')}
      </Typography>
      
      {/* Actions column header */}
      {isDeleteMode ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing(0.5),
          }}
        >
          <IconButton
            size="small"
            onClick={onConfirmDelete}
            disabled={selectedDepartments.size === 0}
            sx={{
              color: '#C62828',
              '&:hover': {
                backgroundColor: 'rgba(198, 40, 40, 0.1)',
              },
              '&:disabled': {
                color: theme.palette.grey[400],
              },
            }}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onCancelDelete}
            sx={{
              color: '#2E7D32',
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: theme.palette.text.secondary,
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Ações
        </Typography>
      )}
    </Box>
  );
});

DepartmentTableHeader.displayName = 'DepartmentTableHeader';

export { DepartmentTableHeader };