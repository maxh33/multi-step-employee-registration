import { useState, useMemo, useCallback, useEffect } from 'react';
import { Employee } from '../../types/employee';

export interface SearchConfig {
  searchTerm: string;
  searchFields: string[];
  caseSensitive?: boolean;
  exactMatch?: boolean;
  debounceMs?: number;
}

export interface FilterConfig<T> {
  field: keyof T;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between';
}

interface UseSearchFilterOptions<T> {
  data: T[];
  searchConfig?: Partial<SearchConfig>;
  initialFilters?: FilterConfig<T>[];
}

interface UseSearchFilterReturn<T> {
  filteredData: T[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterConfig<T>[];
  addFilter: (filter: FilterConfig<T>) => void;
  removeFilter: (field: keyof T) => void;
  clearFilters: () => void;
  clearAll: () => void;
  resultCount: number;
  hasActiveFilters: boolean;
}

export function useSearchFilter<T extends Record<string, any>>({
  data,
  searchConfig = {},
  initialFilters = [],
}: UseSearchFilterOptions<T>): UseSearchFilterReturn<T> {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterConfig<T>[]>(initialFilters);

  const {
    searchFields = ['name', 'firstName', 'email'],
    caseSensitive = false,
    exactMatch = false,
    debounceMs = 300,
  } = searchConfig;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Apply search filter
  const searchFilteredData = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return data;

    return data.filter(item => {
      return searchFields.some(field => {
        const fieldValue = item[field];
        if (fieldValue == null) return false;

        const searchValue = caseSensitive 
          ? String(fieldValue) 
          : String(fieldValue).toLowerCase();
        
        const term = caseSensitive 
          ? debouncedSearchTerm 
          : debouncedSearchTerm.toLowerCase();

        if (exactMatch) {
          return searchValue === term;
        }

        return searchValue.includes(term);
      });
    });
  }, [data, debouncedSearchTerm, searchFields, caseSensitive, exactMatch]);

  // Apply additional filters
  const filteredData = useMemo(() => {
    if (filters.length === 0) return searchFilteredData;

    return searchFilteredData.filter(item => {
      return filters.every(filter => {
        const fieldValue = item[filter.field];
        const filterValue = filter.value;
        const operator = filter.operator || 'equals';

        switch (operator) {
          case 'equals':
            return fieldValue === filterValue;
          
          case 'contains':
            return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
          
          case 'startsWith':
            return String(fieldValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
          
          case 'endsWith':
            return String(fieldValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
          
          case 'gt':
            return Number(fieldValue) > Number(filterValue);
          
          case 'lt':
            return Number(fieldValue) < Number(filterValue);
          
          case 'gte':
            return Number(fieldValue) >= Number(filterValue);
          
          case 'lte':
            return Number(fieldValue) <= Number(filterValue);
          
          case 'in':
            return Array.isArray(filterValue) && filterValue.includes(fieldValue);
          
          case 'between':
            if (Array.isArray(filterValue) && filterValue.length === 2) {
              const numValue = Number(fieldValue);
              return numValue >= Number(filterValue[0]) && numValue <= Number(filterValue[1]);
            }
            return false;
          
          default:
            return fieldValue === filterValue;
        }
      });
    });
  }, [searchFilteredData, filters]);

  // Filter management functions
  const addFilter = useCallback((newFilter: FilterConfig<T>) => {
    setFilters(prev => {
      const existingIndex = prev.findIndex(f => f.field === newFilter.field);
      if (existingIndex >= 0) {
        // Replace existing filter
        const updated = [...prev];
        updated[existingIndex] = newFilter;
        return updated;
      }
      // Add new filter
      return [...prev, newFilter];
    });
  }, []);

  const removeFilter = useCallback((field: keyof T) => {
    setFilters(prev => prev.filter(f => f.field !== field));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const clearAll = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setFilters([]);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return debouncedSearchTerm.trim() !== '' || filters.length > 0;
  }, [debouncedSearchTerm, filters]);

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    clearAll,
    resultCount: filteredData.length,
    hasActiveFilters,
  };
}

// Specialized hook for employee search and filtering
export interface UseEmployeeSearchReturn {
  filteredEmployees: Employee[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  nameFilter: string;
  setNameFilter: (value: string) => void;
  emailFilter: string;
  setEmailFilter: (value: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  clearAllFilters: () => void;
  resultCount: number;
  hasActiveFilters: boolean;
  activeFilters: string[];
}

export function useEmployeeSearch(employees: Employee[]): UseEmployeeSearchReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Combined filtering logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      // General search term (searches across multiple fields)
      const matchesSearchTerm = !searchTerm.trim() || 
        [employee.firstName, employee.email]
          .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));

      // Specific field filters
      const matchesName = !nameFilter.trim() || 
        employee.firstName?.toLowerCase().includes(nameFilter.toLowerCase());

      const matchesEmail = !emailFilter.trim() || 
        employee.email?.toLowerCase().includes(emailFilter.toLowerCase());

      const matchesDepartment = !departmentFilter.trim() || 
        employee.department === departmentFilter;

      return matchesSearchTerm && matchesName && matchesEmail && matchesDepartment;
    });
  }, [employees, searchTerm, nameFilter, emailFilter, departmentFilter]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setNameFilter('');
    setEmailFilter('');
    setDepartmentFilter('');
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return [searchTerm, nameFilter, emailFilter, departmentFilter]
      .some(filter => filter.trim() !== '');
  }, [searchTerm, nameFilter, emailFilter, departmentFilter]);

  // Get active filter labels
  const activeFilters = useMemo(() => {
    const filters: string[] = [];
    if (searchTerm.trim()) filters.push(`Busca: "${searchTerm}"`);
    if (nameFilter.trim()) filters.push(`Nome: "${nameFilter}"`);
    if (emailFilter.trim()) filters.push(`Email: "${emailFilter}"`);
    if (departmentFilter.trim()) filters.push(`Departamento: "${departmentFilter}"`);
    return filters;
  }, [searchTerm, nameFilter, emailFilter, departmentFilter]);

  return {
    filteredEmployees,
    searchTerm,
    setSearchTerm,
    nameFilter,
    setNameFilter,
    emailFilter,
    setEmailFilter,
    departmentFilter,
    setDepartmentFilter,
    clearAllFilters,
    resultCount: filteredEmployees.length,
    hasActiveFilters,
    activeFilters,
  };
}

// Hook for department search
export interface Department {
  id: string;
  name: string;
  employeeCount?: number;
  manager?: string;
}

export function useDepartmentSearch(departments: Department[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [managerFilter, setManagerFilter] = useState('');

  const filteredDepartments = useMemo(() => {
    return departments.filter(department => {
      const matchesSearchTerm = !searchTerm.trim() || 
        [department.name, department.manager]
          .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesName = !nameFilter.trim() || 
        department.name?.toLowerCase().includes(nameFilter.toLowerCase());

      const matchesManager = !managerFilter.trim() || 
        department.manager?.toLowerCase().includes(managerFilter.toLowerCase());

      return matchesSearchTerm && matchesName && matchesManager;
    });
  }, [departments, searchTerm, nameFilter, managerFilter]);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setNameFilter('');
    setManagerFilter('');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return [searchTerm, nameFilter, managerFilter]
      .some(filter => filter.trim() !== '');
  }, [searchTerm, nameFilter, managerFilter]);

  return {
    filteredDepartments,
    searchTerm,
    setSearchTerm,
    nameFilter,
    setNameFilter,
    managerFilter,
    setManagerFilter,
    clearAllFilters,
    resultCount: filteredDepartments.length,
    hasActiveFilters,
  };
}

// Advanced search hook with faceted filtering
interface FacetConfig<T> {
  field: keyof T;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'boolean';
  options?: Array<{ value: any; label: string; count?: number }>;
}

export function useFacetedSearch<T extends Record<string, any>>(
  data: T[],
  facetConfigs: FacetConfig<T>[]
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacets, setSelectedFacets] = useState<Record<string, any>>({});

  // Generate facet options with counts
  const facetsWithCounts = useMemo(() => {
    return facetConfigs.map(facetConfig => {
      const values = data.map(item => item[facetConfig.field]);
      const uniqueValues = Array.from(new Set(values)).filter(v => v != null);
      
      const options = uniqueValues.map(value => ({
        value,
        label: String(value),
        count: values.filter(v => v === value).length,
      }));

      return {
        ...facetConfig,
        options: options.sort((a, b) => b.count - a.count),
      };
    });
  }, [data, facetConfigs]);

  // Apply filters
  const filteredData = useMemo(() => {
    let result = data;

    // Apply search term
    if (searchTerm.trim()) {
      result = result.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply facet filters
    Object.entries(selectedFacets).forEach(([field, value]) => {
      if (value != null && value !== '' && value !== false) {
        if (Array.isArray(value) && value.length > 0) {
          result = result.filter(item => value.includes(item[field]));
        } else {
          result = result.filter(item => item[field] === value);
        }
      }
    });

    return result;
  }, [data, searchTerm, selectedFacets]);

  const updateFacet = useCallback((field: string, value: any) => {
    setSelectedFacets(prev => ({ ...prev, [field]: value }));
  }, []);

  const clearFacet = useCallback((field: string) => {
    setSelectedFacets(prev => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSearchTerm('');
    setSelectedFacets({});
  }, []);

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    facetsWithCounts,
    selectedFacets,
    updateFacet,
    clearFacet,
    clearAll,
    resultCount: filteredData.length,
  };
}