import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { MessageCircle, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SoftWait } from "@/components/ui/SoftWait";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatConversation } from "@/components/chat/ChatConversation";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import type { DisplayChatMessage } from "@/components/chat/ChatMessageBubble";
import { useAskRimbun } from "@/contexts/AskRimbunContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessChatEnabled } from "@/hooks/useBusinessChatEnabled";
import { getDesignatedBusinessSubject } from "@/lib/api/businessApi";
import {
  createBusinessChatThread,
  getBusinessChatSuggestedQuestions,
  listBusinessChatMessages,
  listBusinessChatThreads,
  sendBusinessChatMessage,
  type ChatEvidenceCitation,
} from "@/lib/api/businessChatApi";
import { cn } from "@/lib/utils";

function pageLabel(pathname: string): string {
  if (pathname.includes("/performance")) return "Performance";
  if (pathname.includes("/money")) return "Money";
  if (pathname.includes("/plans")) return "Plans";
  if (pathname.includes("/review")) return "Review";
  if (pathname.includes("/import")) return "Import";
  if (pathname.includes("/connections")) return "Connections";
  if (pathname.includes("/sources")) return "Sources";
  if (pathname.includes("/customers/")) return "Customer";
  return "Home";
}

/**
 * Docked right sidebar — no modal overlay. Main app stays usable for
 * navigation and copying while Ask is open.
 */
export function AskRimbunPanel() {
  const { open, closeAsk, referencePath } = useAskRimbun();
  const { enabled } = useBusinessChatEnabled();
  const { operator } = useAuth();
  const { customerId: routeCustomerId } = useParams<{ customerId?: string }>();
  const location = useLocation();
  const bootstrappedFor = useRef<string | null>(null);

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DisplayChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [asOf, setAsOf] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // v1: direct business tenants only (not FI operators).
  const canUse = enabled && operator?.tenantType === "business";

  const resolveCustomer = useCallback(async () => {
    if (routeCustomerId) return routeCustomerId;
    const match = location.pathname.match(/^\/app\/customers\/([^/]+)/);
    if (match?.[1]) return match[1];
    if (operator?.tenantType === "business") {
      const subject = await getDesignatedBusinessSubject();
      return subject.customerId;
    }
    return null;
  }, [routeCustomerId, location.pathname, operator?.tenantType]);

  const resetConversationState = useCallback(() => {
    setThreadId(null);
    setMessages([]);
    setSuggestions([]);
    setAsOf(null);
    setDraft("");
    setError(null);
    bootstrappedFor.current = null;
  }, []);

  const bootstrap = useCallback(async (id: string, createNew = false) => {
    setLoading(true);
    setError(null);
    try {
      const suggested = await getBusinessChatSuggestedQuestions(id);
      setSuggestions(suggested.questions ?? []);
      const existing = createNew ? [] : await listBusinessChatThreads(id);
      const thread = existing[0] ?? (await createBusinessChatThread(id));
      const storedMessages = await listBusinessChatMessages(id, thread.id);
      setThreadId(thread.id);
      setMessages(
        storedMessages
          .filter((message) => message.role !== "system")
          .map((message) => ({
            id: message.id,
            role: message.role as "user" | "assistant",
            content: message.content,
            limitations: message.limitations,
            generationStatus: message.generationStatus,
          })),
      );
      setAsOf(null);
      bootstrappedFor.current = id;
    } catch {
      setError("Ask Rimbun could not be loaded. Try again in a moment.");
      bootstrappedFor.current = null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open || !canUse) return;
    let cancelled = false;
    setResolving(true);
    void resolveCustomer()
      .then((id) => {
        if (cancelled) return;
        setCustomerId(id);
        setResolving(false);
        if (!id) {
          resetConversationState();
          setError("No business workspace is available for Ask Rimbun.");
          return;
        }
        if (bootstrappedFor.current === id) return;
        resetConversationState();
        setCustomerId(id);
        void bootstrap(id);
      })
      .catch(() => {
        if (cancelled) return;
        setResolving(false);
        setError("Ask Rimbun could not be loaded. Try again in a moment.");
      });
    return () => {
      cancelled = true;
    };
  }, [open, canUse, resolveCustomer, bootstrap, resetConversationState]);

  useEffect(() => {
    if (!open) {
      resetConversationState();
      setCustomerId(null);
    }
  }, [open, resetConversationState]);

  async function startNewConversation() {
    if (!customerId || pending) return;
    setDraft("");
    setError(null);
    await bootstrap(customerId, true);
  }

  async function send(text: string) {
    if (!customerId || !threadId || pending) return;
    const userMsg: DisplayChatMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      content: text,
      generationStatus: "pending",
    };
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setPending(true);
    setError(null);
    try {
      const res = await sendBusinessChatMessage(customerId, threadId, text);
      const assistant = res.message;
      const evidence: ChatEvidenceCitation[] = assistant.evidence ?? [];
      setMessages((prev) => [
        ...prev.map((message) =>
          message.id === userMsg.id
            ? { ...message, generationStatus: "completed" as const }
            : message,
        ),
        {
          id: assistant.id,
          role: "assistant",
          content: assistant.content,
          evidence,
          limitations: assistant.limitations ?? [],
        },
      ]);
      if (assistant.asOf) setAsOf(assistant.asOf);
      if (assistant.suggestedQuestions?.length) {
        setSuggestions(assistant.suggestedQuestions);
      }
    } catch {
      setError(
        "That answer could not be completed. Your question is still below — try again.",
      );
      setDraft(text);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === userMsg.id
            ? { ...message, generationStatus: "failed" as const }
            : message,
        ),
      );
    } finally {
      setPending(false);
    }
  }

  if (!canUse || !open) return null;

  const viewing = pageLabel(referencePath);

  return (
    <aside
      className={cn(
        "flex h-[calc(100vh-4rem)] w-full max-w-sm shrink-0 flex-col border-l border-border/80 bg-background",
        "sticky top-16",
      )}
      aria-label="Ask Rimbun"
    >
      <header className="flex items-start justify-between gap-2 border-b border-border/70 px-4 py-3">
        <div className="min-w-0 space-y-0.5">
          <h2 className="flex items-center gap-2 text-sm font-medium tracking-tight">
            <MessageCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
            Ask Rimbun
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            Viewing {viewing}
            {asOf ? ` · as of ${asOf}` : null}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            disabled={pending || !customerId || resolving || loading}
            onClick={() => void startNewConversation()}
            aria-label="New conversation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={closeAsk}
            aria-label="Close Ask Rimbun"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
        {resolving || loading ? (
          <div className="flex flex-1 items-center justify-center">
            <SoftWait preset="page" />
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <ChatEmptyState
                questions={suggestions}
                disabled={pending || !threadId}
                onSelect={(q) => void send(q)}
              />
            ) : (
              <ChatConversation messages={messages} pending={pending} />
            )}

            {error ? (
              <p className="mt-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-auto pt-3">
              <ChatComposer
                draft={draft}
                onDraftChange={setDraft}
                pending={pending}
                disabled={!threadId}
                onSend={send}
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
