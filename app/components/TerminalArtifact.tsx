import { useEffect, useRef } from "react";
import { site } from "~/content/site";
import { useTerminal } from "~/terminal/TerminalContext";
import { TermInput } from "~/terminal/TermInput";

/** The black artifact on the paper — and it's ALIVE. This is the same
 *  session as the overlay: type right here, first keystroke real.
 *  When output outgrows the widget (or the agent boots), it hands the
 *  session to the big window without losing a line. */

const INLINE_LINES = 6;

export function TerminalArtifact() {
  const { shell, open, setOpen } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  // scrollback length when the overlay last closed — only NEW output
  // (typed here, inline) hands the session back to the big window
  const closedAt = useRef(0);

  useEffect(() => {
    shell.boot();
  }, [shell]);

  useEffect(() => {
    if (!open) closedAt.current = shell.lines.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (
      !open &&
      shell.lines.length > closedAt.current &&
      shell.lines.length > INLINE_LINES
    ) {
      setOpen(true);
    }
  }, [shell.lines.length, open, setOpen]);

  const tail = shell.lines.slice(-INLINE_LINES);

  return (
    <div
      className="term-artifact term-artifact-live"
      onClick={() => {
        if (window.getSelection()?.toString()) return;
        inputRef.current?.focus();
      }}
    >
      <span className="term-artifact-bar" aria-hidden="true">
        <i /> <i /> <i />
        <button
          className="term-expand mono"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          aria-label="Expand terminal"
        >
          ⤢
        </button>
      </span>
      <span className="term-artifact-body">
        {tail.map((l) => (
          <span key={l.id} className={`term-line term-${l.kind}`}>
            {l.text || " "}
          </span>
        ))}
        <span className="term-input-row">
          <span className={shell.mode === "agent" ? "term-green" : "term-dim"}>
            {shell.prompt}
          </span>
          {open ? (
            <span className="term-dim">session in window ↗</span>
          ) : (
            <TermInput
              ref={inputRef}
              shell={shell}
              ariaLabel="Terminal — type here"
            />
          )}
        </span>
      </span>
      <span className="term-artifact-hint mono">
        {shell.mode === "agent"
          ? "agent session active — type exit to leave"
          : `${site.terminalHint} — this prompt is real, start typing`}
      </span>
    </div>
  );
}
