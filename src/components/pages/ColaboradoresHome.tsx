import React, { useState, useMemo, useEffect } from 'react';
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
  TextField,
  InputAdornment,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Employee } from '../../types/employee';
import { getAllDepartments } from '../../services/departments';
import { getEmployeeName } from '../../services/firebase';

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

  // Search and filtering state
  const [searchTerm, setSearchTerm] = useState('');

  // Department names cache for ID-to-name resolution
  const [departmentNames, setDepartmentNames] = useState<Record<string, string>>({});
  
  // Manager names cache for ID-to-name resolution
  const [managerNames, setManagerNames] = useState<Record<string, string>>({});
  
  // Salary visibility toggle
  const [showSalaries, setShowSalaries] = useState(false);

  // Actions menu state (3-dot menu for edit/delete)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [actionsMenuEmployeeId, setActionsMenuEmployeeId] = useState<string | null>(null);

  // Fetch department names and manager names on component mount
  useEffect(() => {
    const fetchNames = async () => {
      try {
        // Fetch department names
        const departments = await getAllDepartments();
        const deptNamesMap: Record<string, string> = {};
        departments.forEach(dept => {
          deptNamesMap[dept.id] = dept.name;
        });
        setDepartmentNames(deptNamesMap);
        
        // Fetch manager names for employees that have managers
        const managerNamesMap: Record<string, string> = {};
        await Promise.all(
          employees.map(async (employee) => {
            if (employee.responsibleManager) {
              try {
                const managerName = await getEmployeeName(employee.responsibleManager);
                if (managerName) {
                  managerNamesMap[employee.responsibleManager] = managerName;
                }
              } catch (error) {
                console.error(`Error fetching manager name for ${employee.responsibleManager}:`, error);
              }
            }
          })
        );
        setManagerNames(managerNamesMap);
      } catch (error) {
        console.error('Error fetching names:', error);
      }
    };

    fetchNames();
  }, [employees]);

  // Utility function to get department name from ID
  const getDepartmentName = (departmentId: string): string => {
    return departmentNames[departmentId] || departmentId || 'Não definido';
  };

  // Utility function to get manager name from ID
  const getManagerName = (managerId: string): string => {
    return managerNames[managerId] || 'Carregando...';
  };

  // Utility function to format salary
  const formatSalary = (salary?: number): string => {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(salary);
  };

  // Utility function to get hierarchical level badge color
  const getHierarchicalLevelColor = (level?: string): string => {
    switch (level) {
      case 'junior': return '#E3F2FD';
      case 'mid-level': return '#E8F5E8';
      case 'senior': return '#FFF3E0';
      case 'manager': return '#F3E5F5';
      default: return '#F5F5F5';
    }
  };

  const getHierarchicalLevelTextColor = (level?: string): string => {
    switch (level) {
      case 'junior': return '#1976D2';
      case 'mid-level': return '#2E7D32';
      case 'senior': return '#F57C00';
      case 'manager': return '#7B1FA2';
      default: return '#666';
    }
  };

  // Filter and sort employees based on search and sort settings
  const filteredAndSortedEmployees = useMemo(() => {
    // First filter by search term
    let filtered = employees;
    
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = employees.filter(emp => 
        emp.firstName.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        getDepartmentName(emp.department).toLowerCase().includes(search) ||
        (emp.position && emp.position.toLowerCase().includes(search)) ||
        (emp.hierarchicalLevel && emp.hierarchicalLevel.toLowerCase().includes(search)) ||
        (emp.responsibleManager && getManagerName(emp.responsibleManager).toLowerCase().includes(search))
      );
    }

    // Then sort
    if (!sortField) return filtered;

    return [...filtered].sort((a, b) => {
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
  }, [employees, searchTerm, sortField, sortDirection, departmentNames, managerNames]);

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

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Buscar por nome, email ou departamento..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
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
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Novo Colaborador
          </Button>
        </Box>
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
              onClick={() => handleSort('position')}
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
              Cargo {getSortIndicator('position')}
            </Typography>
            <Typography
              variant="body2"
              onClick={() => handleSort('hierarchicalLevel')}
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
              Nível {getSortIndicator('hierarchicalLevel')}
            </Typography>
            <Typography
              variant="body2"
              onClick={() => handleSort('responsibleManager')}
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
              Responsável {getSortIndicator('responsibleManager')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                onClick={() => handleSort('baseSalary')}
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
                Salário Base {getSortIndicator('baseSalary')}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setShowSalaries(!showSalaries)}
                sx={{
                  ml: 0.5,
                  p: 0.5,
                  color: theme.palette.text.secondary,
                }}
              >
                {showSalaries ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
              </IconButton>
            </Box>
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
        {filteredAndSortedEmployees.length === 0 ? (
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
              {searchTerm ? 'Nenhum colaborador encontrado' : 'Nenhum colaborador cadastrado'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginBottom: theme.spacing(3),
                color: theme.palette.text.secondary,
              }}
            >
              {searchTerm ? 'Tente ajustar sua busca ou limpar os filtros' : 'Comece adicionando seu primeiro colaborador ao sistema'}
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
            {filteredAndSortedEmployees.map((employee, index) => (
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
                    index < filteredAndSortedEmployees.length - 1
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
                  {getDepartmentName(employee.department)}
                </Typography>

                {/* Position Column */}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {employee.position || 'N/A'}
                </Typography>

                {/* Hierarchical Level Column */}
                {employee.hierarchicalLevel ? (
                  <Chip
                    label={
                      employee.hierarchicalLevel === 'junior' ? 'Júnior' :
                      employee.hierarchicalLevel === 'mid-level' ? 'Pleno' :
                      employee.hierarchicalLevel === 'senior' ? 'Sênior' :
                      employee.hierarchicalLevel === 'manager' ? 'Gerente' :
                      employee.hierarchicalLevel
                    }
                    size="small"
                    sx={{
                      backgroundColor: getHierarchicalLevelColor(employee.hierarchicalLevel),
                      color: getHierarchicalLevelTextColor(employee.hierarchicalLevel),
                      fontWeight: 600,
                      fontSize: '11px',
                      height: '22px',
                      minWidth: 'fit-content',
                      width: 'fit-content',
                      borderRadius: '4px',
                    }}
                  />
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '14px',
                      color: theme.palette.text.disabled,
                    }}
                  >
                    N/A
                  </Typography>
                )}

                {/* Responsible Manager Column */}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {employee.responsibleManager ? getManagerName(employee.responsibleManager) : 'N/A'}
                </Typography>

                {/* Base Salary Column */}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    filter: showSalaries ? 'none' : 'blur(4px)',
                    transition: 'filter 0.2s ease',
                  }}
                >
                  {showSalaries ? formatSalary(employee.baseSalary) : 'R$ •••••'}
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
