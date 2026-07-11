import React, { useMemo, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  User,
  ChevronDown,
  ChevronUp,
  Building2,
  Shield,
  Compass,
  PackageOpen,
  ClipboardList,
  Package,
  UserCircle,
  Users,
} from 'lucide-react';
import { useSelectedCustomer } from '@/contexts/SelectedCustomerContext';
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

const navInactive =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent text-muted-foreground sidebar-nav-inactive";
const navActive = "bg-accent !text-accent-foreground";
const childNav =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ml-4 border-l-2";

/** Customer id only when path is under `/dashboard/customers/:id`. */
function customerIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/dashboard\/customers\/([^/]+)/);
  return match?.[1] ?? null;
}

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { customers } = useSelectedCustomer();

  const routeCustomerId = customerIdFromPath(location.pathname);
  const customerBase = routeCustomerId
    ? `/dashboard/customers/${routeCustomerId}`
    : null;

  const customerLabel = useMemo(() => {
    if (!routeCustomerId) return null;
    const row = customers.find((c) => c.customerId === routeCustomerId);
    return row?.displayName || row?.externalCustomerId || routeCustomerId;
  }, [customers, routeCustomerId]);

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    setIsCatalogOpen(
      path.includes('/banking-products') ||
        path.includes('/investment-explorer') ||
        path.includes('/insurance')
    );
    setIsAccountOpen(path.includes('/profile'));
  }, [location.pathname]);

  return (
    <SidebarContent>
      <nav className="space-y-4">
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dashboard
            </h3>
          </div>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              cn(navInactive, isActive && navActive)
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Home
          </NavLink>
          <NavLink
            to="/dashboard/customers"
            end
            className={({ isActive }) =>
              cn(navInactive, isActive && navActive)
            }
          >
            <Users className="h-4 w-4" />
            Customers
          </NavLink>
        </div>

        {customerBase ? (
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Customer
              </h3>
              {customerLabel ? (
                <p
                  className="mt-1 truncate text-[11px] text-muted-foreground"
                  title={customerLabel}
                >
                  {customerLabel}
                </p>
              ) : null}
            </div>
            <NavLink
              to={customerBase}
              end
              className={({ isActive }) =>
                cn(navInactive, isActive && navActive)
              }
            >
              <UserCircle className="h-4 w-4" />
              Overview
            </NavLink>
            <NavLink
              to={`${customerBase}/assessment`}
              className={({ isActive }) =>
                cn(navInactive, isActive && navActive)
              }
            >
              <ClipboardList className="h-4 w-4" />
              Assessment
            </NavLink>
            <NavLink
              to={`${customerBase}/products`}
              className={({ isActive }) =>
                cn(navInactive, isActive && navActive)
              }
            >
              <Package className="h-4 w-4" />
              Products
            </NavLink>
          </div>
        ) : null}

        <div className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Catalog
            </h3>
          </div>
          <Collapsible open={isCatalogOpen} onOpenChange={setIsCatalogOpen}>
            <CollapsibleTrigger className={cn(navInactive, "w-full justify-between")}>
              <div className="flex items-center gap-3">
                <PackageOpen className="h-4 w-4" />
                <span>Catalog</span>
              </div>
              {isCatalogOpen ? (
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
                    childNav,
                    isActive
                      ? "bg-accent text-accent-foreground border-primary"
                      : "text-muted-foreground sidebar-nav-inactive border-border"
                  )
                }
              >
                <Building2 className="h-4 w-4" />
                Banking
              </NavLink>
              <NavLink
                to="/investment-explorer"
                className={({ isActive }) =>
                  cn(
                    childNav,
                    isActive
                      ? "bg-accent text-accent-foreground border-primary"
                      : "text-muted-foreground sidebar-nav-inactive border-border"
                  )
                }
              >
                <Compass className="h-4 w-4" />
                Investments
              </NavLink>
              <NavLink
                to="/insurance"
                className={({ isActive }) =>
                  cn(
                    childNav,
                    isActive
                      ? "bg-accent text-accent-foreground border-primary"
                      : "text-muted-foreground sidebar-nav-inactive border-border"
                  )
                }
              >
                <Shield className="h-4 w-4" />
                Insurance
              </NavLink>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="space-y-1">
          <Collapsible open={isAccountOpen} onOpenChange={setIsAccountOpen}>
            <CollapsibleTrigger className={cn(navInactive, "w-full justify-between")}>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4" />
                <span>Account</span>
              </div>
              {isAccountOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  cn(
                    childNav,
                    isActive
                      ? "bg-accent text-accent-foreground border-primary"
                      : "text-muted-foreground sidebar-nav-inactive border-border"
                  )
                }
              >
                <User className="h-4 w-4" />
                Profile
              </NavLink>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </nav>
    </SidebarContent>
  );
};

export default AppSidebar;
