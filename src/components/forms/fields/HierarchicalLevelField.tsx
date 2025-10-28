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
import { SelectChangeEvent } from '@mui/material';

type HierarchicalLevel = 'junior' | 'mid-level' | 'senior' | 'manager';

interface HierarchicalLevelFieldProps {
  value: HierarchicalLevel | '';
  onChange: (event: SelectChangeEvent<string>) => void;
  error?: string;
  disabled?: boolean;
  locked?: boolean;
  lockReason?: string;
  onLockedClick?: () => void;
}

const HierarchicalLevelField: React.FC<HierarchicalLevelFieldProps> = React.memo(({
  value,
  onChange,
  error,
  disabled = false,
  locked = false,
  lockReason,
  onLockedClick,
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
        Nível Hierárquico *
        {locked && lockReason && (
          <Typography
            component="span"
            variant="caption"
            sx={{ 
              ml: 1, 
              color: 'warning.main',
              fontStyle: 'italic'
            }}
          >
            ({lockReason})
          </Typography>
        )}
      </Typography>
      <FormControl fullWidth error={!!error}>
        <Select
          value={value || ''}
          onChange={onChange}
          displayEmpty
          disabled={disabled || locked}
          onClick={locked ? onLockedClick : undefined}
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
          <MenuItem value="">
            <em>Selecione o nível</em>
          </MenuItem>
          <MenuItem value="junior">Júnior</MenuItem>
          <MenuItem value="mid-level">Pleno</MenuItem>
          <MenuItem value="senior">Sênior</MenuItem>
          <MenuItem value="manager">Gerente</MenuItem>
        </Select>
        {error && (
          <FormHelperText>{error}</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
});

HierarchicalLevelField.displayName = 'HierarchicalLevelField';

export { HierarchicalLevelField };
export default HierarchicalLevelField;
