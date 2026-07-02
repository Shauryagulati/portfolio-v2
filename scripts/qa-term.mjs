import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push(`pageerror: ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errs.push(`console: ${m.text().slice(0,200)}`); });
const R = [];
const log = (n, ok, extra = "") => { R.push(`${ok ? "PASS" : "FAIL"} ${n}${extra ? " — " + extra : ""}`); };

await page.goto("http://localhost:5200/", { waitUntil: "networkidle" });

// --- 1. inline widget is live; output growth hands off to overlay
await page.click(".term-artifact-live");
const inlineFocused = await page.evaluate(() => document.activeElement?.classList.contains("term-input"));
log("click inline widget focuses input", !!inlineFocused);
await page.keyboard.type("help");
await page.keyboard.press("Enter");
await page.waitForTimeout(400);
const overlayAfterHelp = await page.$(".term-window");
log("help output (>6 lines) hands off to overlay", !!overlayAfterHelp);
let txt = await page.innerText(".term-scroll").catch(() => "");
log("overlay kept scrollback (help output present)", /clear the screen|list files/.test(txt));

// focus in overlay?
const ovFocus = await page.evaluate(() => document.activeElement?.closest(".term-window") != null);
log("overlay input auto-focused", ovFocus);

// --- 2. Esc closes
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
log("Esc closes overlay", !(await page.$(".term-window")));

// --- 3. "/" reopens; session persists
await page.keyboard.press("/");
await page.waitForSelector(".term-window", { timeout: 3000 }).catch(() => {});
log("/ reopens overlay", !!(await page.$(".term-window")));
txt = await page.innerText(".term-scroll").catch(() => "");
log("session persisted after close/reopen", /list files/.test(txt));

const type = async (cmd, wait = 150) => { await page.fill(".term-window .term-input", cmd); await page.keyboard.press("Enter"); await page.waitForTimeout(wait); };

// --- 4. vfs edge cases
await type("cd projects");
await type("cd ../../../../..");
await type("pwd");
txt = await page.innerText(".term-scroll");
log("cd .. past root clamps at ~", txt.trim().endsWith("~"), "last pwd line: " + txt.trim().split("\n").pop());
await type("cat projects");
txt = await page.innerText(".term-scroll");
log("cat directory errors", /is a directory/.test(txt));
await type("cat nope.md");
txt = await page.innerText(".term-scroll");
log("cat missing file errors", /no such file: nope.md/.test(txt));
await type("frobnicate --now");
txt = await page.innerText(".term-scroll");
log("unknown command errors", /command not found: frobnicate/.test(txt));
await type("ls bogusdir");
txt = await page.innerText(".term-scroll");
log("ls bogus arg errors", /ls: no such/.test(txt));
await type("cd about.md");
txt = await page.innerText(".term-scroll");
log("cd into file errors", /not a directory/.test(txt));

// --- 5. rapid empty enters
for (let i = 0; i < 8; i++) await page.keyboard.press("Enter");
await page.waitForTimeout(200);
const noErr = errs.length === 0;
log("8 rapid empty enters: no JS errors", noErr);

// --- 6. very long string
const long = "x".repeat(3000);
await type(long, 300);
txt = await page.innerText(".term-scroll");
log("3000-char input echoed without crash", txt.includes("command not found: " + "x".repeat(20)));
const scrollOverflow = await page.evaluate(() => { const el = document.querySelector(".term-scroll"); return el.scrollWidth - el.clientWidth; });
log("long line wraps (no horiz overflow in scrollback)", scrollOverflow <= 1, `overflowX=${scrollOverflow}px`);

// --- 7. tab completion
await page.fill(".term-window .term-input", "neo");
await page.keyboard.press("Tab");
let v = await page.inputValue(".term-window .term-input");
log("tab completes neo→neofetch", v === "neofetch", `got "${v}"`);
await page.keyboard.press("Enter");
await page.waitForTimeout(200);
await page.fill(".term-window .term-input", "c");
await page.keyboard.press("Tab");
v = await page.inputValue(".term-window .term-input");
log("tab on ambiguous 'c' does nothing (no list shown)", v === "c", `got "${v}"`);
await page.fill(".term-window .term-input", "cat projects/eu");
await page.keyboard.press("Tab");
v = await page.inputValue(".term-window .term-input");
log("tab completes path arg", v === "cat projects/eu-navigator.md", `got "${v}"`);
await page.fill(".term-window .term-input", "");

// --- 8. arrow history
await page.keyboard.press("ArrowUp");
v = await page.inputValue(".term-window .term-input");
log("ArrowUp recalls last command", v === "neofetch", `got "${v.slice(0,40)}"`);
await page.keyboard.press("ArrowUp");
await page.keyboard.press("ArrowDown");
await page.keyboard.press("ArrowDown");
v = await page.inputValue(".term-window .term-input");
log("ArrowDown returns to empty", v === "", `got "${v.slice(0,40)}"`);

// --- 9. history command
await type("history");
txt = await page.innerText(".term-scroll");
log("history lists numbered commands", /\d+\s+cd projects/.test(txt));

// --- 10. theme command flips data-theme
const before = await page.evaluate(() => document.documentElement.dataset.theme);
await type("theme");
const after = await page.evaluate(() => document.documentElement.dataset.theme);
log("theme command flips theme", before !== after, `${before}→${after}`);
await type("theme"); // flip back

// --- 11. clear
await type("clear");
txt = await page.innerText(".term-scroll");
log("clear empties scrollback", txt.trim().split("\n").length <= 2, JSON.stringify(txt.slice(0, 80)));

// --- 12. open navigates + closes
await type("open about.md", 600);
log("open about.md navigates", page.url().endsWith("/about"), page.url());
log("open closes overlay", !(await page.$(".term-window")));

// --- 13. summon from /about via Cmd+K
await page.keyboard.press("Meta+k");
await page.waitForTimeout(400);
log("Cmd+K opens overlay on /about", !!(await page.$(".term-window")));
// exit command closes
await type("exit", 400);
log("exit closes overlay", !(await page.$(".term-window")));

// --- 14. "/" while typing in a normal input shouldn't hijack — no other inputs on site; test in overlay input itself
await page.keyboard.press("/");
await page.waitForTimeout(300);
const reopened = !!(await page.$(".term-window"));
log("/ works after exit on subpage", reopened);
if (reopened) {
  await page.fill(".term-window .term-input", "cat about");
  await page.keyboard.press("/"); // typing a slash into input should insert, not toggle
  v = await page.inputValue(".term-window .term-input");
  log("typing / inside terminal input inserts slash", v === "cat about/", `got "${v}"`);
}

// --- 15. backdrop click closes; window click refocuses input; text selection survives?
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
await page.keyboard.press("/");
await page.waitForSelector(".term-window");
await page.evaluate(() => { // simulate user selecting text in scrollback then clicking (mouseup fires click on window)
  const line = document.querySelector(".term-scroll .term-line");
  const range = document.createRange(); range.selectNodeContents(line);
  const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
});
const selBefore = await page.evaluate(() => getSelection().toString());
await page.click(".term-scroll .term-line");
const selAfter = await page.evaluate(() => getSelection().toString());
log("text selection in scrollback survives click (copy-ability)", selAfter.length > 0, `before="${selBefore.slice(0,20)}" after="${selAfter.slice(0,20)}"`);

// --- 16. focus trap: Tab from input (Tab is completion) — Shift+Tab? focus escape to background?
await page.keyboard.press("Shift+Tab");
const focusEscaped = await page.evaluate(() => document.activeElement?.closest(".term-window") == null ? document.activeElement?.tagName + "." + document.activeElement?.className : null);
log("focus stays inside modal on Shift+Tab", !focusEscaped, `escaped to ${focusEscaped}`);

console.log(R.join("\n"));
if (errs.length) console.log("BROWSER ERRORS:\n" + errs.join("\n"));
await page.screenshot({ path: "/private/tmp/claude-501/-Users-shauryagulati-Developer-Portfolio/e8842b0d-27d0-4d48-8f30-e12fb2048a9e/scratchpad/term-final.png" });
await browser.close();
