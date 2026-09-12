import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMobileMenu } from '@/hooks/useMobileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useSelectedCustomer } from '@/contexts/SelectedCustomerContext';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Compass,
  LogOut,
  Building2,
  Shield,
  ClipboardList,
  Package,
  UserCircle,
  Users,
  Wallet,
  CalendarDays,
  Plug,
  Upload,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Logo } from '@/components/ui/Logo';
import { APP_ROOT, appCustomers, businessWorkspaceBase } from '@/lib/appPaths';

function customerIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/app\/customers\/([^/]+)/);
  return match?.[1] ?? null;
}

const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();
  const { signOut, operator } = useAuth();
  const { customers } = useSelectedCustomer();
  const { toast } = useToast();
  const location = useLocation();
  const isBusinessTenant = operator?.tenantType === "business";

  const routeCustomerId = customerIdFromPath(location.pathname);
  const customerBase = routeCustomerId
    ? `${appCustomers()}/${routeCustomerId}`
    : null;

  const routeCustomer = useMemo(() => {
    if (!routeCustomerId) return null;
    return customers.find((c) => c.customerId === routeCustomerId) ?? null;
  }, [customers, routeCustomerId]);

  const isBusinessCustomerView = routeCustomer?.customerType === "business";
  const businessBase = isBusinessTenant
    ? businessWorkspaceBase()
    : isBusinessCustomerView && routeCustomerId
      ? businessWorkspaceBase(routeCustomerId)
      : null;

  const customerLabel = useMemo(() => {
    if (!routeCustomerId) return null;
    return (
      routeCustomer?.displayName ||
      routeCustomer?.externalCustomerId ||
      routeCustomerId
    );
  }, [routeCustomer, routeCustomerId]);

  const isActive = (path: string) =>
    path === APP_ROOT
      ? location.pathname === APP_ROOT
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
          {isBusinessTenant ? (
            <>
              <div className="space-y-2">
                <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
                  Business
                </h3>
                <Link to={APP_ROOT} className={linkClass(location.pathname === APP_ROOT)} onClick={closeMobileMenu}>
                  <LayoutDashboard className="h-4 w-4" />
                  Home
                </Link>
                <Link to={`${APP_ROOT}/money`} className={linkClass(isActive(`${APP_ROOT}/money`))} onClick={closeMobileMenu}>
                  <Wallet className="h-4 w-4" />
                  Money
                </Link>
                <Link to={`${APP_ROOT}/plans`} className={linkClass(isActive(`${APP_ROOT}/plans`))} onClick={closeMobileMenu}>
                  <CalendarDays className="h-4 w-4" />
                  Plans
                </Link>
                <Link to={`${APP_ROOT}/review`} className={linkClass(isActive(`${APP_ROOT}/review`))} onClick={closeMobileMenu}>
                  <FileText className="h-4 w-4" />
                  Review
                </Link>
              </div>
              <div className="space-y-2">
                <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
                  Data
                </h3>
                <Link to={`${APP_ROOT}/import`} className={linkClass(isActive(`${APP_ROOT}/import`))} onClick={closeMobileMenu}>
                  <Upload className="h-4 w-4" />
                  Import data
                </Link>
                <Link to={`${APP_ROOT}/connections`} className={linkClass(isActive(`${APP_ROOT}/connections`))} onClick={closeMobileMenu}>
                  <Plug className="h-4 w-4" />
                  Connections
                </Link>
                <Link to={`${APP_ROOT}/sources`} className={linkClass(isActive(`${APP_ROOT}/sources`))} onClick={closeMobileMenu}>
                  <ClipboardList className="h-4 w-4" />
                  Sources
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <h3 className="px-2 text-sm font-semibold text-muted-foreground sidebar-section-header">
                  Workspace
                </h3>
                <Link
                  to={APP_ROOT}
                  className={linkClass(location.pathname === APP_ROOT)}
                  onClick={closeMobileMenu}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  to={appCustomers()}
                  className={linkClass(location.pathname === appCustomers())}
                  onClick={closeMobileMenu}
                >
                  <Users className="h-4 w-4" />
                  Customer portfolio
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
                  {isBusinessCustomerView && businessBase ? (
                    <>
                      <Link to={businessBase} className={linkClass(location.pathname === businessBase)} onClick={closeMobileMenu}>
                        <Building2 className="h-4 w-4" />
                        Home
                      </Link>
                      <Link to={`${businessBase}/money`} className={linkClass(isActive(`${businessBase}/money`))} onClick={closeMobileMenu}>
                        <Wallet className="h-4 w-4" />
                        Money
                      </Link>
                      <Link to={`${businessBase}/plans`} className={linkClass(isActive(`${businessBase}/plans`))} onClick={closeMobileMenu}>
                        <CalendarDays className="h-4 w-4" />
                        Plans
                      </Link>
                      <Link to={`${businessBase}/review`} className={linkClass(isActive(`${businessBase}/review`))} onClick={closeMobileMenu}>
                        <FileText className="h-4 w-4" />
                        Review
                      </Link>
                      <h3 className="px-2 pt-3 text-sm font-semibold text-muted-foreground sidebar-section-header">
                        Data
                      </h3>
                      <Link to={`${businessBase}/import`} className={linkClass(isActive(`${businessBase}/import`))} onClick={closeMobileMenu}>
                        <Upload className="h-4 w-4" />
                        Import data
                      </Link>
                      <Link to={`${businessBase}/connections`} className={linkClass(isActive(`${businessBase}/connections`))} onClick={closeMobileMenu}>
                        <Plug className="h-4 w-4" />
                        Connections
                      </Link>
                      <Link to={`${businessBase}/sources`} className={linkClass(isActive(`${businessBase}/sources`))} onClick={closeMobileMenu}>
                        <ClipboardList className="h-4 w-4" />
                        Sources
                      </Link>
                      <Link to={`${customerBase}/products`} className={linkClass(location.pathname.includes('/products'))} onClick={closeMobileMenu}>
                        <Package className="h-4 w-4" />
                        Products
                      </Link>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
            </>
          )}

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
