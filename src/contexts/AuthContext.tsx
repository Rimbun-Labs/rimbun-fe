import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { authService } from '@/lib/auth/authService';
import { userService } from '@/lib/api/userService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRegistrationComplete: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRegistrationComplete, setUserRegistrationComplete] = useState(false);
  const lastProcessedUserIdRef = useRef<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    authService.getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
      // Check if user already has database ID stored
      if (user && userService.getDatabaseUserId()) {
        setUserRegistrationComplete(true);
        console.log('✅ AuthContext: User already has database ID stored');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (user) => {
      setUser(user);
      setLoading(false);
      
      // If user signed in (especially via Google OAuth), ensure they exist in backend
      if (user) {
        // Prevent duplicate processing for the same user
        if (lastProcessedUserIdRef.current === user.id) {
          console.log('🔄 AuthContext: User already processed, skipping:', user.id.substring(0, 8) + '...');
          return;
        }
        
        lastProcessedUserIdRef.current = user.id;
        setUserRegistrationComplete(false); // Reset on auth change
        
        try {
          console.log('🔵 AuthContext: User signed in, ensuring backend registration:', { 
            id: user.id.substring(0, 8) + '...', 
            email: user.email 
          });
          
          const result = await userService.ensureUserExists({
            authProviderId: user.id,
            displayName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
          });
          
          setUserRegistrationComplete(true); // Mark as complete
          console.log('✅ AuthContext: User registration completed:', result);
        } catch (backendError) {
          console.error('❌ AuthContext: Failed to ensure user exists in backend:', backendError);
          // Don't throw here - user is still authenticated with Supabase
        }
      } else {
        // User signed out, reset the last processed user ID
        lastProcessedUserIdRef.current = null;
        setUserRegistrationComplete(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string):Promise<any>  =>  {
    const { user, error } = await authService.signInWithEmail(email, password);
    if (error) throw error;
    if (user) {
      // Ensure user exists in backend
      try {
        setUserRegistrationComplete(false); // Reset before registration
        await userService.ensureUserExists({
          authProviderId: user.id,
          displayName: user.user_metadata?.full_name || email.split('@')[0],
          email: user.email || email,
        });
        setUserRegistrationComplete(true); // Mark as complete
      } catch (backendError) {
        console.error('Failed to ensure user exists in backend:', backendError);
        // Don't throw here - user is still authenticated with Supabase
      }
      // Removed: navigate('/home');
      // Let RootRedirect handle the navigation
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await authService.signInWithGoogle();
    if (error) throw error;
    // Note: For Google OAuth, the user will be available in the onAuthStateChange callback
    // We'll handle backend registration there
  };

  const signUp = async (email: string, password: string, fullName: string):Promise<any> => {
    const { user, error } = await authService.signUpWithEmail({ email, password, fullName });
    if (error) throw error;
    return user
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) throw error;
    
    // Clear the database user ID when signing out
    userService.clearDatabaseUserId();
    setUserRegistrationComplete(false); // Reset registration state
    
    navigate('/login');
  };

  const value = {
    user,
    loading,
    userRegistrationComplete,
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