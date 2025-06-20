import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMobileMenu } from '@/hooks/useMobileMenu';
import { useSession } from '@/contexts/SessionContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  BarChart3,
  User,
  Compass,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();
  const { session } = useSession();
  const location = useLocation();
  const hasCompletedAssessment = Boolean(session?.isCompleted);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={closeMobileMenu}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-primary-foreground font-bold">IL</span>
            </div>
            <span>Investlearn</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="space-y-6">
          {/* Overview Section */}
          <div className="space-y-2">
            <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
              Overview
            </h3>
            <Link
              to={session?.id ? `/dashboard/${session.id}` : '/dashboard'}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive(`/dashboard${session?.id ? `/${session.id}` : ''}`) 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground sidebar-nav-inactive"
              )}
              onClick={closeMobileMenu}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/assessment"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive('/assessment') 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground sidebar-nav-inactive"
              )}
              onClick={closeMobileMenu}
            >
              <BarChart3 className="h-4 w-4" />
              Assessment
            </Link>
          </div>

          {/* Learning Section */}
          <div className="space-y-2">
            <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
              Learning
            </h3>
            <Link
              to="/learning"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive('/learning') 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground sidebar-nav-inactive"
              )}
              onClick={closeMobileMenu}
            >
              <GraduationCap className="h-4 w-4" />
              Learning Library
            </Link>
            <Link
              to={session?.id ? `/learning-path/${session.id}` : '/learning'}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive(`/learning-path/${session?.id}`) 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground sidebar-nav-inactive"
              )}
              onClick={closeMobileMenu}
            >
              <BookOpen className="h-4 w-4" />
              Learning Paths
            </Link>
            <Link
              to={hasCompletedAssessment ? `/investment-explorer/${session.id}` : '/assessment'}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive(`/investment-explorer/${session?.id}`) 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground sidebar-nav-inactive",
                !hasCompletedAssessment && "opacity-50 cursor-not-allowed"
              )}
              onClick={closeMobileMenu}
              title={!hasCompletedAssessment ? "Complete your assessment to access the Investment Explorer" : ""}
            >
              <Compass className="h-4 w-4" />
              Investment Explorer
            </Link>
          </div>

          {/* Profile Section */}
          <div className="space-y-2">
            <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
              Profile
            </h3>
            <Link
              to="/profile"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive('/profile') 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground sidebar-nav-inactive"
              )}
              onClick={closeMobileMenu}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu; 