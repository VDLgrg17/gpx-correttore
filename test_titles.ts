
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageBreak } from "docx";

// Simulazione della logica aggiornata in file-utils.ts
async function exportToDocx(text: string) {
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Euristica per titoli capitolo e sezioni strutturali
    const structuralTitles = ["introduzione", "prefazione", "premessa", "conclusione", "prologo", "epilogo", "ringraziamenti", "bibliografia", "indice"];
    const isStructuralTitle = structuralTitles.includes(trimmed.toLowerCase());
    
    const isChapterTitle = /^Capitolo\s+\d+/i.test(trimmed) || 
                           (trimmed.length < 50 && trimmed === trimmed.toUpperCase() && trimmed.length > 3) ||
                           isStructuralTitle;
    
    if (isChapterTitle) {
      console.log(`[TITLE DETECTED] "${trimmed}" -> Bold, Centered, Heading 1`);
    } else {
      console.log(`[TEXT] "${trimmed}"`);
    }
  }
}

const testContent = `
Introduzione
Questo è il testo dell'introduzione.
INTRODUZIONE
Anche questo deve essere un titolo.
Capitolo 1
Inizio del capitolo.
premessA
Testo misto.
`;

console.log("Testing Title Recognition Logic...");
exportToDocx(testContent);
