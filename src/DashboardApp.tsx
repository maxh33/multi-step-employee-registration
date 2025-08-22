import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

function DashboardApp() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const fetchedEmployees = await getAllEmployees();
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);
  const handleCreateNew = () => {
    setEditingEmployee(null);
    navigate('/colaboradores/novo');
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    navigate(`/colaboradores/editar/${employee.id}`);
  };

  const handleBackToList = () => {
    setEditingEmployee(null);
    navigate('/colaboradores');
  };

  const handleDeleteEmployees = async (employeeIds: string[]) => {
    try {
      for (const id of employeeIds) {
        await deleteEmployee(id);
      }
      const updatedEmployees = await getAllEmployees();
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error('Error deleting employees:', error);
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
        await updateEmployee(editingEmployee.id, formData);
      } else {
        await createEmployee(formData);
      }
      const updatedEmployees = await getAllEmployees();
      setEmployees(updatedEmployees);

      navigate('/colaboradores');
      setEditingEmployee(null);
      return { success: true };
    } catch (error) {
      console.error('Error submitting form:', error);
      return { success: false, error: 'Erro ao salvar colaborador.' };
    }
  };
  return (
    <DashboardLayout showBreadcrumbs={true} onNavigateHome={handleBackToList}>
      <Routes>
        <Route
          path="/colaboradores"
          element={
            <ColaboradoresHome
              onCreateNew={handleCreateNew}
              employees={employees}
              onEditEmployee={handleEditEmployee}
              onDeleteEmployees={handleDeleteEmployees}
            />
          }
        />
        <Route
          path="/colaboradores/novo"
          element={
            <ColaboradorForm
              onBack={handleBackToList}
              onNavigateHome={handleBackToList}
              onSubmit={handleFormSubmit}
              editingEmployee={null}
            />
          }
        />
        <Route
          path="/colaboradores/editar/:id"
          element={
            <ColaboradorForm
              onBack={handleBackToList}
              onNavigateHome={handleBackToList}
              onSubmit={handleFormSubmit}
              editingEmployee={editingEmployee}
            />
          }
        />
        <Route path="/" element={<Navigate to="/colaboradores" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default DashboardApp;
