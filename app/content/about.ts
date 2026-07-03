export const about = {
  title: "About",
  /** Paragraphs, in order. Written to be read, and to be `cat`-ed. */
  body: [
    "I'm Shaurya, an AI engineer working on agents, retrieval, and the unglamorous machinery that makes them trustworthy: evals, citations, observability, and the failure paths nobody designs until production forces them to.",
    "I finished my Master's at Carnegie Mellon (Information Systems Management, Business Intelligence & Data Analytics, Dec '25). While there I built hybrid RAG systems over regulatory text as a research assistant and TA'd the graduate course on operationalizing AI. From there I went straight into the deep end as Founding AI Engineer at Lunon, an AI-native company automating commercial due diligence for private equity. I built the multi-agent pipeline with its quality gates, a 20-tool analyst copilot, and the observability to know what all of it was doing.",
    "The through-line in my work is verification. Retrieval systems that cite the page they decided from. Extraction pipelines with per-field precision tracked across prompt changes. An open-source framework, rag-verdict, that tests what agents do instead of averaging how their answers score. Systems that think are only useful if you can check their work.",
    "This site is a working example of all of it. The terminal is real. Type shaurya into it and you're talking to an agent that has read everything here, cites its sources, and was designed to fail gracefully. That's the job, in miniature.",
  ],
} as const;
