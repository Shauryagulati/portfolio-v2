import { chromium } from "playwright";
const browser = await chromium.launch();

// ---- mobile 390
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
await page.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: "/private/tmp/claude-501/-Users-shauryagulati-Developer-Portfolio/e8842b0d-27d0-4d48-8f30-e12fb2048a9e/scratchpad/mobile-home.png", fullPage: true });

// nav layout
const nav = await page.evaluate(() => {
  const n = document.querySelector(".nav");
  const r = n.getBoundingClientRect();
  const links = [...document.querySelectorAll(".nav-links a, .nav-links button")].map(e => { const b = e.getBoundingClientRect(); return { t: e.textContent.trim(), x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width) }; });
  return { navH: Math.round(r.height), links, overflow: document.scrollingElement.scrollWidth - innerWidth };
});
console.log("mobile nav:", JSON.stringify(nav));

// open terminal via nav button (no keyboard on mobile)
await page.tap(".nav-term");
await page.waitForSelector(".term-window", { timeout: 3000 }).catch(() => console.log("FAIL: nav [/] button did not open terminal"));
const winBox = await page.evaluate(() => {
  const w = document.querySelector(".term-window").getBoundingClientRect();
  return { x: Math.round(w.x), y: Math.round(w.y), w: Math.round(w.width), h: Math.round(w.height), vw: innerWidth, vh: innerHeight };
});
console.log("mobile overlay box:", JSON.stringify(winBox));
// close button tap (esc key doesn't exist on mobile)
await page.tap(".term-close");
await page.waitForTimeout(1000);
console.log("tap esc button closes:", !(await page.$(".term-window")));

// how do you close overlay on mobile if keyboard covers? backdrop visible?
// check the 404 page + a case study on mobile visually
await page.goto("http://localhost:5200/projects/eu-navigator", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const svgBox = await page.evaluate(() => { const s = document.querySelector("main svg"); if (!s) return null; const b = s.getBoundingClientRect(); return { w: Math.round(b.width), vw: innerWidth, overflow: document.scrollingElement.scrollWidth - innerWidth }; });
console.log("case-study svg on mobile:", JSON.stringify(svgBox));
await page.screenshot({ path: "/private/tmp/claude-501/-Users-shauryagulati-Developer-Portfolio/e8842b0d-27d0-4d48-8f30-e12fb2048a9e/scratchpad/mobile-eu.png", fullPage: true });
await ctx.close();

// ---- theme persistence desktop
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx2.newPage();
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
const label0 = await p.innerText(".theme-toggle");
await p.click(".theme-toggle");
const t1 = await p.evaluate(() => document.documentElement.dataset.theme);
const label1 = await p.innerText(".theme-toggle");
await p.reload({ waitUntil: "networkidle" });
const t2 = await p.evaluate(() => document.documentElement.dataset.theme);
const stored = await p.evaluate(() => localStorage.getItem("theme"));
console.log(`theme toggle: label "${label0}"→"${label1}", after click=${t1}, after reload=${t2}, localStorage=${stored}`);
await p.screenshot({ path: "/private/tmp/claude-501/-Users-shauryagulati-Developer-Portfolio/e8842b0d-27d0-4d48-8f30-e12fb2048a9e/scratchpad/dark-home.png", fullPage: false });
// navigate to another page — theme sticks?
await p.click("a[href='/projects']");
await p.waitForTimeout(500);
console.log("theme after client nav:", await p.evaluate(() => document.documentElement.dataset.theme));
await ctx2.close();

// ---- pre-hydration typing: type immediately on domcontentloaded
const ctx3 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p3 = await ctx3.newPage();
await p3.goto("http://localhost:5200/", { waitUntil: "domcontentloaded" });
await p3.click(".term-artifact-live .term-input", { timeout: 2000 }).catch(() => {});
await p3.keyboard.type("help", { delay: 30 });
await p3.waitForTimeout(2500);
const val = await p3.inputValue(".term-artifact-live .term-input").catch(() => "N/A");
console.log("typed 'help' right after DOMContentLoaded, input now:", JSON.stringify(val));
await ctx3.close();
await browser.close();
