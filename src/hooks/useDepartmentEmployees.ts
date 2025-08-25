import { useState, useEffect, useCallback } from 'react';
import { Department } from '../types/department';
import { Employee } from '../types/employee';
import { getAllDepartments, transferEmployeeToDepartment } from '../services/departments';
import { getEmployeesByDepartment } from '../services/firebase';

interface UseDepartmentEmployeesReturn {
  departments: Department[];
  loading: boolean;
  error: string | null;
  refreshDepartments: () => Promise<void>;
  getEmployeesForDepartment: (departmentId: string) => Promise<Employee[]>;
  transferEmployee: (employeeId: string, newDepartmentId: string) => Promise<void>;
}

export const useDepartmentEmployees = (): UseDepartmentEmployeesReturn => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedDepartments = await getAllDepartments();
      setDepartments(fetchedDepartments);
    } catch (err) {
      setError('Erro ao carregar departamentos');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEmployeesForDepartment = useCallback(async (departmentId: string): Promise<Employee[]> => {
    try {
      const employees = await getEmployeesByDepartment(departmentId);
      return employees;
    } catch (err) {
      console.error('Error fetching department employees:', err);
      throw err;
    }
  }, []);

  const transferEmployee = useCallback(async (
    employeeId: string,
    newDepartmentId: string
  ): Promise<void> => {
    try {
      await transferEmployeeToDepartment(employeeId, newDepartmentId);
      // Refresh departments to update employee counts
      await fetchDepartments();
    } catch (err) {
      console.error('Error transferring employee:', err);
      throw err;
    }
  }, [fetchDepartments]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    loading,
    error,
    refreshDepartments: fetchDepartments,
    getEmployeesForDepartment,
    transferEmployee,
  };
};

export default useDepartmentEmployees;
