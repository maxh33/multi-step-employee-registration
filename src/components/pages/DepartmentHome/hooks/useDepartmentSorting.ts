import { useState, useMemo, useCallback } from 'react';
import { Department } from '../../../../types/department';

interface UseDepartmentSortingProps {
  filteredDepartments: Department[];
  employeeCounts: Record<string, number>;
}

interface UseDepartmentSortingReturn {
  sortField: keyof Department | null;
  sortDirection: 'asc' | 'desc';
  sortedDepartments: Department[];
  handleSort: (field: keyof Department) => void;
  getSortIndicator: (field: keyof Department) => string;
  clearSort: () => void;
}

export function useDepartmentSorting({
  filteredDepartments,
  employeeCounts
}: UseDepartmentSortingProps): UseDepartmentSortingReturn {
  const [sortField, setSortField] = useState<keyof Department | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedDepartments = useMemo(() => {
    if (!sortField) return filteredDepartments;

    return [...filteredDepartments].sort((a, b) => {
      let aValue: unknown = a[sortField];
      let bValue: unknown = b[sortField];

      // Handle special sorting cases
      if (sortField === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else if (sortField === 'employeeIds') {
        aValue = employeeCounts[a.id] || 0;
        bValue = employeeCounts[b.id] || 0;
        
        // For numeric sorting
        if (sortDirection === 'asc') {
          return (aValue as number) - (bValue as number);
        } else {
          return (bValue as number) - (aValue as number);
        }
      }

      const aStr = String(aValue || '').toLowerCase();
      const bStr = String(bValue || '').toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredDepartments, sortField, sortDirection, employeeCounts]);

  const handleSort = useCallback((field: keyof Department) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const getSortIndicator = useCallback((field: keyof Department) => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  }, [sortField, sortDirection]);

  const clearSort = useCallback(() => {
    setSortField(null);
    setSortDirection('asc');
  }, []);

  return {
    sortField,
    sortDirection,
    sortedDepartments,
    handleSort,
    getSortIndicator,
    clearSort,
  };
}