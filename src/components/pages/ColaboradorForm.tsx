import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  Breadcrumbs,
  Link,
  LinearProgress,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VerticalStepIndicator from '../ui/VerticalStepIndicator';

interface ColaboradorFormProps {
  onBack: () => void;
  currentStep: number;
  onStepChange?: (step: number) => void;
  onNavigateHome?: () => void;
}

const ColaboradorForm: React.FC<ColaboradorFormProps> = ({ onBack, currentStep, onStepChange, onNavigateHome }) => {
  const theme = useTheme();
  const stepTitles = ['Infos Básicas', 'Infos Profissionais'];
  const totalSteps = 2;
    const progressPercentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#ffffff',
        minHeight: 'calc(100vh - 64px)', // Full height minus header
        margin: 0,
        padding: 0,
      }}
    >
      {/* Breadcrumbs and Progress Bar */}
      <Box
        sx={{
          padding: theme.spacing(3, 3, 0, 3),
        }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: theme.palette.grey[400] }} />}
          sx={{ marginBottom: theme.spacing(2) }}
        >
          <Link
            underline="hover"
            color="inherit"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome?.();
            }}
            sx={{
              color: theme.palette.grey[600],
              fontSize: '14px',
              fontWeight: 400,
              cursor: 'pointer',
            }}
          >
            Colaboradores
          </Link>
          <Typography
            sx={{
              color: theme.palette.text.primary,
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Cadastrar Colaborador
          </Typography>
        </Breadcrumbs>

        {/* Progress Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(2),
            marginBottom: theme.spacing(3),
          }}
        >
          <Box sx={{ width: '100%' }}>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 2,
                },
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontSize: '14px',
              color: theme.palette.text.secondary,
              fontWeight: 500,
              minWidth: '32px',
            }}
          >
            {progressPercentage}%
          </Typography>
        </Box>
      </Box>

      {/* Form Layout - Steps on Left, Content on Right */}
      <Box
        sx={{
          padding: theme.spacing(0, 3, 3, 3),
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: '12px',
            border: `1px solid ${theme.palette.grey[200]}`,
            overflow: 'hidden',
          }}
        >
        <Box
          sx={{
            display: 'flex',
            minHeight: '600px',
          }}
        >
          {/* Left Side - Vertical Steps */}
          <Box
            sx={{
              padding: theme.spacing(4, 3),
              minWidth: '280px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <VerticalStepIndicator
              currentStep={currentStep}
              totalSteps={2}
              stepTitles={stepTitles}
            />
            
            {/* Voltar Button - Inside Left Sidebar */}
            <Button
              variant="text"
              onClick={onBack}
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                textTransform: 'none',
                padding: theme.spacing(1.5, 3),
                marginTop: 'auto',
                alignSelf: 'flex-start',
              }}
            >
              Voltar
            </Button>
          </Box>

          {/* Right Side - Form Content */}
          <Box
            sx={{
              flex: 1,
              padding: theme.spacing(4),
              display: 'flex',
              flexDirection: 'column',
              minHeight: '500px',
            }}
          >
            {/* Current Step Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                marginBottom: theme.spacing(3),
                fontSize: '1.5rem',
              }}
            >
              {stepTitles[currentStep - 1]}
            </Typography>

            {/* Form Content Area */}
            <Box
              sx={{
                marginBottom: theme.spacing(4),
              }}
            >
              {currentStep === 1 && (
                <Box>
                  {/* Placeholder for Step 1 form fields */}
                  <Box
                    sx={{
                      padding: theme.spacing(4),
                      textAlign: 'center',
                      color: theme.palette.text.secondary,
                      border: `2px dashed ${theme.palette.grey[300]}`,
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="body1">
                      Campos do formulário "Informações Básicas" serão implementados aqui
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: theme.spacing(1) }}>
                      (Nome, Email, Telefone, etc.)
                    </Typography>
                  </Box>
                </Box>
              )}

              {currentStep === 2 && (
                <Box>
                  {/* Placeholder for Step 2 form fields */}
                  <Box
                    sx={{
                      padding: theme.spacing(4),
                      textAlign: 'center',
                      color: theme.palette.text.secondary,
                      border: `2px dashed ${theme.palette.grey[300]}`,
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="body1">
                      Campos do formulário "Informações Profissionais" serão implementados aqui
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: theme.spacing(1) }}>
                      (Cargo, Departamento, Data de Início, etc.)
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Form Navigation Button - Only Next/Finish */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: 'auto',
                paddingTop: theme.spacing(4),
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  if (currentStep < 2) {
                    onStepChange?.(currentStep + 1);
                  } else {
                    // Handle form submission
                    console.log('Form submitted!');
                  }
                }}
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
                {currentStep === 2 ? 'Concluir' : 'Próximo'}
              </Button>
            </Box>
          </Box>
        </Box>
        </Paper>
      </Box>

    </Box>
  );
};

export default ColaboradorForm;