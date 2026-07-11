import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFiDecisionInsights } from "@/hooks/useFiDecisionInsights";
import { PageContainer, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LayoutDashboard, RefreshCw, AlertCircle, CircleAlert } from "lucide-react";
import type {
  FiQueueBucket,
  FiQueueBucketSummaryDto,
  FiQueueBookSummary,
} from "@/lib/api/types/fiDecision";
import { useSelectedCustomer } from "@/contexts/SelectedCustomerContext";

const queueBucketLabel: Record<FiQueueBucket, string> = {
  ACT_NOW: "Act now",
  MONITOR: "Monitor",
  SUPPRESSED_HOLD: "Suppressed / Hold",
  NEEDS_DATA: "Needs data",
};

const queueBucketBadgeClass = (bucket: FiQueueBucket) => {
  if (bucket === "ACT_NOW") return "bg-emerald-500/10 text-emerald-700 border-emerald-500/40";
  if (bucket === "SUPPRESSED_HOLD") return "bg-amber-500/10 text-amber-700 border-amber-500/40";
  if (bucket === "NEEDS_DATA") return "bg-rose-500/10 text-rose-700 border-rose-500/40";
  return "bg-muted text-muted-foreground border-border";
};

function customerIdOf(row: FiQueueBucketSummaryDto): string {
  return String(row.customerId ?? row.userId ?? "").trim();
}

function customerTitle(row: FiQueueBucketSummaryDto): string {
  return row.displayName || row.email || row.externalCustomerId || customerIdOf(row);
}

type BucketGroup = {
  id: FiQueueBucket | "QUEUE_PENDING";
  title: string;
  rows: FiQueueBucketSummaryDto[];
};

const BUCKET_ORDER: Array<FiQueueBucket | "QUEUE_PENDING"> = [
  "ACT_NOW",
  "MONITOR",
  "SUPPRESSED_HOLD",
  "NEEDS_DATA",
  "QUEUE_PENDING",
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCustomerId } = useSelectedCustomer();
  const {
    customers,
    bookSummary,
    customersLoading,
    customersError,
    refetchCustomers,
    searchWalkInCustomers,
  } = useFiDecisionInsights();

  const [query, setQuery] = useState("");
  const [hideNeedsData, setHideNeedsData] = useState(false);
  const [walkInInput, setWalkInInput] = useState("");
  const [walkInResults, setWalkInResults] = useState<
    Array<{ customerId: string; displayName?: string; email?: string; externalCustomerId?: string }>
  >([]);
  const [walkInLoading, setWalkInLoading] = useState(false);
  const walkInDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (walkInDebounceRef.current) clearTimeout(walkInDebounceRef.current);
    const cleaned = walkInInput.replace(/[%_\\]/g, "").trim();
    if (cleaned.length < 2) {
      setWalkInResults([]);
      setWalkInLoading(false);
      return;
    }
    setWalkInLoading(true);
    walkInDebounceRef.current = setTimeout(async () => {
      try {
        const rows = await searchWalkInCustomers(cleaned);
        setWalkInResults(
          rows.map((r) => ({
            customerId: String(r.customerId ?? r.userId ?? ""),
            displayName: r.displayName,
            email: r.email,
            externalCustomerId: r.externalCustomerId,
          }))
        );
      } catch {
        setWalkInResults([]);
      } finally {
        setWalkInLoading(false);
      }
    }, 300);
    return () => {
      if (walkInDebounceRef.current) clearTimeout(walkInDebounceRef.current);
    };
  }, [walkInInput, searchWalkInCustomers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      if (hideNeedsData && c.queueBucket === "NEEDS_DATA") return false;
      if (!q) return true;
      const hay = [
        c.displayName,
        c.email,
        c.externalCustomerId,
        c.userId,
        c.customerId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [customers, query, hideNeedsData]);

  const bucketGroups: BucketGroup[] = useMemo(() => {
    const map = new Map<BucketGroup["id"], FiQueueBucketSummaryDto[]>();
    for (const id of BUCKET_ORDER) map.set(id, []);
    for (const row of filtered) {
      const bucket = (row.queueBucket ?? "QUEUE_PENDING") as BucketGroup["id"];
      if (!map.has(bucket)) map.set(bucket, []);
      map.get(bucket)!.push(row);
    }
    return BUCKET_ORDER.map((id) => ({
      id,
      title: id === "QUEUE_PENDING" ? "Queue pending" : queueBucketLabel[id],
      rows: (map.get(id) ?? []).sort(
        (a, b) => (b.queuePriorityScore ?? 0) - (a.queuePriorityScore ?? 0)
      ),
    })).filter((g) => g.rows.length > 0);
  }, [filtered]);

  const openCustomer = (id: string) => {
    if (!id) return;
    setSelectedCustomerId(id);
    navigate(`/dashboard/customers/${id}`);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={LayoutDashboard}
        title="Customers"
        description="Where to put energy next — ranked queue and search for customers to contact or propose plans."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchCustomers()}
            disabled={customersLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${customersLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      <div className="mt-6 space-y-4">
        {bookSummary ? <BookSummaryStrip summary={bookSummary} /> : null}

        <div className="rounded-md border p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Find any customer (name or external id)
          </p>
          <input
            value={walkInInput}
            onChange={(e) => setWalkInInput(e.target.value)}
            placeholder="Type at least 2 characters"
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          />
          {walkInLoading ? <Skeleton className="h-8 w-full" /> : null}
          {walkInResults.length > 0 ? (
            <ul className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
              {walkInResults.map((row) => (
                <li key={row.customerId}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto w-full justify-start px-2 py-1.5 text-left text-xs"
                    onClick={() => openCustomer(row.customerId)}
                  >
                    <span className="font-medium">
                      {row.displayName || row.externalCustomerId || row.customerId}
                    </span>
                    {row.email ? (
                      <span className="ml-1 text-muted-foreground">· {row.email}</span>
                    ) : null}
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter this queue page"
            className="h-9 flex-1 rounded-md border bg-background px-3 text-sm"
          />
          <Button
            type="button"
            variant={hideNeedsData ? "secondary" : "outline"}
            onClick={() => setHideNeedsData((v) => !v)}
            className="h-9"
          >
            {hideNeedsData ? "Showing actionable only" : "Hide Needs data"}
          </Button>
        </div>

        {customersError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to load queue</AlertTitle>
            <AlertDescription>
              The customer queue could not be loaded. Please try again.
            </AlertDescription>
          </Alert>
        ) : null}

        {customersLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : customers.length === 0 ? (
          <Alert>
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>No customers in queue</AlertTitle>
            <AlertDescription>
              No customers are available yet. Refresh after customers have been added.
            </AlertDescription>
          </Alert>
        ) : filtered.length === 0 ? (
          <Alert>
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>No matches</AlertTitle>
            <AlertDescription>Try clearing filters or search.</AlertDescription>
          </Alert>
        ) : (
          <Accordion
            type="multiple"
            defaultValue={bucketGroups.slice(0, 2).map((g) => g.id)}
            className="rounded-md border px-3"
          >
            {bucketGroups.map((group) => (
              <AccordionItem key={group.id} value={group.id}>
                <AccordionTrigger className="text-sm">
                  <span className="flex items-center gap-2">
                    {group.title}
                    <Badge variant="outline">{group.rows.length}</Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {group.rows.map((customer) => {
                    const id = customerIdOf(customer);
                    const bucket = customer.queueBucket;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => openCustomer(id)}
                        className="flex w-full flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left transition-colors hover:bg-accent/50"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="max-w-[320px] truncate text-sm font-medium">
                              {customerTitle(customer)}
                            </p>
                            {bucket ? (
                              <Badge variant="outline" className={queueBucketBadgeClass(bucket)}>
                                {queueBucketLabel[bucket]}
                              </Badge>
                            ) : null}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {customer.queueReason
                              ? `${customer.queueReason} · Priority ${customer.queuePriorityScore ?? 0}/100`
                              : "Queue pending…"}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-primary">Open</span>
                      </button>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </PageContainer>
  );
};

function BookSummaryStrip({ summary }: { summary: FiQueueBookSummary }) {
  return (
    <div className="rounded-lg border border-primary/25 bg-muted/30 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Queue snapshot</p>
          <p className="text-xs text-muted-foreground">
            Priority customers in the current queue
          </p>
        </div>
        {summary.mode === "ranked" ? (
          <Badge variant="outline" className="shrink-0">
            Priority order
          </Badge>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(queueBucketLabel) as FiQueueBucket[]).map((bucket) => (
          <Badge key={bucket} variant="outline" className={queueBucketBadgeClass(bucket)}>
            {queueBucketLabel[bucket]}: {summary.countsByQueueBucket?.[bucket] ?? 0}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
