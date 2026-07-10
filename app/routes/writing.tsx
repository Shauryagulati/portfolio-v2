import { Link } from "react-router";
import { site } from "~/content/site";
import { posts } from "~/content/writing";
import { Reveal } from "~/components/Reveal";
import { pageMeta } from "~/lib/seo";

export function meta() {
  return pageMeta({
    title: `Writing — ${site.name}`,
    description: `Essays by ${site.name} on AI products, agents, and systems.`,
    path: "/writing",
  });
}

export default function Writing() {
  return (
    <main className="page subpage">
      <Reveal order={0}>
        <h1 className="page-title">Writing</h1>
      </Reveal>
      {posts.length === 0 ? (
        <Reveal order={1}>
          <p className="prose">Nothing published yet — drafts in progress.</p>
        </Reveal>
      ) : (
        <ol className="work-list">
          {posts.map((p, i) => (
            <Reveal key={p.slug} order={i + 1} as="li">
              {p.external ? (
                <a href={p.external} className="work-row" rel="noreferrer">
                  <span className="mono work-index">{p.date.slice(0, 10)}</span>
                  <span className="work-main">
                    <span className="work-title">{p.title}</span>
                    <span className="work-oneliner">{p.summary}</span>
                  </span>
                  <span className="mono work-stack">↗ external</span>
                </a>
              ) : (
                <Link
                  to={`/writing/${p.slug}`}
                  className="work-row"
                  viewTransition
                >
                  <span className="mono work-index">{p.date.slice(0, 10)}</span>
                  <span className="work-main">
                    <span className="work-title">{p.title}</span>
                    <span className="work-oneliner">{p.summary}</span>
                  </span>
                </Link>
              )}
            </Reveal>
          ))}
        </ol>
      )}
    </main>
  );
}
