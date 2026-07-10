import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage();
await p.goto("http://localhost:5199/", { waitUntil: "networkidle" });
await p.keyboard.press("/");
await p.waitForSelector(".term-window");
await p.fill(".term-input", "cat skills.md"); await p.keyboard.press("Enter");
await p.waitForTimeout(800);
const loaded = await p.evaluate(async () => {
  await document.fonts.ready;
  return document.fonts.check("16px 'Geist Pixel'");
});
const family = await p.locator(".term-line.term-h1").first().evaluate((el) => getComputedStyle(el).fontFamily);
console.log("font loaded:", loaded, "| h1 family:", family.slice(0, 40));
// zoomed crop of the header area
const h1 = await p.locator(".term-line.term-h1").first().boundingBox();
await p.screenshot({ path: process.env.S + "/pixel-crop.png", clip: { x: h1.x - 10, y: h1.y - 10, width: 500, height: 120 } });
await b.close();
