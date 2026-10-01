import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { platformAudiences } from "./content";

const DOCS_API_URL = "https://docs.rimbun.co/api";

/** Shared marketing header — homepage + audience pages. */
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
            ? "border-b border-[#e8e8ea]/80 bg-[#fbfcfb]/95 backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between gap-4 px-6 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" variant="header" />
            <span className="text-[15px] font-semibold tracking-tight text-[#15241f]">
              Rimbun
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <div className="relative">
              <button
                type="button"
                onClick={() => setSolutionsOpen((o) => !o)}
                className="inline-flex items-center gap-1 text-[13px] text-[#5b6570] hover:text-[#15241f]"
              >
                Solutions
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {solutionsOpen ? (
                <div className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-[#e8e8ea] bg-white py-1 shadow-lg">
                  {platformAudiences.map((a) => (
                    <Link
                      key={a.id}
                      to={a.href}
                      className="block px-4 py-2.5 text-[13px] text-[#15241f] hover:bg-[#f7f7f8]"
                    >
                      {a.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <a
              href={DOCS_API_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-[#5b6570] hover:text-[#15241f]"
            >
              API
            </a>
            <Link
              to="/about"
              className="text-[13px] text-[#5b6570] hover:text-[#15241f]"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {operator ? (
              <Link
                to="/app"
                className="hidden rounded-full bg-[#1B4D3E] px-4 py-1.5 text-[13px] font-medium text-white hover:bg-[#164235] sm:inline"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/contact"
                  className="hidden rounded-full border border-[#d1d5db] bg-white px-4 py-1.5 text-[13px] font-medium text-[#15241f] hover:bg-[#f3f4f6] sm:inline"
                >
                  Talk to us
                </Link>
                <Link
                  to="/login"
                  className="hidden rounded-full bg-[#1B4D3E] px-4 py-1.5 text-[13px] font-medium text-white hover:bg-[#164235] sm:inline"
                >
                  Sign in
                </Link>
              </>
            )}
            <button
              type="button"
              className="p-1.5 text-[#5b6570] md:hidden"
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
            className="fixed left-0 right-0 top-14 z-40 border-b border-[#e8e8ea] bg-[#fbfcfb] md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {platformAudiences.map((a) => (
                <Link key={a.id} to={a.href} className="py-2 text-[15px]">
                  {a.title}
                </Link>
              ))}
              <a
                href={DOCS_API_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-[15px]"
              >
                API
              </a>
              <Link to="/about" className="py-2 text-[15px]">
                About
              </Link>
              <Link to="/contact" className="py-2 text-[15px]">
                Talk to us
              </Link>
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
