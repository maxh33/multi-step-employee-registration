import { useState, useEffect, useCallback } from 'react';
import { getAllEmployees } from '../services/firebase';
import { ExtendedEmployee } from '../types/extendedEmployee';

interface UseManagerSelectionReturn {
  availableManagers: ExtendedEmployee[];
  loading: boolean;
  error: string | null;
  refreshManagers: () => Promise<void>;
}

export const useManagerSelection = (currentEmployeeId?: string): UseManagerSelectionReturn => {
  const [availableManagers, setAvailableManagers] = useState<ExtendedEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManagers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allEmployees = await getAllEmployees();
      
      // For now, return all employees as we don't have hierarchical levels yet
      // TODO: Filter to only manager-level employees when Phase 2B is complete
      const managers = allEmployees.filter(employee => 
        employee.status === 'Ativo' &&
        employee.id !== currentEmployeeId // Prevent self-selection
      );
      
      // Type conversion - for now treat Employee as ExtendedEmployee
      setAvailableManagers(managers as any);
    } catch (err) {
      setError('Erro ao carregar lista de gerentes');
      console.error('Error fetching managers:', err);
    } finally {
      setLoading(false);
    }
  }, [currentEmployeeId]);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  return {
    availableManagers,
    loading,
    error,
    refreshManagers: fetchManagers,
  };
};

export default useManagerSelection;
