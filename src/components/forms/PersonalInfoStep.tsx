import React from 'react';
import { Box, TextField, Typography, Switch, FormControlLabel, useTheme } from '@mui/material';
import { PersonalInfo } from '../../types/employee';

interface PersonalInfoStepProps {
  data: Partial<PersonalInfo>;
  errors: Record<string, string>;
  onChange: (data: Partial<PersonalInfo>) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();

  const handleFieldChange =
    (field: keyof PersonalInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      onChange({
        ...data,
        [field]: value,
      });
    };

  const getFieldError = (field: string) => {
    return errors[`personalInfo.${field}`] || '';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3),
        maxWidth: '500px',
      }}
    >
      {/* Nome Field */}
      <Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            marginBottom: theme.spacing(1),
            color: theme.palette.text.primary,
            fontSize: '14px',
          }}
        >
          Nome
        </Typography>
        <TextField
          fullWidth
          value={data.firstName || ''}
          onChange={handleFieldChange('firstName')}
          placeholder="João da Silva"
          error={!!getFieldError('firstName')}
          helperText={getFieldError('firstName')}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              '& fieldset': {
                borderColor: theme.palette.grey[300],
              },
              '&:hover fieldset': {
                borderColor: theme.palette.grey[400],
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
              '&.Mui-error fieldset': {
                borderColor: theme.palette.error.main,
              },
            },
            '& .MuiInputBase-input': {
              padding: theme.spacing(1.5, 1.5),
              fontSize: '14px',
              color: theme.palette.text.primary,
              '&::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 1,
              },
            },
          }}
        />
      </Box>

      {/* E-mail Field */}
      <Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            marginBottom: theme.spacing(1),
            color: theme.palette.text.primary,
            fontSize: '14px',
          }}
        >
          E-mail
        </Typography>
        <TextField
          fullWidth
          type="email"
          value={data.email || ''}
          onChange={handleFieldChange('email')}
          placeholder="e.g. john@gmail.com"
          error={!!getFieldError('email')}
          helperText={getFieldError('email')}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              '& fieldset': {
                borderColor: theme.palette.grey[300],
              },
              '&:hover fieldset': {
                borderColor: theme.palette.grey[400],
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
              '&.Mui-error fieldset': {
                borderColor: theme.palette.error.main,
              },
            },
            '& .MuiInputBase-input': {
              padding: theme.spacing(1.5, 1.5),
              fontSize: '14px',
              color: theme.palette.text.primary,
              '&::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 1,
              },
            },
          }}
        />
      </Box>

      {/* Alterar ao criar Toggle */}
      <Box
        sx={{
          marginTop: theme.spacing(2),
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={data.activateOnCreate || false}
              onChange={handleFieldChange('activateOnCreate')}
              sx={{
                '& .MuiSwitch-switchBase': {
                  '&.Mui-checked': {
                    color: theme.palette.primary.main,
                    '& + .MuiSwitch-track': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                },
                '& .MuiSwitch-track': {
                  backgroundColor: theme.palette.grey[300],
                },
              }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{
                fontSize: '14px',
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            >
              Ativar ao criar
            </Typography>
          }
          sx={{
            marginLeft: 0,
            '& .MuiFormControlLabel-label': {
              marginLeft: theme.spacing(1),
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PersonalInfoStep;
