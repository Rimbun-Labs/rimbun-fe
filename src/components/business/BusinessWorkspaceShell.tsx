import React from "react";
import { PageContainer, PageHeader } from "@/components/layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Building2, RefreshCw } from "lucide-react";
import { useBusinessWorkspace } from "@/hooks/useBusinessWorkspace";

type Props = {
  title: string;
  description: string;
  customerIdOverride?: string;
  children: (workspace: ReturnType<typeof useBusinessWorkspace>) => React.ReactNode;
};

export function BusinessWorkspaceShell({
  title,
  description,
  customerIdOverride,
  children,
}: Props) {
  const workspace = useBusinessWorkspace(customerIdOverride);

  return (
    <PageContainer>
      <PageHeader
        icon={Building2}
        title={title}
        description={description}
        action={
          <Button variant="outline" size="sm" onClick={() => void workspace.refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {workspace.loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : workspace.error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not load workspace</AlertTitle>
          <AlertDescription>{workspace.error.message}</AlertDescription>
        </Alert>
      ) : (
        children(workspace)
      )}
    </PageContainer>
  );
}
