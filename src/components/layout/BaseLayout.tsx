import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { MobileMenuProvider } from '@/hooks/useMobileMenu';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from '@/hooks/useTheme';
import { useSession } from '@/contexts/SessionContext';
import { AskRimbunProvider, useAskRimbun } from '@/contexts/AskRimbunContext';
import { AskRimbunPanel } from '@/components/chat/AskRimbunPanel';

interface BaseLayoutProps {
  useContainer?: boolean;
  containMaxWidth?: boolean;
}

function AppChrome({
  useContainer,
  containMaxWidth,
  showFullLayout,
}: {
  useContainer: boolean;
  containMaxWidth: boolean;
  showFullLayout: boolean;
}) {
  const { open: askOpen } = useAskRimbun();
  const useMaxWidth = useContainer && containMaxWidth && !askOpen;
  const innerClassName = useContainer
    ? useMaxWidth
      ? "min-w-0 w-full max-w-7xl mx-auto pb-16"
      : "min-w-0 w-full pb-16"
    : "min-w-0 w-full";
  const innerStyle = !useContainer || !useMaxWidth ? { maxWidth: 'none' as const } : {};

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <AppHeader showFullNav={showFullLayout} />
      </div>
      <div className="flex w-full min-w-0 pt-16">
        {showFullLayout && (
          <div className="hidden md:block w-64 shrink-0">
            <AppSidebar />
          </div>
        )}
        <main
          className={`min-w-0 flex-1 overflow-y-auto ${useContainer ? 'p-4 md:p-6 bg-secondary/20' : 'bg-background'}`}
        >
          <div className={innerClassName} style={innerStyle}>
            <Outlet />
          </div>
        </main>
        <AskRimbunPanel />
      </div>
    </div>
  );
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  useContainer = false,
  containMaxWidth = true,
}) => {
  const { session } = useSession();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const hasCompletedAssessment = Boolean(session?.id && session?.isCompleted);
  const showFullLayout = !isHomePage || hasCompletedAssessment;

  return (
    <ThemeProvider>
      <MobileMenuProvider>
        <SidebarProvider>
          <AskRimbunProvider>
            <AppChrome
              useContainer={useContainer}
              containMaxWidth={containMaxWidth}
              showFullLayout={showFullLayout}
            />
          </AskRimbunProvider>
        </SidebarProvider>
      </MobileMenuProvider>
    </ThemeProvider>
  );
};

export default BaseLayout;
