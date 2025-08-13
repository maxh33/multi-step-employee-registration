import React from 'react';
import { Box, Container, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';

interface FormContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  subtitle,
  maxWidth = 'sm',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.grey[50],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2, 0),
      }}
    >
      <Container maxWidth={maxWidth} sx={{ width: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            padding: isMobile ? theme.spacing(3) : theme.spacing(4, 5),
            borderRadius: '16px',
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${theme.palette.grey[200]}`,
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          {/* Header Section */}
          {(title || subtitle) && (
            <Box
              sx={{
                textAlign: 'center',
                marginBottom: theme.spacing(4),
              }}
            >
              {/* Logo Section */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing(3),
                }}
              >
                <img
                  src="/favicon.svg"
                  alt="Max Logo"
                  style={{
                    height: '32px',
                    width: 'auto',
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    marginLeft: theme.spacing(2),
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  Max
                </Typography>
              </Box>

              {title && (
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    marginBottom: subtitle ? theme.spacing(1) : 0,
                    fontSize: isMobile ? '1.75rem' : '2rem',
                  }}
                >
                  {title}
                </Typography>
              )}

              {subtitle && (
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '1.125rem',
                    lineHeight: 1.5,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}

          {/* Content Section */}
          <Box
            sx={{
              width: '100%',
            }}
          >
            {children}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default FormContainer;
