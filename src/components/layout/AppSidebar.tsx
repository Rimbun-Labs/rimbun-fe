
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, BookOpen, HelpCircle, BarChart, PieChart, Star } from "lucide-react";
import { useMobileMenu } from '@/hooks/useMobileMenu';

const AppSidebar = () => {
  const location = useLocation();
  const { isMobileMenuOpen } = useMobileMenu();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar 
      className={cn(
        "md:flex transition-transform duration-300", 
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={isActive("/dashboard")}>
                  <Link to="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={isActive("/assessment")}>
                  <Link to="/assessment">
                    <BarChart />
                    <span>Assessment</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild active={isActive("/learning")}>
                  <Link to="/learning">
                    <BookOpen />
                    <span>Learning</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={isActive("/portfolio")}>
                  <Link to="/portfolio">
                    <PieChart />
                    <span>Portfolio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={isActive("/recommendations")}>
                  <Link to="/recommendations">
                    <Star />
                    <span>Recommendations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={isActive("/help")}>
                  <Link to="/help">
                    <HelpCircle />
                    <span>Help & FAQ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
