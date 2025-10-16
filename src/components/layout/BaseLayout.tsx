import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { MobileMenuProvider } from '@/hooks/useMobileMenu';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from '@/hooks/useTheme';
import { useSession } from '@/contexts/SessionContext';

interface BaseLayoutProps {
  useContainer?: boolean; // Controls whether to use container mx-auto (ContentLayout) or w-full (AppLayout)
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ 
  useContainer = false
}) => {
  const { session } = useSession();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const hasCompletedAssessment = Boolean(session?.id && session?.isCompleted);

  // Show full layout only if assessment is completed or on non-home pages
  const showFullLayout = hasCompletedAssessment || !isHomePage;

  return (
    <ThemeProvider>
      <MobileMenuProvider>
        <SidebarProvider>
          <div className="min-h-screen flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-50">
              <AppHeader showFullNav={showFullLayout} />
            </div>
            <div className="flex w-full pt-16">
              {showFullLayout && (
                <div className="hidden md:block w-64 shrink-0">
                  <AppSidebar />
                </div>
              )}
              <main 
                className={`flex-1 overflow-y-auto ${useContainer ? 'p-4 md:p-6 bg-secondary/20' : 'bg-background'}`}
              >
                <div 
                  className={useContainer ? "max-w-7xl mx-auto pb-16" : "w-full"}
                  style={!useContainer ? {maxWidth: 'none'} : {}}
                >
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

export default BaseLayout; 