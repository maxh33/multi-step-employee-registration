import React from 'react';
import { 
  Button, 
  IconButton, 
  Fab, 
  ButtonGroup,
  CircularProgress,
  Box,
  useTheme 
} from '@mui/material';
import { actionStyles, actionSizes } from '../../../theme/actionStyles';

interface StyledButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

interface StyledIconButtonProps {
  children: React.ReactNode;
  variant?: 'standard' | 'edit' | 'delete' | 'menu';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  'aria-label'?: string;
}

interface StyledFabProps {
  children: React.ReactNode;
  variant?: 'primary' | 'extended';
  text?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

interface StyledButtonGroupProps {
  children: React.ReactNode;
  variant?: 'horizontal' | 'compact' | 'toolbar';
  spacing?: number;
}

// Main styled button component
export const StyledButton: React.FC<StyledButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
}) => {
  const theme = useTheme();

  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return actionStyles.secondaryAction(theme);
      case 'destructive':
        return actionStyles.destructiveAction(theme);
      default:
        return actionStyles.primaryAction(theme);
    }
  };

  const getSizeStyles = () => {
    return actionSizes[size];
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={!loading ? startIcon : undefined}
      endIcon={!loading ? endIcon : undefined}
      type={type}
      sx={{
        ...getButtonStyles(),
        ...getSizeStyles(),
        ...(loading && actionStyles.loading.button(theme)),
        position: 'relative',
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress 
            size={16} 
            sx={{ 
              color: variant === 'secondary' ? theme.palette.text.secondary : '#ffffff' 
            }} 
          />
          {children}
        </Box>
      ) : (
        children
      )}
    </Button>
  );
};

// Styled icon button component
export const StyledIconButton: React.FC<StyledIconButtonProps> = ({
  children,
  variant = 'standard',
  disabled = false,
  loading = false,
  onClick,
  size = 'medium',
  'aria-label': ariaLabel,
}) => {
  const theme = useTheme();

  const getIconButtonStyles = () => {
    return actionStyles.iconButton[variant]?.(theme) || actionStyles.iconButton.standard(theme);
  };

  return (
    <IconButton
      onClick={onClick}
      disabled={disabled || loading}
      size={size}
      aria-label={ariaLabel}
      sx={{
        ...getIconButtonStyles(),
        ...(loading && actionStyles.loading.iconButton(theme)),
        position: 'relative',
      }}
    >
      {loading ? (
        <CircularProgress size={16} sx={{ color: 'inherit' }} />
      ) : (
        children
      )}
    </IconButton>
  );
};

// Styled floating action button component
export const StyledFab: React.FC<StyledFabProps> = ({
  children,
  variant = 'primary',
  text,
  disabled = false,
  loading = false,
  onClick,
}) => {
  const theme = useTheme();

  const getFabStyles = () => {
    if (variant === 'extended' || text) {
      return actionStyles.fab.extended(theme);
    }
    return actionStyles.fab.primary(theme);
  };

  if (variant === 'extended' || text) {
    return (
      <Fab
        variant="extended"
        onClick={onClick}
        disabled={disabled || loading}
        sx={getFabStyles()}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} sx={{ color: '#ffffff' }} />
            {text && text}
          </Box>
        ) : (
          <>
            {children}
            {text && <Box sx={{ ml: 1 }}>{text}</Box>}
          </>
        )}
      </Fab>
    );
  }

  return (
    <Fab
      onClick={onClick}
      disabled={disabled || loading}
      sx={getFabStyles()}
    >
      {loading ? (
        <CircularProgress size={24} sx={{ color: '#ffffff' }} />
      ) : (
        children
      )}
    </Fab>
  );
};

// Styled button group component
export const StyledButtonGroup: React.FC<StyledButtonGroupProps> = ({
  children,
  variant = 'horizontal',
  spacing = 2,
}) => {
  const theme = useTheme();

  const getButtonGroupStyles = () => {
    return actionStyles.buttonGroup[variant]?.(theme) || actionStyles.buttonGroup.horizontal(theme);
  };

  if (variant === 'compact' || variant === 'toolbar') {
    return (
      <Box sx={{ ...getButtonGroupStyles(), gap: theme.spacing(spacing / 2) }}>
        {children}
      </Box>
    );
  }

  return (
    <ButtonGroup
      sx={{
        ...getButtonGroupStyles(),
        '& .MuiButton-root': {
          marginRight: theme.spacing(spacing),
          '&:last-child': {
            marginRight: 0,
          },
        },
      }}
    >
      {children}
    </ButtonGroup>
  );
};

// Quick action button presets
export const PrimaryButton: React.FC<Omit<StyledButtonProps, 'variant'>> = (props) => (
  <StyledButton variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<StyledButtonProps, 'variant'>> = (props) => (
  <StyledButton variant="secondary" {...props} />
);

export const DestructiveButton: React.FC<Omit<StyledButtonProps, 'variant'>> = (props) => (
  <StyledButton variant="destructive" {...props} />
);

export const EditIconButton: React.FC<Omit<StyledIconButtonProps, 'variant'>> = (props) => (
  <StyledIconButton variant="edit" aria-label="Editar" {...props} />
);

export const DeleteIconButton: React.FC<Omit<StyledIconButtonProps, 'variant'>> = (props) => (
  <StyledIconButton variant="delete" aria-label="Excluir" {...props} />
);

export const MenuIconButton: React.FC<Omit<StyledIconButtonProps, 'variant'>> = (props) => (
  <StyledIconButton variant="menu" aria-label="Menu" {...props} />
);

// Specialized button components
interface SaveButtonProps extends Omit<StyledButtonProps, 'variant' | 'children'> {
  isSaving?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ isSaving = false, ...props }) => (
  <StyledButton variant="primary" loading={isSaving} {...props}>
    {isSaving ? 'Salvando...' : 'Salvar'}
  </StyledButton>
);

interface CancelButtonProps extends Omit<StyledButtonProps, 'variant' | 'children'> {}

export const CancelButton: React.FC<CancelButtonProps> = (props) => (
  <StyledButton variant="secondary" {...props}>
    Cancelar
  </StyledButton>
);

interface SubmitButtonProps extends Omit<StyledButtonProps, 'variant' | 'type' | 'children'> {
  isSubmitting?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting = false, ...props }) => (
  <StyledButton variant="primary" type="submit" loading={isSubmitting} {...props}>
    {isSubmitting ? 'Enviando...' : 'Enviar'}
  </StyledButton>
);

interface DeleteButtonProps extends Omit<StyledButtonProps, 'variant' | 'children'> {
  isDeleting?: boolean;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ isDeleting = false, ...props }) => (
  <StyledButton variant="destructive" loading={isDeleting} {...props}>
    {isDeleting ? 'Excluindo...' : 'Excluir'}
  </StyledButton>
);