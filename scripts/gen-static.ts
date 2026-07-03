/** Generates public/llms.txt, sitemap.xml, robots.txt from the content
 *  layer. Runs in prebuild (Node 22.6+ strips types natively). */
import { writeFileSync } from "node:fs";
import { site } from "../app/content/site";
import { projects } from "../app/content/projects";
import { corpus } from "../app/content/corpus";

// llms.txt — curated context for AI crawlers, straight from the corpus
const llms = [
  `# ${site.name}`,
  ``,
  `> ${site.intro}`,
  ``,
  `Canonical site: ${site.url}`,
  `Contact: ${site.email} · GitHub: ${site.github} · LinkedIn: ${site.linkedin}`,
  ``,
  ...corpus.map((doc) => `---\n\n${doc.text}`),
  ``,
  `---`,
  ``,
  `This site has an interactive terminal (press /) with a built-in RAG`,
  `agent. Type "${site.handle}" in it to ask questions about this content.`,
].join("\n");
writeFileSync("public/llms.txt", llms);

// sitemap.xml
const paths = [
  "/",
  "/projects",
  ...projects.map((p) => `/projects/${p.slug}`),
  "/about",
];
const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...paths.map(
    (p) =>
      `  <url><loc>${site.url}${p}</loc><lastmod>${today}</lastmod></url>`,
  ),
  `</urlset>`,
].join("\n");
writeFileSync("public/sitemap.xml", sitemap);

// robots.txt
writeFileSync(
  "public/robots.txt",
  `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
);

console.log(`gen-static: llms.txt (${corpus.length} docs), sitemap (${paths.length} urls), robots.txt`);
