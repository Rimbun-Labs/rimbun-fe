import React from "react";
import { useParams } from "react-router-dom";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { Badge } from "@/components/ui/badge";
import {
  connectionStatusLabel,
  useBusinessConnectorActivity,
  useBusinessConnectorRuns,
  useBusinessConnectorSummary,
} from "@/hooks/useBusinessConnectors";

function formatWhen(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "—";
  }
}

function formatMoney(
  amount: string | number | null | undefined,
  currency: string,
): string {
  if (amount == null || amount === "") return "—";
  const n = Number(amount);
  if (Number.isNaN(n)) return `${amount} ${currency}`;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

function statusLabel(status: string): string {
  switch (status) {
    case "succeeded":
      return "Succeeded";
    case "pending":
      return "Pending";
    case "failed":
      return "Failed";
    case "reversed":
      return "Reversed";
    default:
      return status;
  }
}

const BusinessSourceDetailPage: React.FC<{
  customerIdOverride?: string;
}> = ({ customerIdOverride }) => {
  const { connectionId } = useParams<{ connectionId: string }>();

  return (
    <BusinessWorkspaceShell
      title="Source"
      description="What this feed has brought in, and when it last synced."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => (
        <SourceDetailBody
          customerId={ws.customerId}
          connectionId={connectionId}
        />
      )}
    </BusinessWorkspaceShell>
  );
};

function SourceDetailBody({
  customerId,
  connectionId,
}: {
  customerId: string;
  connectionId: string | undefined;
}) {
  const summary = useBusinessConnectorSummary(customerId, connectionId);
  const activity = useBusinessConnectorActivity(customerId, connectionId);
  const runs = useBusinessConnectorRuns(customerId, connectionId);

  if (!connectionId) {
    return (
      <p className="text-sm text-muted-foreground">No source selected.</p>
    );
  }

  if (summary.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (summary.isError || !summary.data) {
    return (
      <p className="text-sm text-muted-foreground">Could not load this source.</p>
    );
  }

  const { connection, activityCount, latestRun } = summary.data;
  const syncing =
    connection.lastSyncStatus === "running" ||
    connection.lastSyncStatus === "queued";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold tracking-tight">
            {connection.displayName || connection.providerKey}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Last successful sync {formatWhen(connection.lastSuccessfulSyncAt)}
          </p>
        </div>
        <Badge variant="outline">
          {syncing ? "Syncing" : connectionStatusLabel(connection.status)}
        </Badge>
      </div>

      {connection.lastSyncErrorSummary ? (
        <p className="text-sm text-destructive">
          {connection.lastSyncErrorSummary}
        </p>
      ) : null}

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Imported data</h2>
        <p className="text-sm text-muted-foreground">
          {activityCount} processor transaction{activityCount === 1 ? "" : "s"}
          {latestRun
            ? ` · last sync ${latestRun.recordsInserted} new, ${latestRun.recordsUpdated} updated`
            : ""}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Recent activity</h2>
        {activity.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (activity.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No imported activity yet.
          </p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">When</th>
                  <th className="pb-2 pr-4 font-medium">Type</th>
                  <th className="pb-2 pr-4 font-medium">Gross</th>
                  <th className="pb-2 pr-4 font-medium">Fee</th>
                  <th className="pb-2 pr-4 font-medium">Net</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {(activity.data ?? []).map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 text-muted-foreground">
                      {formatWhen(row.occurredAt)}
                    </td>
                    <td className="py-3 pr-4">
                      {row.transactionType.replace(/_/g, " ")}
                      {row.cashflow === "MONEY_OUT" ? " · out" : ""}
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      {formatMoney(row.grossAmount, row.currency)}
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      {formatMoney(row.feeAmount, row.currency)}
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      {formatMoney(row.netAmount, row.currency)}
                    </td>
                    <td className="py-3">{statusLabel(row.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Sync history</h2>
        {(runs.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No syncs yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {(runs.data ?? []).slice(0, 8).map((run) => (
              <li
                key={run.id}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <span className="text-muted-foreground">
                  {formatWhen(run.finishedAt ?? run.startedAt ?? run.createdAt)}
                </span>
                <span>
                  {run.status}
                  {run.status !== "failed"
                    ? ` · ${run.recordsInserted} new / ${run.recordsUpdated} updated`
                    : run.errorSummary
                      ? ` · ${run.errorSummary}`
                      : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default BusinessSourceDetailPage;
