import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface VerticalStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

const VerticalStepIndicator: React.FC<VerticalStepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3),
        padding: theme.spacing(3, 0),
        minWidth: '200px',
      }}
    >
      {stepTitles.map((title, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(2),
            }}
          >
            {/* Step Circle */}
            <Box
              sx={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 500,
                backgroundColor: isCompleted || isActive 
                  ? theme.palette.primary.main 
                  : theme.palette.grey[200],
                color: isCompleted || isActive 
                  ? '#ffffff' 
                  : theme.palette.grey[600],
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}
            >
              {isCompleted ? (
                <CheckIcon sx={{ fontSize: '16px' }} />
              ) : (
                stepNumber
              )}
            </Box>

            {/* Step Label */}
            <Typography
              variant="body2"
              sx={{
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                color: isActive 
                  ? theme.palette.text.primary 
                  : theme.palette.text.secondary,
                lineHeight: 1.4,
              }}
            >
              {title}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default VerticalStepIndicator;