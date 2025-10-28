import { useState, useEffect, useCallback } from 'react';
import { Department } from '../../types/department';
import { getAllDepartments } from '../../services/departments';
import { ProfessionalInfo } from '../../types/employee';

interface UseDepartmentIntegrationProps {
  data: Partial<ProfessionalInfo>;
  onChange: (data: Partial<ProfessionalInfo>) => void;
}

interface UseDepartmentIntegrationReturn {
  departments: Department[];
  loadingDepartments: boolean;
  departmentError: string | null;
  getDepartmentName: (departmentId: string) => string;
  fetchDepartments: () => void;
}

export function useDepartmentIntegration({
  data,
  onChange
}: UseDepartmentIntegrationProps): UseDepartmentIntegrationReturn {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [departmentError, setDepartmentError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoadingDepartments(true);
      setDepartmentError(null);
      const fetchedDepartments = await getAllDepartments();
      setDepartments(fetchedDepartments);
      
      // Validate current department value against fetched departments
      if (data.department && fetchedDepartments.length > 0) {
        const validDepartment = fetchedDepartments.find(dept => 
          dept.name === data.department || 
          (data.department && dept.name.toLowerCase() === data.department.toLowerCase()) ||
          dept.id === data.department
        );
        
        // If current department value is invalid, reset to empty
        if (!validDepartment) {
          console.warn(`Invalid department value "${data.department}" found, resetting to empty`);
          onChange({ ...data, department: '' });
        }
      }
      
      // If no departments exist, show error
      if (fetchedDepartments.length === 0) {
        setDepartmentError('Nenhum departamento cadastrado. Por favor, crie departamentos primeiro.');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      
      // Provide specific error messages based on error type
      let errorMessage = 'Erro ao carregar departamentos';
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      if (errorMsg.includes('network') || errorMsg.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (errorMsg.includes('permission-denied')) {
        errorMessage = 'Sem permissão para acessar departamentos.';
      } else if (errorMsg.includes('index')) {
        errorMessage = 'Configuração do banco de dados em andamento. Tente novamente em alguns instantes.';
      }
      
      setDepartmentError(errorMessage);
    } finally {
      setLoadingDepartments(false);
    }
  }, [data, onChange]);

  const getDepartmentName = useCallback((departmentId: string): string => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'Departamento não encontrado';
  }, [departments]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    loadingDepartments,
    departmentError,
    getDepartmentName,
    fetchDepartments,
  };
}