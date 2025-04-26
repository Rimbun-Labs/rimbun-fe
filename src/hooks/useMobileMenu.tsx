
import React, { createContext, useContext, useState } from 'react';

type MobileMenuProviderProps = {
  children: React.ReactNode;
};

type MobileMenuContextType = {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
};

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export const MobileMenuProvider: React.FC<MobileMenuProviderProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <MobileMenuContext.Provider value={{ isMobileMenuOpen, toggleMobileMenu, closeMobileMenu }}>
      {children}
    </MobileMenuContext.Provider>
  );
};

export const useMobileMenu = (): MobileMenuContextType => {
  const context = useContext(MobileMenuContext);
  
  if (context === undefined) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider');
  }
  
  return context;
};
