import { useState, useMemo, useCallback } from 'react';
import { Employee } from '../../../../types/employee';

type SortDirection = 'asc' | 'desc';
type SortField = keyof Employee | null;

interface UseEmployeeSortingProps {
  filteredEmployees: Employee[];
  getDepartmentName: (departmentId: string) => string;
  getManagerName: (managerId: string) => string;
}

interface UseEmployeeSortingReturn {
  sortField: SortField;
  sortDirection: SortDirection;
  sortedEmployees: Employee[];
  handleSort: (field: keyof Employee) => void;
  getSortIndicator: (field: keyof Employee) => string;
  clearSort: () => void;
}

export function useEmployeeSorting({
  filteredEmployees,
  getDepartmentName,
  getManagerName,
}: UseEmployeeSortingProps): UseEmployeeSortingReturn {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Sort employees based on current sort configuration
  const sortedEmployees = useMemo(() => {
    if (!sortField) return filteredEmployees;

    return [...filteredEmployees].sort((a, b) => {
      let aValue: unknown = a[sortField];
      let bValue: unknown = b[sortField];

      // Handle special sorting cases
      switch (sortField) {
        case 'firstName':
        case 'email':
        case 'position': {
          // Alphabetical sorting A-Z
          const aStr = String(aValue || '').toLowerCase();
          const bStr = String(bValue || '').toLowerCase();
          return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
        }

        case 'department': {
          // Sort by department name (resolved from ID)
          const aDeptName = getDepartmentName(a.department).toLowerCase();
          const bDeptName = getDepartmentName(b.department).toLowerCase();
          return sortDirection === 'asc' ? aDeptName.localeCompare(bDeptName) : bDeptName.localeCompare(aDeptName);
        }

        case 'hierarchicalLevel': {
          // Custom hierarchical ordering: Junior > Mid-level > Senior > Manager
          const levelOrder = { 'junior': 1, 'mid-level': 2, 'senior': 3, 'manager': 4 };
          const aLevel = levelOrder[a.hierarchicalLevel as keyof typeof levelOrder] || 0;
          const bLevel = levelOrder[b.hierarchicalLevel as keyof typeof levelOrder] || 0;
          return sortDirection === 'asc' ? aLevel - bLevel : bLevel - aLevel;
        }

        case 'responsibleManager': {
          // Sort by manager name (resolved from ID)
          const aManagerName = getManagerName(a.responsibleManager || '').toLowerCase();
          const bManagerName = getManagerName(b.responsibleManager || '').toLowerCase();
          return sortDirection === 'asc' ? aManagerName.localeCompare(bManagerName) : bManagerName.localeCompare(aManagerName);
        }

        case 'baseSalary': {
          // Numeric sorting by salary amount
          const aSalary = a.baseSalary || 0;
          const bSalary = b.baseSalary || 0;
          return sortDirection === 'asc' ? aSalary - bSalary : bSalary - aSalary;
        }

        case 'admissionDate': {
          // Chronological date sorting (handle missing dates)
          const aDate = a.admissionDate ? new Date(a.admissionDate).getTime() : 0;
          const bDate = b.admissionDate ? new Date(b.admissionDate).getTime() : 0;
          return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
        }

        default: {
          // Default string comparison for any other fields
          const aStr = String(aValue || '').toLowerCase();
          const bStr = String(bValue || '').toLowerCase();
          return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
        }
      }
    });
  }, [filteredEmployees, sortField, sortDirection, getDepartmentName, getManagerName]);

  // Handle column header click for sorting
  const handleSort = useCallback((field: keyof Employee) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, start with ascending
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  // Get sort indicator for column headers
  const getSortIndicator = useCallback((field: keyof Employee): string => {
    if (sortField !== field) return '↕'; // No sort
    return sortDirection === 'asc' ? '↑' : '↓';
  }, [sortField, sortDirection]);

  // Clear sort
  const clearSort = useCallback(() => {
    setSortField(null);
    setSortDirection('asc');
  }, []);

  return {
    sortField,
    sortDirection,
    sortedEmployees,
    handleSort,
    getSortIndicator,
    clearSort,
  };
}