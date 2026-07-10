import { site } from "~/content/site";
import { resume } from "~/content/resume";
import { getDoc } from "~/content/corpus";
import { topDocs, topSentences } from "./retrieve";

export interface AgentAnswer {
  text: string;
  source: string | null;
}

/** Offline/fallback brain: retrieval + honest composition, no LLM.
 *  Used in dev, when the Pages Function isn't deployed, when the free
 *  quota is spent, or when the network is down. The site never breaks. */
export function localAnswer(query: string): AgentAnswer {
  const q = query.toLowerCase();

  if (/\b(hi|hello|hey|yo)\b/.test(q) && q.length < 20) {
    return {
      text: `hey. ask me about his projects, stack, or how to reach him.`,
      source: null,
    };
  }
  // conversational follow-ups: the offline brain has no memory, say so
  // gracefully instead of shrugging
  // openers like "why"/"how" stay OUT of this list: they begin real
  // questions ("how do I contact him?") and must reach retrieval
  if (
    q.length < 26 &&
    /^(are you sure|really\??$|ok(ay)?\??$|thanks?|thank you|cool|nice|lol|wow)/.test(
      q,
    )
  ) {
    return {
      text: `fair question. I'm running in offline mode right now (no LLM, just retrieval over the site), so I answer each question fresh and can't follow a thread. everything I say comes straight from the files here; cat the source I cite and check me.`,
      source: null,
    };
  }
  if (/(contact|email|reach|hire|linkedin)/.test(q)) {
    return {
      text: `email ${site.email}, or LinkedIn. both listed here.`,
      source: "~/contact.md",
    };
  }
  if (/(stack|skills?|technolog|tools|languages|frameworks)/.test(q)) {
    const skills = Object.entries(resume.skills)
      .map(([g, items]) => `${g.toLowerCase()}: ${items.slice(0, 5).join(", ")}`)
      .join(". ");
    return { text: skills + ".", source: "~/skills.md" };
  }
  if (/(experience|\bwork(ed|s)?\b|jobs?|roles?|career|employ)/.test(q) && q.length < 40) {
    const roles = resume.experience
      .map((x) => `${x.role} at ${x.org} (${x.dates})`)
      .join("; ");
    return {
      text: `${roles}. run: ls ~/experience for the file on each.`,
      source: "~/experience",
    };
  }
  if (/(education|degree|study|studied|university|college|cmu|carnegie)/.test(q) && q.length < 44) {
    const doc = getDoc("~/education.md");
    if (doc) {
      return {
        text: resume.education
          .map((e) => `${e.school}: ${e.credential}`)
          .join(". "),
        source: "~/education.md",
      };
    }
  }
  // only the literal "who is he / about him" — a bare `about` substring
  // hijacked questions like "tell me about eu navigator"
  if (/^(who is|who'?s)\b/.test(q) || /^about\b/.test(q.trim())) {
    return {
      text: `${site.name} — ${site.role} at ${site.school}. ${site.thesis}`,
      source: "~/about.md",
    };
  }
  if (/(project|work|built|portfolio)s?\b/.test(q) && q.length < 32) {
    return {
      text: `three case studies live here: eu-navigator (multi-agent RAG over EU law), air-quality-mlops (full MLOps lifecycle), bert-qa (fine-tuned QA on Azure). Ask about any of them, or run: ls ~/projects`,
      source: "~/projects",
    };
  }

  const hits = topDocs(query, 2);
  if (!hits.length) {
    return {
      text: `I only know what's on this site, and I couldn't find that. Try asking about his projects, stack, education, or contact.`,
      source: null,
    };
  }
  const best = hits[0].doc;
  const sentences = topSentences(best, query, 3);
  const text = sentences.length
    ? sentences.join(" ")
    : best.text.split("\n").slice(2, 5).join(" ");
  return { text, source: best.path };
}

export interface AgentTurn {
  role: "user" | "assistant";
  content: string;
}

/** Ask the deployed Pages Function; null means use the fallback.
 *  `history` gives the model short-term memory for follow-ups. */
export async function remoteAnswer(
  query: string,
  history: AgentTurn[] = [],
  timeoutMs = 12000,
): Promise<AgentAnswer | null> {
  try {
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ q: query.slice(0, 300), h: history.slice(-8) }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { answer?: string; source?: string };
    if (!data.answer) return null;
    return { text: data.answer, source: data.source ?? null };
  } catch {
    return null;
  }
}
