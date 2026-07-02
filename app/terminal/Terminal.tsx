import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "~/content/site";
import { useTerminal } from "./TerminalContext";
import { TermInput } from "./TermInput";

/** The overlay window — the big view of the shared terminal session.
 *  `/` or ⌘K from anywhere, Esc to dismiss. */
export function Terminal() {
  const { shell, open, setOpen, close } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // global summon hotkeys + artifact/nav clicks
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
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      shell.boot();
      window.dispatchEvent(new CustomEvent("terminal:visible"));
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      window.dispatchEvent(new CustomEvent("terminal:hidden"));
    }
  }, [open, shell]);

  // pin scrollback to bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shell.lines, open]);

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
              // don't destroy a drag-selection (copying an email/url matters)
              if (window.getSelection()?.toString()) return;
              inputRef.current?.focus();
            }}
            onKeyDown={(e) => {
              // Escape closes no matter where focus sits inside the dialog
              if (e.key === "Escape") close();
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
                  {l.text || " "}
                </div>
              ))}
              <div className="term-input-row">
                <span className={shell.mode === "agent" ? "term-green" : "term-dim"}>
                  {shell.prompt}
                </span>
                <TermInput
                  ref={inputRef}
                  shell={shell}
                  onEscape={close}
                  ariaLabel="Terminal input"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
