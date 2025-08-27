import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const UnauthorizedPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(2),
        textAlign: 'center',
      }}
    >
      {' '}
      <Box
        sx={{
          backgroundColor: theme.palette.error.light,
          borderRadius: '50%',
          padding: theme.spacing(3),
          marginBottom: theme.spacing(3),
        }}
      >
        <LockOutlinedIcon
          sx={{
            fontSize: '4rem',
            color: theme.palette.error.main,
          }}
        />
      </Box>
      <Typography
        variant="h1"
        sx={{
          fontSize: '6rem',
          fontWeight: 700,
          color: theme.palette.error.main,
          marginBottom: theme.spacing(1),
        }}
      >
        401
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          marginBottom: theme.spacing(2),
        }}
      >
        Acesso Não Autorizado
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ marginBottom: theme.spacing(4), maxWidth: 400 }}
      >
        Você não tem permissão para acessar esta página. Por favor, faça login com uma conta válida.
      </Typography>
      <Button
        variant="contained"
        onClick={handleBackToLogin}
        sx={{
          padding: theme.spacing(1.5, 4),
          borderRadius: '8px',
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Ir para Login
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;
