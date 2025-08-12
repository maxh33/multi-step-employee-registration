import React from 'react';
import { Box, Typography, Button, Paper, useTheme, Avatar, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Employee } from '../../types/employee';

interface ColaboradoresHomeProps {
  onCreateNew: () => void;
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
}

const ColaboradoresHome: React.FC<ColaboradoresHomeProps> = ({
  onCreateNew,
  employees,
  onEditEmployee,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        maxWidth: '1400px',
        width: '100%',
        padding: theme.spacing(3, 3, 3, 2),
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing(3),
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: '1.75rem',
          }}
        >
          Colaboradores
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
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
          }}
        >
          Novo Colaborador
        </Button>
      </Box>

      {/* Table Header */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: `1px solid ${theme.palette.grey[200]}`,
          overflow: 'hidden',
        }}
      >
        {/* Table Headers */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 100px',
            gap: theme.spacing(2),
            padding: theme.spacing(2, 3),
            backgroundColor: theme.palette.grey[50],
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              fontSize: '14px',
            }}
          >
            Nome ↑
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              fontSize: '14px',
            }}
          >
            Email ↓
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              fontSize: '14px',
            }}
          >
            Departamento ↓
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              fontSize: '14px',
            }}
          >
            Status ↓
          </Typography>
        </Box>

        {/* Employee List or Empty State */}
        {employees.length === 0 ? (
          <Box
            sx={{
              padding: theme.spacing(8, 3),
              textAlign: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: theme.spacing(2),
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Nenhum colaborador encontrado
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginBottom: theme.spacing(3),
                color: theme.palette.text.secondary,
              }}
            >
              Comece adicionando seu primeiro colaborador ao sistema
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onCreateNew}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                fontWeight: 500,
                padding: theme.spacing(1.5, 3),
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: '#ffffff',
                },
              }}
            >
              Adicionar Colaborador
            </Button>
          </Box>
        ) : (
          // Employee Rows
          employees.map((employee, index) => (
            <Box
              key={employee.id}
              onClick={() => onEditEmployee(employee)}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 100px',
                gap: theme.spacing(2),
                padding: theme.spacing(2, 3),
                alignItems: 'center',
                borderBottom:
                  index < employees.length - 1 ? `1px solid ${theme.palette.grey[200]}` : 'none',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.grey[50],
                },
              }}
            >
              {/* Nome Column */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: employee.avatar,
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {employee.firstName.charAt(0)}
                  {employee.lastName.charAt(0)}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                >
                  {employee.firstName} {employee.lastName}
                </Typography>
              </Box>

              {/* Email Column */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: '14px',
                  color: theme.palette.text.secondary,
                }}
              >
                {employee.email}
              </Typography>

              {/* Departamento Column */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: '14px',
                  color: theme.palette.text.secondary,
                }}
              >
                {employee.department}
              </Typography>

              {/* Status Column */}
              <Chip
                label={employee.status}
                size="small"
                sx={{
                  backgroundColor: employee.status === 'Ativo' ? '#E8F5E8' : '#FDE8E8',
                  color: employee.status === 'Ativo' ? '#2E7D32' : '#C62828',
                  fontWeight: 600,
                  fontSize: '12px',
                  height: '24px',
                  borderRadius: '4px', //square/rectangular
                  border: employee.status === 'Ativo' ? '1px solid #A5D6A7' : '1px solid #FFAB91',
                  '& .MuiChip-label': {
                    paddingX: theme.spacing(1),
                    paddingY: theme.spacing(0.25),
                  },
                }}
              />
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
};

export default ColaboradoresHome;
