import { GPXEngine, DEFAULT_OPTIONS } from './gpx-engine';

const engine = new GPXEngine(DEFAULT_OPTIONS);

const testCases = [
  {
    input: "Ci vediamo all'ora stabilita.",
    expected: "Ci vediamo all'ora stabilita."
  },
  {
    input: "L'albero è alto.",
    expected: "L'albero è alto."
  },
  {
    input: "Un'amica simpatica.",
    expected: "Un'amica simpatica."
  },
  {
    input: "D'accordo.",
    expected: "D'accordo."
  },
  {
    input: "Po' di tempo.",
    expected: "Po' di tempo."
  },
  {
    input: "all’ora", // Apostrofo curvo
    expected: "all'ora" // Dovrebbe normalizzarlo a dritto o mantenerlo, ma non rimuoverlo
  },
  {
    input: "all' ora", // Spazio dopo apostrofo (errore comune)
    expected: "all'ora" // Dovrebbe unire
  },
  {
    input: "all’ ora", // Apostrofo curvo + spazio
    expected: "all'ora"
  },
  {
    input: "all`ora", // Backtick
    expected: "all'ora"
  },
  {
    input: "all´ora", // Accento acuto
    expected: "all'ora"
  },
  {
    input: "all'ora", // Standard
    expected: "all'ora"
  }
];

async function runTest() {
  console.log("Running Apostrophe Removal Test...");
  let passed = 0;
  
  for (const test of testCases) {
    const result = await engine.correctAsync(test.input);
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
