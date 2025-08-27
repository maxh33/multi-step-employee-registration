import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardActions, 
  Typography, 
  Box, 
  Divider,
  IconButton,
  useTheme 
} from '@mui/material';
import { componentStyles } from '../../../theme/components';

interface StyledCardProps {
  children: React.ReactNode;
  elevation?: number;
  variant?: 'default' | 'outlined' | 'elevated';
  hoverable?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  onClick?: () => void;
  sx?: any; // Allow sx prop for additional styling
}

interface StyledCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  avatar?: React.ReactNode;
  showDivider?: boolean;
}

interface StyledCardContentProps {
  children: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

interface StyledCardActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center' | 'between';
  showDivider?: boolean;
}

// Main styled card component
export const StyledCard: React.FC<StyledCardProps> = ({
  children,
  elevation = 0,
  variant = 'default',
  hoverable = false,
  padding = 'medium',
  onClick,
  sx,
}) => {
  const theme = useTheme();

  const getCardStyles = () => {
    const baseStyles = componentStyles.common.card(theme);
    
    const paddingMap = {
      none: 0,
      small: theme.spacing(2),
      medium: theme.spacing(3),
      large: theme.spacing(4),
    };

    const variantStyles = {
      default: {},
      outlined: {
        border: `1px solid ${theme.palette.grey[300]}`,
        boxShadow: 'none',
      },
      elevated: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    };

    return {
      ...baseStyles,
      ...variantStyles[variant],
      padding: paddingMap[padding],
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      ...(hoverable && {
        '&:hover': {
          ...baseStyles['&:hover'],
          transform: 'translateY(-2px)',
        },
      }),
      ...sx, // Apply additional sx prop
    };
  };

  return (
    <Card
      elevation={elevation}
      onClick={onClick}
      sx={getCardStyles()}
    >
      {children}
    </Card>
  );
};

// Styled card header component
export const StyledCardHeader: React.FC<StyledCardHeaderProps> = ({
  title,
  subtitle,
  action,
  avatar,
  showDivider = false,
}) => {
  const theme = useTheme();

  return (
    <>
      <CardHeader
        avatar={avatar}
        action={action}
        title={
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {title}
          </Typography>
        }
        subheader={
          subtitle && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
              {subtitle}
            </Typography>
          )
        }
        sx={{
          padding: theme.spacing(2, 3),
          '& .MuiCardHeader-content': {
            overflow: 'hidden',
          },
        }}
      />
      {showDivider && <Divider />}
    </>
  );
};

// Styled card content component
export const StyledCardContent: React.FC<StyledCardContentProps> = ({
  children,
  padding = 'medium',
}) => {
  const theme = useTheme();

  const paddingMap = {
    none: 0,
    small: theme.spacing(2, 3),
    medium: theme.spacing(3),
    large: theme.spacing(4),
  };

  return (
    <CardContent sx={{ padding: paddingMap[padding] }}>
      {children}
    </CardContent>
  );
};

// Styled card actions component
export const StyledCardActions: React.FC<StyledCardActionsProps> = ({
  children,
  align = 'right',
  showDivider = false,
}) => {
  const theme = useTheme();

  const getJustifyContent = () => {
    switch (align) {
      case 'left':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'between':
        return 'space-between';
      default:
        return 'flex-end';
    }
  };

  return (
    <>
      {showDivider && <Divider />}
      <CardActions 
        sx={{ 
          padding: theme.spacing(2, 3),
          justifyContent: getJustifyContent(),
          gap: theme.spacing(1),
        }}
      >
        {children}
      </CardActions>
    </>
  );
};

// Specialized card components

// Employee card component
interface EmployeeCardProps {
  employee: {
    id: string;
    firstName: string;
    email: string;
    department?: string;
    position?: string;
    hierarchicalLevel?: string;
    avatar?: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  onClick,
}) => {
  const theme = useTheme();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(employee.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(employee.id);
  };

  return (
    <StyledCard 
      variant="outlined" 
      hoverable 
      onClick={onClick ? () => onClick(employee.id) : undefined}
    >
      <StyledCardHeader
        title={employee.firstName}
        subtitle={employee.email}
        action={
          <Box>
            {onEdit && (
              <IconButton size="small" onClick={handleEdit}>
                📝
              </IconButton>
            )}
            {onDelete && (
              <IconButton size="small" onClick={handleDelete}>
                🗑️
              </IconButton>
            )}
          </Box>
        }
      />
      
      <StyledCardContent padding="small">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {employee.department && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              <strong>Departamento:</strong> {employee.department}
            </Typography>
          )}
          {employee.position && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              <strong>Cargo:</strong> {employee.position}
            </Typography>
          )}
          {employee.hierarchicalLevel && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              <strong>Nível:</strong> {employee.hierarchicalLevel}
            </Typography>
          )}
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};

// Department card component
interface DepartmentCardProps {
  department: {
    id: string;
    name: string;
    employeeCount: number;
    manager?: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onEdit,
  onDelete,
  onClick,
}) => {
  const theme = useTheme();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(department.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(department.id);
  };

  return (
    <StyledCard 
      variant="outlined" 
      hoverable 
      onClick={onClick ? () => onClick(department.id) : undefined}
    >
      <StyledCardHeader
        title={department.name}
        subtitle={`${department.employeeCount} colaborador${department.employeeCount !== 1 ? 'es' : ''}`}
        action={
          <Box>
            {onEdit && (
              <IconButton size="small" onClick={handleEdit}>
                📝
              </IconButton>
            )}
            {onDelete && (
              <IconButton size="small" onClick={handleDelete}>
                🗑️
              </IconButton>
            )}
          </Box>
        }
      />
      
      {department.manager && (
        <StyledCardContent padding="small">
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            <strong>Gerente:</strong> {department.manager}
          </Typography>
        </StyledCardContent>
      )}
    </StyledCard>
  );
};

// Statistics card component
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
}) => {
  const theme = useTheme();

  const getColorStyles = () => {
    return {
      backgroundColor: theme.palette[color].light + '10',
      borderTop: `4px solid ${theme.palette[color].main}`,
    };
  };

  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '➡️';
    }
  };

  return (
    <StyledCard variant="outlined" sx={getColorStyles()}>
      <StyledCardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
            {title}
          </Typography>
          {icon && (
            <Box sx={{ color: theme.palette[color].main, fontSize: '1.5rem' }}>
              {icon}
            </Box>
          )}
        </Box>
        
        <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}>
          {value}
        </Typography>
        
        {(subtitle || trend) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {trend && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: getTrendColor(),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 500,
                }}
              >
                {getTrendIcon()} {trend.value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
      </StyledCardContent>
    </StyledCard>
  );
};