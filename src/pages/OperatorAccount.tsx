import React from "react";
import { PageContainer, PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function roleLabel(role?: string): string {
  if (!role) return "—";
  const map: Record<string, string> = {
    TENANT_ADMIN: "Admin",
    TENANT_ANALYST: "Analyst",
    TENANT_SUPPORT: "Support",
    tenant_admin: "Admin",
    tenant_analyst: "Analyst",
    tenant_support: "Support",
  };
  return map[role] ?? role;
}

/**
 * Operator account — bank tenant_user identity (not end-customer profile).
 */
const OperatorAccount: React.FC = () => {
  const { user, operator, loading, signOut } = useAuth();
  const email = operator?.email || user?.email || "—";

  return (
    <PageContainer>
      <PageHeader
        icon={User}
        title="Account"
        description="Your bank operator account for this workspace."
      />

      <div className="mt-6 space-y-4 max-w-lg">
        {loading ? <Skeleton className="h-40 w-full" /> : null}

        {!loading && user && !operator ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not entitled</AlertTitle>
            <AlertDescription>
              This login is not linked to a bank operator account.
            </AlertDescription>
          </Alert>
        ) : null}

        {!loading && operator ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Operator details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="font-medium">{roleLabel(operator.role)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Organization</p>
                <p className="font-medium">
                  {operator.tenantName?.trim() || "—"}
                </p>
              </div>
              <div className="pt-4">
                <Button variant="outline" onClick={() => void signOut()}>
                  Sign out
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {!loading && !user ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Signed out</AlertTitle>
            <AlertDescription>Sign in to view your account.</AlertDescription>
          </Alert>
        ) : null}
      </div>
    </PageContainer>
  );
};

export default OperatorAccount;
