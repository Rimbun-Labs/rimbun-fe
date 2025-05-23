import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { authService } from '@/lib/auth/authService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    authService.getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string):Promise<any>  =>  {
    const { user, error } = await authService.signInWithEmail(email, password);
    if (error) throw error;
    if (user) {
      navigate('/home');
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await authService.signInWithGoogle();
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string):Promise<any> => {
    const { user, error } = await authService.signUpWithEmail({ email, password, fullName });
    if (error) throw error;
    return user
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) throw error;
    navigate('/login');
  };

  const value = {
    user,
    loading,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 