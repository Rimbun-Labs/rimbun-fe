import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Sun,
  Moon,
  User,
  Menu,
  LogOut,
  MessageCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from '@/hooks/useTheme';
import { useMobileMenu } from '@/hooks/useMobileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Logo } from '@/components/ui/Logo';
import MobileMenu from './MobileMenu';
import { useBusinessChatEnabled } from '@/hooks/useBusinessChatEnabled';
import { useAskRimbun } from '@/contexts/AskRimbunContext';

interface AppHeaderProps {
  showFullNav?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ showFullNav = true }) => {
  const { theme, setTheme } = useTheme();
  const { toggleMobileMenu } = useMobileMenu();
  const { signOut, user, operator } = useAuth();
  const { toast } = useToast();
  const { enabled: chatEnabled } = useBusinessChatEnabled();
  const { openAsk } = useAskRimbun();
  const appHome = user ? '/app' : '/';
  const tenantLabel = operator?.tenantName?.trim() || null;
  const showAsk = chatEnabled && operator?.tenantType === "business";

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

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            {showFullNav && (
              <div className="md:hidden">
                <Button onClick={toggleMobileMenu} variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </div>
            )}
            <Link to={appHome} className="flex items-center space-x-2">
              <Logo size="md" showText className="hidden md:flex" />
              <Logo size="md" className="md:hidden" />
            </Link>
            {tenantLabel ? (
              <>
                <span
                  className="hidden sm:block h-5 w-px bg-border"
                  aria-hidden
                />
                <span
                  className="hidden sm:block max-w-[12rem] truncate text-sm text-muted-foreground"
                  title={tenantLabel}
                >
                  {tenantLabel}
                </span>
              </>
            ) : null}
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {showAsk ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={openAsk}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Ask</span>
              </Button>
            ) : null}
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
                  <Link to="/profile">Account</Link>
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
