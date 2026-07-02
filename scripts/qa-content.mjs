import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await page.keyboard.press("/");
await page.waitForSelector(".term-window");
async function ask(q) {
  await page.fill(".term-input", q);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3500);
}
await ask("shaurya");
await ask("what did he do at lunon?");
await ask("tell me about suture");
await ask("what is rag-verdict?");
const text = await page.innerText(".term-scroll");
const checks = [
  ["lunon answer", /(due diligence|copilot|multi-agent|pipeline)/i.test(text)],
  ["suture answer", /(cardiology|prior-auth|referral|PHI)/i.test(text)],
  ["rag-verdict answer", /(pytest|behavioral|citations resolve|PASS)/i.test(text)],
];
let fail = 0;
for (const [n, ok] of checks) { console.log(`${ok ? "PASS" : "FAIL"} ${n}`); if (!ok) fail++; }
await page.screenshot({ path: process.argv[2] });
await browser.close();
process.exit(fail ? 1 : 0);
