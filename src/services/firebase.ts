import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
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

// Collection reference
const employeesCollectionRef = collection(db, 'employees');

// Helper to convert Firestore DocumentData to Employee type - 4 fields only
const convertDocToEmployee = (doc: QueryDocumentSnapshot<DocumentData>): Employee => {
  const data = doc.data();
  return {
    id: doc.id,
    firstName: data.personalInfo.firstName,
    email: data.personalInfo.email,
    department: data.professionalInfo.department,
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
    const docRef = await addDoc(employeesCollectionRef, newEmployeeData);
    return docRef.id;
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
    const updateData: Partial<EmployeeFormData & { status: string; avatar: string }> = {};

    if (data.personalInfo) {
      updateData.personalInfo = data.personalInfo; // firstName, email, activateOnCreate
      updateData.status = data.personalInfo.activateOnCreate ? 'Ativo' : 'Inativo';
    }
    if (data.professionalInfo) {
      updateData.professionalInfo = data.professionalInfo; // department
    }

    await updateDoc(employeeDocRef, updateData);
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
    await deleteDoc(employeeDocRef);
  } catch (error) {
    throw handleFirebaseError(error, 'exclusão de colaborador');
  }
};
