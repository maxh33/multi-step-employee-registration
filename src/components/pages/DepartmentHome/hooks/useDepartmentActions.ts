import { useState, useCallback } from 'react';
import { Department } from '../../../../types/department';
import { deleteDepartment } from '../../../../services/departments';

interface UseDepartmentActionsProps {
  departments: Department[];
  onRefresh: () => Promise<void>;
  onEdit: (department: Department) => void;
  onError: (error: string) => void;
}

interface UseDepartmentActionsReturn {
  selectedDepartments: Set<string>;
  isDeleteMode: boolean;
  hoveredRowId: string | null;
  menuPosition: { top: number; left: number } | null;
  actionsMenuDepartmentId: string | null;
  setHoveredRowId: (id: string | null) => void;
  setSelectedDepartments: (departments: Set<string>) => void;
  handleCheckboxChange: (departmentId: string, checked: boolean) => void;
  handleActionsMenuClick: (event: React.MouseEvent<HTMLElement>, departmentId: string) => void;
  handleActionsMenuClose: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
  handleCancelDelete: () => void;
  handleConfirmDelete: () => Promise<void>;
  handleRowClick: (department: Department) => void;
}

export function useDepartmentActions({
  departments,
  onRefresh,
  onEdit,
  onError
}: UseDepartmentActionsProps): UseDepartmentActionsReturn {
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [actionsMenuDepartmentId, setActionsMenuDepartmentId] = useState<string | null>(null);

  const handleCheckboxChange = useCallback((departmentId: string, checked: boolean) => {
    const newSelected = new Set(selectedDepartments);
    if (checked) {
      newSelected.add(departmentId);
    } else {
      newSelected.delete(departmentId);
    }
    setSelectedDepartments(newSelected);
  }, [selectedDepartments]);

  const handleActionsMenuClick = useCallback((event: React.MouseEvent<HTMLElement>, departmentId: string) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
    setActionsMenuDepartmentId(departmentId);
  }, []);

  const handleActionsMenuClose = useCallback(() => {
    setMenuPosition(null);
    setActionsMenuDepartmentId(null);
  }, []);

  const handleRowClick = useCallback((department: Department) => {
    if (!isDeleteMode) {
      onEdit(department);
    }
  }, [isDeleteMode, onEdit]);

  const handleEdit = useCallback(() => {
    if (actionsMenuDepartmentId) {
      const department = departments.find(dept => dept.id === actionsMenuDepartmentId);
      if (department) {
        onEdit(department);
      }
    }
    handleActionsMenuClose();
  }, [actionsMenuDepartmentId, departments, onEdit, handleActionsMenuClose]);

  const handleDelete = useCallback(() => {
    setIsDeleteMode(true);
    if (actionsMenuDepartmentId) {
      setSelectedDepartments(new Set([actionsMenuDepartmentId]));
    }
    handleActionsMenuClose();
  }, [actionsMenuDepartmentId, handleActionsMenuClose]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteMode(false);
    setSelectedDepartments(new Set());
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedDepartments.size > 0) {
      try {
        for (const id of Array.from(selectedDepartments)) {
          await deleteDepartment(id);
        }
        await onRefresh();
        setSelectedDepartments(new Set());
        setIsDeleteMode(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir departamentos';
        onError(errorMessage);
      }
    }
  }, [selectedDepartments, onRefresh, onError]);

  return {
    selectedDepartments,
    isDeleteMode,
    hoveredRowId,
    menuPosition,
    actionsMenuDepartmentId,
    setHoveredRowId,
    setSelectedDepartments,
    handleCheckboxChange,
    handleActionsMenuClick,
    handleActionsMenuClose,
    handleEdit,
    handleDelete,
    handleCancelDelete,
    handleConfirmDelete,
    handleRowClick,
  };
}