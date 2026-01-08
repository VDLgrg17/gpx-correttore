
import { GPXEngine, DEFAULT_OPTIONS } from './client/src/lib/gpx-engine';

const engine = new GPXEngine(DEFAULT_OPTIONS);

const testCases = [
  {
    name: "User Example - Artists",
    input: "ed è esattamente ciò che spiega: duchamp, fontana, manzoni, cage, koons, hirst, banksy.",
    expected: "ed è esattamente ciò che spiega: Duchamp, Fontana, Manzoni, Cage, Koons, Hirst, Banksy."
  },
  {
    name: "Philosophers & Others",
    input: "come diceva nietzsche, o forse era kant.",
    expected: "come diceva Nietzsche, o forse era Kant."
  },
  {
    name: "Mixed Context",
    input: "il concetto di fontana e la merda d'artista di manzoni.",
    expected: "il concetto di Fontana e la merda d'artista di Manzoni."
  }
];

console.log("=== TEST NAMED ENTITIES ===\n");

testCases.forEach(test => {
  console.log(`Testing: ${test.name}`);
  console.log(`Input:    "${test.input}"`);
  const result = engine.correct(test.input);
  console.log(`Output:   "${result.corrected}"`);
  
  // Normalizziamo per il confronto
  const normalizedOutput = result.corrected.replace(/\s+/g, ' ').trim();
  const normalizedExpected = test.expected.replace(/\s+/g, ' ').trim();
  
  // Verifica se i nomi attesi sono presenti (case sensitive)
  const missingCapitalizations = [];
  const expectedNames = test.expected.match(/[A-Z][a-z]+/g) || [];
  
  expectedNames.forEach(name => {
    if (!result.corrected.includes(name)) {
      missingCapitalizations.push(name);
    }
  });
  
  if (missingCapitalizations.length === 0) {
    console.log("✅ PASS: Tutti i nomi sono stati capitalizzati.");
  } else {
    console.log("❌ FAIL: Nomi mancanti o minuscoli:", missingCapitalizations.join(", "));
  }
  console.log("-".repeat(40));
});
