import React, { useEffect, useState } from "react";
import { useSyncCustomerFromRoute } from "@/hooks/useSyncCustomerFromRoute";
import { useSelectedCustomer } from "@/contexts/SelectedCustomerContext";
import { PageContainer, PageHeader } from "@/components/layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, CircleAlert } from "lucide-react";
import { apiClient } from "@/lib/api/client";

/** Latest assessment results for a customer (read-only). */
const CustomerAssessment: React.FC = () => {
  const customerId = useSyncCustomerFromRoute();
  const { selectedCustomer } = useSelectedCustomer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [payload, setPayload] = useState<Record<string, unknown> | null>(null);

  const label =
    selectedCustomer?.displayName ||
    selectedCustomer?.externalCustomerId ||
    customerId;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!customerId) return;
      try {
        setLoading(true);
        setError(false);
        const response = await apiClient.get(
          `/dashboard/customers/${customerId}/assessment`
        );
        const body = response.data;
        const data = body?.data !== undefined ? body.data : body;
        if (!cancelled) {
          if (data && typeof data === "object" && !Array.isArray(data)) {
            setPayload(data as Record<string, unknown>);
          } else if (data != null) {
            setPayload({ value: data });
          } else {
            setPayload(null);
          }
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setPayload(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [customerId]);

  const hasResults =
    payload != null && Object.keys(payload).length > 0;

  const summaryLine = (() => {
    if (!payload) return null;
    const score =
      payload.overallScore ??
      payload.score ??
      payload.totalScore ??
      payload.assessmentScore;
    const completedAt =
      payload.completedAt ?? payload.updatedAt ?? payload.createdAt;
    const parts: string[] = [];
    if (typeof score === "number" || typeof score === "string") {
      parts.push(`Score: ${score}`);
    }
    if (typeof completedAt === "string") {
      parts.push(`Completed: ${completedAt}`);
    }
    return parts.length > 0 ? parts.join(" · ") : null;
  })();

  return (
    <PageContainer>
      <PageHeader
        icon={ClipboardList}
        title={`Assessment for ${label}`}
        description="Assessment results for this customer."
      />

      <div className="mt-6 space-y-4">
        {loading ? <Skeleton className="h-28 w-full" /> : null}

        {!loading && error ? (
          <Alert>
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Unable to load assessment</AlertTitle>
            <AlertDescription>
              Assessment results could not be loaded. Please try again later.
            </AlertDescription>
          </Alert>
        ) : null}

        {!loading && !error && !hasResults ? (
          <Alert>
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>No assessment yet</AlertTitle>
            <AlertDescription>
              There is no assessment on file for this customer.
            </AlertDescription>
          </Alert>
        ) : null}

        {!loading && hasResults ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Latest results</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLine ? (
                <p className="text-sm text-muted-foreground">{summaryLine}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Assessment results are on file for this customer.
                </p>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </PageContainer>
  );
};

export default CustomerAssessment;
