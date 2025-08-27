import { useState, useMemo, useCallback } from 'react';
import { Employee } from '../../../../types/employee';

interface UseEmployeeSearchProps {
  employees: Employee[];
  departmentFilter?: string;
  getDepartmentName: (departmentId: string) => string;
  getManagerName: (managerId: string) => string;
}

interface UseEmployeeSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredEmployees: Employee[];
  resultCount: number;
  hasActiveSearch: boolean;
  clearSearch: () => void;
}

export function useEmployeeSearch({
  employees,
  departmentFilter,
  getDepartmentName,
  getManagerName,
}: UseEmployeeSearchProps): UseEmployeeSearchReturn {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter employees based on search term and department filter
  const filteredEmployees = useMemo(() => {
    // First filter by department if department filter is active
    let filtered = employees;
    
    if (departmentFilter) {
      filtered = employees.filter(emp => emp.department === departmentFilter);
    }
    
    // Then filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        getDepartmentName(emp.department).toLowerCase().includes(search) ||
        (emp.position && emp.position.toLowerCase().includes(search)) ||
        (emp.hierarchicalLevel && emp.hierarchicalLevel.toLowerCase().includes(search)) ||
        (emp.responsibleManager && getManagerName(emp.responsibleManager).toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [employees, searchTerm, departmentFilter, getDepartmentName, getManagerName]);

  const hasActiveSearch = useMemo(() => {
    return searchTerm.trim() !== '';
  }, [searchTerm]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const resultCount = filteredEmployees.length;

  return {
    searchTerm,
    setSearchTerm,
    filteredEmployees,
    resultCount,
    hasActiveSearch,
    clearSearch,
  };
}