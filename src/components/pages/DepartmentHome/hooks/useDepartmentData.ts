import { useState, useEffect, useCallback } from 'react';
import { Department } from '../../../../types/department';
import { getAllDepartments } from '../../../../services/departments';
import { getEmployeeName, getActiveEmployeeCountByDepartment } from '../../../../services/firebase';

interface UseDepartmentDataReturn {
  departments: Department[];
  loading: boolean;
  error: string | null;
  managerNames: Record<string, string>;
  employeeCounts: Record<string, number>;
  refreshDepartments: () => Promise<void>;
  clearError: () => void;
}

export function useDepartmentData(): UseDepartmentDataReturn {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managerNames, setManagerNames] = useState<Record<string, string>>({});
  const [employeeCounts, setEmployeeCounts] = useState<Record<string, number>>({});

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedDepartments = await getAllDepartments();
      setDepartments(fetchedDepartments);
      
      // Fetch manager names and employee counts for departments
      const managerNamesMap: Record<string, string> = {};
      const employeeCountsMap: Record<string, number> = {};
      
      await Promise.all(
        fetchedDepartments.map(async (dept) => {
          // Fetch manager name
          if (dept.responsibleManagerId && dept.responsibleManagerId !== 'system') {
            try {
              const managerName = await getEmployeeName(dept.responsibleManagerId);
              if (managerName) {
                managerNamesMap[dept.responsibleManagerId] = managerName;
              }
            } catch (error) {
              console.error(`Error fetching manager name for ${dept.responsibleManagerId}:`, error);
            }
          }
          
          // Fetch active non-manager employee count
          try {
            const activeEmployeeCount = await getActiveEmployeeCountByDepartment(dept.id);
            employeeCountsMap[dept.id] = activeEmployeeCount;
          } catch (error) {
            console.error(`Error fetching employee count for department ${dept.id}:`, error);
            employeeCountsMap[dept.id] = 0;
          }
        })
      );
      
      setManagerNames(managerNamesMap);
      setEmployeeCounts(employeeCountsMap);
    } catch (err) {
      setError('Erro ao carregar departamentos');
      console.error('Erro ao buscar departamentos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDepartments();
  }, [refreshDepartments]);

  return {
    departments,
    loading,
    error,
    managerNames,
    employeeCounts,
    refreshDepartments,
    clearError,
  };
}