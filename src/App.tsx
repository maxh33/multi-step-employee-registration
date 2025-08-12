import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import DashboardLayout from './components/layout/DashboardLayout';
import ColaboradoresHome from './components/pages/ColaboradoresHome';
import ColaboradorForm from './components/pages/ColaboradorForm';
import { Employee, EmployeeFormData } from './types/employee';
import { v4 as uuidv4 } from 'uuid';

type AppView = 'home' | 'form';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

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

  const handleDeleteEmployees = (employeeIds: string[]) => {
    setEmployees((prev) => prev.filter((emp) => !employeeIds.includes(emp.id)));
  };

  const handleReorderEmployees = (fromIndex: number, toIndex: number) => {
    setEmployees((prev) => {
      const newEmployees = [...prev];
      const [draggedEmployee] = newEmployees.splice(fromIndex, 1);
      newEmployees.splice(toIndex, 0, draggedEmployee);
      return newEmployees;
    });
  };

  const handleFormSubmit = (formData: EmployeeFormData): { success: boolean; error?: string } => {
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

    if (editingEmployee) {
      // Update existing employee
      const updatedEmployee: Employee = {
        ...editingEmployee,
        firstName: formData.personalInfo.firstName || '',
        lastName: formData.personalInfo.lastName || '',
        email: formData.personalInfo.email || '',
        phone: formData.personalInfo.phone || '',
        department: formData.professionalInfo.department || '',
        position: formData.professionalInfo.position || '',
        status: formData.personalInfo.activateOnCreate ? 'Ativo' : 'Inativo',
      };

      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editingEmployee.id ? updatedEmployee : emp))
      );
    } else {
      // Create new employee
      const avatarColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
      const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

      const newEmployee: Employee = {
        id: uuidv4(), // Use uuidv4() for ID generation
        firstName: formData.personalInfo.firstName || '',
        lastName: formData.personalInfo.lastName || '',
        email: formData.personalInfo.email || '',
        phone: formData.personalInfo.phone || '',
        department: formData.professionalInfo.department || '',
        position: formData.professionalInfo.position || '',
        status: formData.personalInfo.activateOnCreate ? 'Ativo' : 'Inativo',
        avatar: randomColor,
        createdAt: new Date(),
      };

      setEmployees((prev) => [...prev, newEmployee]);
    }

    setCurrentView('home');
    setEditingEmployee(null);
    return { success: true };
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
            onReorderEmployees={handleReorderEmployees}
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
