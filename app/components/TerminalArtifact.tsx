import { site } from "~/content/site";
import { useTerminal } from "~/terminal/TerminalContext";

/** A quiet launcher — one closed prompt on the paper. The hero keeps its
 *  air; the real terminal opens as a floating window (press / or click). */
export function TerminalArtifact() {
  const { setOpen } = useTerminal();
  return (
    <button
      className="term-artifact"
      onClick={() => setOpen(true)}
      aria-label="Activate the interactive terminal"
    >
      <span className="term-artifact-bar" aria-hidden="true">
        <i /> <i /> <i />
      </span>
      <span className="term-artifact-body" aria-hidden="true">
        <span className="term-line">
          <span className="term-dim">guest@{site.handle} ~ %</span>
          <span className="term-cursor" />
        </span>
      </span>
      <span className="term-artifact-hint mono">
        press <b>/</b> or click to activate · {site.terminalHint}
      </span>
    </button>
  );
}
