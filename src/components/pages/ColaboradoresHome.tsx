import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import TruncatedText from '../ui/TruncatedText';

interface ColaboradoresHomeProps {
  onCreateNew: () => void;
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployees: (employeeIds: string[]) => void;
  departmentFilter?: string;
  onClearDepartmentFilter?: () => void;
}

const ColaboradoresHome: React.FC<ColaboradoresHomeProps> = ({
  onCreateNew,
  employees,
  onEditEmployee,
  onDeleteEmployees,
  departmentFilter,
  onClearDepartmentFilter,
}) => {
  const theme = useTheme();

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  // Responsive grid column templates with correct 5-column structure
  const getGridColumns = (isDeleteMode: boolean) => {
    if (isMobile) {
      // Mobile: 5 columns matching content structure
      return isDeleteMode 
        ? '40px 200px 180px 160px 140px 120px'  // With checkbox - 6 columns total
        : '200px 180px 160px 140px 120px';      // Without checkbox - 5 columns total
    } else if (isTablet) {
      // Tablet: Show priority columns with flexible widths
      return isDeleteMode 
        ? '40px 1fr 1.2fr 1fr 0.8fr 100px' 
        : '1fr 1.2fr 1fr 0.8fr 100px';
    } else {
      // Desktop: Original flexible spacing
      return isDeleteMode 
        ? '40px 1fr 1fr 1fr 1fr 120px' 
        : '1fr 1fr 1fr 1fr 120px';
    }
  };

  // Get minimum table width for horizontal scroll
  const getMinTableWidth = (isDeleteMode: boolean) => {
    if (isMobile) {
      // Sum of corrected 5-column widths: 200+180+160+140+120 = 800px
      return isDeleteMode ? '840px' : '800px';  // +40px for checkbox
    }
    return 'auto'; // Let CSS Grid handle on larger screens
  };

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
  
  // Delete confirmation modal state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
  const getDepartmentName = useCallback((departmentId: string): string => {
    return departmentNames[departmentId] || departmentId || 'Não definido';
  }, [departmentNames]);

  // Utility function to get manager name from ID
  const getManagerName = useCallback((managerId: string): string => {
    return managerNames[managerId] || 'Carregando...';
  }, [managerNames]);

  // Utility function to format salary
  const formatSalary = (salary?: number): string => {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(salary);
  };

  // Utility function to format admission date
  const formatAdmissionDate = (date?: Date | string): string => {
    if (!date) return 'N/A';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
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
    // First filter by department if department filter is active
    let filtered = employees;
    
    if (departmentFilter) {
      filtered = employees.filter(emp => emp.department === departmentFilter);
    }
    
    // Then filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(emp => 
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
      let aValue: unknown = a[sortField];
      let bValue: unknown = b[sortField];

      // Handle special sorting cases
      if (sortField === 'firstName') {
        // Alphabetical sorting A-Z
        aValue = a.firstName;
        bValue = b.firstName;
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      }

      if (sortField === 'email') {
        // Alphabetical sorting A-Z
        aValue = a.email;
        bValue = b.email;
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      }

      if (sortField === 'department') {
        // Sort by department name (resolved from ID)
        aValue = getDepartmentName(a.department);
        bValue = getDepartmentName(b.department);
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      }

      if (sortField === 'position') {
        // Alphabetical sorting A-Z
        aValue = a.position || '';
        bValue = b.position || '';
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      }

      if (sortField === 'hierarchicalLevel') {
        // Custom hierarchical ordering: Junior > Pleno > Sênior > Gerente
        const levelOrder = { 'junior': 1, 'mid-level': 2, 'senior': 3, 'manager': 4 };
        const aLevel = levelOrder[a.hierarchicalLevel as keyof typeof levelOrder] || 0;
        const bLevel = levelOrder[b.hierarchicalLevel as keyof typeof levelOrder] || 0;
        return sortDirection === 'asc' ? aLevel - bLevel : bLevel - aLevel;
      }

      if (sortField === 'responsibleManager') {
        // Sort by manager name (resolved from ID)
        aValue = getManagerName(a.responsibleManager || '');
        bValue = getManagerName(b.responsibleManager || '');
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      }

      if (sortField === 'baseSalary') {
        // Numeric sorting by salary amount
        const aSalary = a.baseSalary || 0;
        const bSalary = b.baseSalary || 0;
        return sortDirection === 'asc' ? aSalary - bSalary : bSalary - aSalary;
      }

      if (sortField === 'admissionDate') {
        // Chronological date sorting (handle missing dates)
        const aDate = a.admissionDate ? new Date(a.admissionDate).getTime() : 0;
        const bDate = b.admissionDate ? new Date(b.admissionDate).getTime() : 0;
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }

      // Default string comparison for any other fields
      const aStr = String(aValue || '').toLowerCase();
      const bStr = String(bValue || '').toLowerCase();
      return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [employees, searchTerm, sortField, sortDirection, departmentFilter, getDepartmentName, getManagerName]);

  // Bulk selection helpers (defined after filteredAndSortedEmployees)
  const isAllSelected = selectedEmployees.size === filteredAndSortedEmployees.length && filteredAndSortedEmployees.length > 0;
  const isPartiallySelected = selectedEmployees.size > 0 && selectedEmployees.size < filteredAndSortedEmployees.length;

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
      setShowDeleteConfirmation(true);
    }
  };

  const handleActualDelete = () => {
    if (selectedEmployees.size > 0) {
      onDeleteEmployees(Array.from(selectedEmployees));
      setSelectedEmployees(new Set());
      setIsDeleteMode(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allEmployeeIds = new Set(filteredAndSortedEmployees.map(emp => emp.id));
      setSelectedEmployees(allEmployeeIds);
    } else {
      setSelectedEmployees(new Set());
    }
  };

  const handleBulkDelete = () => {
    setIsDeleteMode(true);
  };

  const clearSelection = () => {
    setSelectedEmployees(new Set());
    setIsDeleteMode(false);
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
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? theme.spacing(2) : 0,
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
            marginRight: theme.spacing(3),
          }}
        >
          Colaboradores
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? theme.spacing(1.5) : theme.spacing(2), 
          alignItems: isMobile ? 'stretch' : 'center' 
        }}>
          <TextField
            placeholder={isMobile ? "Buscar colaborador..." : "Buscar por nome, email ou departamento..."}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            sx={{ 
              minWidth: isMobile ? 'auto' : isTablet ? 250 : 300,
              width: isMobile ? '100%' : 'auto'
            }}
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
            {isMobile ? 'Novo' : 'Novo Colaborador'}
          </Button>
        </Box>
      </Box>

      {/* Bulk Action Bar */}
      {selectedEmployees.size > 0 && !isDeleteMode && (
        <Box 
          sx={{ 
            mb: 2, 
            p: 2, 
            backgroundColor: theme.palette.primary.light + '10',
            border: `1px solid ${theme.palette.primary.light}`,
            borderRadius: '8px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
            {selectedEmployees.size} colaborador(es) selecionado(s)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={clearSelection}
              sx={{ textTransform: 'none' }}
            >
              Limpar Seleção
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
              sx={{ textTransform: 'none' }}
            >
              Excluir Selecionados
            </Button>
          </Box>
        </Box>
      )}

      {/* Department Filter Indicator */}
      {departmentFilter && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`Filtrado por: ${getDepartmentName(departmentFilter)}`}
            onDelete={onClearDepartmentFilter}
            color="primary"
            variant="outlined"
            sx={{ 
              backgroundColor: theme.palette.primary.light + '20',
              '& .MuiChip-label': { fontWeight: 500 }
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {filteredAndSortedEmployees.length} colaborador(es) encontrado(s)
          </Typography>
        </Box>
      )}

      {/* Unified Table Structure */}
      <Box
        sx={{
          overflowX: isMobile ? 'auto' : 'visible',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: 4,
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: '12px',
            border: `1px solid ${theme.palette.grey[200]}`,
            overflow: 'hidden',
            minWidth: getMinTableWidth(isDeleteMode),
            width: 'fit-content',
          }}
        >
          {/* Table Headers */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px' }}>
                <Checkbox
                  size="small"
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 20 },
                  }}
                />
              </Box>
            )}

            {/* Column 1: Personal Identity (Nome / Email) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                  fontSize: '13px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  opacity: 0.8,
                  '&:hover': {
                    color: theme.palette.text.primary,
                    opacity: 1,
                  },
                }}
              >
                Email {getSortIndicator('email')}
              </Typography>
            </Box>

            {/* Column 2: Organizational Context (Departamento / Data de Admissão) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                onClick={() => handleSort('admissionDate')}
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  fontSize: '13px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  opacity: 0.8,
                  '&:hover': {
                    color: theme.palette.text.primary,
                    opacity: 1,
                  },
                }}
              >
                Data de Admissão {getSortIndicator('admissionDate')}
              </Typography>
            </Box>

            {/* Column 3: Professional Role (Cargo / Nível) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                  fontSize: '13px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  opacity: 0.8,
                  '&:hover': {
                    color: theme.palette.text.primary,
                    opacity: 1,
                  },
                }}
              >
                Nível {getSortIndicator('hierarchicalLevel')}
              </Typography>
            </Box>

            {/* Column 4: Management & Status (Status / Responsável) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
              <Typography
                variant="body2"
                onClick={() => handleSort('responsibleManager')}
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  fontSize: '13px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  opacity: 0.8,
                  '&:hover': {
                    color: theme.palette.text.primary,
                    opacity: 1,
                  },
                }}
              >
                Responsável {getSortIndicator('responsibleManager')}
              </Typography>
            </Box>

            {/* Column 5: Compensation (Salário Base - spans both rows) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '60px' }}>
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

          {/* Table Body */}
          <Box
            sx={{
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
                  gridTemplateColumns: getGridColumns(isDeleteMode),
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

                {/* Column 1: Personal Identity (Nome / Email) */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing(2),
                    }}
                  >
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
                    <TruncatedText
                      text={employee.firstName}
                      maxLength={isMobile ? 12 : 20}
                      variant="body2"
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        maxWidth: isMobile ? '110px' : '160px',
                      }}
                    />
                  </Box>
                  <TruncatedText
                    text={employee.email}
                    maxLength={isMobile ? 20 : 30}
                    variant="body2"
                    sx={{
                      fontSize: '13px',
                      color: theme.palette.text.secondary,
                      ml: 5.5, // Align with the text above (avatar width + gap)
                      maxWidth: isMobile ? '130px' : '150px',
                    }}
                  />
                </Box>

                {/* Column 2: Organizational Context (Departamento / Data de Admissão) */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <TruncatedText
                    text={getDepartmentName(employee.department)}
                    maxLength={isMobile ? 15 : 25}
                    variant="body2"
                    sx={{
                      fontSize: '14px',
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      maxWidth: isMobile ? '100px' : '140px',
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '13px',
                      color: theme.palette.text.secondary,
                      opacity: 0.8,
                    }}
                  >
                    {formatAdmissionDate(employee.admissionDate)}
                  </Typography>
                </Box>

                {/* Column 3: Professional Role (Cargo / Nível) */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <TruncatedText
                    text={employee.position || 'N/A'}
                    maxLength={isMobile ? 12 : 20}
                    variant="body2"
                    sx={{
                      fontSize: '14px',
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      maxWidth: isMobile ? '90px' : '120px',
                    }}
                  />
                  <Box>
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
                          fontSize: '10px',
                          height: '18px',
                          minWidth: 'fit-content',
                          width: 'fit-content',
                          borderRadius: '3px',
                        }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '13px',
                          color: theme.palette.text.disabled,
                          opacity: 0.6,
                        }}
                      >
                        N/A
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Column 4: Management & Status (Status / Responsável) */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                  <TruncatedText
                    text={employee.responsibleManager ? getManagerName(employee.responsibleManager) : 'N/A'}
                    maxLength={isMobile ? 10 : 15}
                    variant="body2"
                    sx={{
                      fontSize: '13px',
                      color: theme.palette.text.secondary,
                      opacity: 0.8,
                      maxWidth: isMobile ? '90px' : '110px',
                    }}
                  />
                </Box>

                {/* Column 5: Compensation (Salário Base) */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '14px',
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      filter: showSalaries ? 'none' : 'blur(4px)',
                      transition: 'filter 0.2s ease',
                      textAlign: 'center',
                    }}
                  >
                    {showSalaries ? formatSalary(employee.baseSalary) : 'R$ •••••'}
                  </Typography>
                </Box>

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
        </Box>
        </Paper>
      </Box>

      {/* Enhanced Delete Confirmation Modal */}
      <Dialog
        open={showDeleteConfirmation}
        onClose={handleCancelConfirmation}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Confirmar Exclusão
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedEmployees.size === 1 
              ? `Tem certeza que deseja excluir este colaborador?`
              : `Tem certeza que deseja excluir ${selectedEmployees.size} colaboradores?`
            }
          </Typography>
          
          {selectedEmployees.size <= 5 ? (
            // Show individual employee names for small selections
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Colaboradores selecionados:
              </Typography>
              {Array.from(selectedEmployees).map(employeeId => {
                const employee = employees.find(emp => emp.id === employeeId);
                return employee ? (
                  <Typography key={employeeId} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
                    • {employee.firstName} ({employee.email})
                  </Typography>
                ) : null;
              })}
            </Box>
          ) : (
            // Show summary for large selections
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {selectedEmployees.size} colaboradores serão excluídos permanentemente.
              </Typography>
            </Box>
          )}
          
          <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 500 }}>
            ⚠️ Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirmation}>
            Cancelar
          </Button>
          <Button 
            onClick={handleActualDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Excluir {selectedEmployees.size === 1 ? 'Colaborador' : `${selectedEmployees.size} Colaboradores`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ColaboradoresHome;
