import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Sun,
  Moon,
  User,
  Menu
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

const AppHeader: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { toggleMobileMenu } = useMobileMenu();
  const { session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="md:hidden mr-2">
          <Button onClick={toggleMobileMenu} variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-primary-foreground font-bold">IL</span>
            </div>
            <span className="font-semibold hidden md:inline-block">Investlearn</span>
          </Link>
        </div>
        <div className="flex-1 flex justify-end items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/assessment">Start Assessment</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/learning">Learning Library</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to={session?.id ? `/learning-path/${session.id}` : '/learning'}>Learning Paths</Link>
            </Button>
          </nav>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex justify-between items-center p-2 border-b">
                <span className="font-medium">Notifications</span>
                <Button variant="ghost" size="sm">Mark all as read</Button>
              </div>
              <div className="py-2">
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Complete your risk assessment</span>
                    <span className="text-sm text-muted-foreground">Finish your assessment to see personalized recommendations</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">New learning module available</span>
                    <span className="text-sm text-muted-foreground">Check out our latest content on ETF investing</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Weekly investment digest</span>
                    <span className="text-sm text-muted-foreground">Your market summary for this week is ready</span>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

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
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
