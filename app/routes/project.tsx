import { Link, useParams } from "react-router";
import { site } from "~/content/site";
import { projects, getProject } from "~/content/projects";
import { Reveal } from "~/components/Reveal";
import { ArchDiagram } from "~/components/ArchDiagram";
import { pageMeta } from "~/lib/seo";

export function meta({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) return [{ title: `Not found — ${site.name}` }];
  return pageMeta({
    title: `${p.title} — ${site.name}`,
    description: p.oneliner,
    path: `/projects/${p.slug}`,
  });
}

const SECTIONS = ["problem", "approach", "outcome"] as const;

export default function Project() {
  const { slug } = useParams();
  const p = slug ? getProject(slug) : undefined;
  if (!p) {
    return (
      <main className="page subpage">
        <h1 className="page-title">Not found</h1>
        <p className="prose">
          No such project. <Link to="/projects">Back to the list.</Link>
        </p>
      </main>
    );
  }
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  return (
    <main className="page subpage case">
      <Reveal order={0}>
        <p className="mono section-label">
          Case study {String(i + 1).padStart(2, "0")}
        </p>
      </Reveal>
      <Reveal order={1}>
        <h1 className="page-title">{p.title}</h1>
      </Reveal>
      <Reveal order={2}>
        <p className="case-oneliner">{p.oneliner}</p>
      </Reveal>
      <Reveal order={3}>
        <p className="mono case-stack">{p.stack.join(" · ")}</p>
      </Reveal>
      <Reveal order={4}>
        <ArchDiagram slug={p.slug} />
      </Reveal>
      {p.figure && (
        <Reveal order={4}>
          <figure className="case-figure">
            <img src={p.figure.src} alt={p.figure.alt} loading="lazy" />
            <figcaption className="mono diagram-caption">
              {p.figure.caption}
            </figcaption>
          </figure>
        </Reveal>
      )}

      {SECTIONS.map((s, n) => (
        <Reveal key={s} order={n + 5} as="section">
          <div className="case-section">
            <h2 className="mono section-label">{s}</h2>
            <p className="prose">{p[s]}</p>
          </div>
        </Reveal>
      ))}

      <Reveal order={8}>
        <div className="case-footer">
          {p.github ? (
            <a className="mono" href={p.github} rel="noreferrer">
              View source on GitHub →
            </a>
          ) : (
            <span className="mono case-note">
              Source available on request.
            </span>
          )}
          <Link className="mono" to={`/projects/${next.slug}`} viewTransition>
            Next: {next.title} →
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
