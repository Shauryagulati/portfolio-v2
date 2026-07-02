import { Link, useLocation } from "react-router";
import { site } from "~/content/site";

export function meta() {
  return [{ title: `404 — ${site.name}` }];
}

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <main className="page subpage">
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
