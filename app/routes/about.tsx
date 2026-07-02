import { site } from "~/content/site";
import { about } from "~/content/about";
import { Reveal } from "~/components/Reveal";

export function meta() {
  return [
    { title: `About — ${site.name}` },
    { name: "description", content: about.body[0] },
  ];
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
