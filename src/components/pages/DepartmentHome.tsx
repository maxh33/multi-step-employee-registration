import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Checkbox,
  Menu,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Department } from '../../types/department';
import { getAllDepartments, deleteDepartment } from '../../services/departments';
import { getEmployeeName, getActiveEmployeeCountByDepartment } from '../../services/firebase';
import DepartmentForm from '../forms/DepartmentForm';
import ConfirmDialog from '../ui/ConfirmDialog';
import Toast from '../ui/Toast';
import { useToast } from '../../hooks/useToast';
import TruncatedText from '../ui/TruncatedText';

interface DepartmentHomeProps {
  onNavigateToEmployees?: (departmentFilter?: string) => void;
  onNavigateToCreateManager?: (departmentId: string, departmentName: string) => void;
}

const DepartmentHome: React.FC<DepartmentHomeProps> = ({ onNavigateToEmployees, onNavigateToCreateManager }) => {
  const theme = useTheme();

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  // Responsive grid column templates with correct 4-column structure
  const getGridColumns = (isDeleteMode: boolean) => {
    if (isMobile) {
      // Mobile: 4 columns matching content structure
      return isDeleteMode ? '40px 180px 150px 100px 120px' : '180px 150px 100px 120px';
    } else if (isTablet) {
      // Tablet: Optimized spacing
      return isDeleteMode ? '40px 2fr 1fr 80px 120px' : '2fr 1fr 80px 120px';
    } else {
      // Desktop: Original spacing
      return isDeleteMode ? '40px 2fr 1.5fr 100px 150px' : '2fr 1.5fr 100px 150px';
    }
  };

  // Get minimum table width for horizontal scroll
  const getDeptMinTableWidth = (isDeleteMode: boolean) => {
    if (isMobile) {
      // Sum of corrected 4-column widths: 180+150+100+120 = 550px
      return isDeleteMode ? '590px' : '550px';  // +40px for checkbox
    }
    return 'auto'; // Let CSS Grid handle on larger screens
  };

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managerNames, setManagerNames] = useState<Record<string, string>>({});
  const [employeeCounts, setEmployeeCounts] = useState<Record<string, number>>({});
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  
  // Hover actions state (matching employee pattern)
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [actionsMenuDepartmentId, setActionsMenuDepartmentId] = useState<string | null>(null);
  
  // Sorting state (matching employee pattern)
  const [sortField, setSortField] = useState<keyof Department | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Toast notifications
  const [toast, toastActions] = useToast();

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedDepartments = await getAllDepartments();
      setDepartments(fetchedDepartments);
      
      // Fetch manager names and employee counts for departments
      const managerNamesMap: Record<string, string> = {};
      const employeeCountsMap: Record<string, number> = {};
      
      await Promise.all(
        fetchedDepartments.map(async (dept) => {
          // Fetch manager name
          if (dept.responsibleManagerId && dept.responsibleManagerId !== 'system') {
            try {
              const managerName = await getEmployeeName(dept.responsibleManagerId);
              if (managerName) {
                managerNamesMap[dept.responsibleManagerId] = managerName;
              }
            } catch (error) {
              console.error(`Error fetching manager name for ${dept.responsibleManagerId}:`, error);
            }
          }
          
          // Fetch active non-manager employee count
          try {
            const activeEmployeeCount = await getActiveEmployeeCountByDepartment(dept.id);
            employeeCountsMap[dept.id] = activeEmployeeCount;
          } catch (error) {
            console.error(`Error fetching employee count for department ${dept.id}:`, error);
            employeeCountsMap[dept.id] = 0;
          }
        })
      );
      
      setManagerNames(managerNamesMap);
      setEmployeeCounts(employeeCountsMap);
    } catch (err) {
      setError('Erro ao carregar departamentos');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort departments (matching employee pattern)
  const filteredAndSortedDepartments = useMemo(() => {
    let filtered = departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dept.responsibleManagerId && managerNames[dept.responsibleManagerId]?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (!sortField) return filtered;

    return [...filtered].sort((a, b) => {
      let aValue: unknown = a[sortField];
      let bValue: unknown = b[sortField];

      // Handle special sorting cases
      if (sortField === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else if (sortField === 'employeeIds') {
        aValue = employeeCounts[a.id] || 0;
        bValue = employeeCounts[b.id] || 0;
        
        // For numeric sorting
        if (sortDirection === 'asc') {
          return (aValue as number) - (bValue as number);
        } else {
          return (bValue as number) - (aValue as number);
        }
      }

      const aStr = String(aValue || '').toLowerCase();
      const bStr = String(bValue || '').toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [departments, searchTerm, sortField, sortDirection, managerNames, employeeCounts]);

  // Sorting handlers (matching employee pattern)
  const handleSort = (field: keyof Department) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIndicator = (field: keyof Department) => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Selection handlers (commented out - not currently used but may be needed for future bulk operations)
  // const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.checked) {
  //     const allIds = new Set(filteredAndSortedDepartments.map(d => d.id));
  //     setSelectedDepartments(allIds);
  //   } else {
  //     setSelectedDepartments(new Set());
  //   }
  // };

  const handleCheckboxChange = (departmentId: string, checked: boolean) => {
    const newSelected = new Set(selectedDepartments);
    if (checked) {
      newSelected.add(departmentId);
    } else {
      newSelected.delete(departmentId);
    }
    setSelectedDepartments(newSelected);
  };

  // Actions menu handlers (matching employee pattern)
  const handleActionsMenuClick = (event: React.MouseEvent<HTMLElement>, departmentId: string) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
    setActionsMenuDepartmentId(departmentId);
  };

  const handleActionsMenuClose = () => {
    setMenuPosition(null);
    setActionsMenuDepartmentId(null);
  };

  const handleRowClick = (department: Department) => {
    if (!isDeleteMode) {
      setEditingDepartment(department);
      setFormOpen(true);
    }
  };

  const handleCreateNew = () => {
    setEditingDepartment(null);
    setFormOpen(true);
  };

  const handleEdit = () => {
    if (actionsMenuDepartmentId) {
      const department = departments.find(dept => dept.id === actionsMenuDepartmentId);
      if (department) {
        setEditingDepartment(department);
        setFormOpen(true);
      }
    }
    handleActionsMenuClose();
  };

  const handleDelete = () => {
    setIsDeleteMode(true);
    if (actionsMenuDepartmentId) {
      setSelectedDepartments(new Set([actionsMenuDepartmentId]));
    }
    handleActionsMenuClose();
  };

  const handleCancelDelete = () => {
    setIsDeleteMode(false);
    setSelectedDepartments(new Set());
  };

  const handleConfirmDelete = async () => {
    if (selectedDepartments.size > 0) {
      try {
        for (const id of Array.from(selectedDepartments)) {
          await deleteDepartment(id);
        }
        await fetchDepartments();
        setSelectedDepartments(new Set());
        setIsDeleteMode(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir departamentos';
        setError(errorMessage);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (departmentToDelete) {
      try {
        await deleteDepartment(departmentToDelete.id);
        await fetchDepartments();
        setDeleteDialogOpen(false);
        setDepartmentToDelete(null);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir departamento';
        setError(errorMessage);
      }
    }
  };

  // Remove old handleBulkDelete as it's now handled by handleConfirmDelete

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingDepartment(null);
  };

  const handleFormSubmit = async () => {
    await fetchDepartments();
    handleFormClose();
  };

  // Handle navegação para colaboradores filtrados por departamento
  const handleNavigateToEmployees = (departmentId: string, departmentName: string) => {
    if (onNavigateToEmployees) {
      // Pass department ID as filter parameter
      onNavigateToEmployees(departmentId);
    }
  };

  // Handle navegação para criação de gerente com contexto do departamento
  const handleNavigateToCreateManager = (departmentId: string, departmentName: string) => {
    if (onNavigateToCreateManager) {
      onNavigateToCreateManager(departmentId, departmentName);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

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
          Departamentos
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? theme.spacing(1.5) : theme.spacing(2), 
          alignItems: isMobile ? 'stretch' : 'center' 
        }}>
          <TextField
            placeholder={isMobile ? "Buscar departamento..." : "Buscar departamento ou responsável..."}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
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
            {isMobile ? 'Novo' : 'Novo Departamento'}
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Unified Departments Table Structure */}
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
            minWidth: getDeptMinTableWidth(isDeleteMode),
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Empty space for checkbox column */}
              </Box>
            )}

            <Typography
              variant="body2"
              onClick={() => handleSort('name')}
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
              onClick={() => handleSort('employeeIds')}
              sx={{
                fontWeight: 500,
                color: theme.palette.text.secondary,
                fontSize: '14px',
                cursor: 'pointer',
                userSelect: 'none',
                textAlign: 'center',
                '&:hover': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              Colaboradores {getSortIndicator('employeeIds')}
            </Typography>
            <Typography
              variant="body2"
              onClick={() => handleSort('createdAt')}
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
              Criado em {getSortIndicator('createdAt')}
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
        {/* Department List or Empty State */}
        {filteredAndSortedDepartments.length === 0 ? (
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
              {searchTerm ? 'Nenhum departamento encontrado' : 'Nenhum departamento cadastrado'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginBottom: theme.spacing(3),
                color: theme.palette.text.secondary,
              }}
            >
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando seu primeiro departamento'}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleCreateNew}
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
              Criar Departamento
            </Button>
          </Box>
        ) : (
          // Department Rows
          <>
            {filteredAndSortedDepartments.map((dept, index) => (
              <Box
                key={dept.id}
                onMouseEnter={() => setHoveredRowId(dept.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                onClick={() => handleRowClick(dept)}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: getGridColumns(isDeleteMode),
                  gap: theme.spacing(2),
                  padding: theme.spacing(2, 3),
                  alignItems: 'center',
                  position: 'relative',
                  borderBottom:
                    index < filteredAndSortedDepartments.length - 1
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
                      checked={selectedDepartments.has(dept.id)}
                      onChange={(e) => handleCheckboxChange(dept.id, e.target.checked)}
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 20 },
                      }}
                    />
                  </Box>
                )}

                {/* Nome Column */}
                <TruncatedText
                  text={dept.name}
                  maxLength={isMobile ? 18 : 30}
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    maxWidth: isMobile ? '140px' : '160px',
                  }}
                />

                {/* Responsável Column */}
                <Chip
                  icon={<PersonIcon />}
                  label={
                    dept.responsibleManagerId && dept.responsibleManagerId !== 'system' 
                      ? (managerNames[dept.responsibleManagerId] || 'Carregando...')
                      : 'Não definido'
                  }
                  size="small"
                  variant="outlined"
                  sx={{
                    maxWidth: isMobile ? '110px' : '130px',
                  }}
                />

                {/* Colaboradores Column */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Chip
                    icon={<PeopleIcon />}
                    label={employeeCounts[dept.id] || 0}
                    size="small"
                    color="primary"
                    variant="outlined"
                    clickable
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToEmployees(dept.id, dept.name);
                    }}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      },
                    }}
                  />
                </Box>

                {/* Criado em Column */}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {new Date(dept.createdAt).toLocaleDateString('pt-BR')}
                </Typography>

                {/* Empty actions column - only in delete mode to match header grid */}
                {isDeleteMode && <Box></Box>}

                {/* 3-dot actions menu - positioned relative to entire row */}
                <IconButton
                  size="small"
                  onClick={(e) => handleActionsMenuClick(e, dept.id)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: !isDeleteMode && hoveredRowId === dept.id ? 'block' : 'none',
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
          </>
        )}
        </Box>
        </Paper>
      </Box>

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

      {/* Department Form Modal */}
      <DepartmentForm
        open={formOpen}
        mode={editingDepartment ? 'edit' : 'create'}
        department={editingDepartment}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        onNavigateToCreateManager={handleNavigateToCreateManager}
      />

      {/* Delete Confirmation Dialog */}
      {departmentToDelete && (
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Excluir Departamento"
          message={
            departmentToDelete.employeeIds.length > 0
              ? `O departamento "${departmentToDelete.name}" possui ${departmentToDelete.employeeIds.length} colaborador(es). Você precisa transferi-los para outro departamento antes de excluir.`
              : `Tem certeza que deseja excluir o departamento "${departmentToDelete.name}"?`
          }
          confirmText={departmentToDelete.employeeIds.length > 0 ? "Entendi" : "Excluir"}
          cancelText={departmentToDelete.employeeIds.length > 0 ? undefined : "Cancelar"}
          onConfirm={departmentToDelete.employeeIds.length > 0 ? () => setDeleteDialogOpen(false) : handleDeleteConfirm}
          onCancel={() => setDeleteDialogOpen(false)}
          confirmColor={departmentToDelete.employeeIds.length > 0 ? "primary" : "error"}
        />
      )}

      {/* Toast Notifications */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={toastActions.hideToast}
      />
    </Box>
  );
};

export default DepartmentHome;
