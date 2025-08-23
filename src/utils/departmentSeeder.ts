// Department seeder - creates initial departments for the system
import { createDepartment } from '../services/departments';
import { getAllDepartments } from '../services/departments';

const defaultDepartments = [
  { name: 'Desenvolvimento', managerId: '' },
  { name: 'Design', managerId: '' },
  { name: 'Marketing', managerId: '' },
  { name: 'Vendas', managerId: '' },
  { name: 'Recursos Humanos', managerId: '' },
  { name: 'Financeiro', managerId: '' },
  { name: 'Operações', managerId: '' },
  { name: 'Suporte', managerId: '' },
  { name: 'Jurídico', managerId: '' },
  { name: 'Produto', managerId: '' },
];

export const seedDepartments = async (defaultManagerId?: string) => {
  try {
    // Check if departments already exist
    const existingDepartments = await getAllDepartments();
    
    if (existingDepartments.length > 0) {
      console.log('Departments already exist, skipping seed');
      return;
    }

    console.log('Seeding departments...');
    
    // Create each department
    for (const dept of defaultDepartments) {
      try {
        await createDepartment({
          name: dept.name,
          responsibleManagerId: defaultManagerId || 'system', // Use system as placeholder
        });
        console.log(`Created department: ${dept.name}`);
      } catch (error) {
        console.error(`Error creating department ${dept.name}:`, error);
      }
    }
    
    console.log('Department seeding complete');
  } catch (error) {
    console.error('Error seeding departments:', error);
  }
};

// Function to check and seed if needed on app startup
export const initializeDepartments = async () => {
  try {
    const departments = await getAllDepartments();
    if (departments.length === 0) {
      console.log('No departments found, initializing...');
      // You would need to create a default manager first or use a system ID
      await seedDepartments();
    }
  } catch (error) {
    console.error('Error initializing departments:', error);
  }
};

export default seedDepartments;
