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
import { Users, RefreshCw, AlertCircle, CircleAlert } from "lucide-react";
import type {
  BusinessPortfolioQueueItem,
  FiQueueBucket,
  FiQueueBucketSummaryDto,
  FiQueueBookSummary,
} from "@/lib/api/types/fiDecision";
import { useSelectedCustomer } from "@/contexts/SelectedCustomerContext";
import { getBankCustomers, getBusinessPortfolioQueue } from "@/lib/api/fiDecisionApi";
import { businessWorkspaceBase } from "@/lib/businessPaths";

type CustomerTypeFilter = "all" | "individual" | "business";

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

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCustomerId } = useSelectedCustomer();
  const {
    customers,
    bookSummary,
    customersLoading,
    customersError,
    refetchCustomers,
  } = useFiDecisionInsights();

  const [query, setQuery] = useState("");
  const [hideNeedsData, setHideNeedsData] = useState(false);
  const [customerTypeFilter, setCustomerTypeFilter] = useState<CustomerTypeFilter>("all");
  const [businessQueue, setBusinessQueue] = useState<BusinessPortfolioQueueItem[]>([]);
  const [businessQueueLoading, setBusinessQueueLoading] = useState(false);
  const [businessQueueError, setBusinessQueueError] = useState<Error | null>(null);
  const [walkInInput, setWalkInInput] = useState("");
  const [walkInResults, setWalkInResults] = useState<
    Array<{
      customerId: string;
      displayName?: string;
      email?: string;
      externalCustomerId?: string;
      customerType?: string;
    }>
  >([]);
  const [walkInLoading, setWalkInLoading] = useState(false);
  const walkInDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (customerTypeFilter !== "business") {
      setBusinessQueue([]);
      setBusinessQueueError(null);
      return;
    }
    let cancelled = false;
    setBusinessQueueLoading(true);
    setBusinessQueueError(null);
    void getBusinessPortfolioQueue(50, 0)
      .then((rows) => {
        if (!cancelled) setBusinessQueue(rows);
      })
      .catch((err) => {
        if (!cancelled) {
          setBusinessQueueError(
            err instanceof Error ? err : new Error("Failed to load business portfolio")
          );
          setBusinessQueue([]);
        }
      })
      .finally(() => {
        if (!cancelled) setBusinessQueueLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [customerTypeFilter]);

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
        const type =
          customerTypeFilter === "all" ? undefined : customerTypeFilter;
        const rows = await getBankCustomers(50, 0, cleaned, type);
        setWalkInResults(
          rows.map((r) => ({
            customerId: String(r.customerId ?? r.userId ?? ""),
            displayName: r.displayName,
            email: r.email,
            externalCustomerId: r.externalCustomerId,
            customerType: r.customerType,
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
  }, [walkInInput, customerTypeFilter]);

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

  const filteredBusiness = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businessQueue.filter((c) => {
      if (!q) return true;
      const hay = [c.displayName, c.externalCustomerId, c.customerId]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [businessQueue, query]);

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

  const openCustomer = (id: string, customerType?: string) => {
    if (!id) return;
    setSelectedCustomerId(id);
    if (customerType === "business" || customerTypeFilter === "business") {
      navigate(businessWorkspaceBase(id));
      return;
    }
    navigate(`/app/customers/${id}`);
  };

  const showBusinessQueue = customerTypeFilter === "business";
  const showIndividualQueue =
    customerTypeFilter === "all" || customerTypeFilter === "individual";

  return (
    <PageContainer>
      <PageHeader
        icon={Users}
        title="Customers"
        description="Where to put energy next — ranked queue and search for customers to contact or propose plans."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void refetchCustomers();
              if (customerTypeFilter === "business") {
                void getBusinessPortfolioQueue(50, 0)
                  .then(setBusinessQueue)
                  .catch(() => setBusinessQueue([]));
              }
            }}
            disabled={customersLoading || businessQueueLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                customersLoading || businessQueueLoading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        }
      />

      <div className="mt-6 space-y-4">
        {showIndividualQueue && bookSummary ? (
          <BookSummaryStrip summary={bookSummary} />
        ) : null}

        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All types"],
              ["individual", "Individuals"],
              ["business", "Businesses"],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={customerTypeFilter === value ? "secondary" : "outline"}
              onClick={() => setCustomerTypeFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>

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
                    onClick={() => openCustomer(row.customerId, row.customerType)}
                  >
                    <span className="font-medium">
                      {row.displayName || row.externalCustomerId || row.customerId}
                    </span>
                    {row.customerType ? (
                      <span className="ml-1 text-muted-foreground">· {row.customerType}</span>
                    ) : null}
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
          {showIndividualQueue ? (
            <Button
              type="button"
              variant={hideNeedsData ? "secondary" : "outline"}
              onClick={() => setHideNeedsData((v) => !v)}
              className="h-9"
            >
              {hideNeedsData ? "Showing actionable only" : "Hide Needs data"}
            </Button>
          ) : null}
        </div>

        {showBusinessQueue ? (
          <>
            {businessQueueError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Unable to load business portfolio</AlertTitle>
                <AlertDescription>
                  Business warnings/actions could not be loaded. Please try again.
                </AlertDescription>
              </Alert>
            ) : null}
            {businessQueueLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : filteredBusiness.length === 0 ? (
              <Alert>
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>No business customers</AlertTitle>
                <AlertDescription>
                  No business customers match this view yet.
                </AlertDescription>
              </Alert>
            ) : (
              <ul className="space-y-2">
                {filteredBusiness.map((row) => (
                  <li key={row.customerId}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-md border px-3 py-3 text-left hover:bg-accent"
                      onClick={() => openCustomer(row.customerId, "business")}
                    >
                      <div>
                        <p className="font-medium">
                          {row.displayName || row.externalCustomerId || row.customerId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {row.openWarningCount} open warning
                          {row.openWarningCount === 1 ? "" : "s"} · {row.openActionCount}{" "}
                          open action{row.openActionCount === 1 ? "" : "s"}
                          {row.topWarningTitle ? ` · ${row.topWarningTitle}` : ""}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {row.openWarningCount > 0 ? "Needs attention" : "Stable"}
                      </Badge>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}

        {showIndividualQueue ? (
          <>
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
                <AlertDescription>Try a different filter or search.</AlertDescription>
              </Alert>
            ) : (
              <Accordion type="multiple" defaultValue={bucketGroups.map((g) => g.id)}>
                {bucketGroups.map((group) => (
                  <AccordionItem key={group.id} value={group.id}>
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        {group.title}
                        <Badge variant="outline">{group.rows.length}</Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {group.rows.map((row) => {
                          const id = customerIdOf(row);
                          return (
                            <li key={id}>
                              <button
                                type="button"
                                className="flex w-full items-center justify-between rounded-md border px-3 py-3 text-left hover:bg-accent"
                                onClick={() => openCustomer(id, "individual")}
                              >
                                <div>
                                  <p className="font-medium">{customerTitle(row)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {row.queueReason || "Queued for follow-up"}
                                  </p>
                                </div>
                                {row.queueBucket ? (
                                  <Badge
                                    variant="outline"
                                    className={queueBucketBadgeClass(row.queueBucket)}
                                  >
                                    {queueBucketLabel[row.queueBucket]}
                                  </Badge>
                                ) : null}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </>
        ) : null}
      </div>
    </PageContainer>
  );
};

function BookSummaryStrip({ summary }: { summary: FiQueueBookSummary }) {
  return (
    <div className="grid gap-2 sm:grid-cols-4 rounded-md border p-3 text-sm">
      <div>
        <p className="text-xs text-muted-foreground">Act now</p>
        <p className="font-semibold">{summary.countsByQueueBucket?.ACT_NOW ?? 0}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Monitor</p>
        <p className="font-semibold">{summary.countsByQueueBucket?.MONITOR ?? 0}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Hold</p>
        <p className="font-semibold">{summary.countsByQueueBucket?.SUPPRESSED_HOLD ?? 0}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Needs data</p>
        <p className="font-semibold">{summary.countsByQueueBucket?.NEEDS_DATA ?? 0}</p>
      </div>
    </div>
  );
}

export default Customers;
