import React from 'react';
import {
  Box,
  Typography,
  TextField,
  useTheme,
} from '@mui/material';

interface BaseSalaryFieldProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

const BaseSalaryField: React.FC<BaseSalaryFieldProps> = React.memo(({
  value,
  onChange,
  error,
}) => {
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseFloat(e.target.value) || 0;
    onChange(numericValue);
  };

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
        Salário Base *
      </Typography>
      <TextField
        fullWidth
        type="number"
        value={value || ''}
        onChange={handleChange}
        placeholder="Ex: 5000.00"
        error={!!error}
        helperText={error}
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
              borderColor: error ? theme.palette.error.main : '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            },
          },
        }}
      />
    </Box>
  );
});

BaseSalaryField.displayName = 'BaseSalaryField';

export { BaseSalaryField };