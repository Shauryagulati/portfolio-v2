import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { site } from "~/content/site";
import { useTheme } from "~/lib/theme";
import { bootLines } from "./greeting";
import { commands, commandNames, type Line, type ShellCtx } from "./commands";
import { cwdString, listDir, resolve } from "./vfs";

export type ShellMode = "shell" | "agent";

/** Everything the terminal window needs: scrollback, prompt, history,
 *  completion, and a mode flag the agent layer flips. */
export function useShell(close: () => void) {
  const [lines, setLines] = useState<Line[]>([]);
  const [cwd, setCwd] = useState<string[]>([]);
  const [mode, setMode] = useState<ShellMode>("shell");
  const [, toggleTheme] = useTheme();
  const navigate = useNavigate();
  const history = useRef<string[]>([]);
  const nextId = useRef(0);
  const booted = useRef(false);
  /** Task 7 plugs the agent in here. */
  const agentHandler = useRef<((input: string) => void) | null>(null);

  const print = useCallback((kind: Line["kind"], ...texts: string[]) => {
    setLines((prev) => [
      ...prev,
      ...texts.map((text) => ({ id: nextId.current++, kind, text })),
    ]);
  }, []);

  const clear = useCallback(() => setLines([]), []);

  /** Grow the last line in place — the agent streams through this. */
  const appendToLast = useCallback((chunk: string) => {
    setLines((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      return [...prev.slice(0, -1), { ...last, text: last.text + chunk }];
    });
  }, []);

  const boot = useCallback(() => {
    if (booted.current) return;
    booted.current = true;
    print("dim", ...bootLines(site.handle));
  }, [print]);

  const prompt =
    mode === "agent" ? `${site.handle} ▸` : `${cwdString(cwd)} %`;

  const exec = useCallback(
    (raw: string) => {
      const input = raw.trim();
      print("in", `${prompt} ${input}`);
      if (!input) return;
      history.current.push(input); // agent questions are history too
      if (mode === "agent") {
        agentHandler.current?.(input);
        return;
      }
      const [name, ...args] = input.split(/\s+/);
      const ctx: ShellCtx = {
        cwd,
        setCwd,
        print,
        clear,
        close,
        navigate,
        toggleTheme,
        history: history.current,
      };
      if (name === site.handle || name === "agent") {
        // agent boot — Task 7 replaces this stub via agentHandler
        if (agentHandler.current) {
          setMode("agent");
          agentHandler.current("__boot__");
        } else {
          print("err", "agent offline — coming online in the next commit.");
        }
        return;
      }
      const cmd = commands[name];
      if (!cmd) {
        print("err", `command not found: ${name} — try help`);
        return;
      }
      cmd.run(ctx, args);
    },
    [mode, cwd, prompt, print, clear, close, navigate, toggleTheme],
  );

  /** Tab completion over commands and current-dir entries.
   *  Unique hit → completed string. Several hits → candidate list
   *  (the input shows them like a real shell). None → null. */
  const complete = useCallback(
    (input: string): string | string[] | null => {
      const parts = input.split(/\s+/);
      const last = parts[parts.length - 1] ?? "";
      const pool =
        parts.length <= 1
          ? commandNames
          : (() => {
              const slash = last.lastIndexOf("/");
              const dirPart = slash >= 0 ? last.slice(0, slash + 1) : "";
              const dir = resolve(cwd, dirPart || ".");
              if (!dir || dir.kind !== "dir") return [];
              return listDir(dir).map((n) => dirPart + n);
            })();
      const hits = pool.filter((p) => p.startsWith(last) && p !== last);
      if (!hits.length) return null;
      if (hits.length > 1) return hits;
      parts[parts.length - 1] = hits[0];
      return parts.join(" ");
    },
    [cwd],
  );

  return {
    lines,
    prompt,
    mode,
    setMode,
    exec,
    complete,
    boot,
    print,
    appendToLast,
    history,
    agentHandler,
  };
}
