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

/** One file per role, VS-Code-explorer style: `ls ~/experience` tells
 *  the story by itself. */
function roleDoc(x: (typeof resume.experience)[number]): Doc {
  const slug = x.org
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .replace(/carnegie-mellon-university.*/, "cmu")
    .concat(x.role.toLowerCase().includes("teaching") ? "-ta" : "");
  return {
    path: `~/experience/${slug}.md`,
    title: `${x.role} at ${x.org}`,
    text: [
      `# ${x.org}`,
      `${x.role} · ${x.dates}`,
      ``,
      ...x.points.map((p) => `- ${p}`),
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
  ...resume.experience.map(roleDoc),
  {
    path: "~/education.md",
    title: "Education",
    text: [
      `# Education`,
      ``,
      ...resume.education.flatMap((e) => [
        `## ${e.school}`,
        e.credential,
        e.detail,
        ``,
      ]),
    ].join("\n"),
  },
  {
    path: "~/publications.md",
    title: "Publications",
    text: [`# Publications`, ``, ...resume.publications.map((p) => `- ${p}`)].join(
      "\n",
    ),
  },
  {
    path: "~/skills.md",
    title: "Skills",
    text: [
      `# Skills`,
      ``,
      ...Object.entries(resume.skills).map(
        ([group, items]) => `- ${group}: ${items.join(", ")}`,
      ),
    ].join("\n"),
  },
  {
    path: "~/resume.md",
    title: "Resume",
    text: [
      `# Resume: ${site.name}`,
      ``,
      `## Education`,
      ...resume.education.map(
        (e) => `- ${e.school}: ${e.credential}. ${e.detail}`,
      ),
      ``,
      `## Publications`,
      ...resume.publications.map((p) => `- ${p}`),
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
