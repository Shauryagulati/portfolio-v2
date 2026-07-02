import { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router";
import { site } from "~/content/site";
import { projects } from "~/content/projects";
import { Reveal } from "~/components/Reveal";
import { TerminalArtifact } from "~/components/TerminalArtifact";

const AsciiCrt = lazy(() => import("~/components/AsciiCrt"));

/** Canvas only after hydration — keeps prerendered HTML clean. */
function HeroObject() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <div className="hero-object" aria-hidden="true">
      {ready && (
        <Suspense fallback={null}>
          <AsciiCrt />
        </Suspense>
      )}
    </div>
  );
}

export function meta() {
  return [
    { title: `${site.name} — ${site.role}` },
    { name: "description", content: site.intro },
  ];
}

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-text">
          <Reveal order={0}>
            <p className="mono hero-kicker">
              {site.role} — {site.school}
            </p>
          </Reveal>
          <Reveal order={1}>
            <h1 className="hero-name">{site.name}</h1>
          </Reveal>
          <Reveal order={2}>
            <p className="hero-thesis prose">{site.thesis}</p>
          </Reveal>
          <Reveal order={3}>
            <TerminalArtifact />
          </Reveal>
        </div>
        <HeroObject />
      </section>

      <section className="work">
        <Reveal order={0}>
          <h2 className="mono section-label">Selected work</h2>
        </Reveal>
        <ol className="work-list">
          {featured.map((p, i) => (
            <Reveal key={p.slug} order={i + 1} as="li">
              <Link to={`/projects/${p.slug}`} className="work-row">
                <span className="mono work-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="work-main">
                  <span className="work-title">{p.title}</span>
                  <span className="work-oneliner">{p.oneliner}</span>
                </span>
                <span className="mono work-stack">
                  {p.stack.slice(0, 3).join(" · ")}
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
        <Reveal order={featured.length + 1}>
          <Link to="/projects" className="mono work-all">
            All projects →
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
