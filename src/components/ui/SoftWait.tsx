import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type SoftWaitPhrase = {
  /** Show this phrase once elapsed time reaches this many ms */
  afterMs: number;
  text: string;
};

export type SoftWaitPreset = "default" | "workspace" | "import" | "page";

const PRESETS: Record<SoftWaitPreset, SoftWaitPhrase[]> = {
  default: [
    { afterMs: 0, text: "Preparing your data…" },
    { afterMs: 2500, text: "Still working…" },
    { afterMs: 6000, text: "Almost there…" },
    { afterMs: 12000, text: "Taking a bit longer than usual…" },
  ],
  workspace: [
    { afterMs: 0, text: "Opening your workspace…" },
    { afterMs: 2500, text: "Gathering business context…" },
    { afterMs: 6000, text: "Almost ready…" },
    { afterMs: 12000, text: "Still loading — hang tight…" },
  ],
  import: [
    { afterMs: 0, text: "Preparing your file…" },
    { afterMs: 2500, text: "Reading rows…" },
    { afterMs: 6000, text: "Almost ready to show…" },
    { afterMs: 12000, text: "Large file — still preparing…" },
  ],
  page: [
    { afterMs: 0, text: "Loading…" },
    { afterMs: 2500, text: "Still working…" },
    { afterMs: 6000, text: "Almost there…" },
    { afterMs: 12000, text: "Taking a bit longer than usual…" },
  ],
};

type Props = {
  /** Named phrase ladder; ignored when `phrases` is set */
  preset?: SoftWaitPreset;
  /** Custom phrase ladder (sorted by afterMs) */
  phrases?: SoftWaitPhrase[];
  /** Optional quiet line under the rotating phrase */
  hint?: ReactNode;
  className?: string;
  /** Tighter padding for sheets / inline panels */
  compact?: boolean;
  /** Logo mark size in px */
  logoSize?: number;
  /** Accessible label; defaults to current phrase */
  "aria-label"?: string;
};

function useElapsedMs(active: boolean): number {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) {
      setElapsed(0);
      return;
    }
    setElapsed(0);
    const started = Date.now();
    const id = window.setInterval(() => {
      setElapsed(Date.now() - started);
    }, 250);
    return () => window.clearInterval(id);
  }, [active]);

  return elapsed;
}

function pickPhrase(phrases: SoftWaitPhrase[], elapsedMs: number): string {
  let current = phrases[0]?.text ?? "Loading…";
  for (const step of phrases) {
    if (elapsedMs >= step.afterMs) current = step.text;
  }
  return current;
}

/**
 * Centered brand wait state: rotating Rimbun mark + time-based phrases.
 * Replaces blank skeletons / bare “Loading…” while work is in flight.
 */
export function SoftWait({
  preset = "default",
  phrases,
  hint,
  className,
  compact = false,
  logoSize = 44,
  "aria-label": ariaLabel,
}: Props) {
  const ladder = useMemo(() => {
    const list = phrases?.length ? phrases : PRESETS[preset];
    return [...list].sort((a, b) => a.afterMs - b.afterMs);
  }, [phrases, preset]);

  const elapsed = useElapsedMs(true);
  const phrase = pickPhrase(ladder, elapsed);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={ariaLabel ?? phrase}
      className={cn(
        "flex w-full flex-col items-center justify-center text-center",
        compact ? "min-h-[12rem] gap-4 px-4 py-8" : "min-h-[18rem] gap-5 px-6 py-12",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute rounded-full bg-primary/10"
          style={{ width: logoSize * 1.7, height: logoSize * 1.7 }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src="/logo.svg"
          alt=""
          width={logoSize}
          height={logoSize}
          className="relative z-[1] object-contain"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.endsWith(".svg")) {
              target.src = "/logo.png";
            }
          }}
        />
      </div>

      <div className="relative min-h-[1.5rem] w-full max-w-xs">
        <AnimatePresence mode="wait">
          <motion.p
            key={phrase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            className="text-sm font-medium text-foreground"
          >
            {phrase}
          </motion.p>
        </AnimatePresence>
      </div>

      {hint ? (
        <p className="max-w-sm text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
