import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:5200/definitely-not-a-page", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
console.log("/definitely-not-a-page mains:", await page.evaluate(() => document.querySelectorAll("main").length));

// true client-side nav via popstate
await page.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await page.evaluate(() => { history.pushState({}, "", "/projects/nope"); dispatchEvent(new PopStateEvent("popstate")); });
await page.waitForTimeout(600);
console.log("client-nav /projects/nope:", await page.evaluate(() => ({ mains: document.querySelectorAll("main").length, text: document.querySelector("main")?.innerText.replace(/\n+/g, " | ").slice(0, 120) })));

await page.evaluate(() => { history.pushState({}, "", "/writing"); dispatchEvent(new PopStateEvent("popstate")); });
await page.waitForTimeout(600);
console.log("client-nav /writing:", await page.evaluate(() => ({ mains: document.querySelectorAll("main").length, text: document.querySelector("main")?.innerText.replace(/\n+/g, " | ").slice(0, 120) })));
await browser.close();
