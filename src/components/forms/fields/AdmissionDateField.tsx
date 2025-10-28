import React from 'react';
import {
  Box,
  Typography,
  TextField,
  useTheme,
} from '@mui/material';

interface AdmissionDateFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const AdmissionDateField: React.FC<AdmissionDateFieldProps> = React.memo(({
  value,
  onChange,
  error,
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
        Data de Admissão
      </Typography>
      <TextField
        fullWidth
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        helperText={error}
        InputLabelProps={{
          shrink: true,
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

AdmissionDateField.displayName = 'AdmissionDateField';

export { AdmissionDateField };