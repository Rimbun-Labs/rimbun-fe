import { Car, Plane, ShoppingBag, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type IndustryTone = "purple" | "blue" | "green";

const toneStyles: Record<
  IndustryTone,
  { well: string; icon: string; bullet: string; link: string }
> = {
  purple: {
    well: "bg-[#7c3aed]/10",
    icon: "text-[#7c3aed]",
    bullet: "bg-[#7c3aed]",
    link: "text-[#7c3aed]",
  },
  blue: {
    well: "bg-[#2563eb]/10",
    icon: "text-[#2563eb]",
    bullet: "bg-[#2563eb]",
    link: "text-[#2563eb]",
  },
  green: {
    well: "bg-[#059669]/10",
    icon: "text-[#059669]",
    bullet: "bg-[#059669]",
    link: "text-[#059669]",
  },
};

export const industryCards: Array<{
  id: string;
  title: string;
  icon: LucideIcon;
  tone: IndustryTone;
  points: string[];
}> = [
  {
    id: "dealerships",
    title: "Dealerships",
    icon: Car,
    tone: "purple",
    points: [
      "Stock aging ties up cash",
      "Floor-plan vs cash decisions",
      "Better timing for buying and selling",
      "Margin and days-to-sell trends",
    ],
  },
  {
    id: "travel",
    title: "Travel & Hospitality",
    icon: Plane,
    tone: "blue",
    points: [
      "Seasonal cash dips ahead",
      "Supplier terms worsening cash troughs",
      "Booking pace vs cash outlook",
      "Occupancy and yield trends",
    ],
  },
  {
    id: "retail",
    title: "Retail / Trading",
    icon: ShoppingBag,
    tone: "green",
    points: [
      "Surplus between cycles",
      "Overdue accounts to chase",
      "Inventory turns and slow movers",
      "Pricing and margin insights",
    ],
  },
];

function StockAgingChart() {
  const rows = [
    { label: "0-30 days", value: "$580,000", width: "92%", color: "#059669", up: true },
    { label: "31-60 days", value: "$410,000", width: "68%", color: "#34d399" },
    { label: "61-90 days", value: "$290,000", width: "48%", color: "#f59e0b" },
    { label: "90+ days", value: "$120,000", width: "22%", color: "#ef4444" },
  ];
  return (
    <div>
      <p className="text-[12px] font-semibold text-foreground">Stock aging</p>
      <p className="text-[11px] text-[#6b7280]">By days on lot</p>
      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[72px_1fr_64px] items-center gap-2">
            <span className="text-[10px] text-[#6b7280]">{row.label}</span>
            <div className="flex items-center gap-1">
              {row.up ? (
                <span className="text-[9px] text-[#059669]">↑</span>
              ) : (
                <span className="w-2" />
              )}
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e5e7eb]">
                <div
                  className="h-full rounded-full"
                  style={{ width: row.width, backgroundColor: row.color }}
                />
              </div>
            </div>
            <span className="text-right text-[10px] font-medium text-foreground">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CashFlowChart() {
  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[12px] font-semibold text-foreground">
            Cash flow forecast
          </p>
          <p className="text-[11px] text-[#6b7280]">Next 90 days</p>
        </div>
        <div className="text-right">
          <p className="text-[14px] font-semibold text-foreground">$86,200</p>
          <p className="text-[10px] text-[#059669]">↑ trough +12%</p>
        </div>
      </div>
      <div className="mt-3 h-[72px] w-full">
        <svg
          viewBox="0 0 160 56"
          className="h-full w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="travelFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points="4,30 28,26 52,34 76,22 100,28 124,18 156,24 156,56 4,56"
            fill="url(#travelFill)"
          />
          <polyline
            points="4,30 28,26 52,34 76,22 100,28 124,18 156,24"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-[#6b7280]">
        <span>Now</span>
        <span>30d</span>
        <span>60d</span>
        <span>90d</span>
      </div>
    </div>
  );
}

function ReceivablesChart() {
  const legend = [
    { label: "0-30 days", value: "$110,000", color: "#059669" },
    { label: "31-60 days", value: "$80,000", color: "#34d399" },
    { label: "61-90 days", value: "$35,000", color: "#f59e0b" },
    { label: "90+ days", value: "$20,000", color: "#ef4444" },
  ];
  return (
    <div>
      <p className="text-[12px] font-semibold text-foreground">
        Overdue receivables
      </p>
      <p className="mt-0.5 text-[18px] font-semibold tracking-tight text-foreground">
        $245,000
      </p>
      <div className="mt-3 flex items-center gap-3">
        <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0" aria-hidden>
          <circle cx="32" cy="32" r="22" fill="#e5e7eb" />
          {/* Approximate segments */}
          <path d="M32 32 L32 10 A22 22 0 0 1 52 40 Z" fill="#059669" />
          <path d="M32 32 L52 40 A22 22 0 0 1 28 53 Z" fill="#34d399" />
          <path d="M32 32 L28 53 A22 22 0 0 1 14 24 Z" fill="#f59e0b" />
          <path d="M32 32 L14 24 A22 22 0 0 1 32 10 Z" fill="#ef4444" />
          <circle cx="32" cy="32" r="12" fill="white" />
        </svg>
        <ul className="min-w-0 flex-1 space-y-1">
          {legend.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-2 text-[10px]"
            >
              <span className="inline-flex items-center gap-1.5 text-[#6b7280]">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </span>
              <span className="font-medium text-foreground">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function IndustryVisual({ id }: { id: string }) {
  if (id === "dealerships") return <StockAgingChart />;
  if (id === "travel") return <CashFlowChart />;
  return <ReceivablesChart />;
}

export function BusinessIndustryCards() {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {industryCards.map((industry) => {
        const Icon = industry.icon;
        const styles = toneStyles[industry.tone];
        return (
          <div
            key={industry.id}
            className="flex flex-col rounded-[16px] border border-[#e8e8ea] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-border dark:bg-card"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-[10px]",
                  styles.well
                )}
              >
                <Icon className={cn("h-4 w-4", styles.icon)} strokeWidth={1.75} />
              </div>
              <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
                {industry.title}
              </h3>
            </div>

            <ul className="mt-4 space-y-2">
              {industry.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-2 text-[13px] leading-snug text-[#6b7280]"
                >
                  <span
                    className={cn(
                      "mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full",
                      styles.bullet
                    )}
                  />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-[12px] bg-[#f7f7f8] p-3 dark:bg-muted/40">
              <IndustryVisual id={industry.id} />
            </div>

            <Link
              to="/contact"
              className={cn(
                "mt-4 text-[13px] font-medium hover:underline",
                styles.link
              )}
            >
              Learn more →
            </Link>
          </div>
        );
      })}
    </div>
  );
}
