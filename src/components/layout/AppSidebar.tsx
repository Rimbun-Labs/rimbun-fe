import React, { useMemo, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
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
  Wallet,
  CalendarDays,
  Plug,
  Upload,
} from 'lucide-react';
import { useSelectedCustomer } from '@/contexts/SelectedCustomerContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { APP_ROOT, appCustomers, businessWorkspaceBase } from '@/lib/appPaths';

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

/** Customer id only when path is under `/app/customers/:id`. */
function customerIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/app\/customers\/([^/]+)/);
  return match?.[1] ?? null;
}

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { customers } = useSelectedCustomer();
  const { operator } = useAuth();
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

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    setIsCatalogOpen(
      path.includes('/banking-products') ||
        path.includes('/investment-explorer') ||
        path.includes('/insurance')
    );
  }, [location.pathname]);

  if (isBusinessTenant) {
    return (
      <SidebarContent>
        <nav className="space-y-4">
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Business
              </h3>
            </div>
            <NavLink
              to={APP_ROOT}
              end
              className={({ isActive }) => cn(navInactive, isActive && navActive)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Home
            </NavLink>
            <NavLink
              to={`${APP_ROOT}/money`}
              className={({ isActive }) => cn(navInactive, isActive && navActive)}
            >
              <Wallet className="h-4 w-4" />
              Money
            </NavLink>
            <NavLink
              to={`${APP_ROOT}/plans`}
              className={({ isActive }) => cn(navInactive, isActive && navActive)}
            >
              <CalendarDays className="h-4 w-4" />
              Plans
            </NavLink>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Data
              </h3>
            </div>
            <NavLink
              to={`${APP_ROOT}/import`}
              className={({ isActive }) => cn(navInactive, isActive && navActive)}
            >
              <Upload className="h-4 w-4" />
              Import data
            </NavLink>
            <NavLink
              to={`${APP_ROOT}/sources`}
              className={({ isActive }) => cn(navInactive, isActive && navActive)}
            >
              <Plug className="h-4 w-4" />
              Sources
            </NavLink>
          </div>
        </nav>
      </SidebarContent>
    );
  }

  return (
    <SidebarContent>
      <nav className="space-y-4">
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </h3>
          </div>
          <NavLink
            to={APP_ROOT}
            end
            className={({ isActive }) =>
              cn(navInactive, isActive && navActive)
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Home
          </NavLink>
          <NavLink
            to={appCustomers()}
            end
            className={({ isActive }) =>
              cn(navInactive, isActive && navActive)
            }
          >
            <Users className="h-4 w-4" />
            Customer portfolio
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
            {isBusinessCustomerView && businessBase ? (
              <>
                <NavLink
                  to={businessBase}
                  end
                  className={({ isActive }) =>
                    cn(navInactive, isActive && navActive)
                  }
                >
                  <Building2 className="h-4 w-4" />
                  Home
                </NavLink>
                <NavLink
                  to={`${businessBase}/money`}
                  className={({ isActive }) =>
                    cn(navInactive, isActive && navActive)
                  }
                >
                  <Wallet className="h-4 w-4" />
                  Money
                </NavLink>
                <NavLink
                  to={`${businessBase}/plans`}
                  className={({ isActive }) =>
                    cn(navInactive, isActive && navActive)
                  }
                >
                  <CalendarDays className="h-4 w-4" />
                  Plans
                </NavLink>
                <div className="px-3 pb-1 pt-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Data
                  </h3>
                </div>
                <NavLink
                  to={`${businessBase}/import`}
                  className={({ isActive }) =>
                    cn(navInactive, isActive && navActive)
                  }
                >
                  <Upload className="h-4 w-4" />
                  Import data
                </NavLink>
                <NavLink
                  to={`${businessBase}/sources`}
                  className={({ isActive }) =>
                    cn(navInactive, isActive && navActive)
                  }
                >
                  <Plug className="h-4 w-4" />
                  Sources
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
              </>
            ) : (
              <>
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
              </>
            )}
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
      </nav>
    </SidebarContent>
  );
};

export default AppSidebar;
