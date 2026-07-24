import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { authService } from '@/lib/auth/authService';
import { userService } from '@/lib/api/userService';
import { apiClient } from '@/lib/api/client';
import { storageUtils } from '@/lib/storage/storageUtils';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase/config';
import {
  AccessRestrictedError,
  markAccessRestricted,
} from '@/lib/auth/accessRestricted';

/** Bank operator identity from GET /dashboard/me. */
export type OperatorSession = {
  authenticated: true;
  tenantUserId: string;
  tenantId: string;
  tenantName: string | null;
  tenantSlug: string | null;
  role: string;
  email?: string;
  uid?: string;
};

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  /**
   * True once Firebase session is resolved against tenant_user via /dashboard/me.
   * (Name is legacy; means entitled operator, not B2C registration.)
   */
  userRegistrationComplete: boolean;
  /** Entitled operator workspace; null when signed out or not entitled. */
  operator: OperatorSession | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type MeResponse = {
  authenticated?: boolean;
  tenantUserId?: string;
  tenantId?: string;
  tenantName?: string | null;
  tenantSlug?: string | null;
  role?: string;
  email?: string;
  uid?: string;
};

function toOperatorSession(data: MeResponse): OperatorSession | null {
  if (!data?.authenticated || !data.tenantUserId || !data.tenantId || !data.role) {
    return null;
  }
  return {
    authenticated: true,
    tenantUserId: data.tenantUserId,
    tenantId: data.tenantId,
    tenantName: data.tenantName ?? null,
    tenantSlug: data.tenantSlug ?? null,
    role: data.role,
    email: data.email,
    uid: data.uid,
  };
}

async function fetchOperatorSession(): Promise<OperatorSession | null> {
  try {
    const { data } = await apiClient.get<MeResponse>('/dashboard/me');
    return toOperatorSession(data ?? {});
  } catch (err) {
    console.warn('AuthContext: /dashboard/me failed — no tenant_user entitlement or auth error', err);
    return null;
  }
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRegistrationComplete, setUserRegistrationComplete] = useState(false);
  const [operator, setOperator] = useState<OperatorSession | null>(null);
  const navigate = useNavigate();

  /** When true, interactive sign-in owns the /me check (avoids double-fetch races). */
  const signInInFlightRef = useRef(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (nextUser) => {
      if (signInInFlightRef.current) {
        // Interactive sign-in path owns entitlement; only keep Firebase user in sync.
        if (!nextUser) {
          setUser(null);
          setOperator(null);
          setUserRegistrationComplete(false);
          setLoading(false);
        } else {
          setUser(nextUser);
        }
        return;
      }

      if (!nextUser) {
        setUser(null);
        setOperator(null);
        setUserRegistrationComplete(false);
        setLoading(false);
        return;
      }

      // Keep loading true until entitlement is known — avoids bouncing entitled operators.
      setLoading(true);
      setUser(nextUser);

      const session = await fetchOperatorSession();
      if (session) {
        setOperator(session);
        setUserRegistrationComplete(true);
        setLoading(false);
        return;
      }

      // Firebase identity without tenant_user: clear session and flag the login UI.
      markAccessRestricted(nextUser.email);
      setOperator(null);
      setUserRegistrationComplete(false);
      await authService.signOut();
      // onAuthStateChange(null) clears loading.
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const completeEntitledSignIn = async (): Promise<void> => {
    const session = await fetchOperatorSession();
    if (session) {
      setOperator(session);
      setUserRegistrationComplete(true);
      setLoading(false);
      return;
    }

    const email = auth.currentUser?.email ?? null;
    markAccessRestricted(email);
    setOperator(null);
    setUserRegistrationComplete(false);
    await authService.signOut();
    throw new AccessRestrictedError(undefined, email);
  };

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    signInInFlightRef.current = true;
    setLoading(true);
    try {
      const { error } = await authService.signInWithEmail(email, password);
      if (error) throw error;
      await completeEntitledSignIn();
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      signInInFlightRef.current = false;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    signInInFlightRef.current = true;
    setLoading(true);
    try {
      const { error } = await authService.signInWithGoogle();
      if (error) throw error;
      await completeEntitledSignIn();
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      signInInFlightRef.current = false;
    }
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
    setOperator(null);

    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userRegistrationComplete,
        operator,
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
