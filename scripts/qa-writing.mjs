import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errs.push(`${m.type()}: ${m.text().slice(0, 300)}`); });
await page.goto("http://localhost:5200/writing", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
console.log("mains:", await page.evaluate(() => document.querySelectorAll("main").length));
console.log("body main html:", await page.evaluate(() => document.querySelector("main").outerHTML.slice(0, 900)));
console.log("h1:", await page.evaluate(() => document.querySelector("h1")?.textContent));
await page.screenshot({ path: "/private/tmp/claude-501/-Users-shauryagulati-Developer-Portfolio/e8842b0d-27d0-4d48-8f30-e12fb2048a9e/scratchpad/writing.png", fullPage: true });
console.log("errs:", errs.join("\n"));
// Also test client-side nav to /writing (from home)
await page.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await page.evaluate(() => { history.pushState({}, "", "/writing"); });
await browser.close();
