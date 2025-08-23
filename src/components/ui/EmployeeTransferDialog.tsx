import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Department } from '../../types/department';
import { Employee } from '../../types/employee';
import { getAllDepartments } from '../../services/departments';
import { transferEmployeeToDepartment } from '../../services/departments';

interface EmployeeTransferDialogProps {
  open: boolean;
  employees: Employee[];
  currentDepartmentId?: string;
  onClose: () => void;
  onTransfer: () => void;
}

const EmployeeTransferDialog: React.FC<EmployeeTransferDialogProps> = ({
  open,
  employees,
  currentDepartmentId,
  onClose,
  onTransfer,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchDepartments();
      setSelectedDepartmentId('');
      setError(null);
    }
  }, [open]);

  const fetchDepartments = async () => {
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
  };

  const handleTransfer = async () => {
    if (!selectedDepartmentId) {
      setError('Selecione um departamento de destino');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Transfer each employee
      for (const employee of employees) {
        await transferEmployeeToDepartment(employee.id, selectedDepartmentId);
      }

      onTransfer();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao transferir colaboradores');
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
          disabled={loading || !selectedDepartmentId}
        >
          {loading ? 'Transferindo...' : 'Transferir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeTransferDialog;
