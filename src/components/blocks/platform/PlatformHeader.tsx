import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { platformAudiences } from "./content";

const DOCS_API_URL = "https://docs.rimbun.co/api";

/** Header matching the platform mockup — used on /platform and audience pages. */
export function PlatformHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const { operator } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setSolutionsOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-colors duration-200",
          isScrolled
            ? "border-b border-[#e8e8ea] bg-[#f7f7f8]/95 backdrop-blur-md dark:border-border dark:bg-background/95"
            : "bg-[#f7f7f8]/80 backdrop-blur-sm dark:bg-background/80"
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between gap-4 px-8">
          <Link to="/platform" className="flex items-center gap-2">
            <Logo size="sm" variant="header" />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              Rimbun
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/platform"
              className="text-[13px] text-[#6b7280] hover:text-foreground"
            >
              Product
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSolutionsOpen((o) => !o)}
                className="inline-flex items-center gap-1 text-[13px] text-[#6b7280] hover:text-foreground"
              >
                Solutions
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {solutionsOpen ? (
                <div className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-[#e8e8ea] bg-white py-1 shadow-lg dark:border-border dark:bg-card">
                  {platformAudiences.map((a) => (
                    <Link
                      key={a.id}
                      to={a.href}
                      className="block px-4 py-2.5 text-[13px] text-foreground hover:bg-[#f7f7f8] dark:hover:bg-muted/60"
                    >
                      {a.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <Link
              to="/contact"
              className="text-[13px] text-[#6b7280] hover:text-foreground"
            >
              Talk
            </Link>
            <a
              href={DOCS_API_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-[#6b7280] hover:text-foreground"
            >
              API
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {operator ? (
              <Link
                to="/dashboard"
                className="hidden text-[13px] text-[#6b7280] hover:text-foreground sm:inline"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/contact"
                  className="hidden rounded-full bg-foreground px-4 py-1.5 text-[13px] font-medium text-background hover:opacity-90 sm:inline"
                >
                  Talk
                </Link>
                <Link
                  to="/login"
                  className="hidden text-[13px] text-[#6b7280] hover:text-foreground sm:inline"
                >
                  Sign in
                </Link>
              </>
            )}
            <button
              type="button"
              className="p-1.5 text-[#6b7280] md:hidden"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed left-0 right-0 top-14 z-40 border-b border-[#e8e8ea] bg-[#f7f7f8] md:hidden dark:border-border dark:bg-background"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              <Link to="/platform" className="py-2 text-[15px]">
                Product
              </Link>
              {platformAudiences.map((a) => (
                <Link key={a.id} to={a.href} className="py-2 text-[15px]">
                  {a.title}
                </Link>
              ))}
              <Link to="/contact" className="py-2 text-[15px]">
                Talk
              </Link>
              <a
                href={DOCS_API_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-[15px]"
              >
                API
              </a>
              <Link to="/login" className="py-2 text-[15px]">
                Sign in
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
