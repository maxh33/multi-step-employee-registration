import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Department } from '../../types/department';
import { getAllDepartments, deleteDepartment } from '../../services/departments';
import DepartmentForm from '../forms/DepartmentForm';
import ConfirmDialog from '../ui/ConfirmDialog';

interface DepartmentHomeProps {
  onNavigateToEmployees?: () => void;
}

const DepartmentHome: React.FC<DepartmentHomeProps> = ({ onNavigateToEmployees }) => {
  const theme = useTheme();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

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
    } catch (err) {
      setError('Erro ao carregar departamentos');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter departments based on search
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = new Set(filteredDepartments.map(d => d.id));
      setSelectedDepartments(allIds);
    } else {
      setSelectedDepartments(new Set());
    }
  };

  const handleSelectDepartment = (id: string) => {
    const newSelected = new Set(selectedDepartments);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDepartments(newSelected);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, dept: Department) => {
    setAnchorEl(event.currentTarget);
    setCurrentDepartment(dept);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentDepartment(null);
  };

  const handleCreateNew = () => {
    setEditingDepartment(null);
    setFormOpen(true);
  };

  const handleEdit = () => {
    if (currentDepartment) {
      setEditingDepartment(currentDepartment);
      setFormOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (currentDepartment) {
      setDepartmentToDelete(currentDepartment);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (departmentToDelete) {
      try {
        await deleteDepartment(departmentToDelete.id);
        await fetchDepartments();
        setDeleteDialogOpen(false);
        setDepartmentToDelete(null);
      } catch (err: any) {
        setError(err.message || 'Erro ao excluir departamento');
      }
    }
  };

  const handleBulkDelete = async () => {
    try {
      const idsToDelete = Array.from(selectedDepartments);
      for (const id of idsToDelete) {
        await deleteDepartment(id);
      }
      await fetchDepartments();
      setSelectedDepartments(new Set());
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir departamentos');
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingDepartment(null);
  };

  const handleFormSubmit = async () => {
    await fetchDepartments();
    handleFormClose();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Departamentos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          sx={{ textTransform: 'none' }}
        >
          Novo Departamento
        </Button>
      </Box>

      {/* Search and Actions Bar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Buscar departamento..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {selectedDepartments.size > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleBulkDelete}
            startIcon={<DeleteIcon />}
          >
            Excluir Selecionados ({selectedDepartments.size})
          </Button>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Departments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedDepartments.size > 0 && 
                    selectedDepartments.size < filteredDepartments.length
                  }
                  checked={
                    filteredDepartments.length > 0 && 
                    selectedDepartments.size === filteredDepartments.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell align="center">Colaboradores</TableCell>
              <TableCell>Criado em</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDepartments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    {searchTerm ? 'Nenhum departamento encontrado' : 'Nenhum departamento cadastrado'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredDepartments.map((dept) => (
                <TableRow
                  key={dept.id}
                  hover
                  selected={selectedDepartments.has(dept.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedDepartments.has(dept.id)}
                      onChange={() => handleSelectDepartment(dept.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {dept.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<PersonIcon />}
                      label={dept.responsibleManagerId || 'Não definido'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<PeopleIcon />}
                      label={dept.employeeIds.length}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(dept.createdAt).toLocaleDateString('pt-BR')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, dept)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Excluir
        </MenuItem>
      </Menu>

      {/* Department Form Modal */}
      <DepartmentForm
        open={formOpen}
        mode={editingDepartment ? 'edit' : 'create'}
        department={editingDepartment}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
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
    </Box>
  );
};

export default DepartmentHome;
