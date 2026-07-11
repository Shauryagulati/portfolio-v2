import { chromium } from "playwright";
const S = process.env.S;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 780 } });
await p.setContent(`<body style="margin:0;background:#161616;display:grid;grid-template-columns:450px 1fr;gap:16px;padding:14px">
<img src="file://${S}/profile/crt.svg" width="437">
<div><img src="file://${S}/profile/card.svg" width="520"><br><br><img src="file://${S}/profile/heatmap.svg" width="843"></div>
</body>`);
await p.waitForTimeout(4200); // boot + lines typed + cells revealed
await p.screenshot({ path: S + "/v2-preview.png" });
await b.close();
console.log("preview ok");
