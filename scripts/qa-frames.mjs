import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await p.waitForTimeout(4500); // engine live
const frames = [];
for (let i = 0; i < 10; i++) {
  frames.push(await p.locator(".ascii-static").textContent());
  await p.waitForTimeout(420);
}
await b.close();
writeFileSync("/tmp/frames.json", JSON.stringify(frames));
console.log("captured", frames.length, "frames,", new Set(frames).size, "unique");
