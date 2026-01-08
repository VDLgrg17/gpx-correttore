
import { GPXEngine } from './client/src/lib/gpx-engine';

const engine = new GPXEngine();

async function runTests() {
  const tests = [
    // Test Ha/A Context
    {
      input: "Lui a detto che viene.",
      expected: "Lui ha detto che viene.",
      desc: "a + participio -> ha"
    },
    {
      input: "Vado ha mangiare.",
      expected: "Vado a mangiare.",
      desc: "ha + infinito -> a"
    },
    {
      input: "Vado ha casa.",
      expected: "Vado a casa.",
      desc: "ha + luogo -> a"
    },
    {
      input: "Luca a mangiato tutto.",
      expected: "Luca ha mangiato tutto.",
      desc: "a + mangiato -> ha"
    },
    // Test Sentence Flow (Regression Check)
    {
      input: "Non è giusto. È sbagliato.",
      expected: "Non è giusto, è sbagliato.",
      desc: "Sentence Flow: È"
    },
    {
      input: "Bello. Ma costoso.",
      expected: "Bello, ma costoso.",
      desc: "Sentence Flow: Ma"
    }
  ];

  console.log("Running GPX v63 Tests (Ha/A & Flow)...\n");
  let passed = 0;

  for (const t of tests) {
    const result = await engine.correctAsync(t.input);
    const output = result.corrected.trim();
    
    if (output === t.expected) {
        console.log(`✅ PASS: ${t.desc}`);
        passed++;
    } else {
        console.log(`❌ FAIL: ${t.desc}`);
        console.log(`   Input:    "${t.input}"`);
        console.log(`   Expected: "${t.expected}"`);
        console.log(`   Actual:   "${output}"`);
    }
  }
  
  console.log(`\nPassed: ${passed}/${tests.length}`);
}

runTests();
