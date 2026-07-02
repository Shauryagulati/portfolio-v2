import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
let fail = 0;
for (const p of ["writing", "projects/does-not-exist", "definitely-not-a-page", "writing/ghost"]) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://localhost:5200/${p}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const mains = await page.evaluate(() => document.querySelectorAll("main").length);
  const terms = await page.evaluate(() => document.querySelectorAll(".term, .term-artifact").length);
  const ok = mains <= 1 && errors.length === 0;
  console.log(`${ok ? "PASS" : "FAIL"} /${p} — mains:${mains} termBlocks:${terms} errors:${errors.length}`);
  if (!ok) fail++;
}
await browser.close();
process.exit(fail ? 1 : 0);
