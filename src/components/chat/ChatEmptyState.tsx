import React from "react";

type Props = {
  questions: string[];
  onSelect: (q: string) => void;
  disabled?: boolean;
};

export function ChatEmptyState({ questions, onSelect, disabled }: Props) {
  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Ask about cash, forecast, performance, or actions. Answers use your
        current Rimbun results and link back to the numbers.
      </p>
      {questions.length > 0 ? (
        <ul className="space-y-2">
          {questions.map((q) => (
            <li key={q}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(q)}
                className="w-full rounded-md border border-border/80 bg-transparent px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:border-foreground/30 hover:bg-muted/40 disabled:pointer-events-none disabled:opacity-50"
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
