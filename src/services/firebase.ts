import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Employee, EmployeeFormData } from '../types/employee';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Collection reference
const employeesCollectionRef = collection(db, 'employees');

// Helper to convert Firestore DocumentData to Employee type - Extended with new fields
const convertDocToEmployee = (doc: QueryDocumentSnapshot<DocumentData>): Employee => {
  const data = doc.data();
  return {
    id: doc.id,
    firstName: data.personalInfo.firstName,
    email: data.personalInfo.email,
    department: data.professionalInfo.department,
    position: data.professionalInfo?.position,
    admissionDate: data.professionalInfo?.admissionDate ? new Date(data.professionalInfo.admissionDate) : undefined,
    hierarchicalLevel: data.professionalInfo?.hierarchicalLevel,
    responsibleManager: data.professionalInfo?.responsibleManager,
    baseSalary: data.professionalInfo?.baseSalary,
    status: data.status,
    avatar: data.avatar || '#CCCCCC',
    createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
  };
};

// Helper to handle Firebase errors and return a new Error object with context
const handleFirebaseError = (error: unknown, operation?: string): Error => {
  let message = 'Ocorreu um erro inesperado. Tente novamente.';
  const operationContext = operation ? ` durante ${operation}` : '';

  if (error && typeof error === 'object' && 'code' in error) {
    const firebaseError = error as { code: string; message?: string };
    switch (firebaseError.code) {
      case 'permission-denied':
        message = `Acesso negado${operationContext}. Verifique suas permissões ou contate o administrador.`;
        break;
      case 'unavailable':
        message = `Serviço indisponível${operationContext}. Verifique sua conexão e tente novamente.`;
        break;
      case 'not-found':
        message = `Registro não encontrado${operationContext}. O colaborador pode ter sido removido.`;
        break;
      case 'deadline-exceeded':
        message = `Tempo limite excedido${operationContext}. Verifique sua conexão com a internet.`;
        break;
      case 'already-exists':
        message = `Colaborador já existe${operationContext}. Verifique o e-mail informado.`;
        break;
      case 'invalid-argument':
        message = `Dados inválidos${operationContext}. Verifique os campos obrigatórios.`;
        break;
      case 'resource-exhausted':
        message = `Limite de uso excedido${operationContext}. Tente novamente mais tarde.`;
        break;
      default:
        message = `Erro ${firebaseError.code}${operationContext}. Contate o suporte se o problema persistir.`;
    }
  }

  console.error(`Firebase Error${operationContext}:`, error);
  return new Error(message);
};

// Firebase Operations

export const createEmployee = async (data: EmployeeFormData): Promise<string> => {
  try {
    const newEmployeeData = {
      personalInfo: data.personalInfo, // firstName, email, activateOnCreate
      professionalInfo: data.professionalInfo, // department
      status: data.personalInfo.activateOnCreate ? 'Ativo' : 'Inativo',
      avatar: '#FF6B6B',
      createdAt: Timestamp.now(),
    };
    
    // Use batch operation for atomic employee creation + department sync
    const batch = writeBatch(db);
    
    // Create employee document
    const employeeRef = doc(employeesCollectionRef);
    batch.set(employeeRef, newEmployeeData);
    
    // Update department's employeeIds array if department is specified
    if (data.professionalInfo.department) {
      const departmentRef = doc(db, 'departments', data.professionalInfo.department);
      
      // Get current department data to update employeeIds
      const departmentSnap = await getDoc(departmentRef);
      if (departmentSnap.exists()) {
        const departmentData = departmentSnap.data();
        const currentEmployeeIds = departmentData.employeeIds || [];
        
        // Add new employee ID to department's employeeIds array
        if (!currentEmployeeIds.includes(employeeRef.id)) {
          batch.update(departmentRef, {
            employeeIds: [...currentEmployeeIds, employeeRef.id],
            updatedAt: Timestamp.now(),
          });
        }
      }
    }
    
    // Commit the batch operation
    await batch.commit();
    return employeeRef.id;
  } catch (error) {
    throw handleFirebaseError(error, 'criação de colaborador');
  }
};

export const updateEmployee = async (
  id: string,
  data: Partial<EmployeeFormData>
): Promise<void> => {
  try {
    const employeeDocRef = doc(db, 'employees', id);
    
    // Get current employee data to check for department changes
    const currentEmployeeSnap = await getDoc(employeeDocRef);
    if (!currentEmployeeSnap.exists()) {
      throw new Error('Employee not found');
    }
    
    const currentEmployee = currentEmployeeSnap.data();
    const currentDepartmentId = currentEmployee.professionalInfo?.department;
    const newDepartmentId = data.professionalInfo?.department;
    
    const updateData: Partial<EmployeeFormData & { status: string; avatar: string }> = {};

    if (data.personalInfo) {
      updateData.personalInfo = data.personalInfo; // firstName, email, activateOnCreate
      updateData.status = data.personalInfo.activateOnCreate ? 'Ativo' : 'Inativo';
    }
    if (data.professionalInfo) {
      updateData.professionalInfo = data.professionalInfo; // department
    }

    // Use batch operation for atomic employee update + department sync
    const batch = writeBatch(db);
    
    // Update employee document
    batch.update(employeeDocRef, updateData);
    
    // Handle department changes
    if (newDepartmentId && currentDepartmentId !== newDepartmentId) {
      // Remove from old department if exists
      if (currentDepartmentId) {
        const oldDepartmentRef = doc(db, 'departments', currentDepartmentId);
        const oldDepartmentSnap = await getDoc(oldDepartmentRef);
        if (oldDepartmentSnap.exists()) {
          const oldDepartmentData = oldDepartmentSnap.data();
          const oldEmployeeIds = oldDepartmentData.employeeIds || [];
          const updatedOldEmployeeIds = oldEmployeeIds.filter((empId: string) => empId !== id);
          
          batch.update(oldDepartmentRef, {
            employeeIds: updatedOldEmployeeIds,
            updatedAt: Timestamp.now(),
          });
        }
      }
      
      // Add to new department
      const newDepartmentRef = doc(db, 'departments', newDepartmentId);
      const newDepartmentSnap = await getDoc(newDepartmentRef);
      if (newDepartmentSnap.exists()) {
        const newDepartmentData = newDepartmentSnap.data();
        const newEmployeeIds = newDepartmentData.employeeIds || [];
        
        // Add employee ID if not already present
        if (!newEmployeeIds.includes(id)) {
          batch.update(newDepartmentRef, {
            employeeIds: [...newEmployeeIds, id],
            updatedAt: Timestamp.now(),
          });
        }
      }
    }
    
    // Commit the batch operation
    await batch.commit();
  } catch (error) {
    throw handleFirebaseError(error, 'atualização de colaborador');
  }
};

export const getEmployee = async (id: string): Promise<Employee | null> => {
  try {
    const employeeDocRef = doc(db, 'employees', id);
    const docSnap = await getDoc(employeeDocRef);

    if (docSnap.exists()) {
      return convertDocToEmployee(docSnap);
    } else {
      return null;
    }
  } catch (error) {
    throw handleFirebaseError(error, 'consulta de colaborador');
  }
};

export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const q = query(employeesCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocToEmployee);
  } catch (error) {
    throw handleFirebaseError(error, 'listagem de colaboradores');
  }
};

export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    const employeeDocRef = doc(db, 'employees', id);
    
    // Get employee data to find which department to remove from
    const employeeSnap = await getDoc(employeeDocRef);
    if (!employeeSnap.exists()) {
      throw new Error('Employee not found');
    }
    
    const employeeData = employeeSnap.data();
    const departmentId = employeeData.professionalInfo?.department;
    
    // Use batch operation for atomic employee deletion + department sync
    const batch = writeBatch(db);
    
    // Delete employee document
    batch.delete(employeeDocRef);
    
    // Remove from department's employeeIds array if department exists
    if (departmentId) {
      const departmentRef = doc(db, 'departments', departmentId);
      const departmentSnap = await getDoc(departmentRef);
      if (departmentSnap.exists()) {
        const departmentData = departmentSnap.data();
        const currentEmployeeIds = departmentData.employeeIds || [];
        const updatedEmployeeIds = currentEmployeeIds.filter((empId: string) => empId !== id);
        
        batch.update(departmentRef, {
          employeeIds: updatedEmployeeIds,
          updatedAt: Timestamp.now(),
        });
      }
    }
    
    // Commit the batch operation
    await batch.commit();
  } catch (error) {
    throw handleFirebaseError(error, 'exclusão de colaborador');
  }
};


// Department-related employee operations (Phase 2C)
export const updateEmployeeDepartment = async (
  employeeId: string,
  departmentId: string
): Promise<void> => {
  try {
    const employeeRef = doc(db, 'employees', employeeId);
    const employeeDoc = await getDoc(employeeRef);
    
    if (!employeeDoc.exists()) {
      throw new Error('Employee not found');
    }
    
    // Update the department in professional info
    await updateDoc(employeeRef, {
      'professionalInfo.department': departmentId,
      'departmentId': departmentId, // Add department reference for Phase 2C
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating employee department:', error);
    throw error;
  }
};

// Get employees by department
export const getEmployeesByDepartment = async (
  departmentId: string
): Promise<Employee[]> => {
  try {
    const q = query(
      employeesCollectionRef,
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    // Filter by department (until we have proper indexing)
    return querySnapshot.docs
      .map(convertDocToEmployee)
      .filter(emp => emp.department === departmentId);
  } catch (error) {
    console.error('Error fetching employees by department:', error);
    throw error;
  }
};

// Utility function to get employee name by ID (for manager display)
export const getEmployeeName = async (employeeId: string): Promise<string | null> => {
  try {
    const employee = await getEmployee(employeeId);
    return employee ? employee.firstName : null;
  } catch (error) {
    console.error('Error fetching employee name:', error);
    return null;
  }
};

// Get employees with manager hierarchical level for selection
export const getManagerEmployees = async (): Promise<Employee[]> => {
  try {
    const allEmployees = await getAllEmployees();
    return allEmployees.filter(employee => 
      employee.hierarchicalLevel === 'manager'
    );
  } catch (error) {
    console.error('Error fetching manager employees:', error);
    throw error;
  }
};

// Get active non-manager employee count for a department
export const getActiveEmployeeCountByDepartment = async (departmentId: string): Promise<number> => {
  try {
    const departmentEmployees = await getEmployeesByDepartment(departmentId);
    return departmentEmployees.filter(employee => 
      employee.status === 'Ativo' && 
      employee.hierarchicalLevel !== 'manager'
    ).length;
  } catch (error) {
    console.error('Error getting active employee count by department:', error);
    return 0;
  }
};

// Get active non-manager employees by department (for navigation)
export const getActiveNonManagerEmployeesByDepartment = async (departmentId: string): Promise<Employee[]> => {
  try {
    const departmentEmployees = await getEmployeesByDepartment(departmentId);
    return departmentEmployees.filter(employee => 
      employee.status === 'Ativo' && 
      employee.hierarchicalLevel !== 'manager'
    );
  } catch (error) {
    console.error('Error getting active non-manager employees by department:', error);
    return [];
  }
};

// Utility to repair/sync department employee counts with actual employee data
export const syncDepartmentEmployeeCounts = async (): Promise<void> => {
  try {
    console.log('Starting department-employee sync...');
    
    // Get all employees and departments
    const [allEmployees, allDepartments] = await Promise.all([
      getAllEmployees(),
      // We'll need to import getDepartments from departments service
      // For now, let's get departments directly
      getDocs(query(collection(db, 'departments'), where('isActive', '==', true)))
    ]);
    
    // Create a map of department ID to actual employee IDs
    const departmentEmployeeMap: Record<string, string[]> = {};
    
    // Group employees by their department
    allEmployees.forEach(employee => {
      if (employee.department) {
        if (!departmentEmployeeMap[employee.department]) {
          departmentEmployeeMap[employee.department] = [];
        }
        departmentEmployeeMap[employee.department].push(employee.id);
      }
    });
    
    // Update each department's employeeIds array
    const batch = writeBatch(db);
    let updatedCount = 0;
    
    allDepartments.docs.forEach(departmentDoc => {
      const departmentId = departmentDoc.id;
      const currentData = departmentDoc.data();
      const actualEmployeeIds = departmentEmployeeMap[departmentId] || [];
      const currentEmployeeIds = currentData.employeeIds || [];
      
      // Check if update is needed
      const needsUpdate = 
        actualEmployeeIds.length !== currentEmployeeIds.length ||
        !actualEmployeeIds.every((id: string) => currentEmployeeIds.includes(id)) ||
        !currentEmployeeIds.every((id: string) => actualEmployeeIds.includes(id));
      
      if (needsUpdate) {
        batch.update(departmentDoc.ref, {
          employeeIds: actualEmployeeIds,
          updatedAt: Timestamp.now(),
        });
        updatedCount++;
        console.log(`Syncing department "${currentData.name}": ${currentEmployeeIds.length} → ${actualEmployeeIds.length} employees`);
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`Successfully synced ${updatedCount} departments`);
    } else {
      console.log('All departments are already in sync');
    }
  } catch (error) {
    console.error('Error syncing department employee counts:', error);
    throw error;
  }
};
