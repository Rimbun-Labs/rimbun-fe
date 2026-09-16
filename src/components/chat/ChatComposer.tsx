import React, { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  disabled?: boolean;
  pending?: boolean;
  onSend: (message: string) => Promise<void> | void;
  draft?: string;
  onDraftChange?: (value: string) => void;
};

export function ChatComposer({
  disabled,
  pending,
  onSend,
  draft,
  onDraftChange,
}: Props) {
  const [local, setLocal] = useState("");
  const value = draft ?? local;
  const setValue = onDraftChange ?? setLocal;

  async function submit() {
    const text = value.trim();
    if (!text || disabled || pending) return;
    await onSend(text);
    if (draft == null) setLocal("");
  }

  return (
    <div
      className={cn(
        "flex items-end gap-2 rounded-lg border border-border/80 bg-muted/20 px-2.5 py-2",
        (disabled || pending) && "opacity-70",
      )}
    >
      <textarea
        className="max-h-28 min-h-[2.5rem] flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
        rows={2}
        value={value}
        disabled={disabled || pending}
        placeholder="Ask a question…"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void submit();
          }
        }}
      />
      <Button
        type="button"
        size="icon"
        className="h-8 w-8 shrink-0 rounded-full"
        disabled={disabled || pending || !value.trim()}
        onClick={() => void submit()}
        aria-label={pending ? "Sending" : "Send"}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
