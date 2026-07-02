/** Renders public/resume.pdf from the content layer via headless Chromium.
 *  Run: npx tsx scripts/gen-resume.ts
 *  Deliberately phone-free — the public artifact carries email/links only. */
import { chromium } from "playwright";
import { site } from "../app/content/site";
import { resume } from "../app/content/resume";
import { projects } from "../app/content/projects";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @page { size: Letter; margin: 14mm 16mm; }
  * { margin: 0; box-sizing: border-box; }
  body { font: 10.2pt/1.45 Georgia, serif; color: #131311; }
  header { text-align: center; margin-bottom: 10pt; }
  h1 { font-size: 19pt; font-weight: 600; letter-spacing: .5px; }
  .contact { font: 8.5pt Menlo, monospace; color: #56524a; margin-top: 3pt; }
  h2 { font: 8.5pt Menlo, monospace; letter-spacing: 2px; text-transform: uppercase;
       color: #56524a; border-bottom: .6pt solid #d8d3c8; padding-bottom: 2pt;
       margin: 10pt 0 5pt; }
  .row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 6pt; }
  .org { font-weight: 600; }
  .role { font-style: italic; }
  .dates { font: 8pt Menlo, monospace; color: #56524a; white-space: nowrap; }
  ul { padding-left: 12pt; margin-top: 2pt; }
  li { margin-top: 1.5pt; }
  .skills div { margin-top: 2.5pt; }
  .skills b { font-family: Menlo, monospace; font-size: 8pt; text-transform: uppercase;
              letter-spacing: 1px; font-weight: 400; color: #56524a; }
  .detail { color: #3d3a34; }
</style></head><body>
<header>
  <h1>${esc(site.name)}</h1>
  <div class="contact">${esc(site.email)} · linkedin.com/in/shauryagulati · github.com/Shauryagulati · ${site.url.replace("https://", "")}</div>
</header>

<h2>Education</h2>
${resume.education
  .map(
    (e) => `<div class="row"><span><span class="org">${esc(e.school)}</span> — ${esc(e.credential)}</span></div>
    <div class="detail">${esc(e.detail)}</div>`,
  )
  .join("")}

<h2>Experience</h2>
${resume.experience
  .map(
    (x) => `<div class="row"><span><span class="org">${esc(x.org)}</span> — <span class="role">${esc(x.role)}</span></span><span class="dates">${esc(x.dates)}</span></div>
    <ul>${x.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`,
  )
  .join("")}

<h2>Selected Projects</h2>
${projects
  .filter((p) => p.featured && p.slug !== "this-site")
  .map(
    (p) => `<div class="row"><span><span class="org">${esc(p.title)}</span> — ${esc(p.oneliner)}</span></div>
    <div class="detail">${esc(p.stack.join(", "))}${p.github ? ` · ${esc(p.github.replace("https://", ""))}` : ""}</div>`,
  )
  .join("")}
<div class="row"><span><span class="org">This site</span> — a terminal with a built-in RAG agent over my work, running at $0/month.</span></div>
<div class="detail">${esc(site.url.replace("https://", ""))} — type "shaurya" in its terminal.</div>

<h2>Skills</h2>
<div class="skills">
${Object.entries(resume.skills)
  .map(([g, items]) => `<div><b>${esc(g)}:</b> ${esc(items.join(", "))}</div>`)
  .join("")}
</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.pdf({ path: "public/resume.pdf", format: "Letter", printBackground: true });
await browser.close();
console.log("gen-resume: public/resume.pdf (phone-free)");
