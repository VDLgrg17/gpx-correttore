
import { GPXEngine } from './client/src/lib/gpx-engine';

async function runTests() {
  const engine = new GPXEngine({
    enableAntiBias: true,
    enableSpellCheck: true
  });

  const tests = [
    // Pattern 1: Stare + Gerundio
    { category: "Grammar Split", input: "alessandro stariposando.", expected: "Alessandro sta riposando." },
    { category: "Grammar Split", input: "staiandando via?", expected: "stai andando via?" },
    { category: "Grammar Split", input: "stavacorrere.", expected: "stavacorrere." }, // NO match (non finisce in ando/endo)
    { category: "Grammar Split", input: "stannomangiando.", expected: "stanno mangiando." },
    
    // Pattern 2: Ausiliare + Participio
    { category: "Grammar Split", input: "homangiato.", expected: "ho mangiato." },
    { category: "Grammar Split", input: "haidetto.", expected: "hai detto." }, // NO match (detto non finisce in ato/uto/ito) -> Aspetta, "detto" è irregolare!
    // La mia regola copre solo regolari (-ato, -uto, -ito). "detto" fallirà con la regola grammaticale pura, 
    // ma potrebbe passare se "detto" è nel dizionario (commonVerbs).
    // Verifichiamo se passa per dizionario o fallisce.
    
    { category: "Grammar Split", input: "èandato.", expected: "è andato." },
    { category: "Grammar Split", input: "sonopartito.", expected: "sono partito." },
    { category: "Grammar Split", input: "hannoavuto.", expected: "hanno avuto." },
    
    // Falsi positivi (Protezione)
    { category: "False Positives", input: "stazione.", expected: "stazione." }, // "sta" + "zione" (zione non finisce in ando/endo)
    { category: "False Positives", input: "stato.", expected: "stato." }, // "sta" + "to" (to troppo corto)
    { category: "False Positives", input: "danno.", expected: "danno." }, // "da" + "nno" (nno non è gerundio)
    
    // Integrazione con Capitalization
    { category: "Integration", input: "alessandro stariposando.", expected: "Alessandro sta riposando." }
  ];

  console.log("=== TEST SUITE v58 (Grammar Split) ===\n");

  let passed = 0;
  for (const t of tests) {
    const result = await engine.correctAsync(t.input);
    const output = result.corrected.trim();
    
    if (output === t.expected) {
      console.log(`✅ [${t.category}] PASS: "${t.input}" -> "${output}"`);
      passed++;
    } else {
      console.log(`❌ [${t.category}] FAIL: "${t.input}"`);
      console.log(`   Expected: "${t.expected}"`);
      console.log(`   Actual:   "${output}"`);
    }
  }

  console.log(`\nRisultati: ${passed}/${tests.length} test passati.`);
}

runTests().catch(console.error);
