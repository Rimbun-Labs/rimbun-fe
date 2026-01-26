import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  LineChart,
  Target,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Building2
} from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { useBankPermission } from '@/hooks/useBankPermission';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';

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
  const location = useLocation();
  
  // State for collapsible sections
  const [isPlanningOpen, setIsPlanningOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isLearningOpen, setIsLearningOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  
  // Auto-expand sections based on current route
  useEffect(() => {
    // Auto-expand Financial Analysis section if on goals, spending, or planning pages
    const isOnPlanningPage = location.pathname.includes('/goals') || 
                             location.pathname.includes('/spending') ||
                             location.pathname.includes('/planning');
    setIsPlanningOpen(isOnPlanningPage);
    
    // Auto-expand Explorer section if on banking products or investment explorer pages
    const isOnExplorerPage = location.pathname.includes('/banking-products') ||
                            location.pathname.includes('/investment-explorer');
    setIsExplorerOpen(isOnExplorerPage);
    
    // Auto-expand Learning section if on learning pages (but NOT investment-explorer)
    const isOnLearningPage = location.pathname.includes('/learning') || 
                            location.pathname.includes('/learning-path');
    setIsLearningOpen(isOnLearningPage);
  }, [location.pathname]);

  // Show loading state for Investment Explorer link
  const renderInvestmentExplorerLink = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed ml-4 border-l-2 border-border">
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
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ml-4 border-l-2",
            isActive 
              ? "bg-accent !text-accent-foreground border-primary" 
              : "text-muted-foreground sidebar-nav-inactive border-border",
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
      <nav className="space-y-4">
        {/* Primary Navigation - Always Visible */}
        <div className="space-y-1">
          <NavLink
            to={session?.id ? `/dashboard/${session.id}` : '/dashboard'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent !text-accent-foreground" : "text-muted-foreground sidebar-nav-inactive"
              )
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
        </div>

        {/* Financial Analysis Section - Collapsible */}
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Financial Analysis
            </h3>
          </div>
          <Collapsible open={isPlanningOpen} onOpenChange={setIsPlanningOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all sidebar-nav-inactive">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4" />
                <span>Financial Analysis</span>
              </div>
              {isPlanningOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              <NavLink
                to="/goals"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ml-4 border-l-2",
                    isActive 
                      ? "bg-accent text-accent-foreground border-primary" 
                      : "text-muted-foreground sidebar-nav-inactive border-border"
                  )
                }
              >
                <Target className="h-4 w-4" />
                Goals
              </NavLink>
              <NavLink
                to="/spending"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ml-4 border-l-2",
                    isActive 
                      ? "bg-accent text-accent-foreground border-primary" 
                      : "text-muted-foreground sidebar-nav-inactive border-border"
                  )
                }
              >
                <DollarSign className="h-4 w-4" />
                Spending
              </NavLink>
              <NavLink
                to="/planning"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ml-4 border-l-2",
                    isActive 
                      ? "bg-accent text-accent-foreground border-primary" 
                      : "text-muted-foreground sidebar-nav-inactive border-border"
                  )
                }
              >
                <BarChart3 className="h-4 w-4" />
                Planning
              </NavLink>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Explorer Section - Collapsible */}
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Explorer
            </h3>
          </div>
          <Collapsible open={isExplorerOpen} onOpenChange={setIsExplorerOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all sidebar-nav-inactive">
              <div className="flex items-center gap-3">
                <Compass className="h-4 w-4" />
                <span>Explorer</span>
              </div>
              {isExplorerOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              <NavLink
                to="/banking-products"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ml-4 border-l-2",
                    isActive 
                      ? "bg-accent text-accent-foreground border-primary" 
                      : "text-muted-foreground sidebar-nav-inactive border-border"
                  )
                }
              >
                <Building2 className="h-4 w-4" />
                Banking
              </NavLink>
              {renderInvestmentExplorerLink()}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Learning Section - Collapsible */}
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Learning
            </h3>
          </div>
          <Collapsible open={isLearningOpen} onOpenChange={setIsLearningOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all sidebar-nav-inactive">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4" />
                <span>Learning</span>
              </div>
              {isLearningOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              <NavLink
                to="/learning"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ml-4 border-l-2",
                    isActive 
                      ? "bg-accent text-accent-foreground border-primary" 
                      : "text-muted-foreground sidebar-nav-inactive border-border"
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
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ml-4 border-l-2",
                    isActive 
                      ? "bg-accent text-accent-foreground border-primary" 
                      : "text-muted-foreground sidebar-nav-inactive border-border"
                  )
                }
              >
                <BookOpen className="h-4 w-4" />
                Learning Paths
              </NavLink>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Other Section - Collapsible (Collapsed by Default) */}
        <div className="space-y-1">
          <Collapsible open={isMoreOpen} onOpenChange={setIsMoreOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all sidebar-nav-inactive">
              <div className="flex items-center gap-3">
                <MoreHorizontal className="h-4 w-4" />
                <span>Account</span>
              </div>
              {isMoreOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              <NavLink
                to="/assessment"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ml-4 border-l-2",
                    isActive 
                      ? "bg-accent text-accent-foreground border-primary" 
                      : "text-muted-foreground sidebar-nav-inactive border-border"
                  )
                }
              >
                <BarChart3 className="h-4 w-4" />
                Assessment
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ml-4 border-l-2",
                    isActive 
                      ? "bg-accent text-accent-foreground border-primary" 
                      : "text-muted-foreground sidebar-nav-inactive border-border"
                  )
                }
              >
                <User className="h-4 w-4" />
                Profile
              </NavLink>
              {!isLoadingPermission && hasBankPermission && (
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ml-4 border-l-2",
                      isActive 
                        ? "bg-accent !text-accent-foreground border-primary" 
                        : "text-muted-foreground sidebar-nav-inactive border-border"
                    )
                  }
                >
                  <LineChart className="h-4 w-4" />
                  Analytics
                </NavLink>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

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
