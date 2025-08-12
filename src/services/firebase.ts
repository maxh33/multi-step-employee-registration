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

// Helper to convert Firestore DocumentData to Employee type
const convertDocToEmployee = (doc: QueryDocumentSnapshot<DocumentData>): Employee => {
  const data = doc.data();
  return {
    id: doc.id,
    firstName: data.personalInfo.firstName,
    lastName: data.personalInfo.lastName,
    email: data.personalInfo.email,
    phone: data.personalInfo.phone,
    department: data.professionalInfo.department,
    position: data.professionalInfo.position,
    status: data.status,
    avatar: data.avatar || '#CCCCCC',
    createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
  };
};

// Helper to handle Firebase errors and return a new Error object
const handleFirebaseError = (error: unknown): Error => {
  let message = 'Ocorreu um erro inesperado. Tente novamente.';
  if (error && typeof error === 'object' && 'code' in error) {
    const firebaseError = error as { code: string };
    switch (firebaseError.code) {
      case 'permission-denied':
        message = 'Permissão negada. Verifique as regras de segurança do Firestore.';
        break;
      case 'unavailable':
        message = 'O serviço está temporariamente indisponível. Tente novamente mais tarde.';
        break;
      case 'not-found':
        message = 'O documento solicitado não foi encontrado.';
        break;
      case 'deadline-exceeded':
        message = 'O tempo para a operação foi excedido. Verifique sua conexão com a internet.';
        break;
      default:
        message = `Um erro ocorreu: ${firebaseError.code}. Por favor, contate o suporte.`;
    }
  }
  console.error('Firebase Error:', error);
  return new Error(message);
};

// Firebase Operations

export const createEmployee = async (data: EmployeeFormData): Promise<string> => {
  try {
    const newEmployeeData = {
      personalInfo: data.personalInfo,
      professionalInfo: data.professionalInfo,
      additionalInfo: data.additionalInfo,
      status: data.personalInfo.activateOnCreate ? 'Ativo' : 'Inativo',
      avatar: '#FF6B6B',
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(employeesCollectionRef, newEmployeeData);
    return docRef.id;
  } catch (error) {
    throw handleFirebaseError(error);
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
      updateData.personalInfo = data.personalInfo;
      updateData.status = data.personalInfo.activateOnCreate ? 'Ativo' : 'Inativo';
    }
    if (data.professionalInfo) {
      updateData.professionalInfo = data.professionalInfo;
    }
    if (data.additionalInfo) {
      updateData.additionalInfo = data.additionalInfo;
    }

    await updateDoc(employeeDocRef, updateData);
  } catch (error) {
    throw handleFirebaseError(error);
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
    throw handleFirebaseError(error);
  }
};

export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const q = query(employeesCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocToEmployee);
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    const employeeDocRef = doc(db, 'employees', id);
    await deleteDoc(employeeDocRef);
  } catch (error) {
    throw handleFirebaseError(error);
  }
};
