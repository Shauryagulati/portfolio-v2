import { site } from "./site";
import { projects } from "./projects";
import { about } from "./about";
import { resume } from "./resume";

/** One document = one virtual file = one agent-retrievable chunk.
 *  Paths are the terminal's file system; text is what `cat` prints
 *  and what the agent quotes. */
export interface Doc {
  path: string; // e.g. "~/projects/eu-navigator.md"
  title: string;
  text: string;
}

function projectDoc(p: (typeof projects)[number]): Doc {
  return {
    path: `~/projects/${p.slug}.md`,
    title: p.title,
    text: [
      `# ${p.title}`,
      p.oneliner,
      `stack: ${p.stack.join(", ")}`,
      ``,
      `## Problem`,
      p.problem,
      ``,
      `## Approach`,
      p.approach,
      ``,
      `## Outcome`,
      p.outcome,
      ...(p.github ? [``, `repo: ${p.github}`] : []),
    ].join("\n"),
  };
}

export const corpus: Doc[] = [
  {
    path: "~/about.md",
    title: "About Shaurya",
    text: [`# About Shaurya Gulati`, ``, ...about.body].join("\n"),
  },
  ...projects.map(projectDoc),
  {
    path: "~/resume.md",
    title: "Resume",
    text: [
      `# Resume — ${site.name}`,
      ``,
      `## Education`,
      ...resume.education.map(
        (e) => `- ${e.school} — ${e.credential}. ${e.detail}`,
      ),
      ``,
      `## Skills`,
      ...Object.entries(resume.skills).map(
        ([group, items]) => `- ${group}: ${items.join(", ")}`,
      ),
      ``,
      `PDF: ${site.url}${resume.pdfPath}`,
    ].join("\n"),
  },
  {
    path: "~/contact.md",
    title: "Contact",
    text: [
      `# Contact`,
      ``,
      `- email: ${site.email}`,
      `- linkedin: ${site.linkedin}`,
      `- github: ${site.github}`,
    ].join("\n"),
  },
];

export function getDoc(path: string): Doc | undefined {
  return corpus.find((d) => d.path === path);
}
