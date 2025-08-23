import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SelectChangeEvent } from '@mui/material';
import { ProfessionalInfo } from '../../types/employee';
import { Department } from '../../types/department';
import { getAllDepartments } from '../../services/departments';

interface ProfessionalInfoStepProps {
  data: Partial<ProfessionalInfo>;
  errors: Record<string, string>;
  onChange: (data: Partial<ProfessionalInfo>) => void;
}

const ProfessionalInfoStep: React.FC<ProfessionalInfoStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [departmentError, setDepartmentError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      setDepartmentError(null);
      const fetchedDepartments = await getAllDepartments();
      setDepartments(fetchedDepartments);
      
      // If no departments exist, create default ones
      if (fetchedDepartments.length === 0) {
        setDepartmentError('Nenhum departamento cadastrado. Por favor, crie departamentos primeiro.');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartmentError('Erro ao carregar departamentos');
    } finally {
      setLoadingDepartments(false);
    }
  };

  const handleFieldChange =
    (field: keyof ProfessionalInfo) => (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      onChange({
        ...data,
        [field]: value,
      });
    };

  const getFieldError = (field: string) => {
    return errors[`professionalInfo.${field}`] || '';
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
        Informações Profissionais
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Adicione informações profissionais do colaborador
      </Typography>

      {departmentError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {departmentError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Department Select */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontWeight: 500,
              color: theme.palette.text.primary,
              fontSize: '14px',
            }}
          >
            Departamento *
          </Typography>
          <FormControl fullWidth error={!!getFieldError('department')}>
            <Select
              value={data.department || ''}
              onChange={handleFieldChange('department')}
              displayEmpty
              disabled={loadingDepartments || departments.length === 0}
              IconComponent={ExpandMoreIcon}
              sx={{
                backgroundColor: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: getFieldError('department') ? theme.palette.error.main : '#e0e0e0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: getFieldError('department') ? theme.palette.error.main : theme.palette.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: getFieldError('department') ? theme.palette.error.main : theme.palette.primary.main,
                },
              }}
            >
              {loadingDepartments ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} />
                    <Typography>Carregando departamentos...</Typography>
                  </Box>
                </MenuItem>
              ) : departments.length === 0 ? (
                <MenuItem disabled value="">
                  <em>Nenhum departamento disponível</em>
                </MenuItem>
              ) : (
                <>
                  <MenuItem value="">
                    <em>Selecione um departamento</em>
                  </MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </>
              )}
            </Select>
            {getFieldError('department') && (
              <FormHelperText>{getFieldError('department')}</FormHelperText>
            )}
          </FormControl>
        </Box>

        {/* Note about future fields */}
        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Nota:</strong> Em breve, novos campos serão adicionados aqui incluindo cargo, 
            data de admissão, nível hierárquico, responsável e salário base.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfessionalInfoStep;
