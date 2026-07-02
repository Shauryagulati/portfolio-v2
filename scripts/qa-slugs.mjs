import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 200)));
for (const r of ["/projects/does-not-exist", "/writing/ghost-post"]) {
  errs.length = 0;
  await page.goto("http://localhost:5200" + r, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const mains = await page.evaluate(() => document.querySelectorAll("main").length);
  const text = await page.evaluate(() => document.body.innerText.replace(/\n+/g, " | ").slice(0, 250));
  console.log(`\n${r}: mains=${mains}\n  ${text}\n  errs: ${errs.join(" ;; ") || "none"}`);
}
// client-side nav: home -> (pushState) /writing via terminal? no link exists. Try router navigation via open? skip.
// client-side navigate to unknown project via evaluate link
await page.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await page.evaluate(() => { const a = document.createElement("a"); a.href = "/projects/nope"; a.textContent = "x"; document.body.appendChild(a); });
await page.click("body > a");
await page.waitForTimeout(800);
console.log("\nclient-nav to /projects/nope:", await page.evaluate(() => document.body.innerText.replace(/\n+/g, " | ").slice(0, 200)));
console.log("errs:", errs.join(" ;; ") || "none");
await browser.close();
