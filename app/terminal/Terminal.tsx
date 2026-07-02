import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "~/content/site";
import { useShell } from "./useShell";
import { useAgent } from "./useAgent";

/** The summonable terminal. `/` or ⌘K from anywhere, Esc to dismiss.
 *  Shell mode is instant and offline; typing `shaurya` boots the agent. */
export function Terminal() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const shell = useShell(close);
  useAgent(shell);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const histIdx = useRef(-1);
  const reduced = useReducedMotion();

  // global summon hotkeys + artifact clicks
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing =
        t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
      if ((e.key === "/" && !typing) || (e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("terminal:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("terminal:open", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      shell.boot();
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, shell]);

  // pin scrollback to bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shell.lines, open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      shell.exec(value);
      setValue("");
      histIdx.current = -1;
    } else if (e.key === "Tab") {
      e.preventDefault();
      const hit = shell.complete(value);
      if (hit) setValue(hit);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = shell.history.current;
      if (!h.length) return;
      histIdx.current =
        histIdx.current === -1
          ? h.length - 1
          : Math.max(0, histIdx.current - 1);
      setValue(h[histIdx.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = shell.history.current;
      if (histIdx.current === -1) return;
      histIdx.current += 1;
      if (histIdx.current >= h.length) {
        histIdx.current = -1;
        setValue("");
      } else setValue(h[histIdx.current]);
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="term-backdrop"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="term-window"
            role="dialog"
            aria-modal="true"
            aria-label="Interactive terminal"
            initial={reduced ? false : { opacity: 0, y: 26, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.focus();
            }}
          >
            <div className="term-window-bar">
              <span className="term-artifact-bar" aria-hidden="true">
                <i /> <i /> <i />
              </span>
              <span className="term-window-title">
                guest@{site.handle} — {shell.mode === "agent" ? "agent" : "zsh"}
              </span>
              <button
                className="term-close mono"
                onClick={close}
                aria-label="Close terminal"
              >
                esc
              </button>
            </div>
            <div className="term-scroll" ref={scrollRef}>
              {shell.lines.map((l) => (
                <div key={l.id} className={`term-line term-${l.kind}`}>
                  {l.text || " "}
                </div>
              ))}
              <div className="term-input-row">
                <span className={shell.mode === "agent" ? "term-green" : "term-dim"}>
                  {shell.prompt}
                </span>
                <input
                  ref={inputRef}
                  className="term-input"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="Terminal input"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
