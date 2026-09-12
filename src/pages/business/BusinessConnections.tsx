import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BusinessWorkspaceShell } from "@/components/business/BusinessWorkspaceShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  catalogAvailabilityLabel,
  connectionStatusLabel,
  parseConnectorReturnParams,
  useAuthorizeBusinessConnector,
  useBusinessConnectorCatalog,
  useBusinessConnectorConnections,
  useDisconnectBusinessConnector,
  useSyncBusinessConnector,
} from "@/hooks/useBusinessConnectors";
import type { BusinessConnectorCatalogItem } from "@/lib/api/businessApi";

function formatWhen(iso: string | null): string {
  if (!iso) return "Never";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "—";
  }
}

const BusinessConnectionsPage: React.FC<{ customerIdOverride?: string }> = ({
  customerIdOverride,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const parsed = parseConnectorReturnParams(location.search);
    if (!parsed) return;
    if (parsed.kind === "success") toast.success(parsed.message);
    else toast.error(parsed.message);
    navigate({ pathname: location.pathname, search: "" }, { replace: true });
  }, [location.pathname, location.search, navigate]);

  return (
    <BusinessWorkspaceShell
      title="Connections"
      description="Link payment and accounting accounts so activity stays current."
      customerIdOverride={customerIdOverride}
    >
      {(ws) => <ConnectionsBody customerId={ws.customerId} />}
    </BusinessWorkspaceShell>
  );
};

function ConnectionsBody({ customerId }: { customerId: string }) {
  const catalog = useBusinessConnectorCatalog(customerId);
  const connections = useBusinessConnectorConnections(customerId);
  const authorize = useAuthorizeBusinessConnector(customerId);
  const sync = useSyncBusinessConnector(customerId);
  const disconnect = useDisconnectBusinessConnector(customerId);
  const [connectingKey, setConnectingKey] = useState<string | null>(null);
  const [apiKeyDraft, setApiKeyDraft] = useState("");
  const [pendingProvider, setPendingProvider] =
    useState<BusinessConnectorCatalogItem | null>(null);

  const activeConnections = (connections.data ?? []).filter(
    (c) => c.status !== "revoked",
  );
  const availableProviders = (catalog.data ?? []).filter((p) => p.available);
  const unavailableProviders = (catalog.data ?? []).filter((p) => !p.available);
  const nothingToShow =
    catalog.isSuccess &&
    connections.isSuccess &&
    availableProviders.length === 0 &&
    activeConnections.length === 0;

  const returnUri = `${window.location.origin}${window.location.pathname}?connector=connected`;

  const startConnect = (provider: BusinessConnectorCatalogItem) => {
    if (provider.authorizationType === "api_key") {
      setPendingProvider(provider);
      setApiKeyDraft("");
      return;
    }
    setConnectingKey(provider.providerKey);
    authorize.mutate(
      {
        provider: provider.providerKey,
        redirectUri: returnUri,
        environment: "sandbox",
      },
      { onSettled: () => setConnectingKey(null) },
    );
  };

  const submitApiKey = () => {
    if (!pendingProvider) return;
    const key = apiKeyDraft.trim();
    if (!key) {
      toast.error("Enter your API key to continue");
      return;
    }
    setConnectingKey(pendingProvider.providerKey);
    authorize.mutate(
      {
        provider: pendingProvider.providerKey,
        redirectUri: returnUri,
        credentials: { apiKey: key },
        environment: "sandbox",
      },
      {
        onSettled: () => {
          setConnectingKey(null);
          setPendingProvider(null);
          setApiKeyDraft("");
        },
      },
    );
  };

  return (
    <div className="space-y-8">
      {catalog.isLoading || connections.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : null}

      {activeConnections.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-sm font-medium">Connected</h2>
          {activeConnections.map((c) => {
            const syncing =
              c.lastSyncStatus === "running" || c.lastSyncStatus === "queued";
            return (
              <div
                key={c.id}
                className="space-y-2 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">
                      {c.displayName || c.providerKey}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last sync {formatWhen(c.lastSuccessfulSyncAt)}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {syncing ? "Syncing" : connectionStatusLabel(c.status)}
                  </Badge>
                </div>
                {c.lastSyncErrorSummary ? (
                  <p className="text-sm text-destructive">
                    {c.lastSyncErrorSummary}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {c.status === "active" || c.status === "error" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={sync.isPending || syncing}
                      onClick={() => sync.mutate(c.id)}
                    >
                      Sync now
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={disconnect.isPending}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Disconnect this account? Information already here stays until you remove it.",
                        )
                      ) {
                        disconnect.mutate(c.id);
                      }
                    }}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            );
          })}
        </section>
      ) : null}

      {availableProviders.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-sm font-medium">Available to connect</h2>
          {availableProviders.map((p) => (
            <div
              key={p.providerKey}
              className="flex flex-wrap items-start justify-between gap-3"
            >
              <div className="max-w-md">
                <p className="text-sm font-medium">{p.displayName}</p>
                <p className="text-sm text-muted-foreground">
                  {p.shortDescription}
                </p>
              </div>
              <Button
                size="sm"
                disabled={authorize.isPending}
                onClick={() => startConnect(p)}
              >
                {connectingKey === p.providerKey ? "Connecting…" : "Connect"}
              </Button>
            </div>
          ))}
        </section>
      ) : null}

      {pendingProvider ? (
        <section className="max-w-md space-y-3 border-t pt-4">
          <p className="text-sm font-medium">
            Connect {pendingProvider.displayName}
          </p>
          <p className="text-sm text-muted-foreground">
            Paste your {pendingProvider.displayName} secret API key. We verify it
            with {pendingProvider.displayName} before saving the connection.
          </p>
          <div className="space-y-1">
            <Label htmlFor="connector-api-key">API key</Label>
            <Input
              id="connector-api-key"
              type="password"
              autoComplete="off"
              value={apiKeyDraft}
              onChange={(e) => setApiKeyDraft(e.target.value)}
              placeholder="Secret key"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={authorize.isPending}
              onClick={submitApiKey}
            >
              Save and connect
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setPendingProvider(null);
                setApiKeyDraft("");
              }}
            >
              Cancel
            </Button>
          </div>
        </section>
      ) : null}

      {unavailableProviders.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Coming soon
          </h2>
          {unavailableProviders.map((p) => (
            <div
              key={p.providerKey}
              className="flex items-center justify-between gap-2 text-sm text-muted-foreground"
            >
              <span>{p.displayName}</span>
              <Badge variant="secondary">{catalogAvailabilityLabel(p)}</Badge>
            </div>
          ))}
        </section>
      ) : null}

      {nothingToShow ? (
        <p className="text-sm text-muted-foreground">
          No systems to connect yet.
        </p>
      ) : null}
    </div>
  );
}

export default BusinessConnectionsPage;
