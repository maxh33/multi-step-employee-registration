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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SelectChangeEvent } from '@mui/material';
import { Employee } from '../../../types/employee';

interface ResponsibleManagerFieldProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  error?: string;
  managers: Employee[];
  loadingManagers: boolean;
  getDepartmentName: (departmentId: string) => string;
  hierarchicalLevel?: string;
}

const ResponsibleManagerField: React.FC<ResponsibleManagerFieldProps> = React.memo(({
  value,
  onChange,
  error,
  managers,
  loadingManagers,
  getDepartmentName,
  hierarchicalLevel,
}) => {
  const theme = useTheme();

  // Only show if not manager level
  if (hierarchicalLevel === 'manager') {
    return null;
  }

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
        Responsável *
      </Typography>
      <FormControl fullWidth error={!!error}>
        <Select
          value={value || ''}
          onChange={onChange}
          displayEmpty
          disabled={loadingManagers}
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
        {error && (
          <FormHelperText>{error}</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
});

ResponsibleManagerField.displayName = 'ResponsibleManagerField';

export { ResponsibleManagerField };