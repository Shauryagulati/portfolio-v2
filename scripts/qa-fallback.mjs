import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage();
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await p.keyboard.press("/");
await p.waitForSelector(".term-window");
async function ask(q, wait = 3200) { await p.fill(".term-input", q); await p.keyboard.press("Enter"); await p.waitForTimeout(wait); }
await ask("shaurya", 600);
await ask("what is his stack?");
await ask("are you sure?");
await ask("where did he work?");
const t = await p.innerText(".term-scroll");
const checks = [
  ["stack cites skills.md", /src: ~\/skills\.md/.test(t)],
  ["stack mentions agents/rag", /(agents, rag|rag, claude)/i.test(t)],
  ["are-you-sure is graceful", /offline mode/.test(t)],
  ["experience lists roles", /Founding AI Engineer at Lunon/.test(t)],
];
let f = 0; for (const [n, ok] of checks) { console.log(`${ok ? "PASS" : "FAIL"} ${n}`); if (!ok) f++; }
await b.close(); process.exit(f ? 1 : 0);
