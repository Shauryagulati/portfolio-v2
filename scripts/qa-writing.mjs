import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage();
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await p.keyboard.press("/");
await p.waitForSelector(".term-window");
for (const c of ["ls writing", "cat writing/synthesis-outrunning-retrieval.md"]) {
  await p.fill(".term-input", c); await p.keyboard.press("Enter"); await p.waitForTimeout(200);
}
const t = await p.innerText(".term-scroll");
console.log(/synthesis-outrunning-retrieval\.md/.test(t) ? "PASS ls writing" : "FAIL ls writing");
console.log(/Synthesis is the voice/.test(t) ? "PASS cat essay" : "FAIL cat essay");
await b.close();
