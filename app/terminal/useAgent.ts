import type { useShell } from "./useShell";

/** Agent layer — plugs into the shell's agentHandler.
 *  This is the shell-only stub; the real agent lands with the Worker. */
export function useAgent(_shell: ReturnType<typeof useShell>) {
  // intentionally empty: `shaurya` reports the agent offline until Task 7
}
