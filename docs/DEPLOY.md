# Deploying — Cloudflare Pages, $0/month

The site is fully static (`build/client`) plus one Pages Function
(`functions/api/agent.ts`) for the AI agent. Everything fits Cloudflare's
free tier. The only money in the project is the domain (~$10/yr).

## One-time setup

1. **Cloudflare account** (free) → Workers & Pages → Create → Pages →
   Connect to the GitHub repo.
2. **Build settings:**
   - Build command: `npm run build`
   - Build output directory: `build/client`
3. **AI binding** (this powers the agent): Pages project → Settings →
   Functions → **AI bindings** → add binding named exactly `AI`.
   Without it, `/api/agent` returns 503 and the terminal quietly uses its
   built-in local fallback — nothing breaks, answers are just template-y.
4. **Analytics** (optional, free, no cookie banner): Cloudflare dashboard →
   Analytics → Web Analytics → add site, paste the snippet hostname in —
   or just enable it on the Pages project.

## Domain

Buy `shauryagulati.dev` (Cloudflare Registrar sells at cost). Pages
project → Custom domains → add it. Update `site.url` in
`app/content/site.ts` and rebuild so canonical/OG/sitemap URLs match.

Until then the site runs free at `<project>.pages.dev`.

## After content changes

Push to `main` — Pages rebuilds automatically. The agent's knowledge,
`llms.txt`, and the terminal's file system all regenerate from
`app/content/*` at build time; there is nothing else to update.

## Rate limits / cost honesty

- Workers AI free allocation renews daily; the model is
  `@cf/meta/llama-3.1-8b-instruct`.
- The function rate-limits 8 req/min per IP (in-isolate, best-effort).
- If quota is exhausted: the client falls back to local retrieval.
  Worst case is a less eloquent agent, never a broken site.
