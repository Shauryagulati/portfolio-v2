// Generates build/client/404.html as PLAIN static HTML — deliberately no
// React/hydration. Unknown direct URLs get a clean terminal-joke page;
// hydrating a mismatched route tree here used to render the site twice.
import { writeFileSync } from "node:fs";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — Shaurya Gulati</title>
<meta name="robots" content="noindex">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<style>
  :root { color-scheme: light dark; }
  body {
    margin: 0; min-height: 100dvh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1.5rem;
    background: #faf8f4; color: #131311;
    font-family: ui-monospace, "SF Mono", Menlo, monospace; padding: 1.5rem;
  }
  @media (prefers-color-scheme: dark) { body { background: #0c0c0c; color: #ecebe7; } }
  h1 { font-size: 0.8rem; letter-spacing: .1em; text-transform: uppercase; opacity: .55; font-weight: 400; margin: 0; }
  .term {
    background: #0d0d0b; border: 1px solid #26261f; border-radius: 10px;
    padding: 1rem 1.25rem; max-width: 34rem; width: 100%;
    color: #e8e6e1; font-size: .85rem; line-height: 1.8;
    box-shadow: 0 22px 48px -18px rgb(0 0 0 / .4);
  }
  .dim { color: #77736b; } .green { color: #34d76f; }
  a { color: inherit; text-underline-offset: .2em; }
  .cursor { display: inline-block; width: .55em; height: 1.05em; margin-left: .35em;
    background: #e8e6e1; vertical-align: text-bottom; animation: blink 1.1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
</style>
</head>
<body>
<h1>404 — page not found</h1>
<div class="term" role="presentation">
  <div><span class="dim">guest@shaurya ~ %</span> open <span id="p">this page</span></div>
  <div>zsh: no such file or directory</div>
  <div class="green">▸ hint: try <a href="/">cd ~</a></div>
  <div><span class="dim">~ %</span><span class="cursor"></span></div>
</div>
<script>document.getElementById("p").textContent = location.pathname;</script>
</body>
</html>
`;
writeFileSync("build/client/404.html", html);
console.log("gen-404: static build/client/404.html");
