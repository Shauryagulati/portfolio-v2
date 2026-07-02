// Screenshot helper: node scripts/shoot.mjs <url> <outfile> [theme] [width]
import { chromium } from "playwright";

const [url, out, theme = "light", width = "1440"] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(width), height: 900 },
});
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console: ${m.text()}`);
});
await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.screenshot({ path: out, fullPage: false });
await browser.close();
if (errors.length) {
  console.error("BROWSER ERRORS:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("ok:", out);
