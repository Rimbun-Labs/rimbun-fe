import { motion } from "framer-motion";

/** Hero forecast preview — solid history, dotted outlook with band. */
export function ForecastHeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 1.5 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[420px]"
    >
      <div
        className="absolute -inset-6 rounded-[32px] bg-[#1B4D3E]/[0.06] blur-2xl"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_24px_60px_rgba(27,77,62,0.14)] md:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[14px] font-semibold tracking-tight text-[#15241f]">
            Forecast
          </p>
          <p className="text-[12px] text-[#6b7280]">Next 6 months</p>
        </div>

        <div className="mt-4 h-[180px] w-full md:h-[200px]">
          <svg
            viewBox="0 0 360 180"
            className="h-full w-full"
            role="img"
            aria-label="Cash forecast chart with outlook beyond today"
          >
            <defs>
              <linearGradient id="homeForecastBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1B4D3E" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#1B4D3E" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Outlook confidence band */}
            <path
              d="M180 88 C210 70, 240 58, 270 64 C300 70, 330 52, 352 46 L352 130 C330 118, 300 126, 270 120 C240 114, 210 118, 180 112 Z"
              fill="url(#homeForecastBand)"
            />

            {/* History (solid) */}
            <path
              d="M16 120 C48 112, 72 98, 96 104 C120 110, 144 78, 180 88"
              fill="none"
              stroke="#1B4D3E"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Outlook (dotted) */}
            <path
              d="M180 88 C210 70, 240 58, 270 64 C300 70, 330 52, 352 46"
              fill="none"
              stroke="#1B4D3E"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 7"
            />

            {/* Today marker */}
            <line
              x1="180"
              y1="28"
              x2="180"
              y2="148"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="3 5"
            />
            <circle cx="180" cy="88" r="4.5" fill="#1B4D3E" />
            <text
              x="180"
              y="22"
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
              fontFamily="inherit"
            >
              Today
            </text>
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
