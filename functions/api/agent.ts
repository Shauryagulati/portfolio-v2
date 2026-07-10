import { site } from "../../app/content/site";
import { corpus } from "../../app/content/corpus";
import { projects } from "../../app/content/projects";

/** Cloudflare Pages Function: POST /api/agent  { q: string, h?: Msg[] }
 *  Requires the Workers AI binding named `AI` (shipped via wrangler.jsonc).
 *
 *  The corpus is ~4K tokens, so the model gets THE WHOLE SITE every time.
 *  Per-query retrieval kept picking the wrong 3 docs for broad questions
 *  ("what are his recent projects?" matched an old course project) and
 *  citations came from retrieval rank rather than what the model used.
 *  Now the model reads everything, answers, and names its own source.
 *  `h` carries short conversation history so follow-ups work. */

interface Msg {
  role: string;
  content: string;
}

interface Env {
  AI: {
    run(
      model: string,
      options: { messages: Msg[]; max_tokens?: number },
    ): Promise<{ response?: string }>;
  };
}

const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

// Per-isolate rate limit — resets when the isolate recycles. Good enough
// for a portfolio; a KV-backed limiter is overkill at this traffic.
const hits = new Map<string, { count: number; reset: number }>();
const PER_MIN = 8;

function limited(ip: string): boolean {
  const now = Date.now();
  const slot = hits.get(ip);
  if (!slot || now > slot.reset) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  slot.count += 1;
  return slot.count > PER_MIN;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

// recency map so "recent" questions rank 2026 work first
const RECENCY = projects
  .map(
    (p) =>
      `- ${p.title} (${p.slug})${p.earlier ? " [earlier work, pre-2025]" : " [recent, 2025-2026]"}: ${p.oneliner}`,
  )
  .join("\n");

const FULL_SITE = corpus
  .map((doc) => `<file path="${doc.path}">\n${doc.text}\n</file>`)
  .join("\n\n");

const SYSTEM = [
  `You are "${site.handle}", the terminal agent on ${site.name}'s portfolio site.`,
  `Below is the ENTIRE content of the site as files. Answer questions about ${site.name} using ONLY these files.`,
  `If something isn't in them, say you only know what's on this site.`,
  ``,
  `Rules:`,
  `- Write in clear, normally-capitalized sentences. Direct and warm, first person about the site owner in third person ("Shaurya built...").`,
  `- Plain text only: no emoji, no markdown symbols (no **, #, backticks).`,
  `- When listing 3+ items, use short lines starting with "- " instead of a comma run.`,
  `- Maximum 90 words of answer.`,
  `- "Recent" means the 2025-2026 work: ${site.name} is currently between roles after Lunon (Feb-May 2026); his recent projects are the ones NOT marked earlier work in the index.`,
  `- End your reply with a final line naming the single most relevant file, exactly like: SRC: ~/projects/suture.md`,
  ``,
  `PROJECT INDEX (recency):`,
  RECENCY,
  ``,
  `FILES:`,
  FULL_SITE,
].join("\n");

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}) => {
  const { request, env } = context;
  if (!env.AI) return json({ error: "ai binding missing" }, 503);
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (limited(ip)) return json({ error: "rate limited" }, 429);

  let q: string;
  let history: Msg[] = [];
  try {
    const body = (await request.json()) as { q?: string; h?: Msg[] };
    q = (body.q ?? "").slice(0, 300).trim();
    if (Array.isArray(body.h)) {
      history = body.h
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string",
        )
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }));
    }
  } catch {
    return json({ error: "bad request" }, 400);
  }
  if (!q) return json({ error: "empty query" }, 400);

  try {
    const out = await env.AI.run(MODEL, {
      messages: [
        { role: "system", content: SYSTEM },
        ...history,
        { role: "user", content: q },
      ],
      max_tokens: 300,
    });
    let answer = out.response?.trim();
    if (!answer) return json({ error: "empty model response" }, 502);

    // the model cites its own source; parse it off the answer
    let source: string | null = null;
    const m = answer.match(/\n?\s*SRC:\s*(~\/[^\s]+)\s*$/i);
    if (m) {
      source = m[1];
      answer = answer.slice(0, m.index).trim();
    }
    if (source && !corpus.some((d) => d.path === source)) source = null;

    return json({ answer, source });
  } catch (e) {
    // client falls back locally; surface a short reason for diagnostics
    const reason = e instanceof Error ? e.message.slice(0, 140) : "unknown";
    return json({ error: `model error: ${reason}` }, 503);
  }
};
