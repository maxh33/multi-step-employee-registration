# Department Management System - Technical Specifications

## Overview

This document defines the comprehensive department management system for Phase 2, implementing CRUD operations for departments with employee-department relationship management as specified in SecondStep.md.

## Requirements Analysis

Based on SecondStep.md:
- *"create a department listing page, similar to the employee one"*
- *"operations of registering a new department, deletion, and editing"*
- *"Department must have: Name, employees, and a responsible manager"*
- *"possible to transfer an employee from one department to another"*
- *"employee CANNOT be left without a department (so is a req field when register)"*

## Data Model & Relationships

### Department Entity
```typescript
interface Department {
  id: string;
  name: string;
  responsibleManagerId: string; // Employee reference (must be manager level)
  employeeIds: string[];        // Array of employee IDs in this department
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;           // Soft delete flag
}

// Firebase Firestore document structure
interface FirebaseDepartment {
  name: string;
  responsibleManagerId: string;
  employeeIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}
```

### Extended Employee Reference
```typescript
// Employee model extension for department relationship
interface EmployeeWithDepartment extends Employee {
  departmentId: string;        // Required reference to department
  departmentName?: string;     // Denormalized for display performance
}
```

### Relationship Rules
1. **One-to-Many**: One department has many employees
2. **Required Department**: Every employee MUST belong to exactly one department
3. **Manager Requirement**: Department responsible manager must be an employee with `hierarchicalLevel: 'manager'`
4. **Manager Uniqueness**: A manager can be responsible for multiple departments
5. **Self-Reference Prevention**: Department manager must be an employee in the system
6. **Cascade Updates**: Department changes reflect in employee records

## Department CRUD Operations

### 1. Create Department

#### API Specification
```typescript
interface CreateDepartmentRequest {
  name: string;
  responsibleManagerId: string;
  initialEmployeeIds?: string[]; // Optional employees to add during creation
}

interface CreateDepartmentResponse {
  id: string;
  department: Department;
  success: boolean;
  error?: string;
}
```

#### Validation Rules
- **Name**: Required, unique, 1-100 characters, no special characters
- **Responsible Manager**: Must exist, must have `hierarchicalLevel: 'manager'`
- **Initial Employees**: If provided, all must exist and be available for transfer

#### Firebase Service Implementation
```typescript
// src/services/departments.ts
export const createDepartment = async (data: CreateDepartmentRequest): Promise<string> => {
  try {
    // Validate manager exists and is manager level
    const manager = await getEmployee(data.responsibleManagerId);
    if (!manager || manager.hierarchicalLevel !== 'manager') {
      throw new Error('Responsible manager must be a manager-level employee');
    }

    // Check department name uniqueness
    const existingDepartment = await getDepartmentByName(data.name);
    if (existingDepartment) {
      throw new Error('Department name already exists');
    }

    // Create department document
    const departmentData = {
      name: data.name.trim(),
      responsibleManagerId: data.responsibleManagerId,
      employeeIds: data.initialEmployeeIds || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true
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
```

### 2. Read Department Operations

#### List All Departments
```typescript
export const getAllDepartments = async (): Promise<Department[]> => {
  try {
    const q = query(
      collection(db, 'departments'),
      where('isActive', '==', true),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocToDepartment);
  } catch (error) {
    throw handleDepartmentError(error, 'listing');
  }
};
```

#### Get Department by ID
```typescript
export const getDepartment = async (id: string): Promise<Department | null> => {
  try {
    const docRef = doc(db, 'departments', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().isActive) {
      return convertDocToDepartment(docSnap);
    }
    return null;
  } catch (error) {
    throw handleDepartmentError(error, 'retrieval');
  }
};
```

#### Get Department with Employee Details
```typescript
export const getDepartmentWithEmployees = async (id: string): Promise<DepartmentWithEmployees | null> => {
  try {
    const department = await getDepartment(id);
    if (!department) return null;

    // Fetch all employees in this department
    const employees = await Promise.all(
      department.employeeIds.map(employeeId => getEmployee(employeeId))
    );

    // Filter out any null results (deleted employees)
    const validEmployees = employees.filter(emp => emp !== null);

    // Fetch manager details
    const manager = await getEmployee(department.responsibleManagerId);

    return {
      ...department,
      employees: validEmployees,
      responsibleManager: manager
    };
  } catch (error) {
    throw handleDepartmentError(error, 'detailed retrieval');
  }
};
```

### 3. Update Department

#### Update Department Info
```typescript
interface UpdateDepartmentRequest {
  name?: string;
  responsibleManagerId?: string;
  employeeIds?: string[];
}

export const updateDepartment = async (
  id: string, 
  updates: UpdateDepartmentRequest
): Promise<void> => {
  try {
    const updateData: any = {
      updatedAt: Timestamp.now()
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

    // Validate and update responsible manager
    if (updates.responsibleManagerId !== undefined) {
      const manager = await getEmployee(updates.responsibleManagerId);
      if (!manager || manager.hierarchicalLevel !== 'manager') {
        throw new Error('Responsible manager must be a manager-level employee');
      }
      updateData.responsibleManagerId = updates.responsibleManagerId;
    }

    // Update employee list
    if (updates.employeeIds !== undefined) {
      updateData.employeeIds = updates.employeeIds;
      
      // Update all affected employees' department references
      const currentDepartment = await getDepartment(id);
      if (currentDepartment) {
        await updateEmployeeDepartmentReferences(
          currentDepartment.employeeIds,
          updates.employeeIds,
          id
        );
      }
    }

    const departmentRef = doc(db, 'departments', id);
    await updateDoc(departmentRef, updateData);
  } catch (error) {
    throw handleDepartmentError(error, 'update');
  }
};
```

### 4. Delete Department

#### Soft Delete Implementation
```typescript
export const deleteDepartment = async (id: string, transferToDepartmentId?: string): Promise<void> => {
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
        employeeIds: [...targetDepartment.employeeIds, ...department.employeeIds]
      });
    }

    // Soft delete department
    const departmentRef = doc(db, 'departments', id);
    await updateDoc(departmentRef, {
      isActive: false,
      updatedAt: Timestamp.now(),
      deletedAt: Timestamp.now()
    });
  } catch (error) {
    throw handleDepartmentError(error, 'deletion');
  }
};
```

## Employee-Department Relationship Management

### Transfer Employee Between Departments
```typescript
export const transferEmployeeToDepartment = async (
  employeeId: string, 
  newDepartmentId: string
): Promise<void> => {
  try {
    // Get current employee data
    const employee = await getEmployee(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Get target department
    const newDepartment = await getDepartment(newDepartmentId);
    if (!newDepartment) {
      throw new Error('Target department not found');
    }

    // Get current department (if exists)
    let oldDepartment: Department | null = null;
    if (employee.departmentId) {
      oldDepartment = await getDepartment(employee.departmentId);
    }

    // Update employee's department reference
    await updateEmployeeDepartment(employeeId, newDepartmentId);

    // Remove employee from old department
    if (oldDepartment) {
      const updatedOldEmployeeIds = oldDepartment.employeeIds.filter(id => id !== employeeId);
      await updateDepartment(oldDepartment.id, {
        employeeIds: updatedOldEmployeeIds
      });
    }

    // Add employee to new department
    const updatedNewEmployeeIds = [...newDepartment.employeeIds, employeeId];
    await updateDepartment(newDepartmentId, {
      employeeIds: updatedNewEmployeeIds
    });
  } catch (error) {
    throw handleDepartmentError(error, 'employee transfer');
  }
};
```

### Bulk Employee Operations
```typescript
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

    // Group employees by current department for efficient updates
    const employeesByDepartment: Record<string, string[]> = {};
    
    for (const employeeId of employeeIds) {
      const employee = await getEmployee(employeeId);
      if (employee?.departmentId) {
        if (!employeesByDepartment[employee.departmentId]) {
          employeesByDepartment[employee.departmentId] = [];
        }
        employeesByDepartment[employee.departmentId].push(employeeId);
      }
    }

    // Update employees' department references
    await Promise.all(
      employeeIds.map(employeeId => 
        updateEmployeeDepartment(employeeId, targetDepartmentId)
      )
    );

    // Update source departments
    for (const [deptId, empIds] of Object.entries(employeesByDepartment)) {
      const sourceDept = await getDepartment(deptId);
      if (sourceDept) {
        const updatedEmployeeIds = sourceDept.employeeIds.filter(
          id => !empIds.includes(id)
        );
        await updateDepartment(deptId, { employeeIds: updatedEmployeeIds });
      }
    }

    // Update target department
    const updatedTargetEmployeeIds = [
      ...targetDepartment.employeeIds,
      ...employeeIds.filter(id => !targetDepartment.employeeIds.includes(id))
    ];
    await updateDepartment(targetDepartmentId, {
      employeeIds: updatedTargetEmployeeIds
    });
  } catch (error) {
    throw handleDepartmentError(error, 'bulk employee transfer');
  }
};
```

## UI Components Specifications

### 1. Department Table (DepartmentHome.tsx)

#### Table Structure
```typescript
interface DepartmentTableColumn {
  field: keyof Department | 'employeeCount' | 'managerName';
  label: string;
  sortable: boolean;
  render?: (department: Department) => React.ReactNode;
}

const columns: DepartmentTableColumn[] = [
  { field: 'name', label: 'Nome', sortable: true },
  { field: 'managerName', label: 'Responsável', sortable: true },
  { field: 'employeeCount', label: 'Colaboradores', sortable: true },
  { field: 'createdAt', label: 'Criado em', sortable: true }
];
```

#### Department Table Features
- **Sorting**: All columns sortable (following employee table pattern)
- **Actions Menu**: Edit, Delete options with confirmation
- **Bulk Operations**: Select multiple departments for bulk delete
- **Search**: Filter by department name
- **Employee Count**: Show number of employees in each department
- **Manager Display**: Show responsible manager name

### 2. Department Form (DepartmentForm.tsx)

#### Form Structure (Modal/Drawer)
```typescript
interface DepartmentFormData {
  name: string;
  responsibleManagerId: string;
  employeeIds: string[];
}

interface DepartmentFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  department?: Department;
  onClose: () => void;
  onSubmit: (data: DepartmentFormData) => Promise<void>;
}
```

#### Form Fields
1. **Department Name**: Text input with validation
2. **Responsible Manager**: Autocomplete dropdown (manager-level employees only)
3. **Employee Assignment**: 
   - Multi-select list showing all employees
   - Current department display for each employee
   - Transfer confirmation for employees changing departments

### 3. Employee Transfer Interface

#### Transfer Modal Component
```typescript
interface EmployeeTransferProps {
  open: boolean;
  employeeIds: string[];
  onClose: () => void;
  onTransfer: (targetDepartmentId: string) => Promise<void>;
}
```

#### Transfer Features
- **Source Department Display**: Show current departments of selected employees
- **Target Department Selection**: Dropdown of available departments
- **Impact Preview**: Show how many employees will be transferred
- **Confirmation**: Clear summary before transfer

## Department Management Page Layout

### Page Structure (DepartmentHome.tsx)
```typescript
const DepartmentHome: React.FC = () => {
  // State management
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>();
  const [formOpen, setFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>();
  const [searchTerm, setSearchTerm] = useState('');

  // Actions
  const handleCreateDepartment = () => setFormOpen(true);
  const handleEditDepartment = (dept: Department) => {
    setEditingDepartment(dept);
    setFormOpen(true);
  };
  const handleDeleteDepartments = async (departmentIds: string[]) => {
    // Implementation with transfer dialog if needed
  };

  return (
    <DepartmentManagementLayout>
      {/* Header with create button and search */}
      <DepartmentHeader 
        onCreateNew={handleCreateDepartment}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {/* Department table */}
      <DepartmentTable
        departments={filteredDepartments}
        selectedDepartments={selectedDepartments}
        onSelectionChange={setSelectedDepartments}
        onEditDepartment={handleEditDepartment}
        onDeleteDepartments={handleDeleteDepartments}
      />
      
      {/* Department form modal */}
      <DepartmentForm
        open={formOpen}
        mode={editingDepartment ? 'edit' : 'create'}
        department={editingDepartment}
        onClose={() => {
          setFormOpen(false);
          setEditingDepartment(null);
        }}
        onSubmit={handleDepartmentSubmit}
      />
    </DepartmentManagementLayout>
  );
};
```

## Firebase Security Rules

### Department Security Rules
```javascript
// Add to firestore.rules
match /departments/{departmentId} {
  allow read, write: if isAuthenticated();
  
  allow create: if isAuthenticated() &&
    isValidDepartmentData(resource.data) &&
    isManagerEmployee(resource.data.responsibleManagerId);
    
  allow update: if isAuthenticated() &&
    isValidDepartmentData(resource.data) &&
    (resource.data.responsibleManagerId == request.data.responsibleManagerId ||
     isManagerEmployee(request.data.responsibleManagerId));
     
  allow delete: if isAuthenticated();
}

function isValidDepartmentData(data) {
  return data.keys().hasAll(['name', 'responsibleManagerId', 'employeeIds']) &&
         data.name is string &&
         data.name.size() > 0 &&
         data.name.size() <= 100 &&
         data.responsibleManagerId is string &&
         data.employeeIds is list;
}

function isManagerEmployee(employeeId) {
  return exists(/databases/$(database)/documents/employees/$(employeeId)) &&
         get(/databases/$(database)/documents/employees/$(employeeId))
           .data.professionalInfo.hierarchicalLevel == 'manager';
}
```

## Testing Strategy

### Department Management Tests
```typescript
// tests/departments/department-crud.spec.ts
test.describe('Department Management', () => {
  test('should create new department with manager', async ({ page }) => {
    // Navigate to departments page
    await page.goto('/departments');
    await page.click('text=Novo Departamento');
    
    // Fill department form
    await page.fill('[data-testid="department-name"]', 'Test Department');
    await page.click('[data-testid="manager-select"]');
    await page.click('text=Manager Name');
    
    // Submit and verify
    await page.click('[data-testid="submit-department"]');
    await expect(page.locator('text=Test Department')).toBeVisible();
  });

  test('should transfer employee between departments', async ({ page }) => {
    // Test employee transfer functionality
    await page.goto('/employees');
    await page.click('[data-testid="employee-row-1"] [data-testid="edit-button"]');
    
    // Change department
    await page.click('[data-testid="department-select"]');
    await page.click('text=New Department');
    
    // Verify transfer
    await page.click('[data-testid="save-employee"]');
    await expect(page.locator('text=New Department')).toBeVisible();
  });

  test('should prevent department deletion with employees', async ({ page }) => {
    await page.goto('/departments');
    await page.click('[data-testid="department-row"] [data-testid="delete-button"]');
    
    // Should show transfer dialog
    await expect(page.locator('[data-testid="transfer-dialog"]')).toBeVisible();
    await expect(page.locator('text=Transfer employees first')).toBeVisible();
  });
});
```

## Performance Optimizations

### Database Query Optimization
1. **Indexes**: Create composite indexes for common queries
2. **Pagination**: Implement pagination for large department lists
3. **Caching**: Cache frequently accessed department-employee relationships
4. **Denormalization**: Store department names with employees for faster display

### UI Performance
1. **Virtual Scrolling**: For large department lists
2. **Lazy Loading**: Load employee details on demand
3. **Debounced Search**: Optimize search input performance
4. **Memoization**: React.memo for department table rows

## Implementation Priority

### Phase 2A: Core Department CRUD
1. Department data model and Firebase service
2. Department listing page with table
3. Create/Edit department forms
4. Basic department-employee assignment

### Phase 2B: Advanced Features  
1. Employee transfer interface
2. Bulk operations
3. Department search and filtering
4. Enhanced validation and error handling

### Phase 2C: Polish & Testing
1. Comprehensive test coverage
2. Performance optimizations
3. UI/UX improvements
4. Documentation updates

This department management system provides complete CRUD functionality while maintaining the established patterns and ensuring data integrity through proper relationship management.