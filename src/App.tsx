import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import DashboardLayout from './components/layout/DashboardLayout';
import ColaboradoresHome from './components/pages/ColaboradoresHome';
import ColaboradorForm from './components/pages/ColaboradorForm';
import { Employee, EmployeeFormData } from './types/employee';
import {
  createEmployee,
  updateEmployee,
  getAllEmployees,
  deleteEmployee,
} from './services/firebase';

type AppView = 'home' | 'form';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const fetchedEmployees = await getAllEmployees();
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
        // Optionally, set an error state to display to the user
      }
    };

    fetchEmployees();
  }, []);

  const handleCreateNew = () => {
    setEditingEmployee(null);
    setCurrentView('form');
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setEditingEmployee(null);
    setCurrentView('home');
  };

  const handleDeleteEmployees = async (employeeIds: string[]) => {
    try {
      for (const id of employeeIds) {
        await deleteEmployee(id);
      }
      // Re-fetch employees to update the list after deletion
      const updatedEmployees = await getAllEmployees();
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error('Error deleting employees:', error);
      // Optionally, set an error state to display to the user
    }
  };

  const handleFormSubmit = async (
    formData: EmployeeFormData
  ): Promise<{ success: boolean; error?: string }> => {
    // Check for duplicate email (skip if editing same employee)
    const duplicateEmployee = employees.find(
      (emp) => emp.email === formData.personalInfo.email && emp.id !== editingEmployee?.id
    );
    if (duplicateEmployee) {
      return {
        success: false,
        error: 'Já existe um colaborador cadastrado com este e-mail',
      };
    }

    try {
      if (editingEmployee) {
        // Update existing employee
        await updateEmployee(editingEmployee.id, formData);
      } else {
        // Create new employee
        await createEmployee(formData);
      }
      // Re-fetch employees to update the list after successful operation
      const updatedEmployees = await getAllEmployees();
      setEmployees(updatedEmployees);

      setCurrentView('home');
      setEditingEmployee(null);
      return { success: true };
    } catch (error) {
      console.error('Error submitting form:', error);
      return { success: false, error: 'Erro ao salvar colaborador.' };
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardLayout showBreadcrumbs={currentView === 'form'} onNavigateHome={handleBackToList}>
        {currentView === 'home' && (
          <ColaboradoresHome
            onCreateNew={handleCreateNew}
            employees={employees}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployees={handleDeleteEmployees}
          />
        )}

        {currentView === 'form' && (
          <ColaboradorForm
            onBack={handleBackToList}
            onNavigateHome={handleBackToList}
            onSubmit={handleFormSubmit}
            editingEmployee={editingEmployee}
          />
        )}
      </DashboardLayout>
    </ThemeProvider>
  );
}

export default App;
