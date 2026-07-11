import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { MobileMenuProvider } from '@/hooks/useMobileMenu';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from '@/hooks/useTheme';
import { useSession } from '@/contexts/SessionContext';

interface BaseLayoutProps {
  useContainer?: boolean; // Controls whether to use container padding (ContentLayout) or w-full (AppLayout)
  /** When useContainer is true, cap content at max-w-7xl. Set to false for full-width content (e.g. Banking). Default true. */
  containMaxWidth?: boolean;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  useContainer = false,
  containMaxWidth = true,
}) => {
  const { session } = useSession();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const hasCompletedAssessment = Boolean(session?.id && session?.isCompleted);

  // Operator console: always show chrome on authenticated app routes (not gated on consumer assessment).
  const showFullLayout = !isHomePage || hasCompletedAssessment;

  const useMaxWidth = useContainer && containMaxWidth;
  const innerClassName = useContainer
    ? useMaxWidth
      ? "min-w-0 w-full max-w-7xl mx-auto pb-16"
      : "min-w-0 w-full pb-16"
    : "min-w-0 w-full";
  const innerStyle = !useContainer || !useMaxWidth ? { maxWidth: 'none' as const } : {};

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
                className={`flex-1 min-w-0 overflow-y-auto ${useContainer ? 'p-4 md:p-6 bg-secondary/20' : 'bg-background'}`}
              >
                <div className={innerClassName} style={innerStyle}>
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