/** Identity + global copy. Single source of truth — pages, terminal,
 *  agent corpus, and llms.txt all read from here. */

export const site = {
  name: "Shaurya Gulati",
  handle: "shaurya",
  role: "AI product builder",
  school: "Carnegie Mellon University",
  thesis: "I build systems that think — and the products around them.",
  intro:
    "AI product builder and data scientist, currently pursuing a Master's at Carnegie Mellon. I design and ship intelligent systems: RAG pipelines, multi-agent applications, and the generative-AI products that put them in people's hands.",
  /** Set to the real domain once purchased; used by SEO generation. */
  url: "https://shauryagulati.dev",
  email: "i.shauryagulati@gmail.com",
  github: "https://github.com/Shauryagulati",
  linkedin: "https://www.linkedin.com/in/shauryagulati/",
  nav: [
    { label: "Projects", to: "/projects" },
    { label: "About", to: "/about" },
    { label: "Resume", to: "/resume" },
  ],
  terminalHint: "type shaurya to talk to my agent",
} as const;
