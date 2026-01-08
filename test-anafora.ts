
import { GPXEngine, DEFAULT_OPTIONS } from './client/src/lib/gpx-engine';

const engine = new GPXEngine(DEFAULT_OPTIONS);

const testCases = [
  { 
    input: "È un problema. È una sfida. È un'opportunità.", 
    expected: "È un problema, è una sfida, è un'opportunità." 
  },
  { 
    input: "Si tratta di capire. Si tratta di agire.", 
    expected: "Si tratta di capire, si tratta di agire." 
  },
  { 
    input: "Non voglio mangiare. Non voglio dormire.", 
    expected: "Non voglio mangiare, non voglio dormire." 
  },
  {
    input: "Il sole splende. Il vento soffia.",
    expected: "Il sole splende, il vento soffia."
  },
  // Caso negativo: parole diverse
  {
    input: "Oggi è bello. Domani piove.",
    expected: "Oggi è bello. Domani piove."
  }
];

console.log("=== ANAFORA MERGER TEST ===\n");

let passed = 0;
let failed = 0;

testCases.forEach(test => {
  const result = engine.correct(test.input);
  const output = result.corrected.trim();
  
  // Rimuovi eventuale punto finale aggiunto dal motore per il confronto
  const cleanOutput = output.replace(/\.$/, '');
  const cleanExpected = test.expected.replace(/\.$/, '');

  if (cleanOutput === cleanExpected) {
    console.log(`✅ PASS: "${test.input}" -> "${cleanOutput}"`);
    passed++;
  } else {
    console.log(`❌ FAIL: "${test.input}" -> "${cleanOutput}" (Expected: "${cleanExpected}")`);
    failed++;
  }
});

console.log(`\nTOTAL: ${testCases.length} | PASS: ${passed} | FAIL: ${failed}`);
if (failed > 0) process.exit(1);
