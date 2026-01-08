
import { GPXEngine } from './client/src/lib/gpx-engine';

const engine = new GPXEngine();

const testCases = [
  { input: "Marcoera stanco.", expected: "Marco era stanco." },
  { input: "Ha deciso diriposare un po'.", expected: "Ha deciso di riposare un po'." },
  { input: "Nonc'è problema.", expected: "Non c'è problema." }, // Questo potrebbe richiedere gestione apostrofo
  { input: "Vorrei sapere chefare adesso.", expected: "Vorrei sapere che fare adesso." },
  { input: "Il problemaè risolto.", expected: "Il problema è risolto." },
  { input: "Andava velocemente a casa.", expected: "Andava velocemente a casa." }, // NO split (mente)
  { input: "Era un canera.", expected: "Era un canera." }, // NO split (ra non comune o cane+ra non sensato)
  { input: "La figurazione era bella.", expected: "La figurazione era bella." }, // NO split (figura+zione)
  { input: "Il capotreno fischia.", expected: "Il capotreno fischia." } // NO split (capo+treno, entrambi validi ma non compatibili per split)
];

console.log("=== TEST WORD SPLITTER (v54) ===\n");

testCases.forEach((test, i) => {
  const result = engine.correct(test.input);
  const passed = result.corrected === test.expected;
  
  console.log(`Test ${i + 1}: "${test.input}"`);
  if (passed) {
    console.log(`✅ PASS: "${result.corrected}"`);
  } else {
    console.log(`❌ FAIL: Got "${result.corrected}", expected "${test.expected}"`);
  }
  console.log("---");
});
