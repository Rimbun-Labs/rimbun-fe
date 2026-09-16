import React from "react";
import { Link, useParams } from "react-router-dom";
import type { ChatEvidenceCitation } from "@/lib/api/businessChatApi";

type Props = {
  evidence: ChatEvidenceCitation[];
};

function resolveEvidenceRoute(route: string, customerId?: string): string {
  if (!route) return route;
  if (!customerId) return route;
  if (route.startsWith("/app/customers/")) return route;
  if (route === "/app" || route === "/app/") {
    return `/app/customers/${customerId}/business`;
  }
  if (route.startsWith("/app/")) {
    const rest = route.slice("/app/".length);
    return `/app/customers/${customerId}/business/${rest}`;
  }
  return route;
}

export function ChatEvidenceLinks({ evidence }: Props) {
  const { customerId } = useParams<{ customerId?: string }>();
  if (!evidence.length) return null;
  return (
    <ul className="mt-2 space-y-1 border-t border-border/60 pt-2 text-sm">
      {evidence.map((e) => {
        const to = resolveEvidenceRoute(e.route, customerId);
        return (
          <li key={e.id}>
            {to ? (
              <Link
                to={to}
                className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                {e.label}
              </Link>
            ) : (
              <span className="text-muted-foreground">{e.label}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
