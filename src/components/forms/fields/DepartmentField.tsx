import React from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SelectChangeEvent } from '@mui/material';
import { Department } from '../../../types/department';

interface DepartmentFieldProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  error?: string;
  departments: Department[];
  loadingDepartments: boolean;
  departmentError: string | null;
  isDepartmentLocked?: boolean;
  onRetryFetch: () => void;
}

const DepartmentField: React.FC<DepartmentFieldProps> = React.memo(({
  value,
  onChange,
  error,
  departments,
  loadingDepartments,
  departmentError,
  isDepartmentLocked,
  onRetryFetch,
}) => {
  const theme = useTheme();

  return (
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
      
      {departmentError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {departmentError}
        </Alert>
      )}
      
      <FormControl fullWidth error={!!error}>
        <Select
          value={value || ''}
          onChange={onChange}
          displayEmpty
          disabled={loadingDepartments || departments.length === 0 || isDepartmentLocked}
          IconComponent={ExpandMoreIcon}
          sx={{
            backgroundColor: '#fff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: error ? theme.palette.error.main : '#e0e0e0',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
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
                  onClick={onRetryFetch}
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
                  onClick={() => window.open(`${window.location.origin}/departamentos`, '_blank', 'noopener,noreferrer')}
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
        {error && (
          <FormHelperText>{error}</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
});

DepartmentField.displayName = 'DepartmentField';

export { DepartmentField };