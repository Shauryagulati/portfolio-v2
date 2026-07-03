import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage();
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await p.keyboard.press("/");
await p.waitForSelector(".term-window");
for (const c of ["cat about.md", "open education.md", "cat resume.md"]) {
  await p.fill(".term-input", c); await p.keyboard.press("Enter"); await p.waitForTimeout(150);
}
const raw = await p.innerText(".term-scroll");
const h1s = await p.locator(".term-line.term-h1").count();
const h2s = await p.locator(".term-line.term-h2").count();
console.log(/# About/.test(raw) ? "FAIL raw hashes visible" : "PASS no raw hashes");
console.log(h1s >= 3 ? `PASS h1 styled (${h1s})` : `FAIL h1 (${h1s})`);
console.log(h2s >= 3 ? `PASS h2 styled (${h2s})` : `FAIL h2 (${h2s})`);
console.log(/no page for education\.md; showing it here/.test(raw) ? "PASS open fallback" : "FAIL open fallback");
console.log(/Carnegie Mellon University/.test(raw) ? "PASS education content shown" : "FAIL education content");
await p.screenshot({ path: process.env.S + "/md-term.png" });
await b.close();
