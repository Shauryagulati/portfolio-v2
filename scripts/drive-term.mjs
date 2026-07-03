// Drive the terminal like a user: node scripts/drive-term.mjs <url> <outfile>
import { chromium } from "playwright";

const [url, out] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
await page.goto(url, { waitUntil: "networkidle" });

await page.keyboard.press("/");
await page.waitForSelector(".term-window", { timeout: 5000 });

async function type(cmd) {
  await page.fill(".term-input", cmd);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(150);
}

await type("help");
await type("ls");
await type("cd projects");
await type("ls");
await type("cat suture.md");
await type("pwd");
await type("cd ..");
await type("neofetch");

const text = await page.innerText(".term-scroll");
await page.screenshot({ path: out });
await browser.close();

const checks = [
  ["boot greeting", /last login/.test(text)],
  ["help lists cat", /cat\s+print a file/.test(text)],
  ["ls shows projects dir", /projects\//.test(text)],
  ["cat prints case study", /cardiology practice/i.test(text)],
  ["pwd tracks cd", /~\/projects/.test(text)],
  ["neofetch", /shaurya-os v2/.test(text)],
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
