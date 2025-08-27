import React from 'react';
import { Chip, Box, useTheme } from '@mui/material';
import { actionStyles } from '../../../theme/actionStyles';
import { HierarchicalLevel } from '../../../types/employee';

interface StyledChipProps {
  label: string;
  variant?: 'default' | 'status' | 'department' | 'hierarchy';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactElement;
}

interface StatusChipProps {
  status: 'active' | 'inactive' | 'pending';
  label?: string;
  size?: 'small' | 'medium';
}

interface DepartmentChipProps {
  departmentName: string;
  employeeCount?: number;
  size?: 'small' | 'medium';
  onDelete?: () => void;
  onClick?: () => void;
}

interface HierarchyChipProps {
  level: HierarchicalLevel;
  size?: 'small' | 'medium';
  onClick?: () => void;
}

// Main styled chip component
export const StyledChip: React.FC<StyledChipProps> = ({
  label,
  variant = 'default',
  color = 'default',
  size = 'medium',
  onDelete,
  onClick,
  disabled = false,
  icon,
}) => {
  const theme = useTheme();

  const getChipStyles = () => {
    if (variant === 'default') {
      return {
        backgroundColor: color === 'default' 
          ? theme.palette.grey[100] 
          : (theme.palette as any)[color].light + '30',
        color: color === 'default' 
          ? theme.palette.text.primary 
          : (theme.palette as any)[color].main,
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        height: size === 'small' ? 24 : 32,
        '& .MuiChip-label': {
          padding: theme.spacing(0, size === 'small' ? 1 : 1.5),
          fontWeight: 500,
        },
        '& .MuiChip-deleteIcon': {
          color: 'inherit',
          '&:hover': {
            color: theme.palette.text.primary,
          },
        },
      };
    }
    
    return {};
  };

  return (
    <Chip
      label={label}
      size={size}
      onDelete={onDelete}
      onClick={onClick}
      disabled={disabled}
      icon={icon}
      sx={getChipStyles()}
    />
  );
};

// Status chip component
export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  label,
  size = 'medium',
}) => {
  const theme = useTheme();

  const getStatusLabel = () => {
    if (label) return label;
    
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <Chip
      label={getStatusLabel()}
      size={size}
      sx={actionStyles.chipAction.status(theme, status)}
    />
  );
};

// Department chip component
export const DepartmentChip: React.FC<DepartmentChipProps> = ({
  departmentName,
  employeeCount,
  size = 'medium',
  onDelete,
  onClick,
}) => {
  const theme = useTheme();

  const label = employeeCount !== undefined 
    ? `${departmentName} (${employeeCount})`
    : departmentName;

  return (
    <Chip
      label={label}
      size={size}
      onDelete={onDelete}
      onClick={onClick}
      sx={actionStyles.chipAction.department(theme)}
    />
  );
};

// Hierarchical level chip component
export const HierarchyChip: React.FC<HierarchyChipProps> = ({
  level,
  size = 'medium',
  onClick,
}) => {
  const theme = useTheme();

  const getLevelLabel = () => {
    switch (level) {
      case 'junior':
        return 'Júnior';
      case 'mid-level':
        return 'Pleno';
      case 'senior':
        return 'Sênior';
      case 'manager':
        return 'Gerente';
      default:
        return level;
    }
  };

  return (
    <Chip
      label={getLevelLabel()}
      size={size}
      onClick={onClick}
      sx={actionStyles.chipAction.hierarchy(theme, level)}
    />
  );
};

// Specialized chip components
interface FilterChipProps {
  label: string;
  onRemove: () => void;
  count?: number;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, onRemove, count }) => {
  const theme = useTheme();
  
  const displayLabel = count !== undefined ? `${label} (${count})` : label;

  return (
    <Chip
      label={displayLabel}
      onDelete={onRemove}
      variant="outlined"
      sx={{
        backgroundColor: theme.palette.primary.light + '20',
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        '& .MuiChip-label': { fontWeight: 500 },
        '& .MuiChip-deleteIcon': {
          color: theme.palette.primary.main,
          '&:hover': {
            color: theme.palette.primary.dark,
          },
        },
      }}
    />
  );
};

interface TagChipProps {
  label: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'filled' | 'outlined';
}

export const TagChip: React.FC<TagChipProps> = ({ 
  label, 
  color = 'primary', 
  variant = 'filled' 
}) => {
  const theme = useTheme();

  return (
    <Chip
      label={label}
      color={color}
      variant={variant}
      size="small"
      sx={{
        fontWeight: 500,
        '& .MuiChip-label': {
          padding: theme.spacing(0, 1),
        },
      }}
    />
  );
};

// Chip group component for displaying multiple chips
interface ChipGroupProps {
  chips: Array<{
    id: string;
    label: string;
    variant?: 'default' | 'status' | 'department' | 'hierarchy';
    color?: string;
    onDelete?: () => void;
    onClick?: () => void;
  }>;
  maxVisible?: number;
  spacing?: number;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({ 
  chips, 
  maxVisible = 3, 
  spacing = 1 
}) => {
  const theme = useTheme();
  const visibleChips = chips.slice(0, maxVisible);
  const hiddenCount = chips.length - maxVisible;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: theme.spacing(spacing),
      alignItems: 'center',
    }}>
      {visibleChips.map((chip) => (
        <StyledChip
          key={chip.id}
          label={chip.label}
          variant={chip.variant}
          onDelete={chip.onDelete}
          onClick={chip.onClick}
          size="small"
        />
      ))}
      
      {hiddenCount > 0 && (
        <Chip
          label={`+${hiddenCount}`}
          size="small"
          sx={{
            backgroundColor: theme.palette.grey[200],
            color: theme.palette.text.secondary,
            fontSize: '0.75rem',
            height: 24,
          }}
        />
      )}
    </Box>
  );
};

// Salary chip component (specialized for displaying salary ranges or values)
interface SalaryChipProps {
  value: number;
  currency?: string;
  format?: 'compact' | 'full';
  isRange?: boolean;
  rangeMax?: number;
}

export const SalaryChip: React.FC<SalaryChipProps> = ({
  value,
  currency = 'R$',
  format = 'compact',
  isRange = false,
  rangeMax,
}) => {
  const theme = useTheme();

  const formatCurrency = (amount: number) => {
    if (format === 'compact' && amount >= 1000) {
      return `${currency} ${(amount / 1000).toFixed(1)}k`;
    }
    return `${currency} ${amount.toLocaleString('pt-BR')}`;
  };

  const label = isRange && rangeMax 
    ? `${formatCurrency(value)} - ${formatCurrency(rangeMax)}`
    : formatCurrency(value);

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: theme.palette.success.light + '30',
        color: theme.palette.success.main,
        fontSize: '0.75rem',
        fontWeight: 600,
        fontFamily: 'monospace',
        height: 24,
        '& .MuiChip-label': {
          padding: theme.spacing(0, 1),
        },
      }}
    />
  );
};