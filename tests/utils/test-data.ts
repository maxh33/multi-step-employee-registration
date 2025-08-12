/**
 * Test data factory for 4-field employee form
 * Supports all required fields: firstName, email, activateOnCreate, department
 */

export interface TestEmployeeData {
  firstName: string;
  email: string;
  activateOnCreate: boolean;
  department: string;
}

export const validEmployeeData: TestEmployeeData = {
  firstName: 'João Silva',
  email: 'joao.silva@test.com',
  activateOnCreate: true,
  department: 'desenvolvimento',
};

export const invalidEmployeeData = {
  firstName: '', // Missing required field
  email: 'invalid-email', // Invalid format
  activateOnCreate: undefined, // Missing boolean value
  department: '', // Missing required field
};

export const departmentOptions = [
  { value: 'desenvolvimento', label: 'Desenvolvimento' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'vendas', label: 'Vendas' },
  { value: 'rh', label: 'Recursos Humanos' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'operacoes', label: 'Operações' },
  { value: 'suporte', label: 'Suporte ao Cliente' },
  { value: 'ti', label: 'TI' },
  { value: 'produto', label: 'Produto' },
];

export const generateRandomEmployee = (): TestEmployeeData => {
  const randomId = Math.floor(Math.random() * 1000);
  const randomDept = departmentOptions[Math.floor(Math.random() * departmentOptions.length)];
  
  return {
    firstName: `TestUser${randomId}`,
    email: `test${randomId}@example.com`,
    activateOnCreate: Math.random() > 0.5,
    department: randomDept.value,
  };
};

export const getTestDataForStep = (step: number): Partial<TestEmployeeData> => {
  switch (step) {
    case 1:
      return {
        firstName: validEmployeeData.firstName,
        email: validEmployeeData.email,
        activateOnCreate: validEmployeeData.activateOnCreate,
      };
    case 2:
      return {
        department: validEmployeeData.department,
      };
    default:
      return validEmployeeData;
  }
};