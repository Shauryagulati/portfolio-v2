import { Link } from "react-router";
import { site } from "~/content/site";
import { projects } from "~/content/projects";
import { Reveal } from "~/components/Reveal";
import { pageMeta } from "~/lib/seo";

export function meta() {
  return pageMeta({
    title: `Projects · ${site.name}`,
    description: `Selected work by ${site.name}: ${projects
      .map((p) => p.title)
      .join(", ")}.`,
    path: "/projects",
  });
}

function Row({ p, i }: { p: (typeof projects)[number]; i: number }) {
  return (
    <Link to={`/projects/${p.slug}`} className="work-row" viewTransition>
      <span className="mono work-index">{String(i + 1).padStart(2, "0")}</span>
      <span className="work-main">
        <span className="work-title">{p.title}</span>
        <span className="work-oneliner">{p.oneliner}</span>
      </span>
      <span className="mono work-stack">{p.stack.slice(0, 3).join(" · ")}</span>
    </Link>
  );
}

export default function Projects() {
  const current = projects.filter((p) => !p.earlier);
  const earlier = projects.filter((p) => p.earlier);
  return (
    <main className="page subpage">
      <Reveal order={0}>
        <h1 className="page-title">Projects</h1>
      </Reveal>
      <ol className="work-list">
        {current.map((p, i) => (
          <Reveal key={p.slug} order={i + 1} as="li">
            <Row p={p} i={i} />
          </Reveal>
        ))}
      </ol>
      <Reveal order={current.length + 1}>
        <h2 className="mono section-label earlier-label">Earlier work</h2>
      </Reveal>
      <ol className="work-list">
        {earlier.map((p, i) => (
          <Reveal key={p.slug} order={current.length + i + 2} as="li">
            <Row p={p} i={current.length + i} />
          </Reveal>
        ))}
      </ol>
    </main>
  );
}
