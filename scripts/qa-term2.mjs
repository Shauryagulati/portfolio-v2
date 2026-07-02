import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
await page.goto("http://localhost:5200/", { waitUntil: "networkidle" });

// open overlay
await page.keyboard.press("/");
await page.waitForSelector(".term-window");

// measure Esc close latency
let t0 = Date.now();
await page.keyboard.press("Escape");
try {
  await page.waitForSelector(".term-window", { state: "detached", timeout: 5000 });
  console.log(`Esc close: overlay detached after ${Date.now() - t0}ms`);
} catch { console.log("Esc close: overlay NEVER detached within 5s"); }

// reopen, run exit command, measure
await page.keyboard.press("/");
await page.waitForSelector(".term-window");
await page.fill(".term-window .term-input", "exit");
t0 = Date.now();
await page.keyboard.press("Enter");
try {
  await page.waitForSelector(".term-window", { state: "detached", timeout: 5000 });
  console.log(`exit close: overlay detached after ${Date.now() - t0}ms`);
} catch { console.log("exit close: overlay NEVER detached within 5s"); }

// cd .. past root
await page.keyboard.press("/");
await page.waitForSelector(".term-window");
const type = async (c) => { await page.fill(".term-window .term-input", c); await page.keyboard.press("Enter"); await page.waitForTimeout(150); };
await type("cd projects");
await type("cd ../../../..");
await type("pwd");
const lines = (await page.innerText(".term-scroll")).trim().split("\n");
console.log("pwd after cd .. spam:", JSON.stringify(lines[lines.length - 2]));

// slash typed inside terminal input
await page.fill(".term-window .term-input", "cat about");
await page.keyboard.press("/");
console.log("slash into input:", JSON.stringify(await page.inputValue(".term-window .term-input")));
await page.fill(".term-window .term-input", "");

// real drag-select then check selection + try Cmd+C
const line = await page.$(".term-scroll .term-line");
const box = await line.boundingBox();
await page.mouse.move(box.x + 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 200, box.y + box.height / 2, { steps: 8 });
await page.mouse.up();
await page.waitForTimeout(300);
const sel = await page.evaluate(() => getSelection().toString());
const active = await page.evaluate(() => document.activeElement?.className);
console.log(`drag-select: selection=${JSON.stringify(sel)} activeElement=${active}`);

// Escape pressed when focus NOT on the input (e.g. after clicking the close button then Esc)
await page.evaluate(() => document.querySelector(".term-close")?.focus());
await page.keyboard.press("Escape");
await page.waitForTimeout(800);
console.log("Esc with focus on close button closes overlay:", !(await page.$(".term-window")));

await browser.close();
