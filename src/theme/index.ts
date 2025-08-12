import { createTheme } from '@mui/material/styles';

// Define color palette based on Figma design
const colors = {
  primary: {
    main: '#00C851',
    light: '#33D677',
    dark: '#00A043',
  },
  secondary: {
    main: '#6c757d',
    light: '#adb5bd',
    dark: '#495057',
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
  },
  // Dashboard specific colors
  sidebar: {
    main: '#ffffff',
    text: '#212529',
    border: '#e9ecef',
  },
  header: {
    main: '#f8f9fa',
    text: '#212529',
  },
  text: {
    primary: '#212529',
    secondary: '#6c757d',
  },
  success: {
    main: '#00C851',
  },
  error: {
    main: '#dc3545',
  },
  warning: {
    main: '#ffc107',
  },
  info: {
    main: '#17a2b8',
  },
  grey: {
    100: '#f8f9fa',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },
};

// Create theme with custom styling
const theme = createTheme({
  palette: colors,
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: colors.text.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.text.primary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: colors.text.primary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: colors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: colors.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
      color: colors.text.secondary,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    // Custom Button styling
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '14px 32px',
          height: '48px',
          fontSize: '1rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: colors.primary.main,
          color: '#ffffff',
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
          '&:disabled': {
            backgroundColor: colors.grey[300],
            color: colors.grey[500],
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          color: colors.text.secondary,
          borderColor: colors.grey[300],
          '&:hover': {
            backgroundColor: colors.grey[100],
            borderColor: colors.grey[400],
          },
        },
      },
    },
    // Custom TextField styling
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            height: '56px',
            '& fieldset': {
              borderColor: colors.grey[300],
            },
            '&:hover fieldset': {
              borderColor: colors.grey[400],
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
              borderWidth: '2px',
            },
            '&.Mui-error fieldset': {
              borderColor: colors.error.main,
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '14px',
            color: colors.text.primary,
            '&.Mui-focused': {
              color: colors.primary.main,
            },
            '&.Mui-error': {
              color: colors.error.main,
            },
          },
          '& .MuiOutlinedInput-input': {
            padding: '16px 14px',
            '&::placeholder': {
              color: colors.text.secondary,
              opacity: 1,
            },
          },
        },
      },
    },
    // Custom Select styling
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: '56px',
        },
      },
    },
    // Custom Paper styling for cards
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
        },
      },
    },
    // Custom Container styling
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
  },
});

export default theme;
