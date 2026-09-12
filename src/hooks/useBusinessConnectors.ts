import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  authorizeBusinessConnector,
  disconnectBusinessConnector,
  listBusinessConnectorCatalog,
  listBusinessConnectorConnections,
  syncBusinessConnector,
  type BusinessConnectorCatalogItem,
  type BusinessSourceConnection,
} from "@/lib/api/businessApi";

export const businessConnectorsQueryKey = (customerId: string) =>
  ["business", "connectors", customerId] as const;

export function useBusinessConnectorCatalog(customerId: string | undefined) {
  return useQuery({
    queryKey: [...businessConnectorsQueryKey(customerId ?? ""), "catalog"],
    queryFn: () => listBusinessConnectorCatalog(customerId!),
    enabled: Boolean(customerId),
    staleTime: 60_000,
    retry: false,
  });
}

export function useBusinessConnectorConnections(
  customerId: string | undefined,
) {
  return useQuery({
    queryKey: [...businessConnectorsQueryKey(customerId ?? ""), "list"],
    queryFn: () => listBusinessConnectorConnections(customerId!),
    enabled: Boolean(customerId),
    staleTime: 15_000,
    retry: false,
    refetchInterval: (query) => {
      const rows = query.state.data as BusinessSourceConnection[] | undefined;
      const syncing = rows?.some(
        (c) =>
          c.lastSyncStatus === "running" ||
          c.lastSyncStatus === "queued" ||
          c.status === "pending",
      );
      return syncing ? 3_000 : false;
    },
  });
}

export function useAuthorizeBusinessConnector(customerId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      provider: string;
      redirectUri: string;
      credentials?: Record<string, unknown>;
      displayName?: string;
      environment?: "sandbox" | "production";
    }) => {
      if (!customerId) throw new Error("Missing customer");
      return authorizeBusinessConnector(customerId, input.provider, {
        redirectUri: input.redirectUri,
        credentials: input.credentials,
        displayName: input.displayName,
        environment: input.environment,
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: businessConnectorsQueryKey(customerId ?? ""),
      });
      if (result.authorizationUrl) {
        window.location.assign(result.authorizationUrl);
        return;
      }
      toast.success("Connected");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not connect");
    },
  });
}

export function useSyncBusinessConnector(customerId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (connectionId: string) => {
      if (!customerId) throw new Error("Missing customer");
      return syncBusinessConnector(customerId, connectionId);
    },
    onSuccess: (run) => {
      queryClient.invalidateQueries({
        queryKey: businessConnectorsQueryKey(customerId ?? ""),
      });
      if (run.status === "partial") {
        toast.warning("Sync completed with some records skipped");
      } else {
        toast.success("Sync completed");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not sync");
    },
  });
}

export function useDisconnectBusinessConnector(
  customerId: string | undefined,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (connectionId: string) => {
      if (!customerId) throw new Error("Missing customer");
      return disconnectBusinessConnector(customerId, connectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: businessConnectorsQueryKey(customerId ?? ""),
      });
      toast.success("Source disconnected");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not disconnect");
    },
  });
}

export function connectionStatusLabel(status: string): string {
  switch (status) {
    case "active":
      return "Connected";
    case "pending":
      return "Connecting";
    case "action_required":
      return "Action required";
    case "expired":
      return "Reconnect needed";
    case "error":
      return "Needs attention";
    case "revoked":
      return "Disconnected";
    default:
      return status;
  }
}

export function catalogAvailabilityLabel(
  item: BusinessConnectorCatalogItem,
): string {
  if (!item.available) {
    return item.pilotRequired ? "Pilot access" : "Temporarily unavailable";
  }
  return "Available to connect";
}

/** Parse OAuth / connect return query params on Sources without replaying callback. */
export function parseConnectorReturnParams(
  search: string,
): { kind: "success" | "failure"; message: string } | null {
  const params = new URLSearchParams(search);
  const result = params.get("connector");
  if (result === "connected" || result === "success") {
    return { kind: "success", message: "Source connected successfully." };
  }
  if (result === "error" || result === "failed") {
    const reason = params.get("reason");
    return {
      kind: "failure",
      message:
        reason === "denied"
          ? "Connection was cancelled."
          : "Could not finish connecting this source.",
    };
  }
  return null;
}
