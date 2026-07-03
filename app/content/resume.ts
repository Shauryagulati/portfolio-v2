/** Resume data — from Resume V9 (2026-06). Phone number deliberately
 *  omitted from all public artifacts (site + web PDF). */

export const resume = {
  pdfPath: "/resume.pdf",
  education: [
    {
      school: "Carnegie Mellon University",
      credential:
        "Master's in Information Systems Management, Business Intelligence & Data Analytics (Aug 2024 – Dec 2025)",
      detail:
        "Coursework: Computational Data Science, Machine Learning, Applications of NLP and LLMs, Distributed Systems, Applied AI.",
    },
    {
      school: "Chandigarh University",
      credential:
        "B.E. Computer Science, specialization in Artificial Intelligence & Machine Learning (2018 – 2022)",
      detail:
        "Undergraduate researcher in sentiment analysis and computer vision; published at international conferences.",
    },
  ],
  experience: [
    {
      org: "Lunon",
      role: "Founding AI Engineer",
      dates: "Feb 2026 – May 2026",
      points: [
        "Built the 5-phase core AI pipeline for automated commercial due diligence (private equity): a multi-agent system with quality gates and automated correction loops.",
        "Built the retrieval stack: document ingestion, hybrid search (pgvector + lexical with RRF fusion), query decomposition, and cross-encoder reranking.",
        "Built the analyst copilot: a ~20-tool agent with streaming chat, a propose-then-confirm flow for edits, and citation verification against the source corpus.",
        "Traced and fixed a quality-gate failure loop blocking a client demo; added warn-mode so runs completed instead of stalling.",
        "Set up Langfuse observability for tracing and cost/latency monitoring across the agent pipeline.",
      ],
    },
    {
      org: "Carnegie Mellon University",
      role: "AI Research Assistant",
      dates: "Jun 2025 – Dec 2025",
      points: [
        "Engineered a hybrid RAG system across 1,000+ regulatory documents: dense retrieval (E5 embeddings, ChromaDB) fused with sparse BM25, re-ranked with a BGE cross-encoder.",
        "Built a PDF ingestion pipeline with page parsing, header detection, and overlapping chunking, with data-lineage tracking for accurate vector-store population.",
        "Evaluated across 50+ query sets: 94% accuracy with grounded citations.",
      ],
    },
    {
      org: "Carnegie Mellon University, Heinz College",
      role: "Graduate Teaching Assistant, Fundamentals of Operationalizing AI",
      dates: "Aug 2025 – Oct 2025",
      points: [
        "Ran recitations and Q&A on deploying and scaling AI systems in practice; guided students through implementation challenges and graded coursework.",
      ],
    },
    {
      org: "YMGrad",
      role: "Software Development Engineer",
      dates: "Jun 2022 – Jul 2024",
      points: [
        "Built analytics APIs and optimized Redis caching and MySQL indexing, cutting load times ~25% and query time ~30%.",
        "Automated operational reporting workflows, reducing manual support overhead ~15%.",
      ],
    },
  ],
  publications: [
    "Enhancing Sentiment Analysis in Short Texts with POS-Embedded LSTM Models",
    "Paint/Writing Application through Webcam using MediaPipe and OpenCV",
    "Virtual Assistant with Sentiment Analysis",
    "Can Artificial Intelligence Work Wonders in Healthcare?",
  ],
  skills: {
    "AI / LLM": [
      "Agents",
      "RAG",
      "Claude Agent SDK",
      "OpenAI API",
      "LangChain",
      "MCP",
      "LLM-as-judge",
      "Evals",
      "Prompt engineering & caching",
    ],
    "Retrieval": [
      "pgvector",
      "FAISS",
      "Hybrid search",
      "BM25",
      "RRF fusion",
      "BGE cross-encoder reranking",
      "Query decomposition",
    ],
    "Backend": [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "SQLAlchemy",
      "Alembic",
      "asyncio",
      "SSE streaming",
      "SQL / MySQL",
    ],
    "Observability / Infra": [
      "Langfuse",
      "OpenTelemetry",
      "Docker",
      "GitHub Actions",
      "Git",
    ],
  },
} as const;
