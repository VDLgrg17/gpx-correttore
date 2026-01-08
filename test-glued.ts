
import { GPXEngine, DEFAULT_OPTIONS } from './client/src/lib/gpx-engine';

const engine = new GPXEngine(DEFAULT_OPTIONS);

const testCases = [
  { input: "orinatoiocioè", expected: "orinatoio cioè" },
  { input: "concettualenon", expected: "concettuale non" },
  { input: "figuranon", expected: "figura non" },
  { input: "problemaè", expected: "problema è" },
  { input: "fattoche", expected: "fatto che" },
  // Eccezioni che NON devono essere separate
  { input: "perché", expected: "perché" },
  { input: "poiché", expected: "poiché" },
  { input: "caffè", expected: "caffè" },
  { input: "problema", expected: "problema" },
  { input: "inglese", expected: "inglese" }
];

console.log("=== GLUED WORD SPLITTER TEST ===\n");

let passed = 0;
let failed = 0;

testCases.forEach(test => {
  const result = engine.correct(test.input);
  const output = result.corrected.trim();
  
  // Rimuovi eventuale punto finale aggiunto dal motore
  const cleanOutput = output.replace(/\.$/, '');

  if (cleanOutput === test.expected) {
    console.log(`✅ PASS: "${test.input}" -> "${cleanOutput}"`);
    passed++;
  } else {
    console.log(`❌ FAIL: "${test.input}" -> "${cleanOutput}" (Expected: "${test.expected}")`);
    failed++;
  }
});

console.log(`\nTOTAL: ${testCases.length} | PASS: ${passed} | FAIL: ${failed}`);
if (failed > 0) process.exit(1);
