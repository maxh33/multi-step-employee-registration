import { useState, useMemo, useCallback } from 'react';
import { Employee } from '../../../../types/employee';

interface UseEmployeeSelectionProps {
  filteredEmployees: Employee[];
}

interface UseEmployeeSelectionReturn {
  selectedEmployees: Set<string>;
  isDeleteMode: boolean;
  setIsDeleteMode: (mode: boolean) => void;
  showDeleteConfirmation: boolean;
  setShowDeleteConfirmation: (show: boolean) => void;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  handleSelectAll: (checked: boolean) => void;
  toggleEmployeeSelection: (employeeId: string) => void;
  clearSelection: () => void;
  handleBulkDelete: () => void;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
  getSelectedCount: () => number;
}

export function useEmployeeSelection({
  filteredEmployees,
}: UseEmployeeSelectionProps): UseEmployeeSelectionReturn {
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Calculate selection states
  const isAllSelected = useMemo(() => {
    return selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0;
  }, [selectedEmployees.size, filteredEmployees.length]);

  const isPartiallySelected = useMemo(() => {
    return selectedEmployees.size > 0 && selectedEmployees.size < filteredEmployees.length;
  }, [selectedEmployees.size, filteredEmployees.length]);

  // Handle select all checkbox
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allEmployeeIds = new Set(filteredEmployees.map(emp => emp.id));
      setSelectedEmployees(allEmployeeIds);
    } else {
      setSelectedEmployees(new Set());
    }
  }, [filteredEmployees]);

  // Toggle individual employee selection
  const toggleEmployeeSelection = useCallback((employeeId: string) => {
    setSelectedEmployees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  }, []);

  // Clear all selections and exit delete mode
  const clearSelection = useCallback(() => {
    setSelectedEmployees(new Set());
    setIsDeleteMode(false);
    setShowDeleteConfirmation(false);
  }, []);

  // Start bulk delete process
  const handleBulkDelete = useCallback(() => {
    setIsDeleteMode(true);
  }, []);

  // Confirm delete (show confirmation dialog)
  const handleConfirmDelete = useCallback(() => {
    if (selectedEmployees.size > 0) {
      setShowDeleteConfirmation(true);
    }
  }, [selectedEmployees.size]);

  // Cancel delete process
  const handleCancelDelete = useCallback(() => {
    setIsDeleteMode(false);
    setSelectedEmployees(new Set());
    setShowDeleteConfirmation(false);
  }, []);

  // Get count of selected employees
  const getSelectedCount = useCallback(() => {
    return selectedEmployees.size;
  }, [selectedEmployees.size]);

  // Handle direct selection for single employee (from action menu)
  const selectEmployee = useCallback((employeeId: string) => {
    setSelectedEmployees(new Set([employeeId]));
    setIsDeleteMode(true);
  }, []);

  return {
    selectedEmployees,
    isDeleteMode,
    setIsDeleteMode,
    showDeleteConfirmation,
    setShowDeleteConfirmation,
    isAllSelected,
    isPartiallySelected,
    handleSelectAll,
    toggleEmployeeSelection,
    clearSelection,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete,
    getSelectedCount,
    // Additional utility for single employee selection from menu
    selectEmployee,
  } as UseEmployeeSelectionReturn & { selectEmployee: (employeeId: string) => void };
}