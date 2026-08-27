import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";

const DOCS_API_URL = "https://docs.rimbun.co/api";
const LINKEDIN_URL = "https://www.linkedin.com/company/rimbunlabs/";

const links = [
  { label: "Product", to: "/platform" },
  { label: "Solutions", to: "/platform#solutions" },
  { label: "Talk", to: "/contact" },
  { label: "API", href: DOCS_API_URL },
  { label: "About", to: "/about" },
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
] as const;

/** Footer matching the platform mockup. */
export function PlatformFooter() {
  return (
    <footer className="border-t border-[#e8e8ea] bg-white dark:border-border dark:bg-background">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-8 px-8 py-10 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex flex-col gap-2">
          <Link to="/platform" className="flex items-center gap-2">
            <Logo size="sm" variant="footer" />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              Rimbun
            </span>
          </Link>
          <p className="text-[12px] text-[#6b7280]">© 2026 Rimbun.</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-[#6b7280]">
          {links.map((link) =>
            "href" in link ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="hover:text-foreground"
              >
                {link.label}
              </Link>
            )
          )}
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#e8e8ea] text-[#6b7280] hover:text-foreground dark:border-border"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
