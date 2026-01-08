
import { GPXEngine } from './client/src/lib/gpx-engine';

async function runTests() {
  const engine = new GPXEngine({
    enableAntiBias: true,
    enableSpellCheck: true
  });

  const tests = [
    // Pattern 5: Verb Split (v61)
    { category: "Verb Split", input: "direiche va bene.", expected: "direi che va bene." }, // Condizionale + che
    { category: "Verb Split", input: "pensoche sia giusto.", expected: "penso che sia giusto." }, // Indicativo + che
    { category: "Verb Split", input: "credevoche fosse vero.", expected: "credevo che fosse vero." }, // Imperfetto + che
    { category: "Verb Split", input: "speriamoche piova.", expected: "speriamo che piova." }, // Congiuntivo/Ind + che
    { category: "Verb Split", input: "fammivedere.", expected: "fammi vedere." }, // Imperativo + infinito (fammi è "fa" + "mi", ma qui testiamo "fammi" se è nel dizionario o split multiplo)
    // "fammi" è "fa" + "mmi" (raddoppiamento). Questo è complesso.
    // Ma "fammi" potrebbe essere nel dizionario verbi? No, ho messo "fammi" in FARE.
    
    { category: "Verb Split", input: "vediamose funziona.", expected: "vediamo se funziona." },
    { category: "Verb Split", input: "andiamovia.", expected: "andiamo via." },
    { category: "Verb Split", input: "dammilo.", expected: "dammi lo." }, // "dammi" è in DARE.
    
    // Regressioni
    { category: "Regression", input: "stariposando.", expected: "sta riposando." },
    { category: "Regression", input: "proseguirenel bosco.", expected: "proseguire nel bosco." },
    
    // Falsi positivi
    { category: "False Positives", input: "anche.", expected: "anche." }, // "an" + "che". "an" non è verbo.
    { category: "False Positives", input: "fatiche.", expected: "fatiche." }, // "fati" + "che". "fati" non è verbo.
    { category: "False Positives", input: "amiche.", expected: "amiche." }, // "ami" + "che". "ami" è verbo (amare).
    // "amiche" -> "ami che"?
    // "ami" è verbo. "che" è glue word.
    // RISCHIO: "amiche" viene splittato in "ami che".
    // Dobbiamo gestire questo. "amiche" è parola valida.
    // Il check `isKnownWord("amiche")` dovrebbe prevenire lo split se viene fatto PRIMA.
    // Ma splitGluedWords viene chiamato su parole che potrebbero essere valide?
    // Nel flusso: `const corrected = this.splitGluedWords(word);`
    // Se `word` è valida, `splitGluedWords` dovrebbe ritornare `word`.
    // All'inizio di `splitGluedWords`: `if (commonWords.has(match)) return match;`
    // "amiche" è in commonWords? Probabilmente no (è plurale).
    // Se non è in commonWords, viene splittato.
    // Questo è un problema.
  ];

  console.log("=== TEST SUITE v61 (Verb Split) ===\n");

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
