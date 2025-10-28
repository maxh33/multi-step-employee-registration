import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface DepartmentActionMenuProps {
  anchorPosition: { top: number; left: number } | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const DepartmentActionMenu: React.FC<DepartmentActionMenuProps> = React.memo(({
  anchorPosition,
  onClose,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  return (
    <Menu
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition || undefined}
      open={Boolean(anchorPosition)}
      onClose={onClose}
      PaperProps={{
        sx: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
          minWidth: 160,
          border: `1px solid ${theme.palette.grey[200]}`,
        },
      }}
    >
      <MenuItem
        onClick={onEdit}
        sx={{
          padding: theme.spacing(1.5, 2),
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        }}
      >
        <ListItemIcon>
          <EditIcon
            fontSize="small"
            sx={{
              color: '#1976d2',
              minWidth: '20px',
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary="Editar"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 500,
          }}
        />
      </MenuItem>
      <MenuItem
        onClick={onDelete}
        sx={{
          padding: theme.spacing(1.5, 2),
          '&:hover': {
            backgroundColor: 'rgba(198, 40, 40, 0.08)',
          },
        }}
      >
        <ListItemIcon>
          <DeleteIcon
            fontSize="small"
            sx={{
              color: '#C62828',
              minWidth: '20px',
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary="Excluir"
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#C62828',
          }}
        />
      </MenuItem>
    </Menu>
  );
});

DepartmentActionMenu.displayName = 'DepartmentActionMenu';

export { DepartmentActionMenu };