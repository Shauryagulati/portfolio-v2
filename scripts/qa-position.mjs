import { chromium } from "playwright";
const browser = await chromium.launch();
for (const port of [5199, 5200]) {
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle", timeout: 8000 });
    await page.keyboard.press("/");
    await page.waitForSelector(".term-window", { timeout: 4000 });
    await page.waitForTimeout(700);
    const box = await page.locator(".term-window").boundingBox();
    const pos = await page.locator(".term-window").evaluate((el) => getComputedStyle(el).position);
    console.log(`:${port} -> window top=${Math.round(box.y)}px of 900, position=${pos}, ${box.y < 300 ? "FLOATING-CENTERED" : "BOTTOM-ANCHORED(?)"}`);
    await page.screenshot({ path: `${process.env.S}/pos-${port}.png` });
    await page.close();
  } catch (e) {
    console.log(`:${port} -> ERROR: ${e.message.split("\n")[0]}`);
  }
}
await browser.close();
