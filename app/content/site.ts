/** Identity + global copy. Single source of truth. Pages, terminal,
 *  agent corpus, and llms.txt all read from here. */

export const site = {
  name: "Shaurya Gulati",
  handle: "shaurya",
  role: "AI engineer",
  school: "Carnegie Mellon University",
  kicker: "AI engineer · agents, RAG, evals · CMU MISM '25",
  thesis: "I build systems that think, and the products around them.",
  intro:
    "AI engineer working on agents, retrieval, and evaluation. Carnegie Mellon MISM-BIDA graduate ('25), most recently Founding AI Engineer at Lunon, where I built the multi-agent pipeline and analyst copilot behind automated commercial due diligence. I care about systems that cite their sources, tests that catch agents misbehaving, and products that earn their place in a workflow.",
  /** Set to the real domain once purchased; used by SEO generation. */
  url: "https://shauryagulati.me",
  email: "i.shauryagulati@gmail.com",
  github: "https://github.com/Shauryagulati",
  linkedin: "https://www.linkedin.com/in/shauryagulati/",
  nav: [
    { label: "Projects", to: "/projects" },
    { label: "About", to: "/about" },
  ],
  terminalHint: "type shaurya to talk to my agent",
} as const;
