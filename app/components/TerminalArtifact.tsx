import { site } from "~/content/site";
import { openTerminal } from "./Nav";

/** The black artifact on the paper — a real terminal, folded shut.
 *  Clicking it (or pressing /) summons the live one. */
export function TerminalArtifact() {
  return (
    <button
      className="term-artifact"
      onClick={openTerminal}
      aria-label="Open the interactive terminal"
    >
      <span className="term-artifact-bar" aria-hidden="true">
        <i /> <i /> <i />
      </span>
      <span className="term-artifact-body" aria-hidden="true">
        <span className="term-line">
          <span className="term-dim">guest@{site.handle} ~ %</span>{" "}
          {site.handle}
        </span>
        <span className="term-line term-green">
          ▸ agent online. ask me anything about his work.
        </span>
        <span className="term-line">
          <span className="term-dim">~ %</span>
          <span className="term-cursor" />
        </span>
      </span>
      <span className="term-artifact-hint mono">{site.terminalHint}</span>
    </button>
  );
}
