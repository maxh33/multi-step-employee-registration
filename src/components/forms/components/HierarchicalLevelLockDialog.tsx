import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
} from '@mui/material';

interface HierarchicalLevelLockDialogProps {
  open: boolean;
  onClose: () => void;
  hasSubordinates: boolean;
}

const HierarchicalLevelLockDialog: React.FC<HierarchicalLevelLockDialogProps> = React.memo(({
  open,
  onClose,
  hasSubordinates,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="lock-dialog-title"
      aria-describedby="lock-dialog-description"
    >
      <DialogTitle id="lock-dialog-title">
        Nível Hierárquico Bloqueado
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="lock-dialog-description">
          Este gerente possui subordinados ativos. Transfira os subordinados para outro gerente antes de alterar o nível hierárquico.
        </DialogContentText>
        {hasSubordinates && (
          <DialogContentText sx={{ mt: 2, fontWeight: 500 }}>
            Para alterar o nível hierárquico:
          </DialogContentText>
        )}
        <Box component="ul" sx={{ mt: 1, pl: 2 }}>
          <li>Acesse a lista de colaboradores</li>
          <li>Encontre os subordinados deste gerente</li>
          <li>Atribua um novo gerente responsável a cada subordinado</li>
          <li>Retorne a este formulário para alterar o nível hierárquico</li>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Entendi
        </Button>
      </DialogActions>
    </Dialog>
  );
});

HierarchicalLevelLockDialog.displayName = 'HierarchicalLevelLockDialog';

export { HierarchicalLevelLockDialog };