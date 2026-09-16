import { apiClient } from "./client";

export type ChatEvidenceCitation = {
  id: string;
  label: string;
  route: string;
};

export type ChatAssistantMessage = {
  id: string;
  role: "assistant";
  content: string;
  evidence: ChatEvidenceCitation[];
  limitations: string[];
  suggestedQuestions: string[];
  asOf: string | null;
  promptVersion?: string;
  provider?: string;
  model?: string;
  contextVersion?: string;
};

export type ChatThreadSummary = {
  id: string;
  title: string | null;
  status: string;
  domain: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessageRow = {
  id: string;
  threadId: string;
  role: "user" | "assistant" | "system";
  content: string;
  generationStatus: "pending" | "completed" | "failed";
  failureCode: string | null;
  evidenceIds: string[];
  limitations: string[];
  createdAt: string;
};

function unwrap<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as { data: unknown }).data !== undefined
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

/** Backend is the only gate — BUSINESS_CHAT_ENABLED. */
export async function getBusinessChatStatus(): Promise<{ enabled: boolean }> {
  const res = await apiClient.get(`/business/chat/status`);
  return unwrap(res.data);
}

export async function getBusinessChatSuggestedQuestions(
  customerId: string,
): Promise<{ questions: string[]; enabled: boolean }> {
  const res = await apiClient.get(
    `/business/customers/${customerId}/chat/suggested-questions`,
  );
  return unwrap(res.data);
}

export async function listBusinessChatThreads(
  customerId: string,
): Promise<ChatThreadSummary[]> {
  const res = await apiClient.get(
    `/business/customers/${customerId}/chat/threads`,
  );
  return unwrap(res.data);
}

export async function createBusinessChatThread(
  customerId: string,
): Promise<ChatThreadSummary> {
  const res = await apiClient.post(
    `/business/customers/${customerId}/chat/threads`,
  );
  return unwrap(res.data);
}

export async function listBusinessChatMessages(
  customerId: string,
  threadId: string,
): Promise<ChatMessageRow[]> {
  const res = await apiClient.get(
    `/business/customers/${customerId}/chat/threads/${threadId}/messages`,
  );
  return unwrap(res.data);
}

export async function sendBusinessChatMessage(
  customerId: string,
  threadId: string,
  message: string,
): Promise<{ message: ChatAssistantMessage }> {
  const res = await apiClient.post(
    `/business/customers/${customerId}/chat/threads/${threadId}/messages`,
    { message },
  );
  return unwrap(res.data);
}

export async function deleteBusinessChatThread(
  customerId: string,
  threadId: string,
): Promise<void> {
  await apiClient.delete(
    `/business/customers/${customerId}/chat/threads/${threadId}`,
  );
}
