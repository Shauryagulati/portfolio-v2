import { useEffect, useRef } from "react";
import { site } from "~/content/site";
import { localAnswer, remoteAnswer, type AgentTurn } from "./agent";
import type { useShell } from "./useShell";

const INTRO = [
  `${site.handle}-agent v1 · RAG over everything on this site.`,
  `ask about projects, stack, education, contact. type exit to leave.`,
];

/** The agent REPL. Remote-first (Pages Function + Workers AI), local
 *  lexical fallback so the terminal works with zero backend. Streams
 *  character-by-character; the CRT spins while thinking. */
export function useAgent(shell: ReturnType<typeof useShell>) {
  const busy = useRef(false);
  // short-term memory: follow-ups ("are you sure?") need the thread
  const turns = useRef<AgentTurn[]>([]);
  // keep latest shell fns without re-registering the handler
  const shellRef = useRef(shell);
  shellRef.current = shell;

  useEffect(() => {
    shellRef.current.agentHandler.current = async (input: string) => {
      const sh = shellRef.current;
      if (input === "__boot__") {
        sh.print("dim", ...INTRO);
        return;
      }
      if (input === "exit" || input === "quit") {
        sh.setMode("shell");
        sh.print("dim", "agent detached. you're back in the shell.");
        return;
      }
      if (busy.current) {
        sh.print("dim", "(still answering. give me a second, then re-ask)");
        return;
      }
      busy.current = true;
      window.dispatchEvent(new CustomEvent("agent:thinking"));
      sh.print("dim", "▸ thinking…");

      const answer =
        (await remoteAnswer(input, turns.current)) ?? localAnswer(input);
      turns.current.push(
        { role: "user", content: input },
        { role: "assistant", content: answer.text.slice(0, 500) },
      );
      if (turns.current.length > 8) turns.current.splice(0, 2);

      window.dispatchEvent(new CustomEvent("agent:idle"));
      sh.print("ok", "");
      // stream in small chunks — fast enough to feel alive, slow enough to read
      const text = answer.text;
      for (let i = 0; i < text.length; i += 3) {
        sh.appendToLast(text.slice(i, i + 3));
        await new Promise((r) => setTimeout(r, 12));
      }
      if (answer.source) sh.print("dim", `src: ${answer.source}`);
      busy.current = false;
    };
    return () => {
      shellRef.current.agentHandler.current = null;
    };
  }, []);
}
