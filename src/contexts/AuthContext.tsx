import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { authService } from '@/lib/auth/authService';
import { userService } from '@/lib/api/userService';
import { apiClient } from '@/lib/api/client';
import { storageUtils } from '@/lib/storage/storageUtils';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  /** True once Firebase session is resolved against tenant_user via /dashboard/me. */
  userRegistrationComplete: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRegistrationComplete, setUserRegistrationComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (!nextUser) {
        setUserRegistrationComplete(false);
        return;
      }

      try {
        const { data } = await apiClient.get<{ authenticated?: boolean }>('/dashboard/me');
        setUserRegistrationComplete(data?.authenticated === true);
      } catch (err) {
        console.warn('AuthContext: /dashboard/me failed — no tenant_user entitlement or auth error', err);
        setUserRegistrationComplete(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<any> => {
    const { user: signedIn, error } = await authService.signInWithEmail(email, password);
    if (error) throw error;
    return signedIn;
  };

  const signInWithGoogle = async () => {
    const { error } = await authService.signInWithGoogle();
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<any> => {
    const { user: created, error } = await authService.signUpWithEmail({ email, password, fullName });
    if (error) throw error;
    return created;
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) throw error;

    userService.clearDatabaseUserId();
    storageUtils.removeItem('assessmentSessionId');
    setUserRegistrationComplete(false);

    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userRegistrationComplete,
        signInWithEmail,
        signInWithGoogle,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
