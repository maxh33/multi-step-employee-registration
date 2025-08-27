import React from 'react';
import { Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { SecondaryButton, DestructiveButton } from '../../../ui/styled';

interface BulkActionToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

export const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkDelete,
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: (theme) => theme.palette.primary.light + '10',
        border: (theme) => `1px solid ${theme.palette.primary.light}`,
        borderRadius: '8px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 2,
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 500, 
          color: (theme) => theme.palette.primary.main 
        }}
      >
        {selectedCount} colaborador{selectedCount !== 1 ? 'es' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <SecondaryButton
          size="small"
          onClick={onClearSelection}
        >
          Limpar Seleção
        </SecondaryButton>
        
        <DestructiveButton
          size="small"
          startIcon={<DeleteIcon />}
          onClick={onBulkDelete}
        >
          Excluir Selecionados
        </DestructiveButton>
      </Box>
    </Box>
  );
};