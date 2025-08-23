import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Department, DepartmentFormData } from '../../types/department';
import {
  createDepartment,
  updateDepartment,
  getDepartmentByName,
} from '../../services/departments';
import { getAllEmployees } from '../../services/firebase';
import { Employee } from '../../types/employee';

interface DepartmentFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  department?: Department | null;
  onClose: () => void;
  onSubmit: () => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  open,
  mode,
  department,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    responsibleManagerId: '',
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset form when opening/closing
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && department) {
        setFormData({
          name: department.name,
          responsibleManagerId: department.responsibleManagerId,
        });
      } else {
        setFormData({
          name: '',
          responsibleManagerId: '',
        });
      }
      setErrors({});
      setSubmitError(null);
      fetchEmployees();
    }
  }, [open, mode, department]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const allEmployees = await getAllEmployees();
      setEmployees(allEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do departamento é obrigatório';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Nome deve ter no máximo 100 caracteres';
    } else {
      // Check uniqueness
      const existingDept = await getDepartmentByName(
        formData.name,
        mode === 'edit' ? department?.id : undefined
      );
      if (existingDept) {
        newErrors.name = 'Já existe um departamento com este nome';
      }
    }

    // Validate responsible manager
    if (!formData.responsibleManagerId) {
      newErrors.responsibleManagerId = 'Responsável é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setLoading(true);
      
      if (mode === 'create') {
        await createDepartment({
          name: formData.name.trim(),
          responsibleManagerId: formData.responsibleManagerId,
        });
      } else if (department) {
        await updateDepartment(department.id, {
          name: formData.name.trim(),
          responsibleManagerId: formData.responsibleManagerId,
        });
      }
      
      onSubmit();
    } catch (error: any) {
      setSubmitError(error.message || 'Erro ao salvar departamento');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof DepartmentFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Novo Departamento' : 'Editar Departamento'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nome do Departamento"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
            inputProps={{ maxLength: 100 }}
          />

          <FormControl
            fullWidth
            margin="normal"
            required
            error={!!errors.responsibleManagerId}
          >
            <InputLabel>Responsável</InputLabel>
            <Select
              value={formData.responsibleManagerId}
              onChange={handleChange('responsibleManagerId')}
              label="Responsável"
              disabled={loadingEmployees}
            >
              {loadingEmployees ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  <Typography sx={{ ml: 1 }}>Carregando...</Typography>
                </MenuItem>
              ) : employees.length === 0 ? (
                <MenuItem disabled>
                  <Typography>Nenhum colaborador disponível</Typography>
                </MenuItem>
              ) : (
                employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.firstName} - {emp.department}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.responsibleManagerId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {errors.responsibleManagerId}
              </Typography>
            )}
          </FormControl>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Nota: Em breve, apenas colaboradores com nível gerencial poderão ser selecionados como responsáveis.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || loadingEmployees}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : mode === 'create' ? (
            'Criar'
          ) : (
            'Salvar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepartmentForm;
