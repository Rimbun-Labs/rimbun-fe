import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
  updateProfile,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { storageUtils } from '../storage/storageUtils';

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
      
      // Configure provider to avoid COOP issues
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Use redirect instead of popup to avoid COOP issues
      const userCredential: UserCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Get the ID token for backend authentication
      const idToken = await user.getIdToken();
      storageUtils.setItem('firebaseIdToken', idToken);
      
      return { user, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      
      // Handle specific COOP errors
      if (error instanceof Error && error.message.includes('Cross-Origin-Opener-Policy')) {
        console.log('🔄 Google OAuth COOP error detected, this is a browser security feature');
        // The authentication may still succeed despite the COOP warning
        return { user: null, error: new Error('Authentication popup blocked by browser security. Please try again or use email/password login.') };
      }
      
      return { user: null, error: error as Error };
    }
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
      await firebaseSignOut(auth);
      
      // Clear any local storage or session data
      storageUtils.removeItem('firebaseIdToken');
      
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
  },

  async sendEmailVerification(user: FirebaseUser): Promise<{ error: Error | null }> {
    try {
      await firebaseSendEmailVerification(user);
      return { error: null };
    } catch (error) {
      console.error('Email verification error:', error);
      return { error: error as Error };
    }
  },

  async resendVerificationEmail(user: FirebaseUser): Promise<{ error: Error | null }> {
    try {
      await firebaseSendEmailVerification(user);
      return { error: null };
    } catch (error) {
      console.error('Resend verification email error:', error);
      return { error: error as Error };
    }
  },

  async sendPasswordResetEmail(email: string): Promise<{ error: Error | null }> {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      console.error('Password reset email error:', error);
      return { error: error as Error };
    }
  },

  async confirmPasswordReset(code: string, newPassword: string): Promise<{ error: Error | null }> {
    try {
      await firebaseConfirmPasswordReset(auth, code, newPassword);
      return { error: null };
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      return { error: error as Error };
    }
  },

  async reauthenticateUser(user: FirebaseUser, currentPassword: string): Promise<{ error: Error | null }> {
    try {
      if (!user.email) {
        throw new Error('User email not found');
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      return { error: null };
    } catch (error: any) {
      console.error('Re-authentication error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/wrong-password') {
        return { error: new Error('Current password is incorrect') };
      } else if (error.code === 'auth/user-mismatch') {
        return { error: new Error('User mismatch') };
      } else if (error.code === 'auth/user-not-found') {
        return { error: new Error('User not found') };
      } else if (error.code === 'auth/invalid-credential') {
        return { error: new Error('Invalid credentials') };
      }
      
      return { error: error as Error };
    }
  },

  async updateUserPassword(user: FirebaseUser, newPassword: string): Promise<{ error: Error | null }> {
    try {
      // Validate password length
      if (newPassword.length < 6) {
        return { error: new Error('Password must be at least 6 characters long') };
      }

      await firebaseUpdatePassword(user, newPassword);
      return { error: null };
    } catch (error: any) {
      console.error('Update password error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/requires-recent-login') {
        return { error: new Error('Please re-authenticate to change your password') };
      } else if (error.code === 'auth/weak-password') {
        return { error: new Error('Password is too weak. Please choose a stronger password') };
      }
      
      return { error: error as Error };
    }
  }
}; 