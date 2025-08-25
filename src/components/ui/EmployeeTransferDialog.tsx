import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Box,
  Chip,
  LinearProgress,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ListItemIcon,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Department } from '../../types/department';
import { Employee } from '../../types/employee';
import { getAllDepartments, bulkTransferEmployees } from '../../services/departments';

interface EmployeeTransferDialogProps {
  open: boolean;
  employees: Employee[];
  currentDepartmentId?: string;
  allowEmployeeSelection?: boolean;
  onClose: () => void;
  onTransfer: (message: string) => void;
}

const EmployeeTransferDialog: React.FC<EmployeeTransferDialogProps> = ({
  open,
  employees,
  currentDepartmentId,
  allowEmployeeSelection = false,
  onClose,
  onTransfer,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transferProgress, setTransferProgress] = useState(0);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set());
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');

  const fetchDepartments = useCallback(async () => {
    try {
      const allDepartments = await getAllDepartments();
      // Filter out current department if provided
      const availableDepartments = currentDepartmentId
        ? allDepartments.filter(d => d.id !== currentDepartmentId)
        : allDepartments;
      setDepartments(availableDepartments);
    } catch (err) {
      setError('Erro ao carregar departamentos');
      console.error('Error fetching departments:', err);
    }
  }, [currentDepartmentId]);

  useEffect(() => {
    if (open) {
      fetchDepartments();
      setSelectedDepartmentId('');
      setError(null);
      setTransferProgress(0);
      setSelectedEmployeeIds(new Set(employees.map(emp => emp.id)));
      setEmployeeSearchTerm('');
    }
  }, [open, employees, fetchDepartments]);

  const getSelectedEmployees = () => {
    return allowEmployeeSelection 
      ? employees.filter(emp => selectedEmployeeIds.has(emp.id))
      : employees;
  };

  const filteredEmployees = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  );

  const handleEmployeeToggle = (employeeId: string) => {
    if (!allowEmployeeSelection) return;
    
    const newSelected = new Set(selectedEmployeeIds);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedEmployeeIds(newSelected);
  };

  const handleSelectAllEmployees = () => {
    if (!allowEmployeeSelection) return;
    
    const allSelected = filteredEmployees.every(emp => selectedEmployeeIds.has(emp.id));
    if (allSelected) {
      // Deselect all filtered employees
      const newSelected = new Set(selectedEmployeeIds);
      filteredEmployees.forEach(emp => newSelected.delete(emp.id));
      setSelectedEmployeeIds(newSelected);
    } else {
      // Select all filtered employees
      const newSelected = new Set(selectedEmployeeIds);
      filteredEmployees.forEach(emp => newSelected.add(emp.id));
      setSelectedEmployeeIds(newSelected);
    }
  };

  const handleTransfer = async () => {
    const employeesToTransfer = getSelectedEmployees();
    
    if (!selectedDepartmentId) {
      setError('Selecione um departamento de destino');
      return;
    }

    if (employeesToTransfer.length === 0) {
      setError('Selecione pelo menos um colaborador para transferir');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTransferProgress(0);

      // Use bulk transfer for better performance
      const employeeIds = employeesToTransfer.map(emp => emp.id);
      await bulkTransferEmployees(employeeIds, selectedDepartmentId);
      
      setTransferProgress(100);
      
      const count = employeesToTransfer.length;
      const targetDept = departments.find(d => d.id === selectedDepartmentId);
      const message = count === 1 
        ? `1 colaborador transferido para "${targetDept?.name || 'departamento'}" com sucesso`
        : `${count} colaboradores transferidos para "${targetDept?.name || 'departamento'}" com sucesso`;
      
      onTransfer(message);
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao transferir colaboradores';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Transferir Colaboradores</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress 
                variant={transferProgress > 0 ? "determinate" : "indeterminate"}
                value={transferProgress}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Transferindo colaboradores...
              </Typography>
            </Box>
          )}

          {allowEmployeeSelection ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selecione os colaboradores para transferir:
              </Typography>
              
              {employees.length > 5 && (
                <TextField
                  placeholder="Buscar colaborador..."
                  variant="outlined"
                  size="small"
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  sx={{ mb: 2, width: '100%' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
                <List dense>
                  <ListItem onClick={handleSelectAllEmployees} sx={{ cursor: 'pointer' }}>
                    <ListItemIcon>
                      <Checkbox
                        checked={filteredEmployees.length > 0 && filteredEmployees.every(emp => selectedEmployeeIds.has(emp.id))}
                        indeterminate={filteredEmployees.some(emp => selectedEmployeeIds.has(emp.id)) && !filteredEmployees.every(emp => selectedEmployeeIds.has(emp.id))}
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Selecionar todos"
                      secondary={`${selectedEmployeeIds.size} de ${employees.length} selecionados`}
                    />
                  </ListItem>
                  {filteredEmployees.map((employee) => (
                    <ListItem key={employee.id} onClick={() => handleEmployeeToggle(employee.id)} sx={{ cursor: 'pointer' }}>
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedEmployeeIds.has(employee.id)}
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={employee.firstName}
                        secondary={employee.email}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {employees.length === 1
                  ? 'Transferindo 1 colaborador'
                  : `Transferindo ${employees.length} colaboradores`}
              </Typography>

              <Box sx={{ mb: 3 }}>
                {employees.slice(0, 3).map((emp) => (
                  <Chip
                    key={emp.id}
                    label={emp.firstName}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
                {employees.length > 3 && (
                  <Chip
                    label={`+${employees.length - 3} mais`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </>
          )}

          <FormControl fullWidth required>
            <InputLabel>Departamento de Destino</InputLabel>
            <Select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              label="Departamento de Destino"
              disabled={loading}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name} ({dept.employeeIds.length} colaboradores)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleTransfer}
          variant="contained"
          disabled={loading || !selectedDepartmentId || getSelectedEmployees().length === 0}
        >
          {loading ? 'Transferindo...' : `Transferir ${getSelectedEmployees().length} colaborador${getSelectedEmployees().length !== 1 ? 'es' : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeTransferDialog;
