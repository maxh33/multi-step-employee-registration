import { useState, useMemo, useCallback } from 'react';
import { Department } from '../../../../types/department';

interface UseDepartmentSearchProps {
  departments: Department[];
  managerNames: Record<string, string>;
}

interface UseDepartmentSearchReturn {
  searchTerm: string;
  filteredDepartments: Department[];
  handleSearchChange: (term: string) => void;
  clearSearch: () => void;
}

export function useDepartmentSearch({
  departments,
  managerNames
}: UseDepartmentSearchProps): UseDepartmentSearchReturn {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return departments;

    const search = searchTerm.toLowerCase().trim();
    return departments.filter(dept =>
      dept.name.toLowerCase().includes(search) ||
      (dept.responsibleManagerId && managerNames[dept.responsibleManagerId]?.toLowerCase().includes(search))
    );
  }, [departments, searchTerm, managerNames]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    filteredDepartments,
    handleSearchChange,
    clearSearch,
  };
}