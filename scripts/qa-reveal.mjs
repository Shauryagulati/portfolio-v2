import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:5200/projects/eu-navigator", { waitUntil: "networkidle" });
// scroll through the page
for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 700); await page.waitForTimeout(250); }
const vis = await page.evaluate(() => {
  const els = [...document.querySelectorAll("main h2, main .case-metrics, main .work-all, main p")];
  const hidden = els.filter((e) => { const o = parseFloat(getComputedStyle(e).opacity); const p = e.closest("[style*='opacity']"); return o < 0.9 && e.innerText.trim(); }).map(e => e.innerText.slice(0, 30));
  const headings = [...document.querySelectorAll("main h2")].map(h => h.innerText);
  return { headings, hidden };
});
console.log("headings after scroll:", JSON.stringify(vis.headings));
console.log("still-hidden:", JSON.stringify(vis.hidden));
// svg text size
const svgFont = await page.evaluate(() => {
  const t = document.querySelector("main svg text");
  if (!t) return null;
  const r = t.getBoundingClientRect();
  return { renderedTextHeightPx: +r.height.toFixed(1), sample: t.textContent };
});
console.log("svg label:", JSON.stringify(svgFont));
await page.screenshot({ path: "/private/tmp/claude-501/-Users-shauryagulati-Developer-Portfolio/e8842b0d-27d0-4d48-8f30-e12fb2048a9e/scratchpad/mobile-eu-scrolled.png" });
await browser.close();
