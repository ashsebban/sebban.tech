import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const sourcePdf = path.join(rootDir, "public", "images", "asher_sebban_resume.pdf");
const outputTxt = path.join(rootDir, "public", "resume-content.txt");

function normalizeLine(line) {
  return line.replace(/\s+/g, " ").trim();
}

async function extractTextFromPdf() {
  let pdfjs;
  try {
    pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  } catch (error) {
    const message = String(error?.message || "");
    if (message.includes("Cannot find package 'pdfjs-dist'")) {
      throw new Error(
        "Missing dependency: pdfjs-dist. Run `npm install` to enable resume text extraction.",
      );
    }
    throw error;
  }

  const pdfData = new Uint8Array(await fs.readFile(sourcePdf));
  const loadingTask = pdfjs.getDocument({ data: pdfData, useSystemFonts: true });
  const pdf = await loadingTask.promise;

  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    const lines = [];
    let currentLine = [];
    let previousY = null;

    for (const item of textContent.items) {
      if (!("str" in item)) continue;

      const y = item.transform?.[5] ?? previousY;
      if (
        previousY !== null &&
        y !== null &&
        Math.abs(y - previousY) > 2 &&
        currentLine.length > 0
      ) {
        lines.push(normalizeLine(currentLine.join(" ")));
        currentLine = [];
      }

      if (item.str.trim().length > 0) {
        currentLine.push(item.str);
      }

      previousY = y;
    }

    if (currentLine.length > 0) {
      lines.push(normalizeLine(currentLine.join(" ")));
    }

    pages.push(lines.filter(Boolean).join("\n"));
  }

  return pages.filter(Boolean).join("\n\n").trim();
}

async function main() {
  try {
    const extracted = await extractTextFromPdf();
    await fs.writeFile(outputTxt, `${extracted}\n`, "utf8");
    console.log(
      `Extracted resume text from ${path.relative(rootDir, sourcePdf)} -> ${path.relative(
        rootDir,
        outputTxt,
      )}`,
    );
  } catch (error) {
    console.error("Resume text extraction failed.");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

await main();
