
// Mock File class for testing
class MockFile {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

function sortFiles(files: any[]): any[] {
  return files.sort((a, b) => {
    // Gestione priorità per Introduzione, Premessa, Prefazione
    const priorityWords = ["introduzione", "premessa", "prefazione", "prologo", "avvertenza"];
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    
    const priorityA = priorityWords.findIndex(w => nameA.includes(w));
    const priorityB = priorityWords.findIndex(w => nameB.includes(w));
    
    // Se entrambi sono prioritari, mantieni ordine relativo alla lista
    if (priorityA !== -1 && priorityB !== -1) return priorityA - priorityB;
    // Se solo A è prioritario, viene prima
    if (priorityA !== -1) return -1;
    // Se solo B è prioritario, viene prima
    if (priorityB !== -1) return 1;

    const numA = extractNumber(a.name);
    const numB = extractNumber(b.name);
    
    if (numA !== null && numB !== null) {
      return numA - numB;
    }
    return a.name.localeCompare(b.name);
  });
}

function extractNumber(name: string): number | null {
  const match = name.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

const files = [
  new MockFile("ManusCAPITOLO5.docx"),
  new MockFile("Manus-CAPITOLO1.docx"),
  new MockFile("ManusINTRODUZIONE.docx"),
  new MockFile("ManusCAPITOLO3.docx"),
  new MockFile("ManusCAPITOLO2.docx"),
  new MockFile("ManusCAPITOLO4.docx")
];

console.log("Ordine originale:");
files.forEach(f => console.log(f.name));

const sorted = sortFiles([...files]);

console.log("\nOrdine dopo sort:");
sorted.forEach(f => console.log(f.name));

// Verifica correttezza
const expected = [
  "ManusINTRODUZIONE.docx",
  "Manus-CAPITOLO1.docx",
  "ManusCAPITOLO2.docx",
  "ManusCAPITOLO3.docx",
  "ManusCAPITOLO4.docx",
  "ManusCAPITOLO5.docx"
];

const isCorrect = sorted.every((f, i) => f.name === expected[i]);
console.log("\nTest superato:", isCorrect);
