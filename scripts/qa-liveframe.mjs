import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
const before = await p.locator(".ascii-static").textContent();
await p.waitForTimeout(4500); // idle mount + a few live frames
const after = await p.locator(".ascii-static").textContent();
const pres = await p.locator("pre.ascii-static").count();
console.log("pre count:", pres);
console.log(before !== after ? "PASS live frames streaming into the same pre" : "FAIL static never went live");
await p.screenshot({ path: process.env.S + "/pre-live.png" });
await b.close();
