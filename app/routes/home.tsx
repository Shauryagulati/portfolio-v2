import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { site } from "~/content/site";
import { projects } from "~/content/projects";
import { Reveal } from "~/components/Reveal";
import { TerminalArtifact } from "~/components/TerminalArtifact";
import { CRT_FRAME } from "~/components/crt-frame";
import { pageMeta } from "~/lib/seo";

const AsciiCrt = lazy(() => import("~/components/AsciiCrt"));

/** ONE permanent <pre>: prerendered with a frozen frame (instant LCP,
 *  zero shift), then the live engine mounts at browser idle and streams
 *  frames into the same node. The element never remounts, so the
 *  browser never re-records a later LCP. */
function HeroObject() {
  const [live, setLive] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  useEffect(() => {
    const start = () =>
      "requestIdleCallback" in window
        ? requestIdleCallback(() => setLive(true), { timeout: 2500 })
        : setTimeout(() => setLive(true), 1200);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
  }, []);
  return (
    <div className="hero-object" aria-hidden="true">
      <pre className="ascii-static" ref={preRef}>
        {CRT_FRAME}
      </pre>
      {live && (
        <Suspense fallback={null}>
          <AsciiCrt target={preRef} />
        </Suspense>
      )}
    </div>
  );
}

export function meta() {
  return pageMeta({
    title: `${site.name} — ${site.role}`,
    description: site.intro,
    path: "/",
  });
}

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-text">
          <Reveal order={0}>
            <p className="mono hero-kicker">{site.kicker}</p>
          </Reveal>
          <Reveal order={1}>
            <h1 className="hero-name">{site.name}</h1>
          </Reveal>
          <Reveal order={2}>
            <p className="hero-thesis prose">{site.thesis}</p>
          </Reveal>
          <Reveal order={3}>
            <ul className="proofs mono">
              {site.proofs.map((p) => (
                <li key={p.v}>
                  <span className="proof-v">{p.v}</span>
                  <span className="proof-l">{p.l}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal order={4}>
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
              <Link to={`/projects/${p.slug}`} className="work-row" viewTransition>
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
          <Link to="/projects" className="mono work-all" viewTransition>
            All projects →
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
