
import { GPXEngine } from './client/src/lib/gpx-engine';

async function runTests() {
  const engine = new GPXEngine({
    enableAntiBias: true,
    enableSpellCheck: true
  });

  const tests = [
    // Pattern 3: Adverb Anchor
    { category: "Adverb Split", input: "stefano dormegià.", expected: "Stefano dorme già." },
    { category: "Adverb Split", input: "non neogliopiù.", expected: "non ne voglio più." }, // "vogliopiù" -> "voglio più" (ma "neogliopiù" è complesso, forse "ne voglio più"?)
    // "neogliopiù" -> "neoglio" + "più". "neoglio" non esiste. 
    // Ma la regola Adverb Anchor splitta se finisce in vocale. "neoglio" finisce in o.
    // Quindi splitta in "neoglio più". Poi "neoglio" verrà corretto dallo spell checker?
    // No, lo spell checker agisce dopo.
    // Testiamo casi più semplici prima.
    
    { category: "Adverb Split", input: "nonvogliopiù.", expected: "non voglio più." }, // "vogliopiù" -> "voglio più"
    { category: "Adverb Split", input: "noncelhofatta.", expected: "non ce l'ho fatta." }, // Complesso
    
    { category: "Adverb Split", input: "andiamovia.", expected: "andiamo via." },
    { category: "Adverb Split", input: "corriqui.", expected: "corri qui." },
    { category: "Adverb Split", input: "guardalì.", expected: "guarda lì." },
    { category: "Adverb Split", input: "vado giù.", expected: "vado giù." }, // Già staccato
    { category: "Adverb Split", input: "vadogiù.", expected: "vado giù." },
    
    // Falsi positivi
    { category: "False Positives", input: "strategia.", expected: "strategia." }, // Finisce in "gia" (senza accento), ma "già" ha accento.
    // La mia lista ha "già" con accento. Quindi "strategia" non matcha "già".
    { category: "False Positives", input: "nostalgia.", expected: "nostalgia." },
    { category: "False Positives", input: "ormai.", expected: "ormai." }, // Finisce in "mai". "or" + "mai". "or" è valido? Sì (poetico).
    // "ormai" è una parola intera. La regola splitta se p1 finisce in vocale/liquida.
    // "or" finisce in r. Quindi splitta in "or mai".
    // Questo è un problema! "ormai" deve restare unito.
    // Soluzione: Se la parola intera è nel dizionario, NON splittare.
    // Ma splitGluedWords viene chiamato PRIMA del check dizionario?
    // No, splitGluedWords controlla se la parola intera è nel dizionario all'inizio.
    // Riga 486: if (commonWords.has(match.toLowerCase())) return match;
    // Quindi "ormai" è salvo SE è in commonWords.
    
    { category: "False Positives", input: "magia.", expected: "magia." }, // "ma" + "gia" (no accento)
    
    // Integrazione
    { category: "Integration", input: "stefano dormegià.", expected: "Stefano dorme già." }
  ];

  console.log("=== TEST SUITE v59 (Adverb Split) ===\n");

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
