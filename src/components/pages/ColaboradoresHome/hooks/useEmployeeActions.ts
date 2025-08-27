import { useState, useCallback, useEffect } from 'react';
import { Employee } from '../../../../types/employee';
import { getAllDepartments } from '../../../../services/departments';
import { getEmployeeName } from '../../../../services/firebase';

interface UseEmployeeActionsProps {
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployees: (employeeIds: string[]) => void;
}

interface UseEmployeeActionsReturn {
  // Actions menu state
  menuPosition: { top: number; left: number } | null;
  actionsMenuEmployeeId: string | null;
  handleActionsMenuClick: (event: React.MouseEvent<HTMLElement>, employeeId: string) => void;
  handleActionsMenuClose: () => void;
  
  // Individual actions
  handleEdit: () => void;
  handleDelete: () => void;
  
  // Delete confirmation
  handleActualDelete: (selectedEmployeeIds: string[]) => void;
  handleCancelConfirmation: () => void;
  
  // Data utilities
  departmentNames: Record<string, string>;
  managerNames: Record<string, string>;
  getDepartmentName: (departmentId: string) => string;
  getManagerName: (managerId: string) => string;
  showSalaries: boolean;
  toggleSalaryVisibility: () => void;
  
  // Utility formatters
  formatSalary: (salary?: number) => string;
  formatAdmissionDate: (date?: Date | string) => string;
  getHierarchicalLevelColor: (level?: string) => string;
  getHierarchicalLevelTextColor: (level?: string) => string;
}

export function useEmployeeActions({
  employees,
  onEditEmployee,
  onDeleteEmployees,
}: UseEmployeeActionsProps): UseEmployeeActionsReturn {
  // Actions menu state
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [actionsMenuEmployeeId, setActionsMenuEmployeeId] = useState<string | null>(null);
  
  // Data caching
  const [departmentNames, setDepartmentNames] = useState<Record<string, string>>({});
  const [managerNames, setManagerNames] = useState<Record<string, string>>({});
  
  // UI state
  const [showSalaries, setShowSalaries] = useState(false);

  // Fetch department names and manager names on component mount
  useEffect(() => {
    const fetchNames = async () => {
      try {
        // Fetch department names
        const departments = await getAllDepartments();
        const deptNamesMap: Record<string, string> = {};
        departments.forEach(dept => {
          deptNamesMap[dept.id] = dept.name;
        });
        setDepartmentNames(deptNamesMap);
        
        // Fetch manager names for employees that have managers
        const managerNamesMap: Record<string, string> = {};
        await Promise.all(
          employees.map(async (employee) => {
            if (employee.responsibleManager) {
              try {
                const managerName = await getEmployeeName(employee.responsibleManager);
                if (managerName) {
                  managerNamesMap[employee.responsibleManager] = managerName;
                }
              } catch (error) {
                console.error(`Error fetching manager name for ${employee.responsibleManager}:`, error);
              }
            }
          })
        );
        setManagerNames(managerNamesMap);
      } catch (error) {
        console.error('Error fetching names:', error);
      }
    };

    fetchNames();
  }, [employees]);

  // Actions menu handlers
  const handleActionsMenuClick = useCallback((event: React.MouseEvent<HTMLElement>, employeeId: string) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
    setActionsMenuEmployeeId(employeeId);
  }, []);

  const handleActionsMenuClose = useCallback(() => {
    setMenuPosition(null);
    setActionsMenuEmployeeId(null);
  }, []);

  const handleEdit = useCallback(() => {
    if (actionsMenuEmployeeId) {
      const employee = employees.find((emp) => emp.id === actionsMenuEmployeeId);
      if (employee) {
        onEditEmployee(employee);
      }
    }
    handleActionsMenuClose();
  }, [actionsMenuEmployeeId, employees, onEditEmployee, handleActionsMenuClose]);

  const handleDelete = useCallback(() => {
    // This will trigger the selection mode with this employee selected
    // The actual deletion logic is handled by the parent component
    handleActionsMenuClose();
    return actionsMenuEmployeeId; // Return the employee ID for parent to handle
  }, [actionsMenuEmployeeId, handleActionsMenuClose]);

  const handleActualDelete = useCallback((selectedEmployeeIds: string[]) => {
    if (selectedEmployeeIds.length > 0) {
      onDeleteEmployees(selectedEmployeeIds);
    }
  }, [onDeleteEmployees]);

  const handleCancelConfirmation = useCallback(() => {
    // This is handled by the parent component's selection hook
  }, []);

  // Utility functions
  const getDepartmentName = useCallback((departmentId: string): string => {
    return departmentNames[departmentId] || departmentId || 'Não definido';
  }, [departmentNames]);

  const getManagerName = useCallback((managerId: string): string => {
    return managerNames[managerId] || 'Carregando...';
  }, [managerNames]);

  const toggleSalaryVisibility = useCallback(() => {
    setShowSalaries(prev => !prev);
  }, []);

  // Utility formatters
  const formatSalary = useCallback((salary?: number): string => {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(salary);
  }, []);

  const formatAdmissionDate = useCallback((date?: Date | string): string => {
    if (!date) return 'N/A';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  }, []);

  const getHierarchicalLevelColor = useCallback((level?: string): string => {
    switch (level) {
      case 'junior': return '#E3F2FD';
      case 'mid-level': return '#E8F5E8';
      case 'senior': return '#FFF3E0';
      case 'manager': return '#F3E5F5';
      default: return '#F5F5F5';
    }
  }, []);

  const getHierarchicalLevelTextColor = useCallback((level?: string): string => {
    switch (level) {
      case 'junior': return '#1976D2';
      case 'mid-level': return '#2E7D32';
      case 'senior': return '#F57C00';
      case 'manager': return '#7B1FA2';
      default: return '#666';
    }
  }, []);

  return {
    // Actions menu state
    menuPosition,
    actionsMenuEmployeeId,
    handleActionsMenuClick,
    handleActionsMenuClose,
    
    // Individual actions
    handleEdit,
    handleDelete,
    
    // Delete confirmation
    handleActualDelete,
    handleCancelConfirmation,
    
    // Data utilities
    departmentNames,
    managerNames,
    getDepartmentName,
    getManagerName,
    showSalaries,
    toggleSalaryVisibility,
    
    // Utility formatters
    formatSalary,
    formatAdmissionDate,
    getHierarchicalLevelColor,
    getHierarchicalLevelTextColor,
  };
}