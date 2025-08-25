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
  Button,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SelectChangeEvent } from '@mui/material';
import { ProfessionalInfo, Employee } from '../../types/employee';
import { Department } from '../../types/department';
import { getAllDepartments } from '../../services/departments';
import { getManagerEmployees } from '../../services/firebase';

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
  
  const [managers, setManagers] = useState<Employee[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, [data.department]); // Re-validate when department value changes

  useEffect(() => {
    // Fetch managers when hierarchical level is set and is not manager
    if (data.hierarchicalLevel && data.hierarchicalLevel !== 'manager') {
      fetchManagers();
    }
  }, [data.hierarchicalLevel]);

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      setDepartmentError(null);
      const fetchedDepartments = await getAllDepartments();
      setDepartments(fetchedDepartments);
      
      // Validate current department value against fetched departments
      if (data.department && fetchedDepartments.length > 0) {
        const validDepartment = fetchedDepartments.find(dept => 
          dept.name === data.department || 
          (data.department && dept.name.toLowerCase() === data.department.toLowerCase()) ||
          dept.id === data.department
        );
        
        // If current department value is invalid, reset to empty
        if (!validDepartment) {
          console.warn(`Invalid department value "${data.department}" found, resetting to empty`);
          onChange({ ...data, department: '' });
        }
      }
      
      // If no departments exist, show error
      if (fetchedDepartments.length === 0) {
        setDepartmentError('Nenhum departamento cadastrado. Por favor, crie departamentos primeiro.');
      }
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      
      // Provide specific error messages based on error type
      let errorMessage = 'Erro ao carregar departamentos';
      if (error?.message?.includes('network') || error?.message?.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error?.message?.includes('permission-denied')) {
        errorMessage = 'Sem permissão para acessar departamentos.';
      } else if (error?.message?.includes('index')) {
        errorMessage = 'Configuração do banco de dados em andamento. Tente novamente em alguns instantes.';
      }
      
      setDepartmentError(errorMessage);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchManagers = async () => {
    try {
      setLoadingManagers(true);
      const managerEmployees = await getManagerEmployees();
      setManagers(managerEmployees);
    } catch (error) {
      console.error('Error fetching managers:', error);
      setManagers([]);
    } finally {
      setLoadingManagers(false);
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

  const getDepartmentName = (departmentId: string): string => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'Departamento não encontrado';
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
              ) : departmentError ? (
                <MenuItem disabled value="">
                  <Box sx={{ color: 'error.main' }}>
                    <Typography variant="body2">{departmentError}</Typography>
                    <Button
                      size="small"
                      onClick={() => fetchDepartments()}
                      sx={{ mt: 1, textTransform: 'none' }}
                    >
                      Tentar novamente
                    </Button>
                  </Box>
                </MenuItem>
              ) : departments.length === 0 ? (
                <MenuItem disabled value="">
                  <Box sx={{ textAlign: 'center', py: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Nenhum departamento disponível
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => window.open('/departamentos', '_blank')}
                      sx={{ 
                        textTransform: 'none',
                        fontSize: '12px',
                        px: 2
                      }}
                    >
                      + Criar Departamento
                    </Button>
                  </Box>
                </MenuItem>
              ) : (
                [
                  <MenuItem key="placeholder" value="">
                    <em>Selecione um departamento</em>
                  </MenuItem>,
                  ...departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))
                ]
              )}
            </Select>
            {getFieldError('department') && (
              <FormHelperText>{getFieldError('department')}</FormHelperText>
            )}
          </FormControl>
        </Box>

        {/* Position Field */}
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
            Cargo *
          </Typography>
          <TextField
            fullWidth
            value={data.position || ''}
            onChange={(e) => onChange({ ...data, position: e.target.value })}
            placeholder="Ex: Desenvolvedor Frontend"
            error={!!getFieldError('position')}
            helperText={getFieldError('position')}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
                '& fieldset': {
                  borderColor: getFieldError('position') ? theme.palette.error.main : '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: getFieldError('position') ? theme.palette.error.main : theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: getFieldError('position') ? theme.palette.error.main : theme.palette.primary.main,
                },
              },
            }}
          />
        </Box>

        {/* Admission Date Field */}
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
            Data de Admissão *
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={data.admissionDate || ''}
            onChange={(e) => onChange({ ...data, admissionDate: e.target.value })}
            error={!!getFieldError('admissionDate')}
            helperText={getFieldError('admissionDate')}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
                '& fieldset': {
                  borderColor: getFieldError('admissionDate') ? theme.palette.error.main : '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: getFieldError('admissionDate') ? theme.palette.error.main : theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: getFieldError('admissionDate') ? theme.palette.error.main : theme.palette.primary.main,
                },
              },
            }}
          />
        </Box>

        {/* Hierarchical Level Field */}
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
            Nível Hierárquico *
          </Typography>
          <FormControl fullWidth error={!!getFieldError('hierarchicalLevel')}>
            <Select
              value={data.hierarchicalLevel || ''}
              onChange={(e) => onChange({ ...data, hierarchicalLevel: e.target.value as any })}
              displayEmpty
              IconComponent={ExpandMoreIcon}
              sx={{
                backgroundColor: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: getFieldError('hierarchicalLevel') ? theme.palette.error.main : '#e0e0e0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: getFieldError('hierarchicalLevel') ? theme.palette.error.main : theme.palette.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: getFieldError('hierarchicalLevel') ? theme.palette.error.main : theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="">
                <em>Selecione o nível</em>
              </MenuItem>
              <MenuItem value="junior">Júnior</MenuItem>
              <MenuItem value="mid-level">Pleno</MenuItem>
              <MenuItem value="senior">Sênior</MenuItem>
              <MenuItem value="manager">Gerente</MenuItem>
            </Select>
            {getFieldError('hierarchicalLevel') && (
              <FormHelperText>{getFieldError('hierarchicalLevel')}</FormHelperText>
            )}
          </FormControl>
        </Box>

        {/* Responsible Manager Field - Only show if not manager level */}
        {data.hierarchicalLevel && data.hierarchicalLevel !== 'manager' && (
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
              Responsável *
            </Typography>
            <FormControl fullWidth error={!!getFieldError('responsibleManager')}>
              <Select
                value={data.responsibleManager || ''}
                onChange={(e) => onChange({ ...data, responsibleManager: e.target.value })}
                displayEmpty
                disabled={loadingManagers}
                IconComponent={ExpandMoreIcon}
                sx={{
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: getFieldError('responsibleManager') ? theme.palette.error.main : '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: getFieldError('responsibleManager') ? theme.palette.error.main : theme.palette.primary.main,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: getFieldError('responsibleManager') ? theme.palette.error.main : theme.palette.primary.main,
                  },
                }}
              >
                {loadingManagers ? (
                  <MenuItem disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} />
                      <Typography>Carregando gerentes...</Typography>
                    </Box>
                  </MenuItem>
                ) : managers.length === 0 ? (
                  <MenuItem disabled value="">
                    <em>Nenhum gerente disponível</em>
                  </MenuItem>
                ) : (
                  [
                    <MenuItem key="placeholder" value="">
                      <em>Selecione um responsável</em>
                    </MenuItem>,
                    ...managers.map((manager) => (
                      <MenuItem key={manager.id} value={manager.id}>
                        {manager.firstName} - {getDepartmentName(manager.department)}
                      </MenuItem>
                    ))
                  ]
                )}
              </Select>
              {getFieldError('responsibleManager') && (
                <FormHelperText>{getFieldError('responsibleManager')}</FormHelperText>
              )}
            </FormControl>
          </Box>
        )}

        {/* Base Salary Field */}
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
            Salário Base *
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={data.baseSalary || ''}
            onChange={(e) => onChange({ ...data, baseSalary: parseFloat(e.target.value) || 0 })}
            placeholder="Ex: 5000.00"
            error={!!getFieldError('baseSalary')}
            helperText={getFieldError('baseSalary')}
            InputProps={{
              startAdornment: (
                <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                  R$
                </Typography>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
                '& fieldset': {
                  borderColor: getFieldError('baseSalary') ? theme.palette.error.main : '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: getFieldError('baseSalary') ? theme.palette.error.main : theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: getFieldError('baseSalary') ? theme.palette.error.main : theme.palette.primary.main,
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfessionalInfoStep;
