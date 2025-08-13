import React from 'react';
import { Box, Typography, useTheme, LinearProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, stepTitles }) => {
  const theme = useTheme();

  // Calculate progress percentage
  const progressPercentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <Box
      sx={{
        width: '100%',
        padding: theme.spacing(0, 0, 3, 0),
        marginBottom: theme.spacing(2),
      }}
    >
      {/* Progress Bar with Percentage */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing(3),
        }}
      >
        {/* Progress Bar */}
        <Box sx={{ width: '100%', mr: 2 }}>
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

        {/* Percentage */}
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

      {/* Step Indicators */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
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
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                flex: 1,
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
                  backgroundColor:
                    isCompleted || isActive ? theme.palette.primary.main : theme.palette.grey[200],
                  color: isCompleted || isActive ? '#ffffff' : theme.palette.grey[600],
                  marginBottom: theme.spacing(1),
                  transition: 'all 0.3s ease',
                  zIndex: 2,
                }}
              >
                {isCompleted ? <CheckIcon sx={{ fontSize: '16px' }} /> : stepNumber}
              </Box>

              {/* Step Label */}
              <Typography
                variant="caption"
                sx={{
                  fontSize: '12px',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  maxWidth: '120px',
                }}
              >
                {title}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default StepIndicator;
