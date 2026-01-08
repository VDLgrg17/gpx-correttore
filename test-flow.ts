
import { GPXEngine } from './client/src/lib/gpx-engine';

const engine = new GPXEngine();

async function runTests() {
  const tests = [
    {
      input: "Non è un buon amico. E' un opportunista. Ti cerca solo per convenienza.",
      expected: "Non è un buon amico, è un opportunista e ti cerca solo per convenienza.", // Nota: "Ti" -> "e ti" è difficile, ma vediamo cosa fa
      // La mia logica attuale:
      // "Non è un buon amico. E' un opportunista." -> "Non è un buon amico, è un opportunista." (Regola È)
      // ". Ti cerca" -> Non ho messo regola per "Ti".
      // Vediamo cosa esce.
    },
    {
      input: "Non è un buon amico. È un opportunista.",
      expected: "Non è un buon amico, è un opportunista."
    },
    {
      input: "Volevo venire. Ma non potevo.",
      expected: "Volevo venire, ma non potevo."
    },
    {
      input: "Era bello. E costoso.",
      expected: "Era bello e costoso."
    },
    {
      input: "Era bello. Ed economico.",
      expected: "Era bello ed economico."
    },
    {
      input: "Penso. Quindi sono.",
      expected: "Penso, quindi sono."
    }
  ];

  console.log("Running Sentence Flow Tests (v62)...\n");
  let passed = 0;

  for (const t of tests) {
    const result = await engine.correctAsync(t.input);
    const output = result.corrected.trim();
    
    // Normalizziamo output per confronto (spazi multipli già rimossi dall'engine)
    
    console.log(`Input:    "${t.input}"`);
    console.log(`Output:   "${output}"`);
    
    // Check parziale per il primo caso complesso
    if (t.input.includes("Ti cerca")) {
        if (output.includes(", è un opportunista")) {
            console.log("✅ Partial Success: 'È' merged correctly.");
        } else {
            console.log("❌ Fail: 'È' not merged.");
        }
    } else {
        if (output === t.expected) {
            console.log("✅ PASS");
            passed++;
        } else {
            console.log(`❌ FAIL (Expected: "${t.expected}")`);
        }
    }
    console.log("---");
  }
}

runTests();
