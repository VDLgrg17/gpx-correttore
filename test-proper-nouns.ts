
import { GPXEngine } from './client/src/lib/gpx-engine';

async function runTests() {
  const engine = new GPXEngine({
    enableAntiBias: true,
    enableSpellCheck: true
  });

  const tests = [
    { input: "vado da marco.", expected: "vado da Marco." },
    { input: "ho visto giulia al parco.", expected: "ho visto Giulia al parco." },
    { input: "ieri ho incontrato john.", expected: "ieri ho incontrato John." },
    { input: "mary è andata a casa.", expected: "Mary è andata a casa." },
    { input: "il mio amico si chiama luca.", expected: "il mio amico si chiama Luca." },
    { input: "questo è un test per vedere se funziona.", expected: "questo è un test per vedere se funziona." }, // Controllo negativo
    { input: "marco è moltointelligente.", expected: "Marco è molto intelligente." } // Test combinato split + maiuscola
  ];

  console.log("Inizio test Proper Nouns Capitalization...\n");

  let passed = 0;
  for (const t of tests) {
    const result = await engine.correctAsync(t.input);
    const output = result.corrected.trim();
    
    if (output === t.expected) {
      console.log(`✅ PASS: "${t.input}" -> "${output}"`);
      passed++;
    } else {
      console.log(`❌ FAIL: "${t.input}"`);
      console.log(`   Expected: "${t.expected}"`);
      console.log(`   Actual:   "${output}"`);
    }
  }

  console.log(`\nRisultati: ${passed}/${tests.length} test passati.`);
}

runTests().catch(console.error);
