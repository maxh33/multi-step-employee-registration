import { useState, useCallback } from 'react';
import { AlertColor } from '@mui/material';

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface ToastActions {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  hideToast: () => void;
}

export const useToast = (): [ToastState, ToastActions] => {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showToast = useCallback((message: string, severity: AlertColor) => {
    setToast({
      open: true,
      message,
      severity,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, open: false }));
  }, []);

  const actions: ToastActions = {
    showSuccess: useCallback((message: string) => showToast(message, 'success'), [showToast]),
    showError: useCallback((message: string) => showToast(message, 'error'), [showToast]),
    showWarning: useCallback((message: string) => showToast(message, 'warning'), [showToast]),
    showInfo: useCallback((message: string) => showToast(message, 'info'), [showToast]),
    hideToast,
  };

  return [toast, actions];
};