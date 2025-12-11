import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Sun,
  Moon,
  User,
  Menu,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from '@/hooks/useTheme';
import { useMobileMenu } from '@/hooks/useMobileMenu';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import MobileMenu from './MobileMenu';
import JourneyTracker from '@/components/dashboard/JourneyTracker';

interface AppHeaderProps {
  showFullNav?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ showFullNav = true }) => {
  const { theme, setTheme } = useTheme();
  const { toggleMobileMenu } = useMobileMenu();
  const { session } = useSession();
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const hasCompletedAssessment = Boolean(session?.isCompleted);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log out",
      });
    }
  };

  // Notification handlers disabled - backend endpoints not available
  // const handleMarkAllAsRead = async () => {
  //   if (unreadCount > 0) {
  //     await markAllAsRead.mutateAsync();
  //   }
  // };

  // const handleNotificationClick = async (notification: typeof notifications[0]) => {
  //   // Mark as read if unread
  //   if (!notification.isRead) {
  //     await markAsRead.mutateAsync(notification.id);
  //   }
  //   
  //   // Navigate if action URL exists
  //   if (notification.actionUrl) {
  //     navigate(notification.actionUrl);
  //   }
  // };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6 gap-4">
          {showFullNav && (
            <div className="md:hidden mr-2">
              <Button onClick={toggleMobileMenu} variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          )}
          <div className="flex items-center shrink-0">
            <Link to="/home" className="flex items-center space-x-2">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-primary-foreground font-bold">IL</span>
              </div>
              <span className="font-semibold hidden md:inline-block">Investlearn</span>
            </Link>
          </div>
          
          {/* Journey Tracker - Only show if assessment is completed */}
          {showFullNav && hasCompletedAssessment && (
            <div className="flex-1 flex justify-center items-center min-w-0 mx-2 md:mx-4">
              <JourneyTracker variant="compact" />
            </div>
          )}
          
          <div className="flex items-center space-x-4 shrink-0">
            {/* Home Link */}
            <Link
              to="/home"
              className={cn(
                "hidden md:flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === "/home"
                  ? "text-foreground bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              Home
            </Link>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <MobileMenu />
    </>
  );
};

export default AppHeader;
