// Renders public/og.png (1200x630) from an inline SVG — paper & ink.
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#FAF8F4"/>
  <text x="96" y="150" font-family="Menlo, monospace" font-size="22" letter-spacing="6" fill="#8B867C">AI ENGINEER · AGENTS, RAG, EVALS · CMU '25</text>
  <text x="90" y="290" font-family="Georgia, serif" font-size="104" fill="#131311">Shaurya Gulati</text>
  <text x="96" y="370" font-family="Georgia, serif" font-size="34" font-style="italic" fill="#56524A">I build systems that think, and the products around them.</text>
  <rect x="90" y="440" width="560" height="110" rx="12" fill="#0D0D0B"/>
  <text x="122" y="485" font-family="Menlo, monospace" font-size="20" fill="#77736B">guest@shaurya ~ %<tspan fill="#E8E6E1">&#160;shaurya</tspan></text>
  <text x="122" y="522" font-family="Menlo, monospace" font-size="20" fill="#34D76F">▸ agent online. ask me anything.</text>
  <text x="1104" y="580" font-family="Menlo, monospace" font-size="18" fill="#8B867C" text-anchor="end">shauryagulati.dev</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync("public/og.png", png);
console.log(`og: public/og.png (${(png.length / 1024).toFixed(0)} kB)`);
