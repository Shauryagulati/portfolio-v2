import { site } from "~/content/site";

export function Footer() {
  return (
    <footer className="footer page">
      <div className="footer-rule" aria-hidden="true" />
      <div className="footer-row">
        <span className="mono">© {new Date().getFullYear()} {site.name}</span>
        <nav className="footer-links" aria-label="Contact">
          <a className="mono" href={`mailto:${site.email}`}>
            Email
          </a>
          <a className="mono" href={site.github} rel="me noreferrer">
            GitHub
          </a>
          <a className="mono" href={site.linkedin} rel="me noreferrer">
            LinkedIn
          </a>
        </nav>
      </div>
      <p className="mono footer-hint">{site.terminalHint} — or press /</p>
    </footer>
  );
}
