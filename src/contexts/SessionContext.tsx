import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResponseGroup } from '@/lib/api/types/assessment';

interface SessionContextType {
  sessionId: string | null;
  setSessionId: (id: string) => void;
  session: ResponseGroup | null;
  setSession: (session: ResponseGroup) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<ResponseGroup | null>(null);

  const clearSession = () => {
    setSessionId(null);
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{ 
      sessionId, 
      setSessionId, 
      session, 
      setSession, 
      clearSession 
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}; 