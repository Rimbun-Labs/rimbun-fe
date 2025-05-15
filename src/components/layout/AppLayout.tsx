import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { MobileMenuProvider } from '@/hooks/useMobileMenu';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from '@/hooks/useTheme';

const AppLayout: React.FC = () => {
  return (
    <ThemeProvider>
      <MobileMenuProvider>
        <SidebarProvider>
          <div className="min-h-screen flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-50">
              <AppHeader />
            </div>
            <div className="flex flex-1 pt-16">
              <div className="hidden md:block w-64 shrink-0">
                <AppSidebar />
              </div>
              <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary/20">
                <div className="container mx-auto pb-16">
                  <Outlet />
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </MobileMenuProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
