import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

type AskRimbunContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openAsk: () => void;
  closeAsk: () => void;
  /** Live page path while Ask is open — updates as the user navigates. */
  referencePath: string;
};

const AskRimbunContext = createContext<AskRimbunContextValue | null>(null);

export function AskRimbunProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [referencePath, setReferencePath] = useState(location.pathname);

  const openAsk = useCallback(() => {
    setReferencePath(location.pathname);
    setOpen(true);
  }, [location.pathname]);

  const closeAsk = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) setReferencePath(location.pathname);
  }, [open, location.pathname]);

  const value = useMemo(
    () => ({ open, setOpen, openAsk, closeAsk, referencePath }),
    [open, openAsk, closeAsk, referencePath],
  );

  return (
    <AskRimbunContext.Provider value={value}>
      {children}
    </AskRimbunContext.Provider>
  );
}

export function useAskRimbun() {
  const ctx = useContext(AskRimbunContext);
  if (!ctx) {
    throw new Error("useAskRimbun must be used within AskRimbunProvider");
  }
  return ctx;
}
