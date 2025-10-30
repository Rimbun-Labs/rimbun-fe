import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  BarChart3,
  User,
  Compass,
  DollarSign,
  TrendingUp,
  LineChart
} from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { useBankPermission } from '@/hooks/useBankPermission';

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "h-full w-full border-r bg-background px-3 py-4",
      className
    )}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const AppSidebar: React.FC = () => {
  const { session, isLoading } = useSession();
  const hasCompletedAssessment = Boolean(session?.isCompleted);
  const { hasPermission: hasBankPermission, isLoading: isLoadingPermission } = useBankPermission();

  // Show loading state for Investment Explorer link
  const renderInvestmentExplorerLink = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed">
          <Compass className="h-4 w-4" />
          Investment Explorer
        </div>
      );
    }

    return (
      <NavLink
        to={hasCompletedAssessment ? `/investment-explorer/${session.id}` : '/assessment'}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
            isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            !hasCompletedAssessment && "opacity-50 cursor-not-allowed"
          )
        }
        title={!hasCompletedAssessment ? "Complete your assessment to access the Investment Explorer" : ""}
      >
        <Compass className="h-4 w-4" />
        Investment Explorer
      </NavLink>
    );
  };

  return (
    <SidebarContent>
      <nav className="space-y-6">
        {/* Overview Section */}
        <div className="space-y-2">
          <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
            Overview
          </h3>
          <NavLink
            to={session?.id ? `/dashboard/${session.id}` : '/dashboard'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground sidebar-nav-inactive"
              )
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink
            to="/assessment"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground sidebar-nav-inactive"
              )
            }
          >
            <BarChart3 className="h-4 w-4" />
            Assessment
          </NavLink>
          <NavLink
            to="/spending-analysis"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground sidebar-nav-inactive"
              )
            }
          >
            <DollarSign className="h-4 w-4" />
            Spending
          </NavLink>
          <NavLink
            to="/cash-flow-projections"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground sidebar-nav-inactive"
              )
            }
          >
            <TrendingUp className="h-4 w-4" />
            Cash Flow
          </NavLink>
        </div>

        {/* Learning Section */}
        <div className="space-y-2">
          <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
            Learning
          </h3>
          <NavLink
            to="/learning"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground sidebar-nav-inactive"
              )
            }
          >
            <GraduationCap className="h-4 w-4" />
            Learning Library
          </NavLink>
          <NavLink
            to={session?.id ? `/learning-path/${session.id}` : '/learning'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground sidebar-nav-inactive"
              )
            }
          >
            <BookOpen className="h-4 w-4" />
            Learning Paths
          </NavLink>
          {renderInvestmentExplorerLink()}
        </div>

        {/* Profile Section */}
        <div className="space-y-2">
          <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
            Profile
          </h3>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground sidebar-nav-inactive"
              )
            }
          >
            <User className="h-4 w-4" />
            Profile
          </NavLink>
        </div>

        {/* Administration Section - Only shown if user has bank permission */}
        {/* Debug: Uncomment the line below to always show Analytics for testing */}
        {/* {(!isLoadingPermission && hasBankPermission) || true && ( */}
        {!isLoadingPermission && hasBankPermission && (
          <div className="space-y-2">
            <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
              Administration
            </h3>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground sidebar-nav-inactive"
                )
              }
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </NavLink>
          </div>
        )}
        {/* Debug info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="px-2 text-xs text-muted-foreground mt-4 pt-4 border-t">
            <div>Permission Check: {isLoadingPermission ? 'Loading...' : hasBankPermission ? '✅ Has Access' : '❌ No Access'}</div>
          </div>
        )}
      </nav>
    </SidebarContent>
  );
};

export default AppSidebar;
