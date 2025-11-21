import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  // Bell, // Notifications disabled for testbed launch
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from '@/hooks/useTheme';
import { useMobileMenu } from '@/hooks/useMobileMenu';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
// Notifications disabled for testbed launch - backend endpoints not available
// import { useNotifications, useNotificationCount, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from '@/hooks/useNotifications';
import MobileMenu from './MobileMenu';
// import { formatDistanceToNow } from 'date-fns'; // Not needed when notifications disabled

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

  // Notifications disabled for testbed launch - backend endpoints not available
  // const { data: notifications = [], isLoading: notificationsLoading } = useNotifications();
  // const { data: unreadCount = 0 } = useNotificationCount();
  // const markAllAsRead = useMarkAllNotificationsAsRead();
  // const markAsRead = useMarkNotificationAsRead();
  
  // Disabled notifications - return empty data
  const notifications: any[] = [];
  const notificationsLoading = false;
  const unreadCount = 0;
  const markAllAsRead = { mutateAsync: async () => {}, isPending: false };
  const markAsRead = { mutateAsync: async () => {} };

  // Show latest 5 notifications
  const displayNotifications = notifications.slice(0, 5);

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
        <div className="flex h-16 items-center px-4 md:px-6">
          {showFullNav && (
            <div className="md:hidden mr-2">
              <Button onClick={toggleMobileMenu} variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          )}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center space-x-2">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-primary-foreground font-bold">IL</span>
              </div>
              <span className="font-semibold hidden md:inline-block">Investlearn</span>
            </Link>
          </div>
          <div className="flex-1 flex justify-end items-center space-x-4">
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
            {/* Notifications disabled for testbed launch - backend endpoints not available */}
            {/* {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex justify-between items-center p-2 border-b">
                    <span className="font-medium">Notifications</span>
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        disabled={markAllAsRead.isPending}
                      >
                        {markAllAsRead.isPending ? 'Marking...' : 'Mark all as read'}
                      </Button>
                    )}
                  </div>
                  <div className="py-2 max-h-96 overflow-y-auto">
                    {notificationsLoading ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Loading notifications...
                      </div>
                    ) : displayNotifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      displayNotifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className={`cursor-pointer ${!notification.isRead ? 'bg-muted/50' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-start justify-between gap-2">
                              <span className={`font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </span>
                              {!notification.isRead && (
                                <span className="h-2 w-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {notification.message}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                    {notifications.length > 5 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/notifications" className="w-full text-center text-sm text-primary">
                            View all notifications
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )} */}

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
