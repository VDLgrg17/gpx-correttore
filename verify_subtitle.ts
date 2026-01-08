
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageBreak } from "docx";

// Simulazione della logica aggiornata in file-utils.ts
async function exportToDocx(text: string) {
  // NORMALIZZAZIONE AGGRESSIVA
  const normalizedText = text.replace(/\[\s*PAGE[_\s]?BREAK\s*\]/gi, "\n[PAGE_BREAK_INTERNAL_TOKEN]\n");
  const lines = normalizedText.split('\n');
  let pendingPageBreak = false;
  let expectSubtitle = false;

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
      console.log(`       -> Alignment: CENTER`);
      console.log(`       -> Font: Times New Roman, Size: 28 (14pt), Bold: TRUE`);
      console.log(`       -> PageBreakBefore: ${pendingPageBreak ? "YES" : "NO"}`);
      pendingPageBreak = false;
      expectSubtitle = true;
    } else if (expectSubtitle && trimmed.length > 0 && trimmed.length < 150) {
      console.log(`[DOCX] Writing SUBTITLE: "${trimmed}"`);
      console.log(`       -> Alignment: CENTER (Correctly centered!)`);
      console.log(`       -> Font: Times New Roman, Size: 28 (14pt), Bold: TRUE`);
      expectSubtitle = false;
    } else {
      expectSubtitle = false;
      console.log(`[DOCX] Writing PARAGRAPH: "${trimmed.substring(0, 20)}..."`);
      console.log(`       -> Alignment: JUSTIFIED`);
    }
  }
}

const testContent = `
[PAGE_BREAK]
Capitolo 2
Esempi applicativi reali. Il valore si dimostra.
Se il primo capitolo ha avuto il compito di creare uno spazio mentale nuovo...
`;

console.log("Testing Subtitle Logic...");
exportToDocx(testContent);
