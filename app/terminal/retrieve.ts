// relative import (not "~") — the Cloudflare Pages Function bundles this
// file too and doesn't know the app's path alias
import { corpus, type Doc } from "../content/corpus";

/** Lexical retrieval over the corpus. The corpus is ~6 small documents —
 *  tf-idf overlap outperforms its weight class here and needs no build-time
 *  embedding step or runtime API. */

const STOP = new Set(
  "a an and are as at be but by for from has he his her hers him how i in is it its me my of on or s so t that the their them they this to was we what when where which who why will with you your".split(
    " ",
  ),
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

interface Indexed {
  doc: Doc;
  tf: Map<string, number>;
  len: number;
}

const index: Indexed[] = corpus.map((doc) => {
  const tf = new Map<string, number>();
  const tokens = tokenize(`${doc.title} ${doc.text}`);
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return { doc, tf, len: tokens.length };
});

function idf(term: string): number {
  const n = index.filter((d) => d.tf.has(term)).length;
  return Math.log(1 + (index.length - n + 0.5) / (n + 0.5));
}

export function topDocs(query: string, k = 2): { doc: Doc; score: number }[] {
  const terms = tokenize(query);
  return index
    .map((d) => {
      let score = 0;
      for (const t of terms) {
        const tf = d.tf.get(t) ?? 0;
        if (tf) score += (tf / d.len) * idf(t);
        // light fuzzy assist: prefix match for stems ("agents" ~ "agent")
        else {
          for (const key of d.tf.keys()) {
            if (key.startsWith(t) || t.startsWith(key)) {
              score += 0.3 * ((d.tf.get(key) ?? 0) / d.len) * idf(key);
              break;
            }
          }
        }
      }
      return { doc: d.doc, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

/** Most query-relevant sentences from a doc, in original order. */
export function topSentences(doc: Doc, query: string, n = 3): string[] {
  const terms = new Set(tokenize(query));
  const sentences = doc.text
    .replace(/^#+ .*$/gm, "")
    .replace(/^- /gm, "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/\n/g, " ").trim())
    .filter((s) => s.length > 30);
  const scored = sentences.map((s, i) => {
    const toks = tokenize(s);
    let hits = 0;
    for (const t of toks) if (terms.has(t)) hits++;
    return { s, i, score: hits / Math.sqrt(toks.length + 1) };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .filter((r) => r.score > 0)
    .sort((a, b) => a.i - b.i)
    .map((r) => r.s);
}
