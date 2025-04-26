
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
            <AppHeader />
            <div className="flex flex-1 overflow-hidden">
              <AppSidebar />
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
