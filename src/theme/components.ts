import { Theme } from '@mui/material/styles';
import { tableStyles } from './tableStyles';
import { formStyles } from './formStyles';
import { actionStyles, actionAnimations } from './actionStyles';
import { gridTemplates, responsiveSpacing, responsiveTypography } from './responsiveHelpers';

// Consolidated component-specific theme overrides
export const componentStyles = {
  // Table-related components
  table: tableStyles,
  
  // Form-related components
  form: formStyles,
  
  // Action-related components
  action: actionStyles,
  
  // Grid templates
  grid: gridTemplates,
  
  // Responsive utilities
  responsive: {
    spacing: responsiveSpacing,
    typography: responsiveTypography,
  },

  // Common component patterns
  common: {
    // Card component styles
    card: (theme: Theme) => ({
      borderRadius: '12px',
      padding: theme.spacing(3),
      border: `1px solid ${theme.palette.grey[200]}`,
      backgroundColor: theme.palette.background.paper,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    }),

    // Dialog styles
    dialog: (theme: Theme) => ({
      '& .MuiDialog-paper': {
        borderRadius: '16px',
        padding: 0,
        overflow: 'visible',
        maxWidth: '600px',
        width: '90vw',
      },
      '& .MuiDialogTitle-root': {
        padding: theme.spacing(3, 3, 2, 3),
        fontSize: '1.5rem',
        fontWeight: 600,
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
      },
      '& .MuiDialogContent-root': {
        padding: theme.spacing(3),
      },
      '& .MuiDialogActions-root': {
        padding: theme.spacing(2, 3, 3, 3),
        borderTop: `1px solid ${theme.palette.grey[200]}`,
        gap: theme.spacing(2),
      },
    }),

    // Sidebar styles
    sidebar: (theme: Theme) => ({
      width: '320px',
      backgroundColor: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.grey[200]}`,
      height: '100vh',
      position: 'fixed' as const,
      left: 0,
      top: 0,
      zIndex: 1100,
      [theme.breakpoints.down('lg')]: {
        width: '280px',
      },
      [theme.breakpoints.down('md')]: {
        transform: 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        '&.open': {
          transform: 'translateX(0)',
        },
      },
    }),

    // Header styles
    header: (theme: Theme) => ({
      height: '80px',
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 3),
      position: 'fixed' as const,
      top: 0,
      left: '320px',
      right: 0,
      zIndex: 1000,
      [theme.breakpoints.down('lg')]: {
        left: '280px',
      },
      [theme.breakpoints.down('md')]: {
        left: 0,
      },
    }),

    // Main content area styles
    main: (theme: Theme) => ({
      marginLeft: '320px',
      marginTop: '80px',
      padding: theme.spacing(3),
      minHeight: 'calc(100vh - 80px)',
      [theme.breakpoints.down('lg')]: {
        marginLeft: '280px',
      },
      [theme.breakpoints.down('md')]: {
        marginLeft: 0,
        padding: theme.spacing(2),
      },
    }),

    // Loading overlay styles
    loadingOverlay: (theme: Theme) => ({
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.palette.background.paper + 'CC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)',
    }),

    // Search bar styles
    searchBar: (theme: Theme) => ({
      width: '100%',
      maxWidth: '400px',
      '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.grey[50],
        '&:hover': {
          backgroundColor: theme.palette.background.paper,
        },
        '&.Mui-focused': {
          backgroundColor: theme.palette.background.paper,
        },
      },
      '& .MuiInputAdornment-root': {
        color: theme.palette.text.secondary,
      },
    }),

    // Status indicator styles
    statusIndicator: (theme: Theme, status: 'online' | 'offline' | 'busy') => {
      const statusColors = {
        online: theme.palette.success.main,
        offline: theme.palette.grey[400],
        busy: theme.palette.warning.main,
      };

      return {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: statusColors[status],
        border: `2px solid ${theme.palette.background.paper}`,
        position: 'absolute' as const,
        bottom: 0,
        right: 0,
      };
    },

    // Skeleton loading styles
    skeleton: (theme: Theme) => ({
      '& .MuiSkeleton-root': {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.grey[100],
      },
      '& .MuiSkeleton-wave': {
        '&::after': {
          background: `linear-gradient(90deg, transparent, ${theme.palette.grey[200]}, transparent)`,
        },
      },
    }),
  },

  // Animation classes
  animations: {
    fadeIn: {
      animation: 'fadeIn 0.3s ease-in-out',
    },
    slideUp: {
      animation: 'slideUp 0.3s ease-out',
    },
    scaleIn: {
      animation: 'scaleIn 0.2s ease-out',
    },
  },
};

// CSS animations to inject into the theme
export const componentAnimations = actionAnimations + `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
`;

// Export individual style categories for tree-shaking
export { tableStyles } from './tableStyles';
export { formStyles } from './formStyles';
export { actionStyles } from './actionStyles';
export { gridTemplates, responsiveSpacing, responsiveTypography, useResponsiveGrid, useResponsiveValue, createResponsiveStyles } from './responsiveHelpers';