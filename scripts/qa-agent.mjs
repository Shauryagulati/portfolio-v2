import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0,150)); });
await page.goto("http://localhost:5200/", { waitUntil: "networkidle" });

// boot agent from INLINE widget
await page.click(".term-artifact-live");
await page.keyboard.type("shaurya");
await page.keyboard.press("Enter");
await page.waitForTimeout(600);
console.log("agent boot opens overlay:", !!(await page.$(".term-window")));
let txt = await page.innerText(".term-scroll");
console.log("intro shown:", /RAG over everything/.test(txt), "| prompt:", /shaurya ▸/.test(await page.innerText(".term-window .term-input-row")));

const ask = async (q, wait) => {
  await page.fill(".term-window .term-input", q);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(wait);
  return await page.innerText(".term-scroll");
};

// happy path question
txt = await ask("what projects has he built?", 4000);
const lastChunk = txt.split("shaurya ▸ what projects has he built?")[1] ?? "";
console.log("\n--- answer to 'what projects':", JSON.stringify(lastChunk.slice(0, 300)));

// question while busy: fire two quickly
await page.fill(".term-window .term-input", "tell me about eu navigator");
await page.keyboard.press("Enter");
await page.waitForTimeout(150);
await page.fill(".term-window .term-input", "what is his email?");
await page.keyboard.press("Enter");
await page.waitForTimeout(5000);
txt = await page.innerText(".term-scroll");
const afterSecond = txt.split("shaurya ▸ what is his email?")[1] ?? "MISSING";
console.log("\n--- second question echoed?", txt.includes("shaurya ▸ what is his email?"));
console.log("--- content after second question:", JSON.stringify(afterSecond.slice(0, 200)));

// gibberish
txt = await ask("qwertyzxcv flibbertigibbet", 3000);
const gib = txt.split("shaurya ▸ qwertyzxcv flibbertigibbet")[1] ?? "MISSING";
console.log("\n--- gibberish answer:", JSON.stringify(gib.slice(0, 200)));

// empty enter in agent mode
await page.keyboard.press("Enter");
await page.waitForTimeout(300);

// shell commands inside agent mode (user confusion path)
txt = await ask("ls", 3000);
const lsAns = txt.split(/shaurya ▸ ls(?!\w)/)[1] ?? "MISSING";
console.log("\n--- 'ls' typed in agent mode:", JSON.stringify(lsAns.slice(0, 200)));

// history recall in agent mode
await page.keyboard.press("ArrowUp");
const recalled = await page.inputValue(".term-window .term-input");
console.log("\nArrowUp in agent mode recalls:", JSON.stringify(recalled));
await page.fill(".term-window .term-input", "");

// exit back to shell
txt = await ask("exit", 500);
console.log("exit returns to shell:", /agent detached/.test(txt));
const prompt = await page.innerText(".term-window .term-input-row");
console.log("prompt back to shell:", /%/.test(prompt), JSON.stringify(prompt.trim()));

// re-enter agent from shell inside overlay
txt = await ask("shaurya", 600);
console.log("re-enter agent works:", /shaurya ▸/.test(await page.innerText(".term-window .term-input-row")));
// Esc while in agent mode
await page.keyboard.press("Escape");
await page.waitForTimeout(1200);
console.log("Esc closes overlay while agent mode:", !(await page.$(".term-window")));
// inline artifact prompt now shows agent mode?
const inline = await page.innerText(".term-artifact-live");
console.log("inline artifact after close (agent mode leaks?):", JSON.stringify(inline.slice(0, 200)));

if (errs.length) console.log("\nERRORS:", errs.join("\n"));
await page.screenshot({ path: "/private/tmp/claude-501/-Users-shauryagulati-Developer-Portfolio/e8842b0d-27d0-4d48-8f30-e12fb2048a9e/scratchpad/agent.png" });
await browser.close();
