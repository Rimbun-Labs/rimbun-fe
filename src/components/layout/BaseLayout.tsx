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
  layoutName: string; // For debug indicators
  debugColor: string; // For debug indicator styling
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ 
  useContainer = false, 
  layoutName, 
  debugColor 
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
                className={`min-w-0 overflow-y-auto ${useContainer ? 'p-4 md:p-6 bg-secondary/20' : 'bg-background'}`}
                style={{ flex: '1 1 auto' }} // Override flex-1 (1 1 0%) with industry standard (1 1 auto)
              >
                {/* Debug indicator - remove this after confirming layout works */}
                {process.env.NODE_ENV === 'development' && (
                  <div className={`mb-4 p-2 ${debugColor} text-xs rounded border`}>
                    {layoutName} - Current path: {location.pathname}
                  </div>
                )}
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