import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:5200/", { waitUntil: "networkidle" });

// expand button opens overlay
await page.click(".term-expand");
await page.waitForSelector(".term-window", { timeout: 3000 });
console.log("expand button opens overlay: true");

// background scroll while overlay open
const y0 = await page.evaluate(() => scrollY);
await page.mouse.move(720, 450);
await page.mouse.wheel(0, 600);
await page.waitForTimeout(400);
const y1 = await page.evaluate(() => scrollY);
console.log(`background scroll while modal open: ${y0} -> ${y1} (locked=${y0 === y1})`);

const type = async (c, w = 200) => { await page.fill(".term-window .term-input", c); await page.keyboard.press("Enter"); await page.waitForTimeout(w); };

// cat resume.md
await type("cat resume.md", 300);
let txt = await page.innerText(".term-scroll");
console.log("cat resume.md mentions PDF:", /PDF: http/.test(txt));

// open with path from root
await type("open projects/eu-navigator.md", 700);
console.log("open projects/eu-navigator.md ->", page.url());
await page.waitForTimeout(300);

// terminal from case-study page, ls should still be at ~? (cwd preserved)
await page.keyboard.press("/");
await page.waitForSelector(".term-window");
await type("pwd", 200);
txt = await page.innerText(".term-scroll");
console.log("cwd preserved across nav:", JSON.stringify(txt.trim().split("\n").slice(-3)));

// ls a file arg
await type("ls about.md", 200);
txt = await page.innerText(".term-scroll");
console.log("ls file arg prints name:", /about\.md/.test(txt.split("ls about.md")[1] ?? ""));

// cd with multiple args / weird whitespace
await type("cd    projects   extra", 200);
await type("pwd", 200);
txt = await page.innerText(".term-scroll");
console.log("cd with extra args:", JSON.stringify(txt.trim().split("\n").slice(-2)));

// open non-openable file (writing corpus? contact.md?)
await type("ls ~", 200);
txt = await page.innerText(".term-scroll");
console.log("root listing:", JSON.stringify((txt.split("ls ~").pop() ?? "").trim().split("\n")[0]));
await type("open contact.md", 300);
txt = await page.innerText(".term-scroll");
console.log("open contact.md:", JSON.stringify((txt.split("open contact.md").pop() ?? "").trim().split("\n")[0]));
await browser.close();
