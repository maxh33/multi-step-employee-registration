import { useState, useEffect, useCallback } from 'react';
import { Employee } from '../../types/employee';
import { getManagerEmployees } from '../../services/firebase';

interface UseManagerSelectionProps {
  hierarchicalLevel?: string;
  employeeId?: string;
}

interface UseManagerSelectionReturn {
  managers: Employee[];
  loadingManagers: boolean;
  fetchManagers: () => void;
}

export function useManagerSelection({
  hierarchicalLevel,
  employeeId
}: UseManagerSelectionProps): UseManagerSelectionReturn {
  const [managers, setManagers] = useState<Employee[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  const fetchManagers = useCallback(async () => {
    try {
      setLoadingManagers(true);
      const managerEmployees = await getManagerEmployees(employeeId); // Exclude current employee
      setManagers(managerEmployees);
    } catch (error) {
      console.error('Error fetching managers:', error);
      setManagers([]);
    } finally {
      setLoadingManagers(false);
    }
  }, [employeeId]);

  useEffect(() => {
    // Fetch managers when hierarchical level is set and is not manager
    if (hierarchicalLevel && hierarchicalLevel !== 'manager') {
      fetchManagers();
    } else {
      setManagers([]);
    }
  }, [hierarchicalLevel, fetchManagers]);

  return {
    managers,
    loadingManagers,
    fetchManagers,
  };
}