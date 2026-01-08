import { GPXEngine, DEFAULT_OPTIONS } from './gpx-engine';

const engine = new GPXEngine(DEFAULT_OPTIONS);

const testCases = [
  {
    input: "Ecco il problema: La soluzione è semplice.",
    expected: "Ecco il problema: la soluzione è semplice."
  },
  {
    input: "Ho incontrato un amico: Mario è arrivato.",
    expected: "Ho incontrato un amico: Mario è arrivato." // Mario è nome proprio
  },
  {
    input: "Uso un tool: ChatGPT è utile.",
    expected: "Uso un tool: ChatGPT è utile." // ChatGPT è eccezione
  },
  {
    input: "Disse: «Ciao come stai?»",
    expected: "Disse: «Ciao come stai?»" // Discorso diretto (gestito da altre regole, ma qui verifichiamo che non rompa)
  },
  {
    input: "Analisi: Il risultato è positivo.",
    expected: "Analisi: il risultato è positivo."
  }
];

async function runTest() {
  console.log("Running Colon Capitalization Test...");
  let passed = 0;
  
  for (const test of testCases) {
    const result = await engine.correctAsync(test.input);
    // Rimuoviamo eventuali spazi extra o newline aggiunti dal motore per il confronto
    const cleanResult = result.corrected.trim();
    
    if (cleanResult === test.expected) {
      console.log(`PASS: "${test.input}" -> "${cleanResult}"`);
      passed++;
    } else {
      console.log(`FAIL: "${test.input}"`);
      console.log(`  Expected: "${test.expected}"`);
      console.log(`  Got:      "${cleanResult}"`);
    }
  }
  
  console.log(`\nResult: ${passed}/${testCases.length} passed.`);
}

runTest();
