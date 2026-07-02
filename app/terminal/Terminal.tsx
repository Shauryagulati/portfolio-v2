import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
} from "motion/react";
import { site } from "~/content/site";
import { useTerminal } from "./TerminalContext";
import { TermInput } from "./TermInput";

/** The terminal as a floating OS window: opens centered, drag it by the
 *  title bar, resize from the corner, keep browsing underneath — it's
 *  non-modal on purpose. Esc or ✕ closes. Mobile gets a full sheet. */
export function Terminal() {
  const { shell, open, setOpen, close } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const dragControls = useDragControls();
  const [mobile, setMobile] = useState(false);
  // keep the title bar reachable: the window starts at top 12dvh, so
  // allow at most that far up, and never let the bar sink below the fold
  const [bounds, setBounds] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const sync = () => {
      setMobile(mq.matches);
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      setBounds({
        top: -(0.12 * vh) + 6,
        bottom: 0.82 * vh,
        left: -0.9 * vw,
        right: 0.9 * vw,
      });
    };
    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  // global summon + dismiss hotkeys, and artifact/nav clicks
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing =
        t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
      if ((e.key === "/" && !typing) || (e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        close();
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("terminal:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("terminal:open", onOpen);
    };
  }, [setOpen, close]);

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
          className="term-window"
          role="dialog"
          aria-label="Interactive terminal"
          drag={!mobile}
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={bounds}
          initial={reduced ? false : { opacity: 0, y: 26, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }} // fade in place — the window may be dragged anywhere
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          onClick={() => {
            if (window.getSelection()?.toString()) return;
            inputRef.current?.focus();
          }}
        >
          <div
            className="term-window-bar"
            onPointerDown={(e) => {
              if (!mobile) dragControls.start(e);
            }}
            style={{ touchAction: "none" }}
          >
            <span className="term-artifact-bar" aria-hidden="true">
              <i /> <i /> <i />
            </span>
            <span className="term-window-title">
              guest@{site.handle} — {shell.mode === "agent" ? "agent" : "zsh"}
            </span>
            <button
              className="term-close mono"
              onClick={close}
              onPointerDown={(e) => e.stopPropagation()}
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
      )}
    </AnimatePresence>
  );
}
