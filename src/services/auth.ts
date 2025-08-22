import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

export interface AuthError {
  code: string;
  message: string;
  userFriendlyMessage: string;
}

export const authService = {
  // Sign in with email/password
  signIn: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw handleAuthError(error);
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    try {
      await signOut(auth);
      // Clear any local storage data
      localStorage.removeItem('formData');
      sessionStorage.clear();
    } catch (error: any) {
      throw handleAuthError(error);
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
const handleAuthError = (error: any): AuthError => {
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
