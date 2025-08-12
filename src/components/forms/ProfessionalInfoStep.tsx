import React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ProfessionalInfo } from '../../types/employee';

interface ProfessionalInfoStepProps {
  data: Partial<ProfessionalInfo>;
  errors: Record<string, string>;
  onChange: (data: Partial<ProfessionalInfo>) => void;
}

// Department options - these can be moved to a configuration file later
const departmentOptions = [
  { value: 'desenvolvimento', label: 'Desenvolvimento' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'vendas', label: 'Vendas' },
  { value: 'rh', label: 'Recursos Humanos' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'operacoes', label: 'Operações' },
  { value: 'suporte', label: 'Suporte ao Cliente' },
  { value: 'ti', label: 'TI' },
  { value: 'produto', label: 'Produto' },
];

const ProfessionalInfoStep: React.FC<ProfessionalInfoStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();

  const handleFieldChange =
    (field: keyof ProfessionalInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3),
        maxWidth: '500px',
      }}
    >
      {/* Department Dropdown */}
      <Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            marginBottom: theme.spacing(1),
            color: theme.palette.text.primary,
            fontSize: '14px',
          }}
        >
          Departamento
        </Typography>
        <FormControl fullWidth error={!!getFieldError('department')}>
          <Select
            value={data.department || ''}
            onChange={handleFieldChange('department')}
            displayEmpty
            IconComponent={ExpandMoreIcon}
            sx={{
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.grey[300],
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.grey[400],
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
              '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.error.main,
              },
              '& .MuiSelect-select': {
                padding: theme.spacing(1.5, 1.5),
                fontSize: '14px',
                color: data.department ? theme.palette.text.primary : theme.palette.text.secondary,
              },
              '& .MuiSelect-icon': {
                color: theme.palette.grey[600],
              },
            }}
          >
            <MenuItem
              value=""
              disabled
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '14px',
              }}
            >
              Selecione um departamento
            </MenuItem>
            {departmentOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  fontSize: '14px',
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                    },
                  },
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {getFieldError('department') && (
            <FormHelperText sx={{ marginLeft: 0 }}>{getFieldError('department')}</FormHelperText>
          )}
        </FormControl>
      </Box>
    </Box>
  );
};

export default ProfessionalInfoStep;
