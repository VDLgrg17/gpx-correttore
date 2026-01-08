
import { GPXEngine } from './client/src/lib/gpx-engine';

async function runTests() {
  const engine = new GPXEngine({
    enableAntiBias: true,
    enableSpellCheck: true
  });

  const tests = [
    // --- NUOVI TEST v57 (Proper Nouns & Split) ---
    { category: "Proper Nouns", input: "vado da marco.", expected: "vado da Marco." },
    { category: "Proper Nouns", input: "ho visto giulia al parco.", expected: "ho visto Giulia al parco." },
    { category: "Proper Nouns", input: "ieri ho incontrato john.", expected: "ieri ho incontrato John." },
    { category: "Proper Nouns", input: "mary è andata a casa.", expected: "Mary è andata a casa." },
    { category: "Proper Nouns", input: "il mio amico si chiama luca.", expected: "il mio amico si chiama Luca." },
    
    // Split + Capitalization
    { category: "Split+Cap", input: "marco è moltointelligente.", expected: "Marco è molto intelligente." },
    { category: "Split+Cap", input: "vado da marcoe luca.", expected: "vado da Marco e Luca." },
    { category: "Split+Cap", input: "ho vistomaria.", expected: "ho visto Maria." },
    
    // Falsi positivi
    { category: "False Positives", input: "il mare è bello.", expected: "il mare è bello." },
    { category: "False Positives", input: "vado a casa.", expected: "vado a casa." },
    
    // --- VECCHI TEST MIGRAZIONI (Adattati) ---
    // Reflow
    { category: "Reflow", input: "Oggi è una bella. Giornata di sole.", expected: "Oggi è una bella giornata di sole." },
    
    // Lists
    { category: "Lists", input: "Serve: pane. Latte. Uova.", expected: "Serve: pane, latte, uova." },
    { category: "Lists", input: "Serve: pane. Latte. E uova.", expected: "Serve: pane, latte, e uova." },
    
    // Named Entities (Artisti)
    { category: "Named Entities", input: "Vedi duchamp, fontana e manzoni.", expected: "Vedi Duchamp, Fontana e Manzoni." },
    
    // Anti-Bias
    { category: "Anti-Bias", input: "Attenzione: Il cane abbaia.", expected: "Attenzione: il cane abbaia." },
    { category: "Anti-Bias", input: "Attenzione: Duchamp è un artista.", expected: "Attenzione: Duchamp è un artista." },
    
    // Edge Cases
    { category: "Edge Cases", input: "Come dice (duchamp) nel suo libro.", expected: "Come dice (Duchamp) nel suo libro." }
  ];

  console.log("=== TEST SUITE v57 (Async) ===\n");

  let passed = 0;
  let failed = 0;

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
      failed++;
    }
  }

  console.log(`\nRisultati: ${passed}/${tests.length} test passati.`);
  
  if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
