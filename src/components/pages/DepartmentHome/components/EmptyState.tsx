import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface EmptyStateProps {
  searchTerm: string;
  onCreateNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  searchTerm,
  onCreateNew,
}) => {
  const theme = useTheme();

  const isSearchResult = searchTerm.trim().length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(8, 3),
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: `1px solid ${theme.palette.grey[200]}`,
        minHeight: '400px',
      }}
    >
      <BusinessIcon
        sx={{
          fontSize: 80,
          color: theme.palette.grey[300],
          marginBottom: theme.spacing(3),
        }}
      />
      
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          marginBottom: theme.spacing(1),
          fontSize: '1.5rem',
        }}
      >
        {isSearchResult ? 'Nenhum departamento encontrado' : 'Nenhum departamento cadastrado'}
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          marginBottom: theme.spacing(4),
          maxWidth: '400px',
          fontSize: '16px',
          lineHeight: 1.6,
        }}
      >
        {isSearchResult
          ? `Não encontramos departamentos que correspondam à pesquisa "${searchTerm}". Tente usar outros termos.`
          : 'Comece criando seu primeiro departamento para organizar seus funcionários.'
        }
      </Typography>

      {!isSearchResult && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: '#ffffff',
            fontWeight: 500,
            padding: theme.spacing(1.5, 4),
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '16px',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Criar Primeiro Departamento
        </Button>
      )}
    </Box>
  );
});

EmptyState.displayName = 'EmptyState';

export { EmptyState };