import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  
  // Extract department context from URL parameters
  const fromDepartment = searchParams.get('fromDepartment');
  const departmentName = searchParams.get('departmentName');
  const role = searchParams.get('role');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitProgress, setSubmitProgress] = React.useState(0);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Convert editingEmployee to form data format OR create initial data for department manager
  const initialFormData = React.useMemo(() => {
    if (editingEmployee) {
      // Editing existing employee
      return {
        personalInfo: {
          firstName: editingEmployee.firstName,
          email: editingEmployee.email,
          activateOnCreate: editingEmployee.status === 'Ativo',
        },
        professionalInfo: {
          department: editingEmployee.department,
          position: editingEmployee.position || '',
          admissionDate: editingEmployee.admissionDate ? editingEmployee.admissionDate.toISOString().split('T')[0] : '',
          hierarchicalLevel: editingEmployee.hierarchicalLevel || 'junior',
          responsibleManager: editingEmployee.responsibleManager || '',
          baseSalary: editingEmployee.baseSalary || 0,
        },
      };
    }
    
    // Creating new employee - check if creating manager for department
    if (fromDepartment && role === 'manager') {
      return {
        personalInfo: {
          firstName: '',
          email: '',
          activateOnCreate: true, // Default to active for new managers
        },
        professionalInfo: {
          department: fromDepartment, // Pre-select the department
          position: '',
          admissionDate: '',
          hierarchicalLevel: 'manager' as const, // Pre-select manager level
          responsibleManager: '', // Managers don't have responsible managers
          baseSalary: 0,
        },
      };
    }
    
    return undefined; // Standard new employee creation
  }, [editingEmployee, fromDepartment, role]);

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
            // Explicit type guard function to ensure data integrity - 4 required fields
            const isCompleteEmployeeFormData = (
              data: Partial<EmployeeFormData>
            ): data is EmployeeFormData => {
              return !!(
                data.personalInfo?.firstName?.trim() &&
                data.personalInfo?.email?.trim() &&
                data.personalInfo?.activateOnCreate !== undefined &&
                data.professionalInfo?.department?.trim()
              );
            };

            if (!isCompleteEmployeeFormData(formData)) {
              setSubmitError(
                'Dados obrigatórios estão faltando. Verifique os campos obrigatórios.'
              );
              setIsSubmitting(false);
              setSubmitProgress(0);
              return;
            }

            // Now we can safely use formData as EmployeeFormData without type assertion
            const result = await onSubmit(formData);
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
        progressIntervalRef.current = null;
      }
      // Only cleanup progress interval - form cleanup is handled in handleBack for explicit cancellations
    };
  }, []);

  const handleBack = () => {
    if (currentStep > 1) {
      previousStep();
    } else {
      // Clear form data when exiting form (especially important when canceling edit)
      if (editingEmployee) {
        clearFormData();
      }
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

        {/* Department Context Indicator */}
        {fromDepartment && role === 'manager' && departmentName && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`Criando gerente para: ${departmentName}`}
              color="primary"
              variant="outlined"
              sx={{
                backgroundColor: theme.palette.primary.light + '20',
                '& .MuiChip-label': { fontWeight: 500 },
              }}
            />
          </Box>
        )}

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
              flexDirection: isMobile ? 'column' : 'row',
              minHeight: '600px',
            }}
          >
            {/* Mobile Layout: Single Column with Step Title + Form Content */}
            {isMobile ? (
              <Box
                sx={{
                  padding: theme.spacing(4),
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '500px',
                }}
              >
                {/* Mobile Step Title */}
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
                      isDepartmentLocked={!!(fromDepartment && role === 'manager')}
                      isHierarchicalLevelLocked={!!(fromDepartment && role === 'manager')}
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

                {/* Mobile Navigation Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    paddingTop: theme.spacing(4),
                  }}
                >
                  <Button
                    variant="text"
                    onClick={handleBack}
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      textTransform: 'none',
                      padding: theme.spacing(1.5, 3),
                    }}
                  >
                    Voltar
                  </Button>

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
            ) : (
              /* Desktop Layout: Sidebar + Form Content */
              <>
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
                        isDepartmentLocked={!!(fromDepartment && role === 'manager')}
                        isHierarchicalLevelLocked={!!(fromDepartment && role === 'manager')}
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
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ColaboradorForm;
