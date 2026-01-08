
import { GPXEngine } from './client/src/lib/gpx-engine';

async function runTests() {
  const engine = new GPXEngine({
    enableAntiBias: true,
    enableSpellCheck: true
  });

  const tests = [
    // Pattern 4: Preposition Anchor
    { category: "Prep Split", input: "proseguirenel seguente modo.", expected: "proseguire nel seguente modo." },
    { category: "Prep Split", input: "andareal mare.", expected: "andare al mare." },
    { category: "Prep Split", input: "saltaresul letto.", expected: "saltare sul letto." },
    { category: "Prep Split", input: "vengodal lavoro.", expected: "vengo dal lavoro." },
    { category: "Prep Split", input: "parlarecoi muri.", expected: "parlare coi muri." },
    { category: "Prep Split", input: "viverenei sogni.", expected: "vivere nei sogni." },
    
    // Falsi positivi (Protezione)
    { category: "False Positives", input: "tunnel.", expected: "tunnel." }, // "tun" + "nel". "tun" finisce per n (non vocale).
    { category: "False Positives", input: "colonnello.", expected: "colonnello." }, // "colon" + "nello". "nello" non è in safePrepositions.
    { category: "False Positives", input: "caramelle.", expected: "caramelle." }, // "cara" + "melle". "melle" non è in safePrepositions.
    { category: "False Positives", input: "sentinelle.", expected: "sentinelle." }, // "senti" + "nelle". "nelle" non è in safePrepositions.
    { category: "False Positives", input: "canale.", expected: "canale." }, // "can" + "ale". "ale" non è preposizione.
    { category: "False Positives", input: "animale.", expected: "animale." },
    { category: "False Positives", input: "ideale.", expected: "ideale." }, // "ide" + "ale".
    
    // Integrazione
    { category: "Integration", input: "proseguirenel seguente modo.", expected: "proseguire nel seguente modo." }
  ];

  console.log("=== TEST SUITE v60 (Preposition Split) ===\n");

  let passed = 0;
  for (const t of tests) {
    const result = await engine.correctAsync(t.input);
    const output = result.corrected.trim();
    
    if (output === t.expected) {
      console.log(`✅ [${t.category}] PASS: "${t.input}" -> "${output}"`);
      passed++;
    } else {
      console.log(`❌ [${t.category}] FAIL: "${t.input}"`);
      console.log(`   Expected: "${t.expected}"`);
      console.log(`   Actual:   "${output}"`);
    }
  }

  console.log(`\nRisultati: ${passed}/${tests.length} test passati.`);
}

runTests().catch(console.error);
