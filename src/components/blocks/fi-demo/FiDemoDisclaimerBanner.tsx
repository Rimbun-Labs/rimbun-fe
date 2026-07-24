import React from "react";
import { AlertTriangle } from "lucide-react";

/**
 * Persistent sample-data notice for the public client workspace preview.
 */
export const FiDemoDisclaimerBanner: React.FC = () => {
  return (
    <div
      role="status"
      className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-foreground"
    >
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" aria-hidden />
        <p className="leading-snug">
          <span className="font-medium">Sample preview.</span> Demo data only — not connected to live
          customers or your systems.
        </p>
      </div>
    </div>
  );
};
