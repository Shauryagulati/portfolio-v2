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
}

export const projects: Project[] = [
  {
    slug: "eu-navigator",
    title: "EU Navigator",
    oneliner:
      "A multi-agent RAG system for exploring EU tech, data, and AI legislation — with verified citations.",
    stack: [
      "LangChain",
      "FAISS",
      "Llama 3.1",
      "BGE-M3",
      "RAGAS",
      "Streamlit",
    ],
    problem:
      "EU tech, data, and AI legislation is vast, interlinked, and written for lawyers. Anyone trying to actually learn it — students, builders, policy people — has to hold structure in their head that the documents themselves bury. Generic chatbots make this worse: they answer confidently without citations, and legal text is exactly where hallucination is most expensive.",
    approach:
      "I built EU Navigator as a personal learning portal backed by a multi-agent RAG pipeline. Specialized agents handle planning, retrieval, synthesis, and review, so every answer is drafted against retrieved legal text and then checked before it reaches the user. The corpus preserves the legislation's native structure through section-based chunking, indexed in FAISS with BGE-M3 embeddings and served by Llama 3.1 through LangChain. A Streamlit interface supports modular exploration, progress tracking, and reflection journaling. Faithfulness and relevancy are measured with RAGAS rather than assumed.",
    outcome:
      "The result is evidence-based legal analysis with verified citations — a system whose answers can be traced back to the exact section of the exact regulation, evaluated with RAGAS for faithfulness and relevancy. It is also the project that shaped how I think about agent design: separate the roles, verify the output, and never let synthesis outrun retrieval.",
    github: "https://github.com/Shauryagulati/EU-Navigator",
    featured: true,
  },
  {
    slug: "air-quality-mlops",
    title: "Air Quality Prediction, End to End",
    oneliner:
      "A complete MLOps pipeline on the UCI air-quality dataset — experiment tracking, streaming ingestion, drift monitoring.",
    stack: [
      "Python",
      "XGBoost",
      "MLflow",
      "Kafka",
      "Docker",
      "Evidently AI",
    ],
    problem:
      "Most ML course projects end at a notebook with a good metric. Real systems fail after that point — untracked experiments, data that drifts, models that quietly degrade in production with nobody watching.",
    approach:
      "I built the whole lifecycle for an air-quality prediction model on the UCI dataset: XGBoost models with every experiment tracked in MLflow, real-time data ingestion through Kafka, and a prediction API packaged in Docker. Monitoring dashboards built with Evidently AI watch for data drift and performance degradation, so the system tells you when it is going stale instead of waiting to be caught.",
    outcome:
      "A reproducible, modular pipeline with continuous evaluation baked in — ingestion, training, serving, and monitoring as one system rather than a notebook and a prayer. The project is my working answer to what 'production ML' means beyond the model file.",
    featured: true,
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
      "Full-stack ML deployment, demonstrated end to end: fine-tuning, packaging, serving, and real-time inference. The baseline comparison discipline — measure the simple thing before shipping the complex one — is a habit I've carried into every system since.",
    featured: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
