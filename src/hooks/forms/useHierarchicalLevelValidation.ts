import { useState, useEffect, useCallback } from 'react';
import { checkManagerHasSubordinates } from '../../services/firebase';

interface UseHierarchicalLevelValidationProps {
  employeeId?: string;
  currentHierarchicalLevel?: string;
}

interface UseHierarchicalLevelValidationReturn {
  hasSubordinates: boolean;
  checkingSubordinates: boolean;
  hierarchicalLevelLockedBySubordinates: boolean;
  showLockDialog: boolean;
  setShowLockDialog: (show: boolean) => void;
  handleLockedHierarchicalLevelClick: () => void;
  handleCloseLockDialog: () => void;
}

export function useHierarchicalLevelValidation({
  employeeId,
  currentHierarchicalLevel
}: UseHierarchicalLevelValidationProps): UseHierarchicalLevelValidationReturn {
  const [hasSubordinates, setHasSubordinates] = useState(false);
  const [checkingSubordinates, setCheckingSubordinates] = useState(false);
  const [hierarchicalLevelLockedBySubordinates, setHierarchicalLevelLockedBySubordinates] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);

  // Check if current manager has subordinates (for edit mode)
  useEffect(() => {
    const checkSubordinates = async () => {
      if (employeeId && currentHierarchicalLevel === 'manager') {
        try {
          setCheckingSubordinates(true);
          const subordinatesExist = await checkManagerHasSubordinates(employeeId);
          setHasSubordinates(subordinatesExist);
          setHierarchicalLevelLockedBySubordinates(subordinatesExist);
        } catch (error) {
          console.error('Error checking manager subordinates:', error);
          setHasSubordinates(false);
          setHierarchicalLevelLockedBySubordinates(false);
        } finally {
          setCheckingSubordinates(false);
        }
      } else {
        setHasSubordinates(false);
        setHierarchicalLevelLockedBySubordinates(false);
      }
    };

    checkSubordinates();
  }, [employeeId, currentHierarchicalLevel]);

  const handleLockedHierarchicalLevelClick = useCallback(() => {
    if (hierarchicalLevelLockedBySubordinates) {
      setShowLockDialog(true);
    }
  }, [hierarchicalLevelLockedBySubordinates]);

  const handleCloseLockDialog = useCallback(() => {
    setShowLockDialog(false);
  }, []);

  return {
    hasSubordinates,
    checkingSubordinates,
    hierarchicalLevelLockedBySubordinates,
    showLockDialog,
    setShowLockDialog,
    handleLockedHierarchicalLevelClick,
    handleCloseLockDialog,
  };
}