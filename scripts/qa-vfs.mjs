import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage();
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await p.keyboard.press("/");
await p.waitForSelector(".term-window");
for (const c of ["ls", "ls experience", "cat experience/lunon.md", "cat skills.md"]) {
  await p.fill(".term-input", c); await p.keyboard.press("Enter"); await p.waitForTimeout(150);
}
const t = await p.innerText(".term-scroll");
console.log(/experience\//.test(t) ? "PASS ls shows experience/" : "FAIL ls");
console.log(/lunon\.md/.test(t) ? "PASS experience dir lists roles" : "FAIL roles");
console.log(/Founding AI Engineer/.test(t) ? "PASS cat lunon.md" : "FAIL cat lunon");
console.log(/RRF fusion/.test(t) ? "PASS cat skills.md" : "FAIL skills");
await b.close();
