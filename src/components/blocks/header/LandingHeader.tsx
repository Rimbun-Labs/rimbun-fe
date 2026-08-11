"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const DOCS_API_URL = "https://docs.rimbun.co/api";

const navigation = [
  { name: "Product", href: "/clients#product" },
  { name: "Talk", href: "/contact" },
  { name: "About", href: "/about" },
];

export const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { operator } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith("/clients")) {
      return location.pathname === "/clients" || location.pathname === "/";
    }
    return location.pathname === href;
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-200",
          isScrolled
            ? "border-b border-border bg-background/90 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between px-6 md:h-14">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" variant="header" />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              Rimbun
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-[13px] transition-colors",
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-1.5 text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            {operator ? (
              <Link
                to="/dashboard"
                className="hidden text-[13px] text-muted-foreground hover:text-foreground sm:inline"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <a
                  href={DOCS_API_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden text-[13px] text-muted-foreground hover:text-foreground sm:inline"
                >
                  API
                </a>
                <Link
                  to="/contact"
                  className="hidden rounded-full bg-foreground px-3.5 py-1.5 text-[13px] font-medium text-background hover:opacity-85 sm:inline"
                >
                  Talk
                </Link>
                <Link
                  to="/login"
                  className="hidden text-[13px] text-muted-foreground hover:text-foreground md:inline"
                >
                  Sign in
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-muted-foreground hover:text-foreground md:hidden"
              aria-label="Open menu"
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
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed left-0 right-0 top-12 z-40 border-b border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 text-[15px] text-foreground"
                >
                  {item.name}
                </Link>
              ))}
              <a
                href={DOCS_API_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-[15px] text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                API
              </a>
              {operator ? (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 text-[15px] text-foreground"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 text-[15px] text-foreground"
                >
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
