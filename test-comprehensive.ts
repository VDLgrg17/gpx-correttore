
import { GPXEngine, DEFAULT_OPTIONS } from './client/src/lib/gpx-engine';

const engine = new GPXEngine(DEFAULT_OPTIONS);

interface TestCase {
  category: string;
  name: string;
  input: string;
  expected: string | RegExp; // Stringa esatta o Regex per flessibilità
}

const testCases: TestCase[] = [
  // 1. REFLOW & RESPIRO
  {
    category: "Reflow",
    name: "Basic Sentence Merge",
    input: "Oggi è una bella. Giornata di sole.",
    expected: "Oggi è una bella giornata di sole."
  },
  {
    category: "Reflow",
    name: "Short Sentence Exception",
    input: "Sì. No. Forse.",
    expected: "Sì. No. Forse." // Frasi molto brevi non dovrebbero essere unite se hanno senso compiuto (o forse sì? Dipende dalla logica attuale)
  },

  // 2. LIST DETECTION
  {
    category: "Lists",
    name: "Standard List",
    input: "Serve: pane. Latte. Uova.",
    expected: "Serve: pane, latte, uova."
  },
  {
    category: "Lists",
    name: "Mixed List with Conjunction",
    input: "Serve: pane. Latte. E uova.",
    expected: "Serve: pane, latte, e uova."
  },
  {
    category: "Lists",
    name: "Colon List Reflow (User Case)",
    input: "L’uomo deve: scaldarsi. Nutrirsi. Proteggersi.",
    expected: "L’uomo deve: scaldarsi, nutrirsi, proteggersi."
  },

  // 3. NAMED ENTITIES (The Critical One)
  {
    category: "Named Entities",
    name: "Artists Lowercase",
    input: "Vedi duchamp, fontana e manzoni.",
    expected: "Vedi Duchamp, Fontana e Manzoni."
  },
  {
    category: "Named Entities",
    name: "After Colon (Conflict Check)",
    input: "Artisti: duchamp. Fontana. Manzoni.",
    expected: "Artisti: Duchamp, Fontana, Manzoni." // Deve unire (regola lista) MA mantenere maiuscola (regola Entity)
  },
  {
    category: "Named Entities",
    name: "Mixed Context",
    input: "Il concetto di fontana è diverso da quello di nietzsche.",
    expected: "Il concetto di Fontana è diverso da quello di Nietzsche."
  },

  // 4. ANTI-BIAS vs NAMED ENTITIES
  {
    category: "Anti-Bias",
    name: "Common Word after Colon",
    input: "Attenzione: Il cane abbaia.",
    expected: "Attenzione: il cane abbaia." // Deve diventare minuscolo
  },
  {
    category: "Anti-Bias",
    name: "Named Entity after Colon",
    input: "Attenzione: Duchamp è un artista.",
    expected: "Attenzione: Duchamp è un artista." // Deve restare Maiuscolo
  },
  {
    category: "Anti-Bias",
    name: "Lowercase Entity after Colon",
    input: "Attenzione: duchamp è un artista.",
    expected: "Attenzione: Duchamp è un artista." // Deve diventare Maiuscolo
  },

  // 5. EDGE CASES
  {
    category: "Edge Cases",
    name: "Parentheses",
    input: "Come dice (duchamp) nel suo libro.",
    expected: "Come dice (Duchamp) nel suo libro."
  },
  {
    category: "Edge Cases",
    name: "Quotes",
    input: 'Disse "fontana" e poi tacque.',
    expected: /Disse [“"«]Fontana[”"»] e poi tacque\./ // Accetta vari tipi di virgolette
  },
  {
    category: "Edge Cases",
    name: "Abbreviations",
    input: "Vedi pag. 5 o art. 3 del codice.",
    expected: "Vedi pag. 5 o art. 3 del codice." // Non deve espandere o rompere su pag.
  }
];

console.log("=== COMPREHENSIVE SIMULATION SUITE ===\n");

let passed = 0;
let failed = 0;

testCases.forEach(test => {
  const result = engine.correct(test.input);
  const output = result.corrected.trim();
  
  let isPass = false;
  if (typeof test.expected === 'string') {
    isPass = output === test.expected;
  } else {
    isPass = test.expected.test(output);
  }

  if (isPass) {
    console.log(`✅ [${test.category}] ${test.name}`);
    passed++;
  } else {
    console.log(`❌ [${test.category}] ${test.name}`);
    console.log(`   Input:    "${test.input}"`);
    console.log(`   Expected: "${test.expected}"`);
    console.log(`   Actual:   "${output}"`);
    failed++;
  }
});

console.log("\n" + "=".repeat(40));
console.log(`TOTAL: ${testCases.length} | PASS: ${passed} | FAIL: ${failed}`);
console.log("=".repeat(40));

if (failed > 0) {
  process.exit(1);
}
