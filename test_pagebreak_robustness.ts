
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageBreak } from "docx";

// Simulazione della logica ROBUSTA in file-utils.ts
async function exportToDocx(text: string) {
  const lines = text.split('\n');
  let pendingPageBreak = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Regex robusta
    if (/^\[\s*PAGE[_\s]?BREAK\s*\]$/i.test(trimmed)) {
      console.log(`[PAGE BREAK DETECTED] "${trimmed}" -> Setting pendingPageBreak = true`);
      pendingPageBreak = true;
      continue;
    }

    if (pendingPageBreak) {
      console.log(`[TEXT AFTER BREAK] "${trimmed}" (Starts on new page)`);
      pendingPageBreak = false;
    } else {
      console.log(`[TEXT] "${trimmed}"`);
    }
  }
}

const testContent = `
Fine capitolo precedente.
[PAGE_BREAK]
Capitolo 1 (Standard)
Fine capitolo 1.
[ PAGE_BREAK ]
Capitolo 2 (Con spazi)
Fine capitolo 2.
[page_break]
Capitolo 3 (Minuscolo)
Fine capitolo 3.
[PAGE BREAK]
Capitolo 4 (Senza underscore)
`;

console.log("Testing Robust Page Break Logic...");
exportToDocx(testContent);
