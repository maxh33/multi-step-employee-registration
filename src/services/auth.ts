import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

export interface AuthError {
  code: string;
  message: string;
  userFriendlyMessage: string;
}

interface FirebaseError {
  code: string;
  message: string;
  customData?: unknown;
}

export const authService = {
  // Sign in with email/password
  signIn: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw handleAuthError(error as FirebaseError);
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    try {
      await signOut(auth);
      
      // Clear application data with error handling
      try {
        // Clear form data and other localStorage items
        localStorage.removeItem('formData');
        localStorage.removeItem('employeeFormData');
        localStorage.removeItem('departmentFormData');
        
        // Clear only app-specific session storage items to avoid breaking other applications
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('lastAuthCheck');
        sessionStorage.removeItem('authState');
      } catch (storageError) {
        // Log storage cleanup errors but don't fail logout
        console.warn('Failed to clear some storage data during logout:', storageError);
      }
    } catch (error) {
      throw handleAuthError(error as FirebaseError);
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Subscribe to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
};

// Firebase Auth error handling
const handleAuthError = (error: FirebaseError): AuthError => {
  let userFriendlyMessage = 'Ocorreu um erro durante a autenticação.';

  switch (error.code) {
    case 'auth/invalid-email':
      userFriendlyMessage = 'E-mail inválido.';
      break;
    case 'auth/user-disabled':
      userFriendlyMessage = 'Esta conta foi desabilitada.';
      break;
    case 'auth/user-not-found':
      userFriendlyMessage = 'Usuário não encontrado.';
      break;
    case 'auth/wrong-password':
      userFriendlyMessage = 'Senha incorreta.';
      break;
    case 'auth/invalid-credential':
      userFriendlyMessage = 'E-mail ou senha incorretos.';
      break;
    case 'auth/too-many-requests':
      userFriendlyMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      break;
    case 'auth/network-request-failed':
      userFriendlyMessage = 'Erro de conexão. Verifique sua internet.';
      break;
    default:
      userFriendlyMessage = 'Erro de autenticação. Tente novamente.';
  }

  return {
    code: error.code,
    message: error.message,
    userFriendlyMessage,
  };
};
