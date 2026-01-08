
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageBreak } from "docx";

// --- MOCK DELLE FUNZIONI REALI ---

// 1. Simulazione GPXEngine (che potrebbe alterare gli spazi)
function simulateGPXCorrection(text: string): string {
  // Simula quello che fa il motore: normalizza spazi, corregge punteggiatura
  // Esempio critico: potrebbe aggiungere spazi intorno a [PAGE_BREAK]
  let processed = text.replace(/\[PAGE_BREAK\]/g, "[ PAGE_BREAK ]"); 
  return processed;
}

// 2. Simulazione Export Logic (quella che abbiamo appena fixato)
function simulateExport(text: string) {
  const lines = text.split('\n');
  let pendingPageBreak = false;
  let outputLog = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // REGEX ROBUSTA (La fix)
    if (/^\[\s*PAGE[_\s]?BREAK\s*\]$/i.test(trimmed)) {
      outputLog.push(`[SYSTEM] Found Page Break Marker: "${trimmed}" -> REMOVED from text, SET pendingPageBreak=true`);
      pendingPageBreak = true;
      continue;
    }

    // Riconoscimento Titoli
    const structuralTitles = ["introduzione", "prefazione", "premessa", "conclusione"];
    const isStructuralTitle = structuralTitles.includes(trimmed.toLowerCase());
    const isChapterTitle = /^Capitolo\s+\d+/i.test(trimmed) || isStructuralTitle;
    
    if (isChapterTitle) {
      outputLog.push(`[DOCX] Writing TITLE: "${trimmed}"`);
      outputLog.push(`       -> Bold: YES`);
      outputLog.push(`       -> Centered: YES`);
      outputLog.push(`       -> PageBreakBefore: ${pendingPageBreak ? "YES (CORRECT)" : "NO"}`);
      pendingPageBreak = false;
    } else {
      outputLog.push(`[DOCX] Writing PARAGRAPH: "${trimmed.substring(0, 30)}..."`);
      if (pendingPageBreak) {
         outputLog.push(`       -> PageBreakBefore: YES (Starts on new page)`);
         pendingPageBreak = false;
      }
    }
  }
  return outputLog;
}

// --- SCENARIO REALE UTENTE ---
const userScenarioText = `
Buona lettura!
Giorgio Demagistris
[PAGE_BREAK]
Capitolo 1
La fine del management tradizionale e la nascita del potere assistito
`;

console.log("=== SIMULAZIONE COMPLETA ===");
console.log("1. Testo Originale Utente:");
console.log(userScenarioText.trim());

console.log("\n2. Esecuzione Correzione GPX (Simulata):");
const correctedText = simulateGPXCorrection(userScenarioText);
console.log(correctedText.trim());

console.log("\n3. Generazione DOCX (Verifica Finale):");
const results = simulateExport(correctedText);
results.forEach(r => console.log(r));

// Verifica Automatica
const hasPageBreak = results.some(r => r.includes("PageBreakBefore: YES (CORRECT)"));
const markerRemoved = !results.some(r => r.includes("Writing PARAGRAPH: \"["));

console.log("\n=== ESITO ===");
if (hasPageBreak && markerRemoved) {
  console.log("✅ SUCCESSO: Il marker è stato rimosso e il Capitolo 1 inizia a pagina nuova.");
} else {
  console.log("❌ FALLIMENTO: Qualcosa non va.");
}
