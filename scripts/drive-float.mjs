// Drive the floating terminal window: node scripts/drive-float.mjs <url> <out>
import { chromium } from "playwright";

const [url, out] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
await page.goto(url, { waitUntil: "networkidle" });

// 1. launcher opens the window
await page.click(".term-artifact");
await page.waitForSelector(".term-window");
const opened = (await page.locator(".term-window").count()) === 1;

// 2. commands execute in the window
await page.fill(".term-input", "ls");
await page.keyboard.press("Enter");
await page.waitForTimeout(200);
const lsWorks = /projects\//.test(await page.innerText(".term-scroll"));

// 3. drag by the title bar
const before = await page.locator(".term-window").boundingBox();
const bar = await page.locator(".term-window-bar").boundingBox();
await page.mouse.move(bar.x + bar.width / 2, bar.y + bar.height / 2);
await page.mouse.down();
await page.mouse.move(bar.x + bar.width / 2 + 220, bar.y + bar.height / 2 + 120, { steps: 8 });
await page.mouse.up();
const after = await page.locator(".term-window").boundingBox();
const dragged =
  Math.abs(after.x - before.x - 220) < 30 && Math.abs(after.y - before.y - 120) < 30;

// 4. non-modal: the page scrolls underneath while the window is open
await page.mouse.move(200, 500);
await page.mouse.wheel(0, 600);
await page.waitForTimeout(300);
const scrolled = await page.evaluate(() => window.scrollY > 200);

// 5. Esc closes; session survives reopen
await page.click(".term-input");
await page.keyboard.press("Escape");
const closed = await page
  .waitForSelector(".term-window", { state: "detached", timeout: 3000 })
  .then(() => true)
  .catch(() => false);
await page.keyboard.press("/");
await page.waitForSelector(".term-window");
const continuity = /projects\//.test(await page.innerText(".term-scroll"));

await page.screenshot({ path: out });
await browser.close();

const checks = [
  ["launcher opens window", opened],
  ["commands execute", lsWorks],
  ["drag by title bar", dragged],
  ["page scrolls underneath (non-modal)", scrolled],
  ["esc closes", closed],
  ["session survives reopen", continuity],
];
let fail = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) fail++;
}
if (errors.length) {
  console.error("BROWSER ERRORS:\n" + errors.join("\n"));
  fail++;
}
process.exit(fail ? 1 : 0);
