
import { GPXEngine, DEFAULT_OPTIONS } from './client/src/lib/gpx-engine';

const engine = new GPXEngine(DEFAULT_OPTIONS);

const testCases = [
  {
    name: "User Example 1",
    input: "Oggi, per sopravvivere, l’uomo deve: scaldarsi. Nutrirsi. Proteggersi.",
    expected: "Oggi, per sopravvivere, l’uomo deve: scaldarsi, nutrirsi, proteggersi."
  },
  {
    name: "User Example 2",
    input: "Garantirsi un riparo. Produrre energia. Mantenere beni e relazioni.",
    expected: "Garantirsi un riparo, produrre energia, mantenere beni e relazioni." // Questo è più difficile senza i due punti espliciti, ma vediamo come si comporta
  },
  {
    name: "Mixed List",
    input: "Ecco cosa fare: correre. Saltare. E poi: dormire. Sognare.",
    expected: "Ecco cosa fare: correre, saltare. E poi: dormire, sognare."
  }
];

console.log("=== TEST COLON LIST REFLOW ===\n");

testCases.forEach(test => {
  console.log(`Testing: ${test.name}`);
  console.log(`Input:    "${test.input}"`);
  const result = engine.correct(test.input);
  console.log(`Output:   "${result.corrected}"`);
  
  // Normalizziamo per il confronto (ignoriamo differenze minime di spazi)
  const normalizedOutput = result.corrected.replace(/\s+/g, ' ').trim();
  const normalizedExpected = test.expected.replace(/\s+/g, ' ').trim();
  
  // Controllo lasco: verifichiamo se i punti sono diventati virgole
  const dotsOriginal = (test.input.match(/\./g) || []).length;
  const dotsOutput = (result.corrected.match(/\./g) || []).length;
  
  if (normalizedOutput === normalizedExpected) {
    console.log("✅ PASS: Output esatto.");
  } else if (dotsOutput < dotsOriginal) {
    console.log("⚠️ PARTIAL: Alcuni punti sono stati rimossi, ma l'output non è identico.");
    console.log(`   Expected: "${test.expected}"`);
  } else {
    console.log("❌ FAIL: Nessuna unione rilevata.");
    console.log(`   Expected: "${test.expected}"`);
  }
  console.log("-".repeat(40));
});
