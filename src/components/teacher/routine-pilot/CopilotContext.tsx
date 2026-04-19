import { createContext, useCallback, useContext, useState, ReactNode } from "react";

export interface CopilotOpenOptions {
  routineKey?: string;
  batchId?: string;
}

interface CopilotContextValue {
  isOpen: boolean;
  initialRoutineKey: string | null;
  initialBatchId: string | null;
  openCopilot: (opts?: CopilotOpenOptions) => void;
  closeCopilot: () => void;
  toggleCopilot: () => void;
}

const CopilotContext = createContext<CopilotContextValue | null>(null);

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialRoutineKey, setInitialRoutineKey] = useState<string | null>(null);
  const [initialBatchId, setInitialBatchId] = useState<string | null>(null);

  const openCopilot = useCallback((opts?: CopilotOpenOptions) => {
    if (opts?.routineKey !== undefined) setInitialRoutineKey(opts.routineKey);
    if (opts?.batchId !== undefined) setInitialBatchId(opts.batchId);
    setIsOpen(true);
  }, []);

  const closeCopilot = useCallback(() => setIsOpen(false), []);
  const toggleCopilot = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <CopilotContext.Provider
      value={{ isOpen, initialRoutineKey, initialBatchId, openCopilot, closeCopilot, toggleCopilot }}
    >
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const ctx = useContext(CopilotContext);
  if (!ctx) throw new Error("useCopilot must be used within CopilotProvider");
  return ctx;
}
