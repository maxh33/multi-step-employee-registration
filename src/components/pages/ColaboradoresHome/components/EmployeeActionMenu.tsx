import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface EmployeeActionMenuProps {
  anchorPosition: { top: number; left: number } | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const EmployeeActionMenu: React.FC<EmployeeActionMenuProps> = ({
  anchorPosition,
  open,
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition || undefined}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      sx={{
        '& .MuiPaper-root': {
          minWidth: '160px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        },
      }}
    >
      <MenuItem
        onClick={onEdit}
        sx={{
          padding: (theme) => theme.spacing(1.5, 2),
          fontSize: '0.875rem',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: '36px' }}>
          <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
        </ListItemIcon>
        <ListItemText primary="Editar" />
      </MenuItem>

      <Divider sx={{ margin: (theme) => theme.spacing(0.5, 0) }} />

      <MenuItem
        onClick={onDelete}
        sx={{
          padding: (theme) => theme.spacing(1.5, 2),
          fontSize: '0.875rem',
          color: 'error.main',
          '&:hover': {
            backgroundColor: (theme) => theme.palette.error.light + '20',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: '36px' }}>
          <DeleteIcon fontSize="small" sx={{ color: 'inherit' }} />
        </ListItemIcon>
        <ListItemText primary="Excluir" />
      </MenuItem>
    </Menu>
  );
};