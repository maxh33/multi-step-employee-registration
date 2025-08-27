import { Theme } from '@mui/material/styles';

// Reusable action button styling configurations
export const actionStyles = {
  // Primary action button styles
  primaryAction: (theme: Theme) => ({
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    padding: theme.spacing(1.5, 3),
    borderRadius: '8px',
    fontWeight: 500,
    textTransform: 'none' as const,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: '0 2px 8px rgba(0, 200, 81, 0.3)',
    },
    '&:disabled': {
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.grey[500],
    },
  }),

  // Secondary action button styles
  secondaryAction: (theme: Theme) => ({
    backgroundColor: 'transparent',
    color: theme.palette.text.secondary,
    borderColor: theme.palette.grey[300],
    padding: theme.spacing(1.5, 3),
    borderRadius: '8px',
    fontWeight: 500,
    textTransform: 'none' as const,
    border: `1px solid ${theme.palette.grey[300]}`,
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
      borderColor: theme.palette.grey[400],
    },
  }),

  // Destructive action button styles
  destructiveAction: (theme: Theme) => ({
    backgroundColor: theme.palette.error.main,
    color: '#ffffff',
    padding: theme.spacing(1.5, 3),
    borderRadius: '8px',
    fontWeight: 500,
    textTransform: 'none' as const,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
      boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
    },
  }),

  // Icon button variants
  iconButton: {
    // Standard icon button
    standard: (theme: Theme) => ({
      width: 40,
      height: 40,
      padding: theme.spacing(1),
      borderRadius: '8px',
      color: theme.palette.text.secondary,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.text.primary,
      },
    }),

    // Edit action icon button
    edit: (theme: Theme) => ({
      width: 36,
      height: 36,
      padding: theme.spacing(0.75),
      borderRadius: '6px',
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light + '20',
      '&:hover': {
        backgroundColor: theme.palette.primary.light + '40',
      },
    }),

    // Delete action icon button
    delete: (theme: Theme) => ({
      width: 36,
      height: 36,
      padding: theme.spacing(0.75),
      borderRadius: '6px',
      color: theme.palette.error.main,
      backgroundColor: theme.palette.error.light + '20',
      '&:hover': {
        backgroundColor: theme.palette.error.light + '40',
      },
    }),

    // Menu trigger icon button
    menu: (theme: Theme) => ({
      width: 32,
      height: 32,
      padding: theme.spacing(0.5),
      borderRadius: '4px',
      color: theme.palette.text.secondary,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.text.primary,
      },
    }),
  },

  // Chip action styles
  chipAction: {
    // Status chip styles
    status: (theme: Theme, status: 'active' | 'inactive' | 'pending') => {
      const statusColors = {
        active: {
          bg: theme.palette.success.light + '30',
          text: theme.palette.success.main,
        },
        inactive: {
          bg: theme.palette.error.light + '30',
          text: theme.palette.error.main,
        },
        pending: {
          bg: theme.palette.warning.light + '30',
          text: theme.palette.warning.main,
        },
      };

      return {
        backgroundColor: statusColors[status].bg,
        color: statusColors[status].text,
        fontSize: '0.75rem',
        fontWeight: 500,
        borderRadius: '12px',
        height: '24px',
        '& .MuiChip-label': {
          padding: theme.spacing(0, 1),
        },
      };
    },

    // Department chip styles
    department: (theme: Theme) => ({
      backgroundColor: theme.palette.primary.light + '20',
      color: theme.palette.primary.main,
      fontSize: '0.75rem',
      fontWeight: 500,
      borderRadius: '12px',
      height: '24px',
      '& .MuiChip-label': {
        padding: theme.spacing(0, 1),
      },
    }),

    // Hierarchical level chip styles
    hierarchy: (theme: Theme, level: 'junior' | 'mid-level' | 'senior' | 'manager') => {
      const levelColors = {
        junior: {
          bg: theme.palette.info.light + '30',
          text: theme.palette.info.main,
        },
        'mid-level': {
          bg: theme.palette.warning.light + '30',
          text: theme.palette.warning.main,
        },
        senior: {
          bg: theme.palette.primary.light + '30',
          text: theme.palette.primary.main,
        },
        manager: {
          bg: theme.palette.secondary.light + '30',
          text: theme.palette.secondary.main,
        },
      };

      return {
        backgroundColor: levelColors[level].bg,
        color: levelColors[level].text,
        fontSize: '0.75rem',
        fontWeight: 500,
        borderRadius: '12px',
        height: '24px',
        '& .MuiChip-label': {
          padding: theme.spacing(0, 1),
        },
      };
    },
  },

  // Menu action styles
  menuAction: {
    // Context menu container
    container: (theme: Theme) => ({
      minWidth: '160px',
      '& .MuiPaper-root': {
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: `1px solid ${theme.palette.grey[200]}`,
      },
    }),

    // Menu item styles
    item: (theme: Theme, variant: 'default' | 'destructive' = 'default') => ({
      padding: theme.spacing(1.5, 2),
      fontSize: '0.875rem',
      color: variant === 'destructive' 
        ? theme.palette.error.main 
        : theme.palette.text.primary,
      '&:hover': {
        backgroundColor: variant === 'destructive' 
          ? theme.palette.error.light + '20'
          : theme.palette.action.hover,
      },
    }),

    // Menu divider
    divider: (theme: Theme) => ({
      margin: theme.spacing(0.5, 0),
      backgroundColor: theme.palette.grey[200],
    }),
  },

  // Floating action button styles
  fab: {
    // Primary FAB
    primary: (theme: Theme) => ({
      position: 'fixed' as const,
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      backgroundColor: theme.palette.primary.main,
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 200, 81, 0.4)',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: '0 6px 16px rgba(0, 200, 81, 0.5)',
      },
      zIndex: 1000,
    }),

    // Extended FAB with text
    extended: (theme: Theme) => ({
      position: 'fixed' as const,
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      backgroundColor: theme.palette.primary.main,
      color: '#ffffff',
      borderRadius: '24px',
      padding: theme.spacing(1.5, 3),
      boxShadow: '0 4px 12px rgba(0, 200, 81, 0.4)',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: '0 6px 16px rgba(0, 200, 81, 0.5)',
      },
      zIndex: 1000,
      textTransform: 'none' as const,
      fontWeight: 500,
    }),
  },

  // Button group styles
  buttonGroup: {
    // Horizontal button group
    horizontal: (theme: Theme) => ({
      display: 'flex',
      gap: theme.spacing(2),
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column' as const,
        width: '100%',
        '& button': {
          width: '100%',
        },
      },
    }),

    // Compact button group (for table rows)
    compact: (theme: Theme) => ({
      display: 'flex',
      gap: theme.spacing(1),
      alignItems: 'center',
    }),

    // Toolbar button group
    toolbar: (theme: Theme) => ({
      display: 'flex',
      gap: theme.spacing(1),
      alignItems: 'center',
      padding: theme.spacing(1),
      borderRadius: '8px',
      backgroundColor: theme.palette.grey[50],
    }),
  },

  // Loading states for actions
  loading: {
    // Button with loading state
    button: (theme: Theme) => ({
      '&.loading': {
        color: 'transparent',
        pointerEvents: 'none' as const,
        '&::after': {
          content: '""',
          position: 'absolute' as const,
          width: '16px',
          height: '16px',
          border: `2px solid ${theme.palette.common.white}`,
          borderRadius: '50%',
          borderTopColor: 'transparent',
          animation: 'spin 1s linear infinite',
        },
      },
    }),

    // Icon button with loading state
    iconButton: (theme: Theme) => ({
      '&.loading': {
        '& .MuiSvgIcon-root': {
          display: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute' as const,
          width: '16px',
          height: '16px',
          border: `2px solid ${theme.palette.text.secondary}`,
          borderRadius: '50%',
          borderTopColor: 'transparent',
          animation: 'spin 1s linear infinite',
        },
      },
    }),
  },
};

// Action button size variants
export const actionSizes = {
  small: {
    padding: '8px 16px',
    fontSize: '0.875rem',
    height: '32px',
  },
  medium: {
    padding: '12px 24px',
    fontSize: '0.875rem',
    height: '40px',
  },
  large: {
    padding: '16px 32px',
    fontSize: '1rem',
    height: '48px',
  },
};

// CSS keyframes for animations (to be added to theme)
export const actionAnimations = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0, -8px, 0); }
    70% { transform: translate3d(0, -4px, 0); }
    90% { transform: translate3d(0, -2px, 0); }
  }
`;