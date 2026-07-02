import { site } from "../../app/content/site";
import { topDocs } from "../../app/terminal/retrieve";

/** Cloudflare Pages Function: POST /api/agent  { q: string }
 *  Deploys automatically with the site. Requires the Workers AI binding
 *  named `AI` (Pages project → Settings → Functions → AI bindings).
 *  Free tier: Workers AI daily allocation; the client falls back to
 *  local retrieval on any non-200, so quota exhaustion never breaks UX. */

interface Env {
  AI: {
    run(
      model: string,
      options: {
        messages: { role: string; content: string }[];
        max_tokens?: number;
      },
    ): Promise<{ response?: string }>;
  };
}

const MODEL = "@cf/meta/llama-3.1-8b-instruct";

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

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}) => {
  const { request, env } = context;
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (limited(ip)) return json({ error: "rate limited" }, 429);

  let q: string;
  try {
    const body = (await request.json()) as { q?: string };
    q = (body.q ?? "").slice(0, 300).trim();
  } catch {
    return json({ error: "bad request" }, 400);
  }
  if (!q) return json({ error: "empty query" }, 400);

  const hitsDocs = topDocs(q, 3);
  const context_ = hitsDocs
    .map((h) => `[${h.doc.path}]\n${h.doc.text.slice(0, 1600)}`)
    .join("\n\n");

  const system = [
    `You are "${site.handle}" — the terminal agent on ${site.name}'s portfolio site.`,
    `Answer questions about ${site.name} using ONLY the CONTEXT below.`,
    `If the answer isn't in the context, say you only know what's on this site.`,
    `Voice: lowercase terminal-log style, direct, warm, no emoji, no markdown.`,
    `Maximum 110 words.`,
    ``,
    `CONTEXT:`,
    context_ || "(nothing retrieved)",
  ].join("\n");

  try {
    const out = await env.AI.run(MODEL, {
      messages: [
        { role: "system", content: system },
        { role: "user", content: q },
      ],
      max_tokens: 256,
    });
    const answer = out.response?.trim();
    if (!answer) return json({ error: "empty model response" }, 502);
    return json({ answer, source: hitsDocs[0]?.doc.path ?? null });
  } catch {
    // model/binding unavailable — client falls back locally
    return json({ error: "model unavailable" }, 503);
  }
};
