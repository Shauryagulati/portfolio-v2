import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await p.waitForTimeout(5000); // engine live, frames streaming at final density
const text = await p.locator(".ascii-static").textContent();
await b.close();
writeFileSync("app/components/crt-frame.ts",
  "/** One frozen frame of the ASCII CRT, captured from the LIVE renderer\n" +
  " *  at production density, so the idle-time swap to live frames is\n" +
  " *  pixel-compatible: same grid, same font metrics, no LCP re-entry. */\n" +
  "export const CRT_FRAME = " + JSON.stringify(text) + ";\n");
const rows = text.split("\n");
console.log("refrozen:", rows.length, "rows x", rows[0]?.length, "cols");
