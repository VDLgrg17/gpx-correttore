
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageBreak } from "docx";

// Simulazione della logica aggiornata in file-utils.ts
async function exportToDocx(text: string) {
  // NORMALIZZAZIONE AGGRESSIVA
  const normalizedText = text.replace(/\[\s*PAGE[_\s]?BREAK\s*\]/gi, "\n[PAGE_BREAK_INTERNAL_TOKEN]\n");
  const lines = normalizedText.split('\n');
  let pendingPageBreak = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed === "[PAGE_BREAK_INTERNAL_TOKEN]") {
      console.log(`[SYSTEM] Page Break Token Found -> Setting pendingPageBreak=true`);
      pendingPageBreak = true;
      continue;
    }

    if (!trimmed) continue;

    const structuralTitles = ["introduzione", "prefazione", "premessa", "conclusione"];
    const isStructuralTitle = structuralTitles.includes(trimmed.toLowerCase());
    const isChapterTitle = /^Capitolo\s+\d+/i.test(trimmed) || isStructuralTitle;
    
    if (isChapterTitle) {
      console.log(`[DOCX] Writing TITLE: "${trimmed}"`);
      console.log(`       -> Alignment: CENTER (Manual)`);
      console.log(`       -> Font: Times New Roman, Size: 32 (16pt), Bold: TRUE (Manual)`);
      console.log(`       -> PageBreakBefore: ${pendingPageBreak ? "YES" : "NO"}`);
      pendingPageBreak = false;
    } else {
      console.log(`[DOCX] Writing PARAGRAPH: "${trimmed.substring(0, 20)}..."`);
      pendingPageBreak = false;
    }
  }
}

const testContent = `
[PAGE_BREAK]
Capitolo 1
Testo del capitolo.
[ page break ]
INTRODUZIONE
Testo introduzione.
`;

console.log("Testing Manual Formatting Logic...");
exportToDocx(testContent);
