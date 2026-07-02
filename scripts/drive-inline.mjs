// Drive the INLINE hero terminal: node scripts/drive-inline.mjs <url> <out>
import { chromium } from "playwright";

const [url, out] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
await page.goto(url, { waitUntil: "networkidle" });

const inline = page.locator(".term-artifact-live .term-input");

// 1. type directly into the artifact — no click-to-open first
await inline.click();
await inline.fill("pwd");
await page.keyboard.press("Enter");
await page.waitForTimeout(200);
const inlineText = await page.innerText(".term-artifact-live");
const inlineWorks = /~\s*%\s*pwd/.test(inlineText) || inlineText.includes("pwd");
const noOverlayYet = (await page.locator(".term-window").count()) === 0;

// 2. keep going — output should outgrow the widget and hand off
await inline.fill("help");
await page.keyboard.press("Enter");
await page.waitForSelector(".term-window", { timeout: 4000 }).catch(() => {});
const overlayAfterGrowth = (await page.locator(".term-window").count()) === 1;

// 3. session continuity: the overlay must contain the inline history
const overlayText = overlayAfterGrowth
  ? await page.innerText(".term-scroll")
  : "";
const continuity = /pwd/.test(overlayText) && /help/.test(overlayText);

// 4. agent boots into overlay from scratch
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
await inline.click();
await inline.fill("shaurya");
await page.keyboard.press("Enter");
await page.waitForTimeout(600);
const agentInOverlay =
  (await page.locator(".term-window").count()) === 1 &&
  /RAG over everything/.test(await page.innerText(".term-scroll"));

await page.screenshot({ path: out });
await browser.close();

const checks = [
  ["inline input executes", inlineWorks],
  ["no premature overlay", noOverlayYet],
  ["hands off when output grows", overlayAfterGrowth],
  ["session continuity", continuity],
  ["agent boots into overlay", agentInOverlay],
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
