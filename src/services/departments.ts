// Department service for Firebase operations - Phase 2C Implementation

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Department,
  FirebaseDepartment,
  DepartmentWithEmployees,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '../types/department';
import { ExtendedEmployee } from '../types/extendedEmployee';
import { getEmployee, updateEmployeeDepartment, getAllEmployees } from './firebase';

// Helper function to convert Firestore document to Department
const convertDocToDepartment = (doc: QueryDocumentSnapshot<DocumentData>): Department => {
  const data = doc.data() as FirebaseDepartment;
  return {
    id: doc.id,
    name: data.name,
    responsibleManagerId: data.responsibleManagerId,
    employeeIds: data.employeeIds || [],
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    isActive: data.isActive !== false, // Default to true if not specified
  };
};

// Error handling helper
const handleDepartmentError = (error: any, operation: string): Error => {
  console.error(`Department ${operation} error:`, error);
  const message = error?.message || `Failed to ${operation} department`;
  return new Error(message);
};

// 1. CREATE DEPARTMENT
export const createDepartment = async (data: CreateDepartmentRequest): Promise<string> => {
  try {
    // For now, skip manager validation until we have extended employee data
    // TODO: Validate manager exists and is manager level
    
    // Check department name uniqueness
    const existingDepartment = await getDepartmentByName(data.name);
    if (existingDepartment) {
      throw new Error('Department name already exists');
    }

    // Create department document
    const departmentData: FirebaseDepartment = {
      name: data.name.trim(),
      responsibleManagerId: data.responsibleManagerId,
      employeeIds: data.initialEmployeeIds || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true,
    };

    const docRef = await addDoc(collection(db, 'departments'), departmentData);
    
    // Update employees if initial employees provided
    if (data.initialEmployeeIds?.length) {
      await Promise.all(
        data.initialEmployeeIds.map(employeeId => 
          updateEmployeeDepartment(employeeId, docRef.id)
        )
      );
    }

    return docRef.id;
  } catch (error) {
    throw handleDepartmentError(error, 'creation');
  }
};
// 2. READ DEPARTMENT OPERATIONS

// Get department by name (for uniqueness check)
export const getDepartmentByName = async (
  name: string, 
  excludeId?: string
): Promise<Department | null> => {
  try {
    const q = query(
      collection(db, 'departments'),
      where('name', '==', name.trim()),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    for (const doc of querySnapshot.docs) {
      if (excludeId && doc.id === excludeId) continue;
      return convertDocToDepartment(doc);
    }
    
    return null;
  } catch (error) {
    throw handleDepartmentError(error, 'name lookup');
  }
};

// Get all active departments with retry logic
export const getAllDepartments = async (retryCount = 0): Promise<Department[]> => {
  const maxRetries = 3;
  
  try {
    const q = query(
      collection(db, 'departments'),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const departments = querySnapshot.docs.map(convertDocToDepartment);
    
    // Sort client-side to avoid requiring composite index
    return departments.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error: any) {
    console.error(`Department listing attempt ${retryCount + 1} failed:`, error);
    
    // Retry on network errors or if retries remaining
    if (retryCount < maxRetries && (
      error?.code === 'unavailable' || 
      error?.message?.includes('network') ||
      error?.message?.includes('UNAVAILABLE') ||
      error?.message?.includes('Failed to get document')
    )) {
      console.log(`Retrying department fetch (attempt ${retryCount + 2}/${maxRetries + 1})...`);
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000)); // Exponential backoff
      return getAllDepartments(retryCount + 1);
    }
    
    throw handleDepartmentError(error, 'listing');
  }
};
// Get single department by ID
export const getDepartment = async (id: string): Promise<Department | null> => {
  try {
    const docRef = doc(db, 'departments', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FirebaseDepartment;
      if (data.isActive !== false) {
        return {
          id: docSnap.id,
          name: data.name,
          responsibleManagerId: data.responsibleManagerId,
          employeeIds: data.employeeIds || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          isActive: data.isActive === true,
        };
      }
    }
    return null;
  } catch (error) {
    throw handleDepartmentError(error, 'retrieval');
  }
};

// Get department with employee details
export const getDepartmentWithEmployees = async (
  id: string
): Promise<DepartmentWithEmployees | null> => {
  try {
    const department = await getDepartment(id);
    if (!department) return null;

    // For now, return simplified version until we have extended employee data
    // TODO: Fetch actual employee details when extended types are implemented
    return {
      ...department,
      employees: [],
      responsibleManager: null,
      employeeCount: department.employeeIds.length,
    };
  } catch (error) {
    throw handleDepartmentError(error, 'detailed retrieval');
  }
};
// 3. UPDATE DEPARTMENT
export const updateDepartment = async (
  id: string,
  updates: UpdateDepartmentRequest
): Promise<void> => {
  try {
    const updateData: any = {
      updatedAt: Timestamp.now(),
    };

    // Validate and update name
    if (updates.name !== undefined) {
      if (updates.name.trim().length === 0) {
        throw new Error('Department name cannot be empty');
      }
      
      // Check uniqueness (excluding current department)
      const existingDept = await getDepartmentByName(updates.name, id);
      if (existingDept) {
        throw new Error('Department name already exists');
      }
      
      updateData.name = updates.name.trim();
    }

    // Update responsible manager
    if (updates.responsibleManagerId !== undefined) {
      // TODO: Validate manager when extended employee types are implemented
      updateData.responsibleManagerId = updates.responsibleManagerId;
    }

    // Update employee list
    if (updates.employeeIds !== undefined) {
      updateData.employeeIds = updates.employeeIds;
      
      // TODO: Update employee department references when extended types are implemented
    }

    const departmentRef = doc(db, 'departments', id);
    await updateDoc(departmentRef, updateData);
  } catch (error) {
    throw handleDepartmentError(error, 'update');
  }
};
// 4. DELETE DEPARTMENT
export const deleteDepartment = async (
  id: string,
  transferToDepartmentId?: string
): Promise<void> => {
  try {
    const department = await getDepartment(id);
    if (!department) {
      throw new Error('Department not found');
    }

    // Validate employee transfer if department has employees
    if (department.employeeIds.length > 0) {
      if (!transferToDepartmentId) {
        throw new Error('Cannot delete department with employees. Please transfer employees first.');
      }
      
      const targetDepartment = await getDepartment(transferToDepartmentId);
      if (!targetDepartment) {
        throw new Error('Target department for employee transfer not found');
      }

      // Transfer all employees to target department
      await Promise.all(
        department.employeeIds.map(employeeId => 
          updateEmployeeDepartment(employeeId, transferToDepartmentId)
        )
      );

      // Update target department employee list
      await updateDepartment(transferToDepartmentId, {
        employeeIds: [...targetDepartment.employeeIds, ...department.employeeIds],
      });
    }

    // Soft delete department
    const departmentRef = doc(db, 'departments', id);
    await updateDoc(departmentRef, {
      isActive: false,
      updatedAt: Timestamp.now(),
      deletedAt: Timestamp.now(),
    });
  } catch (error) {
    throw handleDepartmentError(error, 'deletion');
  }
};
// 5. EMPLOYEE-DEPARTMENT RELATIONSHIP MANAGEMENT

// Transfer single employee to another department
export const transferEmployeeToDepartment = async (
  employeeId: string,
  newDepartmentId: string
): Promise<void> => {
  try {
    // Get target department
    const newDepartment = await getDepartment(newDepartmentId);
    if (!newDepartment) {
      throw new Error('Target department not found');
    }

    // For now, simplified transfer until we have extended employee types
    // TODO: Get current department from employee when extended types are implemented
    
    // Add employee to new department if not already there
    if (!newDepartment.employeeIds.includes(employeeId)) {
      const updatedEmployeeIds = [...newDepartment.employeeIds, employeeId];
      await updateDepartment(newDepartmentId, {
        employeeIds: updatedEmployeeIds,
      });
    }

    // Update employee's department reference
    await updateEmployeeDepartment(employeeId, newDepartmentId);
  } catch (error) {
    throw handleDepartmentError(error, 'employee transfer');
  }
};

// Bulk transfer employees to a department
export const bulkTransferEmployees = async (
  employeeIds: string[],
  targetDepartmentId: string
): Promise<void> => {
  try {
    // Validate target department
    const targetDepartment = await getDepartment(targetDepartmentId);
    if (!targetDepartment) {
      throw new Error('Target department not found');
    }

    // Update employees' department references
    await Promise.all(
      employeeIds.map(employeeId => 
        updateEmployeeDepartment(employeeId, targetDepartmentId)
      )
    );

    // Update target department with new employees
    const uniqueEmployeeIds = Array.from(new Set([
      ...targetDepartment.employeeIds,
      ...employeeIds,
    ]));
    
    await updateDepartment(targetDepartmentId, {
      employeeIds: uniqueEmployeeIds,
    });
  } catch (error) {
    throw handleDepartmentError(error, 'bulk employee transfer');
  }
};