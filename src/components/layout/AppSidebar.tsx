import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  Target, 
  HelpCircle,
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react';

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
  return (
    <SidebarContent>
      <nav className="space-y-6">
        {/* Overview Section */}
        <div className="space-y-2">
          <h3 className="px-2 text-sm font-semibold text-muted-foreground">
            Overview
          </h3>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
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
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )
            }
          >
            <BarChart3 className="h-4 w-4" />
            Assessment
          </NavLink>
        </div>

        {/* Learning Section */}
        <div className="space-y-2">
          <h3 className="px-2 text-sm font-semibold text-muted-foreground">
            Learning
          </h3>
          <NavLink
            to="/learning"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )
            }
          >
            <GraduationCap className="h-4 w-4" />
            Learning Path
          </NavLink>
          <NavLink
            to="/learning/modules"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )
            }
          >
            <BookOpen className="h-4 w-4" />
            Course Modules
          </NavLink>
          <NavLink
            to="/learning/goals"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )
            }
          >
            <Target className="h-4 w-4" />
            Learning Goals
          </NavLink>
        </div>

        {/* Help Section */}
        <div className="space-y-2">
          <h3 className="px-2 text-sm font-semibold text-muted-foreground">
            Support
          </h3>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )
            }
          >
            <HelpCircle className="h-4 w-4" />
            Help & FAQ
          </NavLink>
        </div>
      </nav>
    </SidebarContent>
  );
};

export default AppSidebar;
