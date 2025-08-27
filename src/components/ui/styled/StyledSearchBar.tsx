import React from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Chip,
  Typography,
  useTheme 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { componentStyles } from '../../../theme/components';

interface StyledSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  disabled?: boolean;
}

interface StyledSearchContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface StyledFilterChipProps {
  label: string;
  onDelete?: () => void;
  color?: 'default' | 'primary' | 'secondary';
  variant?: 'filled' | 'outlined';
}

interface StyledSearchResultsProps {
  resultCount: number;
  searchTerm?: string;
  filters?: string[];
  onClearFilters?: () => void;
}

// Main search bar component
export const StyledSearchBar: React.FC<StyledSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  onClear,
  fullWidth = true,
  size = 'medium',
  disabled = false,
}) => {
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  return (
    <TextField
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
      sx={componentStyles.common.searchBar(theme)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClear}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

// Search container with title and actions
export const StyledSearchContainer: React.FC<StyledSearchContainerProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      {(title || subtitle || actions) && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 2,
            [theme.breakpoints.down('sm')]: {
              flexDirection: 'column',
              gap: 2,
            }
          }}
        >
          <Box>
            {title && (
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.primary,
                  mb: subtitle ? 0.5 : 0,
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography 
                variant="body2" 
                sx={{ color: theme.palette.text.secondary }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              [theme.breakpoints.down('sm')]: {
                width: '100%',
                justifyContent: 'flex-end',
              }
            }}>
              {actions}
            </Box>
          )}
        </Box>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
          flexDirection: 'column',
          alignItems: 'stretch',
        }
      }}>
        {children}
      </Box>
    </Box>
  );
};

// Filter chip component
export const StyledFilterChip: React.FC<StyledFilterChipProps> = ({
  label,
  onDelete,
  color = 'primary',
  variant = 'filled',
}) => {
  const theme = useTheme();

  return (
    <Chip
      label={label}
      onDelete={onDelete}
      color={color}
      variant={variant}
      sx={{
        ...componentStyles.table.filterChip(theme),
        '& .MuiChip-deleteIcon': {
          color: 'inherit',
          '&:hover': {
            color: theme.palette.text.primary,
          },
        },
      }}
    />
  );
};

// Search results summary component
export const StyledSearchResults: React.FC<StyledSearchResultsProps> = ({
  resultCount,
  searchTerm,
  filters = [],
  onClearFilters,
}) => {
  const theme = useTheme();

  if (resultCount === 0 && !searchTerm && filters.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      {/* Results count */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {resultCount === 0 
            ? 'Nenhum resultado encontrado'
            : resultCount === 1
            ? '1 resultado encontrado'
            : `${resultCount} resultados encontrados`
          }
          {searchTerm && ` para "${searchTerm}"`}
        </Typography>
        
        {filters.length > 0 && onClearFilters && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.primary.main,
              cursor: 'pointer',
              textDecoration: 'underline',
              '&:hover': {
                color: theme.palette.primary.dark,
              },
            }}
            onClick={onClearFilters}
          >
            Limpar filtros
          </Typography>
        )}
      </Box>

      {/* Active filters */}
      {filters.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filters.map((filter, index) => (
            <StyledFilterChip
              key={index}
              label={filter}
              variant="outlined"
              onDelete={() => {
                // This would need to be implemented by the parent component
                // by passing individual filter removal handlers
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

// Multi-field search bar (for searching across multiple fields)
interface StyledMultiFieldSearchProps {
  fields: Array<{
    key: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }>;
  onClearAll?: () => void;
}

export const StyledMultiFieldSearch: React.FC<StyledMultiFieldSearchProps> = ({
  fields,
  onClearAll,
}) => {
  const theme = useTheme();
  
  const hasActiveFilters = fields.some(field => field.value.trim() !== '');

  return (
    <Box>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 2,
        mb: 2,
      }}>
        {fields.map((field) => (
          <StyledSearchBar
            key={field.key}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder || `Buscar por ${field.label.toLowerCase()}...`}
            fullWidth
            size="small"
          />
        ))}
      </Box>
      
      {hasActiveFilters && onClearAll && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.primary.main,
              cursor: 'pointer',
              textDecoration: 'underline',
              '&:hover': {
                color: theme.palette.primary.dark,
              },
            }}
            onClick={onClearAll}
          >
            Limpar todos os filtros
          </Typography>
        </Box>
      )}
    </Box>
  );
};