import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useShell } from "./useShell";
import { useAgent } from "./useAgent";

/** One shell, two views: the inline artifact on the home hero and the
 *  overlay window share the same session — same scrollback, same cwd,
 *  same agent. Typing inline and expanding never loses state. */

type TerminalCtx = {
  shell: ReturnType<typeof useShell>;
  open: boolean;
  setOpen: (v: boolean) => void;
  close: () => void;
};

const Ctx = createContext<TerminalCtx | null>(null);

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const shell = useShell(close);
  useAgent(shell);

  // the agent deserves the big window — expand when it boots
  useEffect(() => {
    if (shell.mode === "agent") setOpen(true);
  }, [shell.mode]);

  return (
    <Ctx.Provider value={{ shell, open, setOpen, close }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTerminal(): TerminalCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTerminal outside TerminalProvider");
  return ctx;
}
