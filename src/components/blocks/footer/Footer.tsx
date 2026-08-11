import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const DOCS_API_URL = "https://docs.rimbun.co/api";

interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("border-t border-border", className)}>
      <div className="mx-auto flex max-w-[980px] flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="sm" variant="footer" />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            Rimbun
          </span>
        </Link>

        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-muted-foreground">
          <a
            href={DOCS_API_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            API
          </a>
          <Link to="/contact" className="hover:text-foreground">
            Talk
          </Link>
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-[980px] px-6 pb-10">
        <p className="text-[12px] text-muted-foreground">
          © {new Date().getFullYear()} Rimbun
        </p>
      </div>
    </footer>
  );
};
