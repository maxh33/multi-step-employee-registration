import { Theme } from '@mui/material/styles';

// Reusable form styling configurations
export const formStyles = {
  // Form container styles
  formContainer: (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(3),
    padding: theme.spacing(4),
  }),

  // Form paper wrapper styles
  formPaper: (theme: Theme) => ({
    borderRadius: '12px',
    padding: theme.spacing(4),
    border: `1px solid ${theme.palette.grey[200]}`,
  }),

  // Form section styles
  formSection: (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  }),

  // Form section title styles
  sectionTitle: (theme: Theme) => ({
    fontSize: '1.25rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
  }),

  // Form grid layouts
  formGrid: {
    // Two column grid for desktop
    twoColumn: (theme: Theme) => ({
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing(3),
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
        gap: theme.spacing(2),
      },
    }),

    // Three column grid for desktop
    threeColumn: (theme: Theme) => ({
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: theme.spacing(3),
      [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: '1fr 1fr',
      },
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
        gap: theme.spacing(2),
      },
    }),

    // Full width single column
    singleColumn: (theme: Theme) => ({
      display: 'flex',
      flexDirection: 'column' as const,
      gap: theme.spacing(2),
    }),
  },

  // Field wrapper styles
  fieldWrapper: (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(1),
  }),

  // Field label styles
  fieldLabel: (theme: Theme) => ({
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(0.5),
  }),

  // Field help text styles
  fieldHelp: (theme: Theme) => ({
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  }),

  // Form actions container styles
  formActions: (theme: Theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(3),
    borderTop: `1px solid ${theme.palette.grey[200]}`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      gap: theme.spacing(2),
    },
  }),

  // Form button group styles
  buttonGroup: (theme: Theme) => ({
    display: 'flex',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      '& button': {
        flex: 1,
      },
    },
  }),

  // Form validation styles
  validation: {
    error: (theme: Theme) => ({
      border: `2px solid ${theme.palette.error.main}`,
      '&:focus': {
        borderColor: theme.palette.error.main,
      },
    }),

    success: (theme: Theme) => ({
      border: `2px solid ${theme.palette.success.main}`,
      '&:focus': {
        borderColor: theme.palette.success.main,
      },
    }),

    errorText: (theme: Theme) => ({
      color: theme.palette.error.main,
      fontSize: '0.75rem',
      marginTop: theme.spacing(0.5),
    }),

    helperText: (theme: Theme) => ({
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      marginTop: theme.spacing(0.5),
    }),
  },

  // Multi-step form styles
  multiStepForm: {
    container: (theme: Theme) => ({
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      minHeight: '500px',
    }),

    content: (theme: Theme) => ({
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'auto',
    }),

    stepContent: (theme: Theme) => ({
      padding: theme.spacing(3, 4),
      flex: 1,
    }),

    navigation: (theme: Theme) => ({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(2, 4),
      borderTop: `1px solid ${theme.palette.grey[200]}`,
      backgroundColor: theme.palette.grey[50],
    }),

    progressBar: (theme: Theme) => ({
      padding: theme.spacing(2, 4),
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    }),
  },

  // Specialized field styles
  specialized: {
    // Salary field styles
    salaryField: (theme: Theme) => ({
      '& .MuiInputAdornment-root': {
        color: theme.palette.text.secondary,
        fontSize: '0.875rem',
      },
      '& input': {
        textAlign: 'right' as const,
        fontFamily: 'monospace',
      },
    }),

    // Date field styles
    dateField: (theme: Theme) => ({
      '& .MuiInputBase-input': {
        textAlign: 'center' as const,
      },
    }),

    // Manager field styles (with hierarchy indication)
    managerField: (theme: Theme) => ({
      '& .manager-option': {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
      },
      '& .hierarchy-badge': {
        fontSize: '0.75rem',
        padding: theme.spacing(0.25, 0.75),
        borderRadius: '12px',
        backgroundColor: theme.palette.primary.light + '30',
        color: theme.palette.primary.main,
      },
    }),

    // Department field styles
    departmentField: (theme: Theme) => ({
      '& .department-option': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      '& .employee-count': {
        fontSize: '0.75rem',
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.grey[100],
        padding: theme.spacing(0.25, 0.75),
        borderRadius: '12px',
      },
    }),
  },

  // Form loading states
  loading: {
    overlay: (theme: Theme) => ({
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.palette.background.paper + '80',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }),

    skeleton: (theme: Theme) => ({
      '& .MuiSkeleton-root': {
        borderRadius: theme.shape.borderRadius,
      },
    }),
  },
};

// Form validation utilities
export const formValidation = {
  required: 'Este campo é obrigatório',
  email: 'Formato de email inválido',
  phone: 'Formato de telefone inválido',
  minLength: (length: number) => `Mínimo de ${length} caracteres`,
  maxLength: (length: number) => `Máximo de ${length} caracteres`,
  salaryMin: 'Salário deve ser maior que R$ 0',
  dateFormat: 'Formato de data inválido',
  futureDate: 'Data não pode ser no futuro',
  pastDate: 'Data não pode ser no passado',
};