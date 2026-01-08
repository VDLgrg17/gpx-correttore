
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageBreak } from "docx";

// Simulazione della logica aggiornata in file-utils.ts
async function exportToDocx(text: string) {
  const normalizedText = text.replace(/\[\s*PAGE[_\s]?BREAK\s*\]/gi, "\n[PAGE_BREAK_INTERNAL_TOKEN]\n");
  const lines = normalizedText.split('\n');
  let pendingPageBreak = false;
  let expectSubtitle = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isChapterTitle = /^Capitolo\s+\d+/i.test(trimmed);
    
    if (isChapterTitle) {
      console.log(`[DOCX] Writing TITLE: "${trimmed}"`);
      expectSubtitle = true;
    } else if (expectSubtitle && trimmed.length > 0 && trimmed.length < 150) {
      console.log(`[DOCX] Writing SUBTITLE: "${trimmed}"`);
      expectSubtitle = false;
    } else {
      expectSubtitle = false;
      
      // REGOLA DEI 3 PERIODI
      const sentences = trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed];
      console.log(`[DOCX] Processing Paragraph with ${sentences.length} sentences...`);
      
      let currentChunk: string[] = [];
      let sentenceCount = 0;
      let chunkIndex = 1;

      for (const sentence of sentences) {
        currentChunk.push(sentence.trim());
        sentenceCount++;

        if (sentenceCount === 3) {
          console.log(`       -> Chunk ${chunkIndex}: "${currentChunk.join(' ').substring(0, 30)}..." (3 sentences)`);
          console.log(`          [ACTION] Inserting Spacing After Block (12pt)`);
          currentChunk = [];
          sentenceCount = 0;
          chunkIndex++;
        }
      }

      if (currentChunk.length > 0) {
        console.log(`       -> Chunk ${chunkIndex}: "${currentChunk.join(' ').substring(0, 30)}..." (${currentChunk.length} sentences)`);
      }
    }
  }
}

const testContent = `
Capitolo 3
Il Potere della Pratica
Questa è la prima frase. Questa è la seconda frase. Questa è la terza frase. Questa è la quarta frase. Questa è la quinta frase. Questa è la sesta frase. Questa è la settima frase.
`;

console.log("Testing 3-Sentence Rule...");
exportToDocx(testContent);
