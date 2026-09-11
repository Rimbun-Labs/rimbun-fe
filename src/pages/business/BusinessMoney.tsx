import React from "react";
import { useSearchParams } from "react-router-dom";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  BusinessObligation,
  BusinessReceivable,
  FinancialAccount,
} from "@/lib/api/businessApi";
import { cn } from "@/lib/utils";

type MoneyTab = "position" | "in" | "out";

function formatMoney(
  amount: string | number | null | undefined,
  currency: string,
): string {
  if (amount == null || amount === "") return "—";
  const n = Number(amount);
  if (Number.isNaN(n)) return `${amount} ${currency}`;
  if (currency === "IDR" && Math.abs(n) >= 1_000_000) {
    const millions = n / 1_000_000;
    const rounded =
      Math.abs(millions) >= 10
        ? Math.round(millions)
        : Math.round(millions * 10) / 10;
    return `IDR ${rounded}m`;
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function obligationLabel(type: string): string {
  const map: Record<string, string> = {
    payable: "Supplier",
    payroll: "Payroll",
    tax: "Tax",
    rent: "Rent",
    subscription: "Subscription",
    supplier: "Supplier",
    insurance: "Insurance",
    other: "Other",
  };
  return map[type] ?? type.replace(/_/g, " ");
}

function sortByDueDate(
  a: { dueDate: string | null },
  b: { dueDate: string | null },
): number {
  if (!a.dueDate && !b.dueDate) return 0;
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return a.dueDate.localeCompare(b.dueDate);
}

function parseTab(raw: string | null): MoneyTab {
  if (raw === "in" || raw === "out") return raw;
  return "position";
}

function statusPillClass(status: string): string {
  const v = status.toLowerCase();
  if (v === "active" || v === "paid" || v === "collected") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (v === "planned" || v === "scheduled") {
    return "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300";
  }
  if (v === "open" || v === "due" || v === "outstanding") {
    return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
  }
  return "bg-muted text-muted-foreground";
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        statusPillClass(status),
      )}
    >
      {status}
    </span>
  );
}

function PanelCard({
  title,
  countLabel,
  emptyMessage,
  empty,
  children,
}: {
  title: string;
  countLabel: string;
  emptyMessage: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full rounded-2xl border bg-background p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{countLabel}</p>
      </div>
      {empty ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        children
      )}
    </div>
  );
}

function PositionPanel({ accounts }: { accounts: FinancialAccount[] }) {
  return (
    <PanelCard
      title="Cash position"
      countLabel={
        accounts.length === 0
          ? "No accounts yet."
          : `${accounts.length} account(s).`
      }
      emptyMessage="Add account balances from Import data."
      empty={accounts.length === 0}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-sm text-muted-foreground">
              <th className="pb-3 pr-6 font-medium">Account</th>
              <th className="pb-3 pr-6 font-medium">Balance</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => {
              const name =
                a.displayName || a.institutionName || a.externalAccountId;
              const meta = [
                (a.accountType || "account").toLowerCase(),
                a.currency,
                a.balanceAsOf ? `as of ${formatDate(a.balanceAsOf)}` : null,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-4 pr-6 align-middle">
                    <p className="font-semibold">{name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {meta}
                    </p>
                  </td>
                  <td className="py-4 pr-6 align-middle font-semibold tabular-nums">
                    {formatMoney(a.currentBalance, a.currency)}
                  </td>
                  <td className="py-4 align-middle">
                    <StatusPill status={a.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PanelCard>
  );
}

function ComingInPanel({ receivables }: { receivables: BusinessReceivable[] }) {
  const sorted = [...receivables].sort(sortByDueDate);
  return (
    <PanelCard
      title="Expected receipts"
      countLabel={
        sorted.length === 0
          ? "No open receivables."
          : `${sorted.length} receipt(s).`
      }
      emptyMessage="When invoices or expected receipts are in the workspace, they show up here."
      empty={sorted.length === 0}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-sm text-muted-foreground">
              <th className="pb-3 pr-6 font-medium">Receipt</th>
              <th className="pb-3 pr-6 font-medium">Amount</th>
              <th className="pb-3 pr-6 font-medium">Due date</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-4 pr-6 align-middle font-semibold">
                  {r.externalId || "Receivable"}
                </td>
                <td className="py-4 pr-6 align-middle font-semibold tabular-nums">
                  {formatMoney(r.outstandingAmount, r.currency)}
                </td>
                <td className="py-4 pr-6 align-middle text-muted-foreground">
                  {formatDate(r.dueDate)}
                </td>
                <td className="py-4 align-middle">
                  <StatusPill status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelCard>
  );
}

function GoingOutPanel({
  obligations,
}: {
  obligations: BusinessObligation[];
}) {
  const sorted = [...obligations].sort(sortByDueDate);
  return (
    <PanelCard
      title="Upcoming commitments"
      countLabel={
        sorted.length === 0
          ? "No commitments yet."
          : `${sorted.length} commitment(s).`
      }
      emptyMessage="When bills and commitments are in the workspace, they show up here."
      empty={sorted.length === 0}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-sm text-muted-foreground">
              <th className="pb-3 pr-6 font-medium">Commitment</th>
              <th className="pb-3 pr-6 font-medium">Amount</th>
              <th className="pb-3 pr-6 font-medium">Due date</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((o) => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="py-4 pr-6 align-middle font-semibold">
                  {obligationLabel(o.obligationType)}
                </td>
                <td className="py-4 pr-6 align-middle font-semibold tabular-nums">
                  {formatMoney(o.amount, o.currency)}
                </td>
                <td className="py-4 pr-6 align-middle text-muted-foreground">
                  {formatDate(o.dueDate)}
                </td>
                <td className="py-4 align-middle">
                  <StatusPill status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelCard>
  );
}

const BusinessMoneyPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = parseTab(searchParams.get("tab"));

  return (
    <BusinessWorkspaceShell
      title="Money"
      description="What you have, what's coming in, and what's going out."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => (
        <Tabs
          value={tab}
          onValueChange={(value) => {
            const next = parseTab(value);
            setSearchParams(next === "position" ? {} : { tab: next }, {
              replace: true,
            });
          }}
          className="w-full gap-4"
        >
          <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-xl bg-muted p-1.5">
            <TabsTrigger
              value="position"
              className="rounded-lg px-3 py-2.5 data-[state=active]:shadow-sm"
            >
              Position
              {ws.accounts.length > 0 ? ` (${ws.accounts.length})` : ""}
            </TabsTrigger>
            <TabsTrigger
              value="in"
              className="rounded-lg px-3 py-2.5 data-[state=active]:shadow-sm"
            >
              Coming in
              {ws.receivables.length > 0 ? ` (${ws.receivables.length})` : ""}
            </TabsTrigger>
            <TabsTrigger
              value="out"
              className="rounded-lg px-3 py-2.5 data-[state=active]:shadow-sm"
            >
              Going out
              {ws.obligations.length > 0 ? ` (${ws.obligations.length})` : ""}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="position" className="mt-0 w-full">
            <PositionPanel accounts={ws.accounts} />
          </TabsContent>
          <TabsContent value="in" className="mt-0 w-full">
            <ComingInPanel receivables={ws.receivables} />
          </TabsContent>
          <TabsContent value="out" className="mt-0 w-full">
            <GoingOutPanel obligations={ws.obligations} />
          </TabsContent>
        </Tabs>
      )}
    </BusinessWorkspaceShell>
  );
};

export default BusinessMoneyPage;
