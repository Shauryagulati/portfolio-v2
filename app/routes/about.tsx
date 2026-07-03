import { site } from "~/content/site";
import { about } from "~/content/about";
import { resume } from "~/content/resume";
import { Reveal } from "~/components/Reveal";
import { pageMeta } from "~/lib/seo";

export function meta() {
  return pageMeta({
    title: `About — ${site.name}`,
    description: about.body[0],
    path: "/about",
  });
}

/** Story only — the full record lives in the resume PDF and the
 *  terminal (cat experience.md, education.md, publications.md). */
export default function About() {
  return (
    <main className="page subpage">
      <Reveal order={0}>
        <h1 className="page-title">{about.title}</h1>
      </Reveal>
      <div className="prose about-body">
        {about.body.map((para, i) => (
          <Reveal key={i} order={i + 1} as="p">
            {para}
          </Reveal>
        ))}
      </div>
      <Reveal order={about.body.length + 1}>
        <a className="mono record-download" href={resume.pdfPath} download>
          Download the resume ↓
        </a>
      </Reveal>
    </main>
  );
}
