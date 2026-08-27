import { Logo } from "@/components/ui/Logo";
import {
  businessesDataSources,
  businessesOutputs,
} from "./content";

const LAYER_MAX = "max-w-[760px]";

/** Input sources → Rimbun Intelligence Layer flowchart (mockup-critical section). */
export function BusinessesDataFlow() {
  return (
    <div>
      <div className="mx-auto max-w-[720px] text-center">
        <h2 className="text-[24px] font-semibold tracking-tight text-foreground md:text-[28px]">
          One view from the data you already have
        </h2>
        <p className="mt-2 text-[16px] text-[#6b7280] dark:text-muted-foreground">
          Start with transactions. Add accounting and operational data for
          deeper, more specific recommendations.
        </p>
      </div>

      <div className="mt-8">
        {/* Five input sources */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
          {businessesDataSources.map((source) => {
            const Icon = source.icon;
            return (
              <div key={source.title} className="text-center lg:text-left">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f5ee] lg:mx-0">
                  <Icon className="h-4 w-4 text-[#059669]" strokeWidth={1.75} />
                </div>
                <h3 className="mt-2.5 text-[13px] font-semibold text-foreground">
                  {source.title}
                </h3>
                <p className="mt-1 text-[12px] leading-snug text-[#6b7280]">
                  {source.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* One continuous graph: ticks → rail → green arrows (no break) */}
        <div
          className="relative mx-auto mt-2 hidden h-[72px] w-full lg:block"
          aria-hidden
        >
          <svg
            viewBox="0 0 1000 72"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            {/* 5 source ticks → rail */}
            {[100, 300, 500, 700, 900].map((x) => (
              <line
                key={`tick-${x}`}
                x1={x}
                y1="0"
                x2={x}
                y2="18"
                stroke="#c5cdd6"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <line
              x1="100"
              y1="18"
              x2="900"
              y2="18"
              stroke="#c5cdd6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />
            {/*
              Green arrows start ON the rail (y=18), stay inside layer width.
              Layer is max-w 760 centered in ~1100 → ~15.5%–84.5% of full width
              → in 1000 viewBox: ~155–845. Arrows at 25% / 50% / 75% of that span.
            */}
            {[258, 500, 742].map((x) => (
              <g key={`arrow-${x}`}>
                <line
                  x1={x}
                  y1="18"
                  x2={x}
                  y2="60"
                  stroke="#059669"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.75"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={`M${x} 72 L${x - 5} 60 L${x + 5} 60 Z`}
                  fill="#059669"
                  opacity="0.8"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Mobile connector */}
        <div
          className="mx-auto my-6 flex h-10 w-0 flex-col items-center lg:hidden"
          aria-hidden
        >
          <div className="h-8 w-px border-l border-dashed border-[#059669]/70" />
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            className="text-[#059669]/80"
          >
            <path d="M5 8 L0 0 H10 Z" fill="currentColor" />
          </svg>
        </div>

        <div
          className={`mx-auto ${LAYER_MAX} rounded-[16px] border border-[#d8ebe0] bg-[#f3f8f5] px-5 py-4 dark:border-[#059669]/25 dark:bg-[#059669]/10 md:px-6 md:py-5`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            <div className="flex min-w-0 items-start gap-2.5">
              <Logo size="sm" variant="header" />
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                  Rimbun Intelligence Layer
                </h3>
                <p className="mt-1 max-w-[360px] text-[13px] leading-relaxed text-[#6b7280] dark:text-muted-foreground">
                  We connect and analyze your data to surface what
                  matters: actions to take, risks to watch, and opportunities to
                  capture.
                </p>
              </div>
            </div>
            <div className="grid shrink-0 grid-cols-1 gap-1.5 sm:grid-cols-2">
              {businessesOutputs.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#e5ebe7] bg-white px-3 py-1.5 text-center text-[11px] font-medium text-foreground shadow-[0_1px_1px_rgba(0,0,0,0.03)] dark:border-border dark:bg-card"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
