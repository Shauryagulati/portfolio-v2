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

/** The whole story on one page: who, then the record. Experience,
 *  education, publications, skills. The PDF is a copy, not the source. */
export default function About() {
  let order = 0;
  return (
    <main className="page subpage">
      <Reveal order={order++}>
        <h1 className="page-title">{about.title}</h1>
      </Reveal>
      <div className="prose about-body">
        {about.body.map((para, i) => (
          <Reveal key={i} order={order++} as="p">
            {para}
          </Reveal>
        ))}
      </div>

      <Reveal order={order++} as="section">
        <div className="record">
          <h2 className="mono section-label record-label">Experience</h2>
          {resume.experience.map((x) => (
            <div className="case-section" key={x.org + x.role}>
              <div>
                <h3 className="record-org">{x.org}</h3>
                <p className="mono record-meta">
                  {x.role} · {x.dates}
                </p>
              </div>
              <ul className="prose record-points">
                {x.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal order={order++} as="section">
        <div className="record">
          <h2 className="mono section-label record-label">Education</h2>
          {resume.education.map((e) => (
            <div className="case-section" key={e.school}>
              <div>
                <h3 className="record-org">{e.school}</h3>
                <p className="mono record-meta">{e.credential}</p>
              </div>
              <p className="prose">{e.detail}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal order={order++} as="section">
        <div className="record">
          <h2 className="mono section-label record-label">Publications</h2>
          <ul className="prose record-points record-pubs">
            {resume.publications.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal order={order++} as="section">
        <div className="record">
          <h2 className="mono section-label record-label">Skills</h2>
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

      <Reveal order={order++}>
        <a className="mono record-download" href={resume.pdfPath} download>
          Download this as a PDF ↓
        </a>
      </Reveal>
    </main>
  );
}
