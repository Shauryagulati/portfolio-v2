export interface Project {
  slug: string;
  title: string;
  oneliner: string;
  stack: string[];
  /** Case-study body. Plain paragraphs — rendered on the page,
   *  `cat`-able in the terminal, and retrievable by the agent. */
  problem: string;
  approach: string;
  outcome: string;
  github?: string;
  featured: boolean;
  /** Pre-CMU / superseded work — listed under "Earlier" on the index. */
  earlier?: boolean;
}

export const projects: Project[] = [
  {
    slug: "suture",
    title: "Suture",
    oneliner:
      "An AI-native operations layer for a cardiology practice — the full referral-to-outreach loop, built to be audited.",
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "LLM extraction",
      "Hybrid RAG",
    ],
    problem:
      "A cardiology practice runs on paper-shaped work: referrals arrive as faxes and PDFs, prior authorizations mean reading payer policy documents, and patient outreach is manual phone-tag. Automating any of it with LLMs raises the stakes rather than lowering them — a hallucinated field in a referral or a leaked record isn't a bug, it's a patient-safety and compliance incident. The system had to be useful AND provably careful.",
    approach:
      "Suture handles the full loop — intake, review, prior-auth, outreach — with the human kept deliberately in it. Documents flow through an LLM extraction pipeline backed by a real eval harness: per-field precision and recall tracked across every prompt change, so quality regressions are caught before they ship. Prior authorization runs on a 3-stage hybrid-RAG engine (structured rules + semantic retrieval) over payer policy documents. Extracted data goes to human-in-the-loop review before anything acts on it, and outreach goes multi-channel only after approval. The security posture is fail-closed: tenant isolation enforced at the ORM layer (a missing tenant context raises, cross-tenant reads return 404), field-level PHI encryption, and a PHI-safe audit log.",
    outcome:
      "A working AI platform for a domain where 'mostly right' is not a passing grade — extraction with measured per-field accuracy, retrieval that cites the payer policy it decided from, and an architecture where the dangerous failure modes are structurally impossible rather than merely unlikely. The repo stays private for exactly the reasons the system exists; a walkthrough is available on request.",
    featured: true,
  },
  {
    slug: "rag-verdict",
    title: "rag-verdict",
    oneliner:
      "Pytest for RAG agents — an open-source framework that tests what your agent does, not just how its answers score.",
    stack: [
      "Python",
      "pytest",
      "LLM-as-judge",
      "CI",
      "Open source (MIT)",
    ],
    problem:
      "RAG evaluation tools like RAGAS and DeepEval mostly average quality scores over answers. That misses the failures that actually embarrass you in production: the retrieval tool that silently never fired, the citation pointing at a document that doesn't exist, the agent that confidently answers questions its corpus knows nothing about. Scores don't catch behavior; tests do.",
    approach:
      "rag-verdict treats a RAG agent like code under test. Behavioral probes check whether tools fire when they should, whether every citation resolves to a real document, and whether the agent refuses out-of-corpus questions instead of improvising. A pluggable adapter (Python or HTTP) connects any RAG system in any language. An LLM-as-judge layer with structured output handles the fuzzy cases — and degrades gracefully when no API key is present, so the deterministic checks still run in CI. Results come back as PASS/FAIL/WEAK verdicts, not a decimal that nobody can act on.",
    outcome:
      "An MIT-licensed framework that turns 'our agent seems fine' into a test suite with verdicts — CI-friendly, language-agnostic, and opinionated about what matters. It's also the distilled lesson of every RAG system I've built: retrieve before you generate, cite what you retrieved, and test the behavior, not the vibes.",
    github: "https://github.com/Shauryagulati/ragverdict",
    featured: true,
  },
  {
    slug: "regulatory-rag",
    title: "Regulatory RAG at CMU",
    oneliner:
      "A hybrid retrieval system over 1,000+ regulatory documents — 94% accuracy with grounded citations.",
    stack: [
      "E5 embeddings",
      "ChromaDB",
      "BM25",
      "BGE reranking",
      "LangChain",
      "RAGAS",
    ],
    problem:
      "Policy and corporate stakeholders navigating regulation across U.S. states and Europe face thousands of pages of interlinked legal text — and legal text is exactly where LLM hallucination is most expensive. As an AI Research Assistant at Carnegie Mellon, my brief was a system whose answers could be trusted enough to act on: grounded, cited, and measured.",
    approach:
      "The retrieval core is hybrid: dense E5 embeddings in ChromaDB fused with sparse BM25, then re-ranked with a BGE cross-encoder — because regulatory queries mix precise statutory language with fuzzy intent, and neither dense nor sparse retrieval wins alone. Feeding it is a PDF ingestion pipeline with page parsing, header detection, and overlapping chunking, with data-lineage tracking so every vector traces back to its exact source page. The project grew out of my earlier multi-agent work (a Planner–Retriever–Synthesizer–Reviewer pipeline evaluated with RAGAS at 0.78 faithfulness / 0.74 answer relevancy), which taught me where agent complexity pays and where retrieval quality is the whole game.",
    outcome:
      "Evaluated across 50+ query sets: 94% accuracy with grounded citations over 1,000+ regulatory documents. The deeper outcome is a working philosophy — separate the roles, verify the output, track lineage from answer back to page — that I've carried into every retrieval system since, including the one running inside this site's terminal.",
    github: "https://github.com/Shauryagulati/REG-RAG",
    featured: true,
  },
  {
    slug: "this-site",
    title: "This Site, and the Agent Inside It",
    oneliner:
      "The portfolio is its own case study: a terminal with a RAG agent over everything on it, built to run at $0.",
    stack: [
      "React Router",
      "React Three Fiber",
      "TypeScript",
      "Cloudflare Workers AI",
      "RAG",
    ],
    problem:
      "A portfolio that claims 'AI engineer' should have to prove it on the page. Most sites settle for a chat widget bolted into a corner — no context, no character, and it breaks the moment an API key expires or a free tier runs dry. The bar here was a working AI product with real constraints: zero monthly cost, no broken states, and an interface that says something about how I think.",
    approach:
      "Everything starts from one content layer: the same typed modules generate the pages, a virtual file system for the built-in terminal, the agent's retrieval corpus, and an llms.txt for AI crawlers — one source of truth, four surfaces. The terminal is summonable from anywhere as a floating window, and typing 'shaurya' boots an agent REPL the way a CLI tool would. Retrieval is deliberately lexical — tf-idf over a small corpus beats an embedding pipeline at this scale — and generation runs on Cloudflare Workers AI's free tier behind a rate-limited function. If the model is unreachable, the agent degrades to retrieval-composed answers instead of failing: the demo can't die. The hero object is the same philosophy applied to 3D — a retro CRT rasterized to live text every frame, made of the same material as the terminal.",
    outcome:
      "A fully static site with one serverless function, streaming cited answers, and no failure mode a visitor can see — at $0/month. Every architectural decision is inspectable: the site you are reading is the system diagram. It encodes my working rules for agent products: retrieve before you generate, cite what you retrieved, and design the degraded path before the happy one.",
    featured: true,
  },
  {
    slug: "eyeline",
    title: "Eyeline",
    oneliner:
      "A free, open-source macOS teleprompter that docks under the notch — read your script while holding eye contact.",
    stack: ["Swift", "macOS", "Homebrew", "Open source"],
    problem:
      "Every video call with a script has the same tell: eyes drifting to a second window. Teleprompter apps exist, but they're paid, cloud-connected, or float awkwardly over your content. The fix wanted to be invisible — literally at the camera.",
    approach:
      "Eyeline docks the script directly under the MacBook notch — the closest pixels to the lens — so reading looks like eye contact. It's 100% local (nothing leaves the machine), free, open-source, and ships through its own Homebrew tap for a one-line install.",
    outcome:
      "A small, finished product with real users' problem at its center — and proof that I ship outside the Python/ML lane too: native Swift, macOS platform quirks, packaging, and distribution, end to end.",
    github: "https://github.com/Shauryagulati/eyeline",
    featured: false,
  },
  {
    slug: "air-quality-mlops",
    title: "Air Quality Prediction, End to End",
    oneliner:
      "A complete MLOps pipeline on the UCI air-quality dataset — experiment tracking, streaming ingestion, drift monitoring.",
    stack: ["Python", "XGBoost", "MLflow", "Kafka", "Docker", "Evidently AI"],
    problem:
      "Most ML course projects end at a notebook with a good metric. Real systems fail after that point — untracked experiments, data that drifts, models that quietly degrade in production with nobody watching.",
    approach:
      "I built the whole lifecycle for an air-quality prediction model on the UCI dataset: XGBoost models with every experiment tracked in MLflow, real-time data ingestion through Kafka, and a prediction API packaged in Docker. Monitoring dashboards built with Evidently AI watch for data drift and performance degradation, so the system tells you when it is going stale instead of waiting to be caught.",
    outcome:
      "A reproducible, modular pipeline with continuous evaluation baked in — ingestion, training, serving, and monitoring as one system rather than a notebook and a prayer. It was my first full answer to what 'production ML' means beyond the model file.",
    featured: false,
    earlier: true,
  },
  {
    slug: "bert-qa",
    title: "Question Answering with BERT on Azure",
    oneliner:
      "A fine-tuned BERT QA system, benchmarked against classical baselines and deployed for real-time inference on Azure ML.",
    stack: ["Python", "BERT", "Hugging Face", "Azure ML", "SQuAD"],
    problem:
      "Matching a user's question to the sentence that actually answers it is deceptively hard: lexical overlap fails on paraphrase, and deep models are easy to demo but hard to serve with acceptable latency.",
    approach:
      "I fine-tuned a BERT-based question-answering system on SQuAD to match queries against candidate answer sentences, using semantic similarity over sentence embeddings — and benchmarked it honestly against Jaccard and TF-IDF baselines to prove the deep model earned its cost. The model was deployed on Azure Machine Learning with a scoring pipeline optimized for both latency and accuracy.",
    outcome:
      "Full-stack ML deployment, demonstrated end to end: fine-tuning, packaging, serving, and real-time inference. The baseline-comparison discipline — measure the simple thing before shipping the complex one — is a habit I've carried into every system since.",
    featured: false,
    earlier: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
