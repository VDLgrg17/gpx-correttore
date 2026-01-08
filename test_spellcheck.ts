
import { GPXEngine } from './client/src/lib/gpx-engine';

const engine = new GPXEngine();

const testCases = [
  { input: "managementt", expected: "management", desc: "Doppia consonante finale (inglese)" },
  { input: "sportt", expected: "sport", desc: "Doppia consonante finale (sport)" },
  { input: "jazz", expected: "jazz", desc: "Parola corretta con doppia consonante (jazz)" },
  { input: "watt", expected: "watt", desc: "Parola corretta con doppia consonante (watt)" },
  { input: "ca sa", expected: "casa", desc: "Parola spezzata (ca sa)" },
  { input: "in sieme", expected: "insieme", desc: "Parola spezzata (in sieme)" },
  { input: "a casa", expected: "a casa", desc: "Falso positivo (a casa)" },
  { input: "di lato", expected: "di lato", desc: "Falso positivo (di lato)" },
  { input: "casaa", expected: "casa", desc: "Doppia vocale finale (casaa)" },
  { input: "perchéé", expected: "perché", desc: "Doppia vocale accentata (perchéé)" }
];

console.log("=== TEST CORRETTORE ORTOGRAFICO GPX ===");

let passed = 0;
let failed = 0;

testCases.forEach(test => {
  const result = engine.correct(test.input);
  const output = result.corrected.trim();
  
  if (output === test.expected) {
    console.log(`✅ PASS: ${test.desc} -> "${output}"`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${test.desc}`);
    console.log(`   Input: "${test.input}"`);
    console.log(`   Expected: "${test.expected}"`);
    console.log(`   Actual:   "${output}"`);
    failed++;
  }
});

console.log(`\nRisultati: ${passed} passati, ${failed} falliti.`);
