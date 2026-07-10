import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1000, height: 640 },
  recordVideo: { dir: "/tmp/v1vid", size: { width: 1000, height: 640 } },
});
const page = await ctx.newPage();
await page.goto("https://shauryagulati.github.io/", { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(5000); // loading + intro animation
// gentle scroll journey — the camera ride is the whole show
for (let i = 0; i < 14; i++) {
  await page.mouse.wheel(0, 320);
  await page.waitForTimeout(550);
}
await page.waitForTimeout(1500);
await ctx.close();
await browser.close();
console.log("recorded");
