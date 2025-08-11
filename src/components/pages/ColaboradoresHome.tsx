import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface ColaboradoresHomeProps {
  onCreateNew: () => void;
}

const ColaboradoresHome: React.FC<ColaboradoresHomeProps> = ({ onCreateNew }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        maxWidth: '1400px',
        width: '100%',
        padding: theme.spacing(3, 3, 3, 2),
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
          }}
        >
          Colaboradores
        </Typography>

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
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Novo Colaborador
        </Button>
      </Box>

      {/* Table Header */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: `1px solid ${theme.palette.grey[200]}`,
          overflow: 'hidden',
        }}
      >
        {/* Table Headers */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 100px',
            gap: theme.spacing(2),
            padding: theme.spacing(2, 3),
            backgroundColor: theme.palette.grey[50],
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              fontSize: '14px',
            }}
          >
            Nome ↑
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              fontSize: '14px',
            }}
          >
            Email ↓
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              fontSize: '14px',
            }}
          >
            Departamento ↓
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              fontSize: '14px',
            }}
          >
            Status ↓
          </Typography>
        </Box>

        {/* Empty State */}
        <Box
          sx={{
            padding: theme.spacing(8, 3),
            textAlign: 'center',
            color: theme.palette.text.secondary,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: theme.spacing(2),
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            Nenhum colaborador encontrado
          </Typography>
          <Typography
            variant="body2"
            sx={{
              marginBottom: theme.spacing(3),
              color: theme.palette.text.secondary,
            }}
          >
            Comece adicionando seu primeiro colaborador ao sistema
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onCreateNew}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              fontWeight: 500,
              padding: theme.spacing(1.5, 3),
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                color: '#ffffff',
              },
            }}
          >
            Adicionar Colaborador
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ColaboradoresHome;