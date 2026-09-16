import React from "react";

type Props = {
  asOf: string | null;
};

export function ChatDataStatus({ asOf }: Props) {
  if (!asOf) return null;
  return (
    <p className="text-xs text-muted-foreground">
      Data as of {asOf}
    </p>
  );
}
