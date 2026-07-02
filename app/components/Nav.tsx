import { Link, NavLink } from "react-router";
import { site } from "~/content/site";
import { ThemeToggle } from "./ThemeToggle";

export function openTerminal() {
  window.dispatchEvent(new CustomEvent("terminal:open"));
}

export function Nav() {
  return (
    <header className="nav page">
      <Link to="/" className="nav-name mono">
        {site.name.toLowerCase()}
      </Link>
      <nav className="nav-links" aria-label="Primary">
        {site.nav.map((item) => (
          <NavLink key={item.to} to={item.to} className="mono nav-link">
            {item.label}
          </NavLink>
        ))}
        <button
          className="mono nav-link nav-term"
          onClick={openTerminal}
          aria-label="Open terminal"
          title="Open terminal (/)"
        >
          [/]
        </button>
        <ThemeToggle />
      </nav>
    </header>
  );
}
