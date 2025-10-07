import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { authService } from '@/lib/auth/authService';
import { userService } from '@/lib/api/userService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  userRegistrationComplete: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRegistrationComplete, setUserRegistrationComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth changes - this is the ONLY place that handles user setup
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        
        try {
          console.log('🔵 AuthContext: User signed in, ensuring backend registration:', { 
            id: user.uid.substring(0, 8) + '...', 
            email: user.email 
          });
          
          // First, try to get the database user ID for existing users
          const existingDatabaseUserId = await userService.getDatabaseUserIdForExistingUser(user.uid);
          
          if (existingDatabaseUserId) {
            console.log('✅ AuthContext: Found existing user in database');
            setUserRegistrationComplete(true);
          } else {
            // User doesn't exist, create them
            const result = await userService.ensureUserExists({
              authProviderId: user.uid,
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              email: user.email || '',
            });
            
            setUserRegistrationComplete(true); // Mark as complete
            console.log('✅ AuthContext: User registration completed:', result);
          }
        } catch (backendError) {
          console.error('❌ AuthContext: Failed to ensure user exists in backend:', backendError);
          
          // Check if user already has database ID stored (might be a "user already exists" error)
          if (userService.getDatabaseUserId()) {
            console.log('✅ AuthContext: User already has database ID stored, marking as complete');
            setUserRegistrationComplete(true);
          } else {
            console.log('⚠️ AuthContext: User registration failed and no database ID found');
            
            // Check if this is a network/server error vs user error
            const errorMessage = backendError instanceof Error ? backendError.message : String(backendError);
            if (errorMessage.includes('Failed to connect') || errorMessage.includes('ECONNREFUSED')) {
              console.log('🔄 AuthContext: Backend server not available, allowing user to proceed with cached data');
              // Allow user to proceed if backend is down but they have cached data
              setUserRegistrationComplete(true);
            } else {
              console.log('❌ AuthContext: User registration failed, user needs to retry');
              // Don't set userRegistrationComplete to true - user needs to retry
            }
          }
        }
      } else {
        // User signed out
        setUserRegistrationComplete(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<any> => {
    const { user, error } = await authService.signInWithEmail(email, password);
    if (error) throw error;
    // Note: Backend registration is handled in onAuthStateChange callback
    return user;
  };

  const signInWithGoogle = async () => {
    const { error } = await authService.signInWithGoogle();
    if (error) throw error;
    // Note: Backend registration is handled in onAuthStateChange callback
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<any> => {
    const { user, error } = await authService.signUpWithEmail({ email, password, fullName });
    if (error) throw error;
    return user;
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) throw error;
    
    // Clear the database user ID when signing out
    userService.clearDatabaseUserId();
    setUserRegistrationComplete(false); // Reset registration state
    
    navigate('/'); // Go to landing page instead of login
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      userRegistrationComplete,
      signInWithEmail,
      signInWithGoogle,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 