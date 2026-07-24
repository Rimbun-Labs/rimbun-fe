"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ArrowRight
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const navigation = [
  { name: "Clients", href: "/clients" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
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

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="container px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative group-hover:scale-105 transition-all duration-300">
                  <Logo size="lg" variant="header" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-foreground">
                    Rimbun
                  </span>
                  <span className="text-xs text-muted-foreground -mt-1">Financial Intelligence Signals Platform</span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item, index) => (
                <motion.div key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors duration-200",
                      (item.href === "/clients"
                        ? location.pathname === "/clients" ||
                          location.pathname === "/" ||
                          location.pathname.startsWith("/clients/")
                        : location.pathname === item.href)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors duration-200"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                )}
              </motion.button>

              {/* Auth Buttons */}
              {operator ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-3"
                >
                  <Button asChild variant="outline" size="sm" className="border-border hover:bg-muted">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link to="/profile">Profile</Link>
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-3"
                >
                  <Button asChild variant="outline" size="sm" className="border-border hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <a href="mailto:team@rimbun.co">
                      Request a demo
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </motion.div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Menu className="h-4 w-4 text-muted-foreground" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40"
          >
            <div className="container px-4 py-6 space-y-3">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="lg"
                  className="w-full justify-start text-left h-12"
                  asChild
                >
                  <Link to={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
