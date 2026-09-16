import React, { useEffect, useRef } from "react";
import {
  ChatMessageBubble,
  type DisplayChatMessage,
} from "@/components/chat/ChatMessageBubble";

type Props = {
  messages: DisplayChatMessage[];
  pending?: boolean;
};

export function ChatConversation({ messages, pending }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-1">
      {messages.map((m) => (
        <ChatMessageBubble key={m.id} message={m} />
      ))}
      {pending ? (
        <p className="text-xs text-muted-foreground">Thinking…</p>
      ) : null}
      <div ref={endRef} />
    </div>
  );
}
