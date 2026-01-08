
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageBreak } from "docx";
import fs from 'fs';

// Simulazione della logica attuale in file-utils.ts
async function exportToDocx(text: string, filename: string) {
  const lines = text.split('\n');
  const children = [];
  let emptyLineCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Gestione Page Break esplicito
    if (trimmed === "[PAGE_BREAK]") {
      console.log("Found [PAGE_BREAK]");
      children.push(new Paragraph({ children: [new PageBreak()] }));
      emptyLineCount = 0;
      continue;
    }

    // Ignora righe vuote per evitare spazi eccessivi
    if (!trimmed) {
      continue;
    }

    // Euristica per titoli capitolo (LOGICA ATTUALE)
    const isChapterTitle = /^Capitolo\s+\d+/i.test(trimmed) || (trimmed.length < 50 && trimmed === trimmed.toUpperCase() && trimmed.length > 3);
    
    if (isChapterTitle) {
      console.log(`Found Chapter Title: "${trimmed}"`);
      children.push(
        new Paragraph({
          text: trimmed,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 400,
            after: 300,
          },
          run: {
            font: "Times New Roman",
            bold: true,
            size: 32, // 16pt
          }
        })
      );
    } else {
      children.push(
        new Paragraph({
          text: trimmed,
          alignment: AlignmentType.JUSTIFIED,
          spacing: {
            line: 360,
            after: 0,
          }
        })
      );
    }
  }
}

// Test case basato sul file dell'utente
const testContent = `
Buona lettura!
Giorgio Demagistris
[PAGE_BREAK]
Capitolo 1
La fine del management tradizionale e la nascita del potere assistito
`;

console.log("Testing export logic...");
exportToDocx(testContent, "test_output.docx");
