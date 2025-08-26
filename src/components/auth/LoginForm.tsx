import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { signIn, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'E-mail deve ter um formato válido';
    }

    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (validateForm()) {
      try {
        await signIn(formData.email, formData.password);
        navigate('/');
      } catch (error) {
        // Error is handled in AuthContext
      }
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(2),
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: theme.spacing(4),
          maxWidth: 400,
          width: '100%',
          borderRadius: '12px',
        }}
      >
        {' '}
        <Box sx={{ textAlign: 'center', marginBottom: theme.spacing(3) }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(1),
            }}
          >
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Entre com suas credenciais para acessar o sistema
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ marginBottom: theme.spacing(2) }} onClose={clearError}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={!!formErrors.email}
            helperText={formErrors.email}
            margin="normal"
            variant="outlined"
            autoComplete="email"
            autoFocus
          />

          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            error={!!formErrors.password}
            helperText={formErrors.password}
            margin="normal"
            variant="outlined"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              marginTop: theme.spacing(3),
              padding: theme.spacing(1.5),
              borderRadius: '8px',
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
