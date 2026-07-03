// Normalizes public/resume.pdf metadata (title/author) so browsers show
// "Shaurya Gulati Resume" instead of whatever the export tool left behind
// (e.g. "Resume-V9.docx"). Runs in prebuild: swap the PDF anytime, the
// metadata self-heals on the next build.
import { readFileSync, writeFileSync } from "node:fs";
import { PDFDocument } from "pdf-lib";

const path = "public/resume.pdf";
const doc = await PDFDocument.load(readFileSync(path), { updateMetadata: false });
const wanted = "Shaurya Gulati Resume";
if (doc.getTitle() !== wanted) {
  doc.setTitle(wanted);
  doc.setAuthor("Shaurya Gulati");
  doc.setSubject("Resume");
  writeFileSync(path, await doc.save());
  console.log(`fix-pdf-meta: title set to "${wanted}"`);
} else {
  console.log("fix-pdf-meta: already clean");
}
