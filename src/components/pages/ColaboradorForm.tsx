import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  Breadcrumbs,
  Link,
  LinearProgress,
  Alert,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VerticalStepIndicator from '../ui/VerticalStepIndicator';
import PersonalInfoStep from '../forms/PersonalInfoStep';
import ProfessionalInfoStep from '../forms/ProfessionalInfoStep';
import { useFormData } from '../../hooks/useFormData';
import { EmployeeFormData, Employee } from '../../types/employee';

interface ColaboradorFormProps {
  onBack: () => void;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onNavigateHome?: () => void;
  onSubmit?: (formData: EmployeeFormData) => Promise<{ success: boolean; error?: string }>;
  editingEmployee?: Employee | null;
}

const ColaboradorForm: React.FC<ColaboradorFormProps> = ({
  onBack,
  onNavigateHome,
  onSubmit,
  editingEmployee,
}) => {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitProgress, setSubmitProgress] = React.useState(0);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Convert editingEmployee to form data format
  const initialFormData = React.useMemo(() => {
    if (!editingEmployee) return undefined;

    return {
      personalInfo: {
        firstName: editingEmployee.firstName,
        lastName: editingEmployee.lastName,
        email: editingEmployee.email,
        phone: editingEmployee.phone,
        activateOnCreate: editingEmployee.status === 'Ativo',
      },
      professionalInfo: {
        position: editingEmployee.position,
        department: editingEmployee.department,
        startDate: '',
        salary: 0,
      },
      additionalInfo: {
        emergencyContact: '',
        notes: '',
      },
    };
  }, [editingEmployee]);

  const {
    formData,
    currentStep,
    errors,
    progress,
    updatePersonalInfo,
    updateProfessionalInfo,
    validateCurrentStep,
    nextStep,
    previousStep,
    clearFormData,
  } = useFormData(initialFormData);

  const stepTitles = ['Infos Básicas', 'Informações Profissionais'];
  const totalSteps = 2;

  const handleNext = async () => {
    setSubmitError(null); // Clear any previous errors
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        nextStep();
      } else {
        // Handle form submission with progress animation
        setIsSubmitting(true);
        setSubmitProgress(0);

        // Simulate progress animation
        progressIntervalRef.current = setInterval(() => {
          setSubmitProgress((prev) => {
            if (prev >= 100) {
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
              }
              return 100;
            }
            return prev + 10;
          });
        }, 100);

        // Wait for animation to complete
        setTimeout(async () => {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          if (onSubmit && formData.personalInfo && formData.professionalInfo) {
            const result = await onSubmit(formData as EmployeeFormData);
            if (result.success) {
              // Success - clear form data and navigate
              clearFormData();
            } else {
              // Handle duplicate error
              setSubmitError(result.error || 'Erro ao enviar formulário');
            }
          }
          setIsSubmitting(false);
          setSubmitProgress(0);
        }, 1200);
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleBack = () => {
    if (currentStep > 1) {
      previousStep();
    } else {
      onBack();
    }
  };

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
            {editingEmployee ? 'Editar Colaborador' : 'Cadastrar Colaborador'}
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
              value={isSubmitting ? submitProgress : progress}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: isSubmitting
                    ? theme.palette.success.main
                    : theme.palette.primary.main,
                  borderRadius: 2,
                  transition: 'width 0.3s ease-in-out', // Smooth animation
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
            {isSubmitting ? `${submitProgress}%` : `${progress}%`}
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
                onClick={handleBack}
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
                  <PersonalInfoStep
                    data={formData.personalInfo || {}}
                    errors={errors}
                    onChange={updatePersonalInfo}
                  />
                )}

                {currentStep === 2 && (
                  <ProfessionalInfoStep
                    data={formData.professionalInfo || {}}
                    errors={errors}
                    onChange={updateProfessionalInfo}
                  />
                )}
              </Box>

              {/* Error Display */}
              {submitError && (
                <Box sx={{ marginTop: theme.spacing(2) }}>
                  <Alert severity="error" sx={{ borderRadius: '8px' }}>
                    {submitError}
                  </Alert>
                </Box>
              )}

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
                  onClick={handleNext}
                  disabled={isSubmitting}
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
                    '&:disabled': {
                      backgroundColor: theme.palette.grey[400],
                      color: theme.palette.grey[600],
                    },
                  }}
                >
                  {isSubmitting
                    ? 'Enviando...'
                    : currentStep === 2
                      ? editingEmployee
                        ? 'Atualizar'
                        : 'Concluir'
                      : 'Próximo'}
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
