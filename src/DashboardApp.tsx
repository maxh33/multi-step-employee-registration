import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ColaboradoresHome from './components/pages/ColaboradoresHome';
import ColaboradorForm from './components/pages/ColaboradorForm';
import DepartmentHome from './components/pages/DepartmentHome';
import { Employee, EmployeeFormData } from './types/employee';
import {
  createEmployee,
  updateEmployee,
  getAllEmployees,
  deleteEmployee,
} from './services/firebase';
import { initializeDepartments } from './utils/departmentSeeder';
import { syncDepartmentEmployeeCounts } from './services/firebase';
import { updateDepartmentManager } from './services/departments';

function DashboardApp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize departments first (creates defaults if none exist)
        await initializeDepartments();
        
        // Then fetch employees
        const fetchedEmployees = await getAllEmployees();
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  // Add sync function to global scope for manual data repair
  React.useEffect(() => {
    (window as any).repairDepartmentCounts = syncDepartmentEmployeeCounts;
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

    // Extract department context from URL for manager linking
    const fromDepartment = searchParams.get('fromDepartment');
    const role = searchParams.get('role');
    const isCreatingDepartmentManager = fromDepartment && role === 'manager';

    try {
      let newEmployeeId: string | null = null;
      
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, formData);
      } else {
        newEmployeeId = await createEmployee(formData);
      }
      
      // If creating a manager for a department, link the manager to the department
      if (isCreatingDepartmentManager && newEmployeeId && fromDepartment) {
        try {
          await updateDepartmentManager(fromDepartment, newEmployeeId);
          console.log(`Manager ${newEmployeeId} successfully linked to department ${fromDepartment}`);
        } catch (error) {
          console.error('Error linking manager to department:', error);
          // Don't fail the entire operation, just log the error
        }
      }
      
      const updatedEmployees = await getAllEmployees();
      setEmployees(updatedEmployees);

      // Navigate based on context
      if (isCreatingDepartmentManager) {
        // Show success message and navigate to departments
        navigate('/departamentos');
      } else {
        navigate('/colaboradores');
      }
      
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
              departmentFilter={searchParams.get('department') || undefined}
              onClearDepartmentFilter={() => navigate('/colaboradores')}
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
        <Route
          path="/departamentos"
          element={
            <DepartmentHome 
              onNavigateToEmployees={(departmentId) => 
                navigate(`/colaboradores${departmentId ? `?department=${departmentId}` : ''}`)
              }
              onNavigateToCreateManager={(departmentId, departmentName) =>
                navigate(`/colaboradores/novo?fromDepartment=${departmentId}&departmentName=${encodeURIComponent(departmentName)}&role=manager`)
              }
            />
          }
        />
        <Route path="/" element={<Navigate to="/colaboradores" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default DashboardApp;
