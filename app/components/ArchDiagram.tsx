/** Ink-style architecture diagrams — hairline boxes, mono labels,
 *  currentColor so they live in both themes. Data-driven so each case
 *  study stays honest and small. */

interface Node {
  id: string;
  x: number;
  y: number;
  w: number;
  label: string;
  sub?: string;
  accent?: boolean;
}

interface Edge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
}

interface Diagram {
  nodes: Node[];
  edges: Edge[];
  h: number;
}

const H = 44;

const DIAGRAMS: Record<string, Diagram> = {
  "regulatory-rag": {
    h: 200,
    nodes: [
      { id: "pdf", x: 10, y: 20, w: 104, label: "legal PDFs", sub: "1,000+ docs" },
      { id: "ingest", x: 154, y: 20, w: 118, label: "ingestion", sub: "chunk + lineage" },
      { id: "dense", x: 312, y: 6, w: 110, label: "dense", sub: "E5 · ChromaDB" },
      { id: "sparse", x: 312, y: 76, w: 110, label: "sparse", sub: "BM25" },
      { id: "rerank", x: 462, y: 40, w: 120, label: "reranker", sub: "BGE cross-enc" },
      { id: "ans", x: 622, y: 40, w: 118, label: "cited answer", sub: "94% / 50+ sets", accent: true },
      { id: "eval", x: 462, y: 138, w: 120, label: "evaluation", sub: "query sets" },
    ],
    edges: [
      { from: "pdf", to: "ingest" },
      { from: "ingest", to: "dense" },
      { from: "ingest", to: "sparse" },
      { from: "dense", to: "rerank" },
      { from: "sparse", to: "rerank" },
      { from: "rerank", to: "ans" },
      { from: "eval", to: "ans", dashed: true },
    ],
  },
  suture: {
    h: 200,
    nodes: [
      { id: "intake", x: 10, y: 40, w: 100, label: "intake", sub: "referrals, faxes" },
      { id: "extract", x: 150, y: 40, w: 120, label: "extraction", sub: "LLM pipeline" },
      { id: "evals", x: 150, y: 140, w: 120, label: "eval harness", sub: "per-field P/R" },
      { id: "review", x: 310, y: 40, w: 118, label: "human review", sub: "in the loop" },
      { id: "pa", x: 468, y: 40, w: 130, label: "prior-auth", sub: "3-stage hybrid RAG" },
      { id: "policy", x: 468, y: 140, w: 130, label: "payer policies", sub: "rules + semantic" },
      { id: "out", x: 638, y: 40, w: 116, label: "outreach", sub: "multi-channel", accent: true },
    ],
    edges: [
      { from: "intake", to: "extract" },
      { from: "evals", to: "extract", dashed: true, label: "gates" },
      { from: "extract", to: "review" },
      { from: "review", to: "pa" },
      { from: "policy", to: "pa" },
      { from: "pa", to: "out" },
    ],
  },
  "rag-verdict": {
    h: 200,
    nodes: [
      { id: "agent", x: 10, y: 40, w: 118, label: "your RAG agent", sub: "any language" },
      { id: "adapter", x: 168, y: 40, w: 110, label: "adapter", sub: "python / http" },
      { id: "probes", x: 318, y: 40, w: 150, label: "behavioral probes", sub: "tools · citations · refusals" },
      { id: "judge", x: 318, y: 140, w: 150, label: "LLM-as-judge", sub: "optional, degrades" },
      { id: "verdict", x: 508, y: 40, w: 158, label: "PASS / FAIL / WEAK", accent: true },
      { id: "ci", x: 706, y: 40, w: 70, label: "CI" },
    ],
    edges: [
      { from: "agent", to: "adapter" },
      { from: "adapter", to: "probes" },
      { from: "judge", to: "probes", dashed: true },
      { from: "probes", to: "verdict" },
      { from: "verdict", to: "ci" },
    ],
  },
  "air-quality-mlops": {
    h: 190,
    nodes: [
      { id: "uci", x: 10, y: 20, w: 96, label: "UCI data" },
      { id: "kafka", x: 146, y: 20, w: 96, label: "Kafka", sub: "streaming" },
      { id: "train", x: 282, y: 20, w: 110, label: "XGBoost", sub: "training" },
      { id: "mlflow", x: 282, y: 126, w: 110, label: "MLflow", sub: "experiments" },
      { id: "api", x: 432, y: 20, w: 116, label: "prediction API", sub: "docker" },
      { id: "mon", x: 588, y: 20, w: 122, label: "Evidently", sub: "drift monitor", accent: true },
    ],
    edges: [
      { from: "uci", to: "kafka" },
      { from: "kafka", to: "train" },
      { from: "train", to: "mlflow", label: "runs" },
      { from: "train", to: "api" },
      { from: "api", to: "mon" },
      { from: "mon", to: "train", dashed: true, label: "retrain signal" },
    ],
  },
  "bert-qa": {
    h: 190,
    nodes: [
      { id: "squad", x: 10, y: 20, w: 96, label: "SQuAD" },
      { id: "ft", x: 146, y: 20, w: 116, label: "fine-tune", sub: "BERT · HF" },
      { id: "base", x: 146, y: 126, w: 116, label: "baselines", sub: "TF-IDF · Jaccard" },
      { id: "score", x: 302, y: 20, w: 128, label: "similarity scoring", sub: "embeddings" },
      { id: "azure", x: 470, y: 20, w: 120, label: "Azure ML", sub: "endpoint" },
      { id: "ans", x: 630, y: 20, w: 116, label: "answer", sub: "real-time", accent: true },
    ],
    edges: [
      { from: "squad", to: "ft" },
      { from: "ft", to: "score" },
      { from: "base", to: "score", dashed: true, label: "benchmark" },
      { from: "score", to: "azure" },
      { from: "azure", to: "ans" },
    ],
  },
  "this-site": {
    h: 190,
    nodes: [
      { id: "content", x: 10, y: 73, w: 116, label: "app/content/*", sub: "one source" },
      { id: "pages", x: 186, y: 6, w: 96, label: "pages" },
      { id: "vfs", x: 186, y: 73, w: 96, label: "terminal vfs" },
      { id: "llms", x: 186, y: 140, w: 96, label: "llms.txt" },
      { id: "repl", x: 334, y: 73, w: 110, label: "shaurya REPL", accent: true },
      { id: "fn", x: 494, y: 30, w: 120, label: "pages function", sub: "rate-limited" },
      { id: "ai", x: 664, y: 30, w: 110, label: "workers ai", sub: "llama 3.1 8b" },
      { id: "fb", x: 494, y: 126, w: 120, label: "local fallback", sub: "tf-idf compose" },
    ],
    edges: [
      { from: "content", to: "pages" },
      { from: "content", to: "vfs" },
      { from: "content", to: "llms" },
      { from: "vfs", to: "repl" },
      { from: "repl", to: "fn", label: "remote first" },
      { from: "fn", to: "ai" },
      { from: "repl", to: "fb", dashed: true, label: "if unreachable" },
    ],
  },
};

function mid(n: Node) {
  return { cx: n.x + n.w / 2, cy: n.y + H / 2 };
}

/** Straight edge between node borders, arrowhead at the target. */
function EdgeLine({ a, b, edge }: { a: Node; b: Node; edge: Edge }) {
  const A = mid(a);
  const B = mid(b);
  // clip the line at each node's border (horizontal or vertical dominant)
  const dx = B.cx - A.cx;
  const dy = B.cy - A.cy;
  let x1 = A.cx, y1 = A.cy, x2 = B.cx, y2 = B.cy;
  if (Math.abs(dx) > Math.abs(dy)) {
    x1 = dx > 0 ? a.x + a.w : a.x;
    x2 = dx > 0 ? b.x : b.x + b.w;
    y1 = A.cy + (Math.abs(dy) > 1 ? Math.sign(dy) * 0 : 0);
  } else {
    y1 = dy > 0 ? a.y + H : a.y;
    y2 = dy > 0 ? b.y : b.y + H;
  }
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray={edge.dashed ? "4 4" : undefined}
        opacity="0.45"
        markerEnd="url(#arrow)"
      />
      {edge.label && (
        <text
          x={mx}
          y={my - 6}
          textAnchor="middle"
          className="diagram-edge-label"
        >
          {edge.label}
        </text>
      )}
    </g>
  );
}

export function ArchDiagram({ slug }: { slug: string }) {
  const d = DIAGRAMS[slug];
  if (!d) return null;
  const byId = Object.fromEntries(d.nodes.map((n) => [n.id, n]));
  return (
    <figure className="diagram">
      <svg
        viewBox={`0 0 840 ${d.h}`}
        role="img"
        aria-label="Architecture diagram"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 8 4 L 0 8" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </marker>
        </defs>
        {d.edges.map((e, i) => (
          <EdgeLine key={i} a={byId[e.from]} b={byId[e.to]} edge={e} />
        ))}
        {d.nodes.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={H}
              rx="6"
              fill="var(--bg)"
              stroke={n.accent ? "var(--accent)" : "currentColor"}
              strokeWidth="1"
              opacity={n.accent ? 1 : 0.6}
            />
            <text
              x={n.x + n.w / 2}
              y={n.y + (n.sub ? 19 : 27)}
              textAnchor="middle"
              className="diagram-label"
              fill={n.accent ? "var(--accent)" : "currentColor"}
            >
              {n.label}
            </text>
            {n.sub && (
              <text
                x={n.x + n.w / 2}
                y={n.y + 34}
                textAnchor="middle"
                className="diagram-sub"
              >
                {n.sub}
              </text>
            )}
          </g>
        ))}
      </svg>
      <figcaption className="mono diagram-caption">architecture</figcaption>
    </figure>
  );
}
