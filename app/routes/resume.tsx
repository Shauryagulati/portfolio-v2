import { site } from "~/content/site";
import { resume } from "~/content/resume";
import { Reveal } from "~/components/Reveal";
import { pageMeta } from "~/lib/seo";

export function meta() {
  return pageMeta({
    title: `Resume — ${site.name}`,
    description: `Resume of ${site.name} — ${site.role}, ${site.school}.`,
    path: "/resume",
  });
}

export default function Resume() {
  return (
    <main className="page subpage">
      <Reveal order={0}>
        <div className="resume-head">
          <h1 className="page-title">Resume</h1>
          <a className="mono resume-pdf" href={resume.pdfPath} download>
            Download PDF ↓
          </a>
        </div>
      </Reveal>

      <Reveal order={1} as="section">
        <div className="case-section">
          <h2 className="mono section-label">Education</h2>
          {resume.education.map((e) => (
            <p className="prose" key={e.school}>
              <strong>{e.school}</strong> — {e.credential}. {e.detail}
            </p>
          ))}
        </div>
      </Reveal>

      {resume.experience.length > 0 && (
        <Reveal order={2} as="section">
          <div className="case-section">
            <h2 className="mono section-label">Experience</h2>
            {resume.experience.map((x) => (
              <div className="prose resume-role" key={x.org + x.role}>
                <p>
                  <strong>{x.role}</strong> — {x.org}{" "}
                  <span className="mono">{x.dates}</span>
                </p>
                <ul>
                  {x.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal order={3} as="section">
        <div className="case-section">
          <h2 className="mono section-label">Skills</h2>
          <dl className="skills">
            {Object.entries(resume.skills).map(([group, items]) => (
              <div className="skills-row" key={group}>
                <dt className="mono">{group}</dt>
                <dd>{items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </main>
  );
}
