import React from "react";
import { AlertTriangle } from "lucide-react";

/**
 * Persistent synthetic-data notice for FI RM workspace demo surfaces.
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
          <span className="font-medium">Synthetic preview.</span> This relationship-manager workspace uses static
          fixtures only — not live customers, core banking, or CRM. Prioritized actions and scripts are illustrative.
        </p>
      </div>
    </div>
  );
};
