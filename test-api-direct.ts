import { analyzeText } from "./server/ai-supervisor";

const testText = "Domani ti chiamo e ti spiego tutto. Ti proporrò tre soluzioni: la prima risolve il problema, la seconda migliora le prestazioni.";

async function main() {
  console.log("=== TEST DIRETTO API SUPERVISORE AI ===\n");
  console.log("Testo di input:");
  console.log(testText);
  console.log("\n--- Invio richiesta all'API ---\n");
  
  try {
    const result = await analyzeText(testText);
    console.log("=== RISPOSTA ===\n");
    console.log("Testo corretto:");
    console.log(result.correctedText);
    console.log("\nCorrezioni rilevate:", result.changes.length);
    if (result.changes.length > 0) {
      console.log("\nDettaglio correzioni:");
      result.changes.forEach((c, i) => {
        console.log(`\n${i + 1}. "${c.original}" → "${c.corrected}"`);
        console.log(`   Motivo: ${c.reason}`);
      });
    }
  } catch (error) {
    console.error("ERRORE:", error);
  }
}

main();
