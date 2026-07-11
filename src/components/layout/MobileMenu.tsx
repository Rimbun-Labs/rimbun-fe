import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMobileMenu } from '@/hooks/useMobileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useSelectedCustomer } from '@/contexts/SelectedCustomerContext';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  User,
  Compass,
  LogOut,
  Building2,
  Shield,
  ClipboardList,
  Package,
  UserCircle,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Logo } from '@/components/ui/Logo';

function customerIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/dashboard\/customers\/([^/]+)/);
  return match?.[1] ?? null;
}

const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();
  const { signOut } = useAuth();
  const { customers } = useSelectedCustomer();
  const { toast } = useToast();
  const location = useLocation();

  const routeCustomerId = customerIdFromPath(location.pathname);
  const customerBase = routeCustomerId
    ? `/dashboard/customers/${routeCustomerId}`
    : null;

  const customerLabel = useMemo(() => {
    if (!routeCustomerId) return null;
    const row = customers.find((c) => c.customerId === routeCustomerId);
    return row?.displayName || row?.externalCustomerId || routeCustomerId;
  }, [customers, routeCustomerId]);

  const isActive = (path: string) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = async () => {
    try {
      await signOut();
      closeMobileMenu();
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

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
      active
        ? "bg-accent !text-accent-foreground"
        : "text-muted-foreground sidebar-nav-inactive"
    );

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={closeMobileMenu}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Logo size="md" showText />
          </SheetTitle>
        </SheetHeader>

        <nav className="space-y-6">
          <div className="space-y-2">
            <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
              Dashboard
            </h3>
            <Link
              to="/dashboard"
              className={linkClass(location.pathname === '/dashboard')}
              onClick={closeMobileMenu}
            >
              <LayoutDashboard className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/dashboard/customers"
              className={linkClass(
                location.pathname === '/dashboard/customers'
              )}
              onClick={closeMobileMenu}
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>
          </div>

          {customerBase ? (
            <div className="space-y-2">
              <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
                Customer
              </h3>
              {customerLabel ? (
                <p className="px-2 text-xs text-muted-foreground truncate">{customerLabel}</p>
              ) : null}
              <Link
                to={customerBase}
                className={linkClass(location.pathname === customerBase)}
                onClick={closeMobileMenu}
              >
                <UserCircle className="h-4 w-4" />
                Overview
              </Link>
              <Link
                to={`${customerBase}/assessment`}
                className={linkClass(location.pathname.includes('/assessment'))}
                onClick={closeMobileMenu}
              >
                <ClipboardList className="h-4 w-4" />
                Assessment
              </Link>
              <Link
                to={`${customerBase}/products`}
                className={linkClass(location.pathname.includes('/products'))}
                onClick={closeMobileMenu}
              >
                <Package className="h-4 w-4" />
                Products
              </Link>
            </div>
          ) : null}

          <div className="space-y-2">
            <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
              Catalog
            </h3>
            <Link
              to="/banking-products"
              className={linkClass(isActive('/banking-products'))}
              onClick={closeMobileMenu}
            >
              <Building2 className="h-4 w-4" />
              Banking
            </Link>
            <Link
              to="/investment-explorer"
              className={linkClass(isActive('/investment-explorer'))}
              onClick={closeMobileMenu}
            >
              <Compass className="h-4 w-4" />
              Investments
            </Link>
            <Link
              to="/insurance"
              className={linkClass(isActive('/insurance'))}
              onClick={closeMobileMenu}
            >
              <Shield className="h-4 w-4" />
              Insurance
            </Link>
          </div>

          <div className="space-y-2">
            <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
              Account
            </h3>
            <Link
              to="/profile"
              className={linkClass(isActive('/profile'))}
              onClick={closeMobileMenu}
            >
              <User className="h-4 w-4" />
              Account
            </Link>
          </div>

          <div className="space-y-2 pt-6 border-t">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
