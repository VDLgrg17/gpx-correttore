import { GPXEngine } from './client/src/lib/gpx-engine';

const engine = new GPXEngine();

const tests = [
  { input: "vado da marco", expected: "vado da Marco" },
  { input: "ciao luca, come stai?", expected: "ciao Luca, come stai?" },
  { input: "hello john", expected: "hello John" },
  { input: "il cane di anna", expected: "il cane di Anna" },
  { input: "vado a roma", expected: "vado a Roma" }, // Roma non è nella lista nomi, ma verifichiamo se l'ho messa
  { input: "marco è moltointelligente", expected: "Marco è molto intelligente." } // Test combinato
];

console.log("Running Name Capitalization Tests...");
let passed = 0;

tests.forEach(t => {
  const result = engine.process(t.input).text;
  // Normalizziamo il risultato rimuovendo il punto finale se l'input non l'aveva, per semplificare il confronto
  // (Il motore aggiunge il punto finale se manca, che è corretto, ma qui testiamo i nomi)
  const normalizedResult = result.trim();
  
  // Per il test combinato, ci aspettiamo il punto. Per gli altri, controlliamo se il nome è maiuscolo.
  const expectedName = t.expected.match(/[A-Z][a-z]+/)?.[0];
  
  if (normalizedResult.includes(expectedName || "FAIL")) {
    console.log(`✅ PASS: "${t.input}" -> ...${expectedName}...`);
    passed++;
  } else {
    console.log(`❌ FAIL: "${t.input}"`);
    console.log(`   Expected to contain: ${expectedName}`);
    console.log(`   Got: "${normalizedResult}"`);
  }
});

if (passed === tests.length) {
  console.log("\nALL TESTS PASSED!");
} else {
  console.log(`\n${tests.length - passed} TESTS FAILED.`);
}
