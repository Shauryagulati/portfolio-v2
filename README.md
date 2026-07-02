# shauryagulati — portfolio v2

Personal site of **Shaurya Gulati** — AI product builder, CMU.
Paper-and-ink by day, graphite-and-phosphor by night, with a real
terminal in it.

## The idea

- A minimal, typographic site anyone can browse — projects, about, resume.
- Press `/` (or `⌘K`) anywhere: a **terminal** opens. `ls`, `cd`, `cat`
  your way through the site's virtual file system.
- Type **`shaurya`** in it and an **agent** boots — RAG over everything
  on the site, streamed with source citations, the way a CLI agent should.
- The hero object is a **retro CRT rendered as live ASCII** — real
  Three.js geometry rasterized to text every frame. It leans toward your
  cursor and spins while the agent thinks.

## Stack

React Router v8 (framework mode, fully prerendered static HTML) ·
React 19 · TypeScript · Three.js / React Three Fiber · Motion ·
Cloudflare Pages + one Pages Function (Workers AI) for the agent,
with a local lexical-retrieval fallback so the site works with zero
backend.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site -> build/client (+ llms.txt, sitemap, og)
npm run typecheck
```

Content lives in `app/content/*` — pages, the terminal's file system,
the agent's knowledge, and `llms.txt` all regenerate from it.

Deploying: see `docs/DEPLOY.md` (Cloudflare Pages, $0/month).

## Lineage

v1 of this site was built on Edward Hinrichsen's open-source
retro-computer portfolio (MIT — thank you). v2 is a from-scratch
rebuild; the ASCII CRT is the tip of the hat.
