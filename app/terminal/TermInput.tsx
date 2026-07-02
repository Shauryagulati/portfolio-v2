import { forwardRef, useRef, useState } from "react";
import type { useShell } from "./useShell";

/** The one true input: Enter executes, Tab completes, ↑/↓ walks history.
 *  Shared by the overlay window and the inline hero artifact. */
export const TermInput = forwardRef<
  HTMLInputElement,
  {
    shell: ReturnType<typeof useShell>;
    onEscape?: () => void;
    disabled?: boolean;
    ariaLabel: string;
  }
>(function TermInput({ shell, onEscape, disabled, ariaLabel }, ref) {
  const [value, setValue] = useState("");
  const histIdx = useRef(-1);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      shell.exec(value);
      setValue("");
      histIdx.current = -1;
    } else if (e.key === "Tab") {
      if (e.shiftKey) return; // let Shift+Tab move focus (a11y escape hatch)
      e.preventDefault();
      const hit = shell.complete(value);
      if (Array.isArray(hit)) {
        shell.print("dim", hit.join("   ")); // ambiguous → show candidates
      } else if (hit) {
        setValue(hit);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = shell.history.current;
      if (!h.length) return;
      histIdx.current =
        histIdx.current === -1 ? h.length - 1 : Math.max(0, histIdx.current - 1);
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
      onEscape?.();
    }
  };

  return (
    <input
      ref={ref}
      className="term-input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={disabled}
      spellCheck={false}
      autoCapitalize="off"
      autoComplete="off"
      aria-label={ariaLabel}
    />
  );
});
