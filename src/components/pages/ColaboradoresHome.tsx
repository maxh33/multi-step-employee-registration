import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Employee } from '../../types/employee';

interface ColaboradoresHomeProps {
  onCreateNew: () => void;
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployees: (employeeIds: string[]) => void;
}

const ColaboradoresHome: React.FC<ColaboradoresHomeProps> = ({
  onCreateNew,
  employees,
  onEditEmployee,
  onDeleteEmployees,
}) => {
  const theme = useTheme();

  // Sorting state
  const [sortField, setSortField] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Delete mode state
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  // Actions menu state (3-dot menu for edit/delete)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [actionsMenuEmployeeId, setActionsMenuEmployeeId] = useState<string | null>(null);

  // Sort employees based on current sort settings
  const sortedEmployees = useMemo(() => {
    if (!sortField) return employees;

    return [...employees].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle name sorting (firstName only since lastName not implemented)
      if (sortField === 'firstName') {
        aValue = a.firstName;
        bValue = b.firstName;
      }

      // Convert to strings for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [employees, sortField, sortDirection]);

  // Handle column header click for sorting
  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, start with ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort indicator for column headers
  const getSortIndicator = (field: keyof Employee) => {
    if (sortField !== field) return '↕'; // No sort
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Handle actions menu (edit/delete)
  const handleActionsMenuClick = (event: React.MouseEvent<HTMLElement>, employeeId: string) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
    setActionsMenuEmployeeId(employeeId);
  };

  const handleActionsMenuClose = () => {
    setMenuPosition(null);
    setActionsMenuEmployeeId(null);
  };

  const handleEdit = () => {
    if (actionsMenuEmployeeId) {
      const employee = employees.find((emp) => emp.id === actionsMenuEmployeeId);
      if (employee) {
        onEditEmployee(employee);
      }
    }
    handleActionsMenuClose();
  };

  const handleDelete = () => {
    setIsDeleteMode(true);
    if (actionsMenuEmployeeId) {
      setSelectedEmployees(new Set([actionsMenuEmployeeId]));
    }
    handleActionsMenuClose();
  };

  const handleCancelDelete = () => {
    setIsDeleteMode(false);
    setSelectedEmployees(new Set());
  };

  const handleConfirmDelete = () => {
    if (selectedEmployees.size > 0) {
      onDeleteEmployees(Array.from(selectedEmployees));
      setSelectedEmployees(new Set());
      setIsDeleteMode(false);
    }
  };

  const handleCheckboxChange = (employeeId: string, checked: boolean) => {
    const newSelected = new Set(selectedEmployees);
    if (checked) {
      newSelected.add(employeeId);
    } else {
      newSelected.delete(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  const handleRowClick = (employee: Employee) => {
    if (!isDeleteMode) {
      onEditEmployee(employee);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '1400px',
        width: '100%',
        padding: theme.spacing(3, 3, 3, 2),
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing(3),
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: '1.75rem',
          }}
        >
          Colaboradores
        </Typography>

        <Button
          variant="contained"
          onClick={onCreateNew}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: '#ffffff',
            fontWeight: 500,
            padding: theme.spacing(1.5, 3),
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Novo Colaborador
        </Button>
      </Box>

      {/* Sticky Table Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: '12px 12px 0 0',
            border: `1px solid ${theme.palette.grey[200]}`,
            borderBottom: 'none',
          }}
        >
          {/* Table Headers */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: isDeleteMode ? '40px 1fr 1fr 1fr 80px 80px' : '1fr 1fr 1fr 80px',
              gap: theme.spacing(2),
              padding: theme.spacing(2, 3),
              backgroundColor: '#f4f6f8',
              borderBottom: `1px solid ${theme.palette.grey[200]}`,
              transition: 'grid-template-columns 0.3s ease',
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
              onClick={() => handleSort('firstName')}
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
              Nome {getSortIndicator('firstName')}
            </Typography>
            <Typography
              variant="body2"
              onClick={() => handleSort('email')}
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
              Email {getSortIndicator('email')}
            </Typography>
            <Typography
              variant="body2"
              onClick={() => handleSort('department')}
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
              Departamento {getSortIndicator('department')}
            </Typography>
            <Typography
              variant="body2"
              onClick={() => handleSort('status')}
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
              Status {getSortIndicator('status')}
            </Typography>

            {/* Actions column header - only in delete mode */}
            {isDeleteMode && (
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
                  onClick={handleConfirmDelete}
                  disabled={selectedEmployees.size === 0}
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
                  onClick={handleCancelDelete}
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
            )}
          </Box>
        </Paper>
      </Box>

      {/* Scrollable Table Body */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '0 0 12px 12px',
          border: `1px solid ${theme.palette.grey[200]}`,
          borderTop: 'none',
          maxHeight: '70vh',
          overflow: 'auto',
        }}
      >
        {/* Employee List or Empty State */}
        {sortedEmployees.length === 0 ? (
          <Box
            sx={{
              padding: theme.spacing(8, 3),
              textAlign: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: theme.spacing(2),
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Nenhum colaborador encontrado
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginBottom: theme.spacing(3),
                color: theme.palette.text.secondary,
              }}
            >
              Comece adicionando seu primeiro colaborador ao sistema
            </Typography>
            <Button
              variant="outlined"
              onClick={onCreateNew}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                fontWeight: 500,
                padding: theme.spacing(1.5, 3),
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: '#ffffff',
                },
              }}
            >
              Adicionar Colaborador
            </Button>
          </Box>
        ) : (
          // Employee Rows
          <>
            {sortedEmployees.map((employee, index) => (
              <Box
                key={employee.id}
                onMouseEnter={() => setHoveredRowId(employee.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                onClick={() => handleRowClick(employee)}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: isDeleteMode
                    ? '40px 1fr 1fr 1fr 80px 80px'
                    : '1fr 1fr 1fr 80px',
                  gap: theme.spacing(2),
                  padding: theme.spacing(2, 3),
                  alignItems: 'center',
                  position: 'relative',
                  borderBottom:
                    index < sortedEmployees.length - 1
                      ? `1px solid ${theme.palette.grey[200]}`
                      : 'none',
                  cursor: isDeleteMode ? 'default' : 'pointer',
                  transition: 'grid-template-columns 0.3s ease, background-color 0.2s ease',
                  backgroundColor: 'transparent',
                  opacity: 1,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[50],
                  },
                }}
              >
                {/* Checkbox Column - only in delete mode */}
                {isDeleteMode && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Checkbox
                      size="small"
                      checked={selectedEmployees.has(employee.id)}
                      onChange={(e) => handleCheckboxChange(employee.id, e.target.checked)}
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 20 },
                      }}
                    />
                  </Box>
                )}

                {/* Nome Column */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(2),
                    position: 'relative',
                  }}
                >
                  {/* 6-dot drag handle - appears on hover */}

                  <Avatar
                    alt={employee.firstName}
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: employee.avatar,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    {employee.firstName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {employee.firstName}
                  </Typography>
                </Box>

                {/* Email Column */}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {employee.email}
                </Typography>

                {/* Departamento Column */}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {employee.department}
                </Typography>

                {/* Status Column */}
                <Chip
                  label={employee.status}
                  size="small"
                  sx={{
                    backgroundColor: employee.status === 'Ativo' ? '#E8F5E8' : '#FDE8E8',
                    color: employee.status === 'Ativo' ? '#2E7D32' : '#C62828',
                    fontWeight: 600,
                    fontSize: '12px',
                    height: '24px',
                    minWidth: 'fit-content',
                    width: 'fit-content',
                    borderRadius: '5px',
                  }}
                />

                {/* Empty actions column - only in delete mode to match header grid */}
                {isDeleteMode && <Box></Box>}

                {/* 3-dot actions menu - positioned relative to entire row */}
                <IconButton
                  size="small"
                  onClick={(e) => handleActionsMenuClick(e, employee.id)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: !isDeleteMode && hoveredRowId === employee.id ? 'block' : 'none',
                    transition: 'opacity 0.2s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.grey[100],
                    },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            {/* Actions menu */}
            <Menu
              open={Boolean(menuPosition)}
              onClose={handleActionsMenuClose}
              anchorReference="anchorPosition"
              anchorPosition={menuPosition || undefined}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: '8px',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <MenuItem onClick={handleEdit} sx={{ fontSize: '14px', gap: theme.spacing(1) }}>
                <EditIcon fontSize="small" />
                Editar
              </MenuItem>
              <MenuItem onClick={handleDelete} sx={{ fontSize: '14px', gap: theme.spacing(1) }}>
                <DeleteIcon fontSize="small" />
                Remover
              </MenuItem>
            </Menu>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ColaboradoresHome;
