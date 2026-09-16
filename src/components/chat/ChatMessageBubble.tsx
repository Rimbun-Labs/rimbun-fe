import React from "react";
import { ChatEvidenceLinks } from "@/components/chat/ChatEvidenceLinks";
import type { ChatEvidenceCitation } from "@/lib/api/businessChatApi";
import { cn } from "@/lib/utils";

export type DisplayChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  generationStatus?: "pending" | "completed" | "failed";
  evidence?: ChatEvidenceCitation[];
  limitations?: string[];
};

type Props = {
  message: DisplayChatMessage;
};

function PlainAnswer({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
      {text}
    </div>
  );
}

export function ChatMessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[95%] text-sm",
          isUser
            ? "rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-background"
            : "space-y-2 text-foreground",
        )}
      >
        <PlainAnswer text={message.content} />
        {isUser && message.generationStatus === "failed" ? (
          <p className="mt-1 text-xs text-background/70">Not answered</p>
        ) : null}
        {!isUser && message.limitations && message.limitations.length > 0 ? (
          <ul className="space-y-1 text-xs text-muted-foreground">
            {message.limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        ) : null}
        {!isUser && message.evidence ? (
          <ChatEvidenceLinks evidence={message.evidence} />
        ) : null}
      </div>
    </div>
  );
}
