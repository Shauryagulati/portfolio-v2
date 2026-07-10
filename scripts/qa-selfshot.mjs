import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1240, height: 780 }, deviceScaleFactor: 2 });
await p.addInitScript(() => localStorage.setItem("theme", "dark"));
await p.goto("http://localhost:5199/", { waitUntil: "networkidle" });
await p.keyboard.press("/");
await p.waitForSelector(".term-window");
async function t(cmd, wait) { await p.fill(".term-input", cmd); await p.keyboard.press("Enter"); await p.waitForTimeout(wait); }
await t("shaurya", 700);
await t("what did he build at lunon?", 4500);
const box = await p.locator(".term-window").boundingBox();
await p.screenshot({ path: "public/images/this-site-terminal.png", clip: box });
await b.close();
console.log("self-portrait taken");
