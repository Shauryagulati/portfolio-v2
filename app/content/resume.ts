/** Resume data — VERIFIED FACTS ONLY.
 *  TODO(shaurya): fill the marked slots (program name, dates, roles) and
 *  drop your PDF at public/resume.pdf — the page links to it. */

export const resume = {
  pdfPath: "/resume.pdf",
  education: [
    {
      school: "Carnegie Mellon University",
      credential: "Master's degree", // TODO(shaurya): exact program + dates
      detail:
        "Graduate study focused on machine learning systems and AI products.",
    },
  ],
  // TODO(shaurya): add roles/internships with dates — intentionally empty
  // rather than invented.
  experience: [] as {
    org: string;
    role: string;
    dates: string;
    points: string[];
  }[],
  skills: {
    "AI / ML": [
      "RAG systems",
      "Multi-agent applications",
      "LLM evaluation (RAGAS)",
      "Fine-tuning (BERT)",
      "XGBoost",
    ],
    "Engineering": [
      "Python",
      "LangChain",
      "FAISS",
      "Hugging Face",
      "Docker",
      "Kafka",
      "MLflow",
      "Azure ML",
      "TypeScript / React",
    ],
    "Practice": [
      "Experiment tracking",
      "Model monitoring (Evidently)",
      "Data drift detection",
      "Product thinking",
    ],
  },
} as const;
