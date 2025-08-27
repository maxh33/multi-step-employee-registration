import { useState, useMemo, useCallback } from 'react';
import { Employee, HierarchicalLevel } from '../../types/employee';

export type SortDirection = 'asc' | 'desc';
export type SortableField = keyof Employee | string;

interface SortConfig {
  field: SortableField | null;
  direction: SortDirection;
}

interface UseTableSortingOptions<T> {
  data: T[];
  initialSort?: {
    field: keyof T;
    direction: SortDirection;
  };
  customSortFunctions?: {
    [K in keyof T]?: (a: T[K], b: T[K]) => number;
  };
}

interface UseTableSortingReturn<T> {
  sortedData: T[];
  sortConfig: SortConfig;
  handleSort: (field: keyof T) => void;
  clearSort: () => void;
  setSortConfig: (config: SortConfig) => void;
}

export function useTableSorting<T extends Record<string, any>>({
  data,
  initialSort,
  customSortFunctions = {},
}: UseTableSortingOptions<T>): UseTableSortingReturn<T> {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: initialSort?.field as SortableField || null,
    direction: initialSort?.direction || 'asc',
  });

  // Generic comparison function
  const compareValues = useCallback((a: any, b: any, field: keyof T): number => {
    // Use custom sort function if provided
    if (customSortFunctions[field]) {
      return customSortFunctions[field]!(a[field], b[field]);
    }

    const aValue = a[field];
    const bValue = b[field];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Date comparison
    if (aValue instanceof Date && bValue instanceof Date) {
      return aValue.getTime() - bValue.getTime();
    }

    // String date comparison (ISO format)
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return aDate.getTime() - bDate.getTime();
      }
    }

    // Numeric comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return aValue - bValue;
    }

    // String comparison (case insensitive)
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
    }

    // Boolean comparison
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return aValue === bValue ? 0 : aValue ? -1 : 1;
    }

    // Fallback to string comparison
    return String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
  }, [customSortFunctions]);

  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig.field || data.length === 0) {
      return data;
    }

    return [...data].sort((a, b) => {
      const comparison = compareValues(a, b, sortConfig.field as keyof T);
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [data, sortConfig, compareValues]);

  // Handle sort column click
  const handleSort = useCallback((field: keyof T) => {
    setSortConfig(prevConfig => {
      if (prevConfig.field === field) {
        // Toggle direction if same field
        return {
          field,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      // New field, default to ascending
      return {
        field: field as SortableField,
        direction: 'asc',
      };
    });
  }, []);

  // Clear sort
  const clearSort = useCallback(() => {
    setSortConfig({ field: null, direction: 'asc' });
  }, []);

  return {
    sortedData,
    sortConfig,
    handleSort,
    clearSort,
    setSortConfig,
  };
}

// Specialized hook for employee sorting
export interface UseEmployeeSortingReturn {
  sortedEmployees: Employee[];
  sortField: SortableField | null;
  sortDirection: SortDirection;
  handleSort: (field: keyof Employee) => void;
  getSortIndicator: (field: keyof Employee) => string;
  clearSort: () => void;
}

export function useEmployeeSorting(employees: Employee[]): UseEmployeeSortingReturn {
  const customSortFunctions = useMemo(() => ({
    // Custom sort for hierarchical levels
    hierarchicalLevel: (a: HierarchicalLevel | undefined, b: HierarchicalLevel | undefined) => {
      const levelOrder = { junior: 0, 'mid-level': 1, senior: 2, manager: 3 };
      const aLevel = a ? (levelOrder[a] ?? 999) : 999;
      const bLevel = b ? (levelOrder[b] ?? 999) : 999;
      return aLevel - bLevel;
    },
    
    // Custom sort for salary (handle currency formatting)
    baseSalary: (a: number | undefined, b: number | undefined) => {
      const aVal = a || 0;
      const bVal = b || 0;
      return aVal - bVal;
    },
    
    // Custom sort for dates
    admissionDate: (a: Date | undefined, b: Date | undefined) => {
      if (!a && !b) return 0;
      if (!a) return 1;
      if (!b) return -1;
      const aDate = a instanceof Date ? a : new Date(a);
      const bDate = b instanceof Date ? b : new Date(b);
      return aDate.getTime() - bDate.getTime();
    },
  }), []);

  const result = useTableSorting({
    data: employees,
    initialSort: { field: 'firstName', direction: 'asc' },
    customSortFunctions,
  });

  return {
    sortedEmployees: result.sortedData,
    sortField: result.sortConfig.field,
    sortDirection: result.sortConfig.direction,
    handleSort: result.handleSort,
    getSortIndicator: (field: keyof Employee) => {
      if (result.sortConfig.field !== field) return '↕';
      return result.sortConfig.direction === 'asc' ? '↑' : '↓';
    },
    clearSort: result.clearSort,
  };
}

// Hook for department sorting
export interface Department {
  id: string;
  name: string;
  employeeCount?: number;
  manager?: string;
  createdAt?: string | Date;
}

export function useDepartmentSorting(departments: Department[]) {
  const customSortFunctions = useMemo(() => ({
    employeeCount: (a: number | undefined, b: number | undefined) => (a || 0) - (b || 0),
    createdAt: (a: string | Date | undefined, b: string | Date | undefined) => {
      if (!a && !b) return 0;
      if (!a) return 1;
      if (!b) return -1;
      const aDate = a instanceof Date ? a : new Date(a);
      const bDate = b instanceof Date ? b : new Date(b);
      return aDate.getTime() - bDate.getTime();
    },
  }), []);

  return useTableSorting({
    data: departments,
    initialSort: { field: 'name', direction: 'asc' },
    customSortFunctions,
  });
}

// Multi-column sorting hook
interface MultiSortConfig<T> {
  field: keyof T;
  direction: SortDirection;
}

export function useMultiColumnSorting<T extends Record<string, any>>(
  data: T[],
  sortConfigs: MultiSortConfig<T>[] = []
) {
  const sortedData = useMemo(() => {
    if (sortConfigs.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const config of sortConfigs) {
        const aValue = a[config.field];
        const bValue = b[config.field];

        let comparison = 0;

        // Same comparison logic as single sort
        if (aValue == null && bValue == null) comparison = 0;
        else if (aValue == null) comparison = 1;
        else if (bValue == null) comparison = -1;
        else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        } else {
          comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
        }

        if (comparison !== 0) {
          return config.direction === 'desc' ? -comparison : comparison;
        }
      }
      return 0;
    });
  }, [data, sortConfigs]);

  return sortedData;
}