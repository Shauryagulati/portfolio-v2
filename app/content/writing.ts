export interface Post {
  slug: string;
  title: string;
  date: string; // ISO
  summary: string;
  /** Paragraphs — for essays published on this site. */
  body?: string[];
  /** Set instead of body to link a piece published elsewhere
   *  (Substack, Hashnode, ...). Renders as an outbound link. */
  external?: string;
}

/** Essays. The nav link and routes appear automatically when posts
 *  exist. Remaining candidate titles:
 *  - "Design the degraded path before the happy one"
 *  - "What a portfolio terminal taught me about agent UX" */
export const posts: Post[] = [
  {
    slug: "synthesis-outrunning-retrieval",
    title: "Never Let Synthesis Outrun Retrieval",
    date: "2026-07-10",
    summary:
      "The most dangerous RAG system is the one whose answers sound better than its retrieval deserves.",
    body: [
      "Every RAG demo I have ever watched fails the same way, and almost nobody in the room notices. Someone asks a question, the system produces a confident, fluent, well-structured answer, and everyone nods. Then you check what the retriever actually returned, and it's two half-relevant chunks and a fragment from the wrong document. The language model wrote the answer anyway. It always will. That's what it's for.",
      "This is the core failure mode of retrieval-augmented systems: synthesis outrunning retrieval. The model's ability to produce a plausible answer grows completely independent of whether the system found the right information. Worse, better models make the problem harder to see. A weak model on top of bad retrieval produces obviously bad answers. A strong model on top of bad retrieval produces beautiful ones.",
      "I learned this on legal text, which is the least forgiving corpus there is. At Carnegie Mellon I built a RAG system over more than a thousand regulatory documents, for people who needed to act on the answers. Regulation punishes paraphrase: a summary that sounds right and cites nothing is worse than no answer, because someone might use it. So the architecture bent everything toward retrieval. Hybrid search, because statutory language is exact while the questions about it never are. Cross-encoder reranking, because the difference between the right section and the almost-right section is the whole job. Data lineage on every chunk, so any answer could be traced back to the page it came from. We evaluated across more than fifty query sets and measured 94 percent accuracy with grounded citations, and the number I trusted most wasn't the accuracy. It was the citation rate.",
      "Then I took the lesson into production at Lunon, building due-diligence automation for private equity, where a wrong answer isn't embarrassing, it's expensive. The rule got mechanical there. The analyst copilot verified citations against the source corpus before showing them. The pipeline had quality gates that could fail a run outright rather than let a weak intermediate result flow downstream into something persuasive. When a gate misfired and blocked a client demo, the fix wasn't to remove the gate. It was a warn-mode: complete the run, flag the doubt, keep the human informed. The system stayed honest either way.",
      "Why do teams keep breaking this rule? Because synthesis improves your demo overnight and retrieval improves it over months. Swap in a better model and everything instantly sounds smarter, so that's where the effort goes. Retrieval work is unglamorous: chunking strategy, index quality, reranking, evaluation sets. Nobody claps for a better chunker. But the model is rented; your retrieval layer is the actual product.",
      "The discipline, as I practice it now: make citations load-bearing, so the system refuses rather than answers uncited. Measure retrieval separately from generation, because a blended score hides exactly the failure you care about. And test behavior, not vibes. I built rag-verdict, an open-source testing framework, around precisely these checks: did the retrieval tool fire, does every citation resolve to a real document, does the agent refuse questions its corpus can't answer. PASS or FAIL, not a decimal.",
      "Systems that think are only useful if you can check their work. Synthesis is the voice. Retrieval is the knowledge. Keep the voice on a leash exactly as long as the knowledge.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
