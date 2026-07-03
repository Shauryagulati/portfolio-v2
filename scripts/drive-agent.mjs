// Drive the agent REPL: node scripts/drive-agent.mjs <url> <outfile>
import { chromium } from "playwright";

const [url, out] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
await page.goto(url, { waitUntil: "networkidle" });

await page.keyboard.press("/");
await page.waitForSelector(".term-window");

async function type(cmd, wait = 400) {
  await page.fill(".term-input", cmd);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(wait);
}

await type("shaurya", 600);
await type("tell me about suture", 4000);
await type("how do I contact him?", 4000);
await type("what did he do at lunon?", 4000);
await type("exit", 400);
await type("pwd", 300);

const text = await page.innerText(".term-scroll");
await page.screenshot({ path: out });
await browser.close();

const checks = [
  ["agent boots", /RAG over everything/i.test(text)],
  ["suture answer", /(cardiology|prior-auth|referral|PHI)/i.test(text)],
  ["suture cited", /src: ~\/projects\/suture\.md/.test(text)],
  ["contact answer", /i\.shauryagulati@gmail\.com/i.test(text)],
  ["exit returns to shell", /agent detached/.test(text)],
  ["shell works after exit", /\n~\s*$|~ % pwd/m.test(text)],
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
