import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import { MobileMenuProvider } from '@/hooks/useMobileMenu';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from '@/hooks/useTheme';

/**
 * PublicLayout - Layout for public pages (About, Contact, Privacy, Terms, Cookies)
 * Includes AppHeader but no sidebar
 */
const PublicLayout: React.FC = () => {
  return (
    <ThemeProvider>
      <MobileMenuProvider>
        <SidebarProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <div className="fixed top-0 left-0 right-0 z-50">
              <AppHeader showFullNav={false} />
            </div>
            <main className="flex-1 pt-16 bg-background">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </MobileMenuProvider>
    </ThemeProvider>
  );
};

export default PublicLayout;

