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
    avatar: data.avatar || '#CCCCCC', // Default avatar if not present
    createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
  };
};

// Firebase Operations

/**
 * Creates a new employee document in Firestore.
 * @param data Employee form data.
 * @returns The ID of the newly created document.
 */
export const createEmployee = async (data: EmployeeFormData): Promise<string> => {
  try {
    const newEmployeeData = {
      personalInfo: data.personalInfo,
      professionalInfo: data.professionalInfo,
      additionalInfo: data.additionalInfo,
      status: data.personalInfo.activateOnCreate ? 'Ativo' : 'Inativo',
      avatar: '#FF6B6B', // Default avatar color for new employees
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(employeesCollectionRef, newEmployeeData);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing employee document in Firestore.
 * @param id The ID of the employee document to update.
 * @param data Partial employee form data to update.
 */
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
    throw error;
  }
};

/**
 * Fetches a single employee document from Firestore by ID.
 * @param id The ID of the employee document to fetch.n * @returns The Employee object or null if not found.
 */
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
    throw error;
  }
};

/**
 * Fetches all employee documents from Firestore.
 * @returns An array of Employee objects.
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const q = query(employeesCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocToEmployee);
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes an employee document from Firestore.
 * @param id The ID of the employee document to delete.
 */
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    const employeeDocRef = doc(db, 'employees', id);
    await deleteDoc(employeeDocRef);
  } catch (error) {
    throw error;
  }
};
