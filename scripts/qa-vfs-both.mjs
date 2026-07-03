import { chromium } from "playwright";
const b = await chromium.launch();
for (const port of [5199, 5200]) {
  const p = await b.newPage();
  try {
    await p.goto(`http://localhost:${port}/`, { waitUntil: "networkidle", timeout: 10000 });
    await p.keyboard.press("/");
    await p.waitForSelector(".term-window", { timeout: 4000 });
    await p.fill(".term-input", "ls"); await p.keyboard.press("Enter"); await p.waitForTimeout(150);
    await p.fill(".term-input", "ls experience"); await p.keyboard.press("Enter"); await p.waitForTimeout(150);
    const t = await p.innerText(".term-scroll");
    console.log(`:${port} ls -> ${/experience\//.test(t) ? "has experience/" : "MISSING experience/"}, ${/lunon\.md/.test(t) ? "has lunon.md" : "MISSING lunon.md"}, ${/skills\.md/.test(t) ? "has skills.md" : "MISSING skills.md"}`);
  } catch (e) { console.log(`:${port} ERROR ${e.message.split("\n")[0]}`); }
  await p.close();
}
await b.close();
