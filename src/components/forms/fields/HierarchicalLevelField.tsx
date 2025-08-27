import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  FormHelperText,
} from '@mui/material';
import { HierarchicalLevel } from '../../../types/extendedEmployee';

interface HierarchicalLevelFieldProps {
  value: HierarchicalLevel | '';
  onChange: (value: HierarchicalLevel) => void;
  error?: string;
}

const hierarchicalLevels: Array<{
  value: HierarchicalLevel;
  label: string;
  description: string;
}> = [
  { 
    value: 'junior', 
    label: 'Júnior', 
    description: 'Profissional iniciante (0-2 anos)' 
  },
  { 
    value: 'mid-level', 
    label: 'Pleno', 
    description: 'Profissional intermediário (2-5 anos)' 
  },
  { 
    value: 'senior', 
    label: 'Sênior', 
    description: 'Profissional experiente (5+ anos)' 
  },
  { 
    value: 'manager', 
    label: 'Gerente', 
    description: 'Liderança e gestão de equipe' 
  }
];

const HierarchicalLevelField: React.FC<HierarchicalLevelFieldProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <FormControl fullWidth error={!!error}>
      <FormLabel component="legend">Nível Hierárquico *</FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value as HierarchicalLevel)}
        row
      >
        {hierarchicalLevels.map((level) => (
          <FormControlLabel
            key={level.value}
            value={level.value}
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {level.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {level.description}
                </Typography>
              </Box>
            }
          />
        ))}
      </RadioGroup>
      {error && (
        <FormHelperText>{error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default HierarchicalLevelField;
