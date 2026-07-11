import { Link, useParams } from "react-router";
import { site } from "~/content/site";
import { getPost } from "~/content/writing";
import { Reveal } from "~/components/Reveal";
import { pageMeta } from "~/lib/seo";

export function meta({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) return [{ title: `Not found · ${site.name}` }];
  return pageMeta({
    title: `${p.title} · ${site.name}`,
    description: p.summary,
    path: `/writing/${p.slug}`,
  });
}

export default function Post() {
  const { slug } = useParams();
  const p = slug ? getPost(slug) : undefined;
  if (!p || !p.body) {
    return (
      <main className="page subpage">
        <h1 className="page-title">Not found</h1>
        <p className="prose">
          No such essay. <Link to="/writing">Back to writing.</Link>
        </p>
      </main>
    );
  }
  return (
    <main className="page subpage">
      <Reveal order={0}>
        <p className="mono section-label">{p.date.slice(0, 10)}</p>
      </Reveal>
      <Reveal order={1}>
        <h1 className="page-title">{p.title}</h1>
      </Reveal>
      <div className="prose about-body">
        {p.body.map((para, i) => (
          <Reveal key={i} order={i + 2} as="p">
            {para}
          </Reveal>
        ))}
      </div>
    </main>
  );
}
