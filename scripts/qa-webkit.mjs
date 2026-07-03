import { webkit } from "playwright";
const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await page.keyboard.press("/");
await page.waitForSelector(".term-window");
await page.waitForTimeout(800);
const box = await page.locator(".term-window").boundingBox();
const cs = await page.locator(".term-window").evaluate((el) => {
  const s = getComputedStyle(el);
  return { top: s.top, left: s.left, position: s.position, height: s.height };
});
console.log(`webkit: window y=${Math.round(box.y)}px of 900, computed=`, JSON.stringify(cs));
await page.screenshot({ path: `${process.env.S}/pos-webkit.png` });
await browser.close();
