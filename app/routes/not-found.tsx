import { useEffect, useState } from "react";
import { Link } from "react-router";
import { site } from "~/content/site";

export function meta() {
  return [{ title: `404 — ${site.name}` }];
}

export default function NotFound() {
  // prerendered once as /404 but served for any unknown path — resolve
  // the real pathname after mount to avoid a hydration mismatch
  const [pathname, setPathname] = useState("…");
  useEffect(() => setPathname(location.pathname), []);
  return (
    <main className="page subpage">
      <h1 className="visually-hidden">Page not found</h1>
      <div className="term-artifact nf-term" role="presentation">
        <span className="term-artifact-bar" aria-hidden="true">
          <i /> <i /> <i />
        </span>
        <span className="term-artifact-body">
          <span className="term-line">
            <span className="term-dim">guest@{site.handle} ~ %</span> open{" "}
            {pathname}
          </span>
          <span className="term-line">
            zsh: no such file or directory: {pathname}
          </span>
          <span className="term-line term-green">
            ▸ hint: try <Link to="/">cd ~</Link>
          </span>
          <span className="term-line">
            <span className="term-dim">~ %</span>
            <span className="term-cursor" />
          </span>
        </span>
      </div>
    </main>
  );
}
