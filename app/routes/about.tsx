import { site } from "~/content/site";
import { about } from "~/content/about";
import { Reveal } from "~/components/Reveal";
import { pageMeta } from "~/lib/seo";

export function meta() {
  return pageMeta({
    title: `About — ${site.name}`,
    description: about.body[0],
    path: "/about",
  });
}

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
    </main>
  );
}
