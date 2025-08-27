import React from 'react';
import { TextField } from '@mui/material';

interface PositionFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const PositionField: React.FC<PositionFieldProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    // Basic sanitization
    if (newValue.length <= 100) {
      onChange(newValue);
    }
  };

  return (
    <TextField
      fullWidth
      label="Cargo *"
      placeholder="ex: Desenvolvedor Frontend"
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={error || 'Informe o cargo do colaborador'}
      disabled={disabled}
      inputProps={{ maxLength: 100 }}
      variant="outlined"
    />
  );
};

export default PositionField;
