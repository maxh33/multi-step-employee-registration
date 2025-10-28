import React from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface DepartmentSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCreateNew: () => void;
}

const DepartmentSearchBar: React.FC<DepartmentSearchBarProps> = React.memo(({
  searchTerm,
  onSearchChange,
  onCreateNew,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? theme.spacing(2) : 0,
        marginBottom: theme.spacing(3),
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          fontSize: '1.75rem',
          marginRight: theme.spacing(3),
        }}
      >
        Departamentos
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? theme.spacing(1.5) : theme.spacing(2), 
        alignItems: isMobile ? 'stretch' : 'center' 
      }}>
        <TextField
          placeholder={isMobile ? "Buscar departamento..." : "Buscar por nome ou responsável..."}
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          sx={{ 
            minWidth: isMobile ? 'auto' : isTablet ? 250 : 300,
            width: isMobile ? '100%' : 'auto'
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: '#ffffff',
            fontWeight: 500,
            padding: theme.spacing(1.5, 3),
            borderRadius: '8px',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          {isMobile ? 'Novo' : 'Novo Departamento'}
        </Button>
      </Box>
    </Box>
  );
});

DepartmentSearchBar.displayName = 'DepartmentSearchBar';

export { DepartmentSearchBar };