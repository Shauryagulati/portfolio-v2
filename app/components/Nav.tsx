import { Link, NavLink } from "react-router";
import { site } from "~/content/site";
import { posts } from "~/content/writing";
import { ThemeToggle } from "./ThemeToggle";

// Writing joins the nav only once the first essay is published
const navItems = [
  ...site.nav,
  ...(posts.length ? [{ label: "Writing", to: "/writing" }] : []),
];

export function openTerminal() {
  window.dispatchEvent(new CustomEvent("terminal:open"));
}

export function Nav() {
  return (
    <header className="nav page">
      <Link to="/" className="nav-name mono" viewTransition>
        {site.name.toLowerCase()}
      </Link>
      <nav className="nav-links" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="mono nav-link"
            viewTransition
          >
            {item.label}
          </NavLink>
        ))}
        <a className="mono nav-link" href="/resume.pdf" download>
          Resume ↓
        </a>
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
