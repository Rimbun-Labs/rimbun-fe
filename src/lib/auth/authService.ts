import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthResponse {
  user: FirebaseUser | null;
  error: Error | null;
}

export const authService = {
  async signUpWithEmail({ email, password, fullName }: { email: string; password: string; fullName: string }): Promise<AuthResponse> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, {
        displayName: fullName
      });

      return { user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: error as Error };
    }
  },

  async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return { user, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: error as Error };
    }
  },

  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential: UserCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Get the ID token for backend authentication
      const idToken = await user.getIdToken();
      localStorage.setItem('firebaseIdToken', idToken);
      
      return { user, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { user: null, error: error as Error };
    }
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
      await firebaseSignOut(auth);
      
      // Clear any local storage or session data
      localStorage.removeItem('firebaseIdToken');
      
      return { error: null };
    } catch (error) {
      console.error('Error during sign out:', error);
      return { error: error as Error };
    }
  },

  async getCurrentUser(): Promise<FirebaseUser | null> {
    return auth.currentUser;
  },

  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  }
}; 