import { chromium } from "playwright";

const BASE = "http://localhost:5200";
const routes = ["/", "/projects", "/projects/eu-navigator", "/projects/air-quality-mlops",
  "/projects/bert-qa", "/projects/this-site", "/about", "/resume", "/writing", "/definitely-not-a-page"];

const browser = await chromium.launch();
const out = [];

for (const width of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 } });
  for (const r of routes) {
    const page = await ctx.newPage();
    const errs = [], failedReq = [];
    page.on("console", (m) => { if (m.type() === "error") errs.push(`console: ${m.text()}`); });
    page.on("pageerror", (e) => errs.push(`pageerror: ${e.message}`));
    page.on("requestfailed", (req) => failedReq.push(`${req.url()} — ${req.failure()?.errorText}`));
    page.on("response", (res) => { if (res.status() >= 400) failedReq.push(`${res.status()} ${res.url()}`); });
    const resp = await page.goto(BASE + r, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const info = await page.evaluate(() => {
      const se = document.scrollingElement;
      return {
        title: document.title,
        h1: document.querySelector("h1")?.textContent?.trim() ?? null,
        mainText: document.querySelector("main")?.innerText.slice(0, 200) ?? "",
        hOverflow: se.scrollWidth - document.documentElement.clientWidth,
        svgCount: document.querySelectorAll("main svg").length,
        links: [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")),
        theme: document.documentElement.dataset.theme,
        navLinks: [...document.querySelectorAll(".nav-links a, .nav-links button")].map(e => e.textContent.trim()),
      };
    });
    out.push({ width, route: r, status: resp.status(), errs, failedReq, ...info });
    await page.close();
  }
  await ctx.close();
}

// collect + check every internal link found
const allLinks = [...new Set(out.flatMap((o) => o.links))];
const linkResults = [];
const ctx2 = await browser.newContext();
const p2 = await ctx2.newPage();
for (const l of allLinks) {
  const r = await p2.goto(BASE + l, { waitUntil: "domcontentloaded" }).catch((e) => null);
  linkResults.push(`${l} -> ${r ? r.status() : "ERR"}`);
}
await browser.close();

for (const o of out) {
  console.log(`\n=== ${o.width}px ${o.route} [HTTP ${o.status}] theme=${o.theme}`);
  console.log(`title: ${o.title} | h1: ${o.h1} | svg: ${o.svgCount} | hOverflow: ${o.hOverflow}px`);
  console.log(`main: ${o.mainText.replace(/\n/g, " | ")}`);
  if (o.errs.length) console.log("ERRORS:\n  " + o.errs.join("\n  "));
  if (o.failedReq.length) console.log("FAILED REQ:\n  " + o.failedReq.join("\n  "));
}
console.log("\n=== internal links ===");
console.log(linkResults.join("\n"));
