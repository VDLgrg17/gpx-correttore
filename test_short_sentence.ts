
import { GPXEngine } from './client/src/lib/gpx-engine';

const engine = new GPXEngine();
const testText = "Il danzatore è artista perché il corpo è la forma. L’attore è artista perché il corpo parla. Il poeta no. Come facciamo a rimediare con il codice qui?";

console.log("Originale:", testText);
const result = engine.correct(testText);
console.log("Corretto:", result.corrected);

// Verifica: Non ci dovrebbero essere doppi a capo (\n\n) dopo "Il poeta no."
// Perché:
// 1. "Il danzatore..." (Lunga) -> count=1
// 2. "L'attore..." (Lunga) -> count=2
// 3. "Il poeta no." (Breve, 3 parole) -> count resta 2
// 4. "Come facciamo..." (Lunga) -> count=3 -> QUI scatta \n\n

if (result.corrected.includes("Il poeta no. Come facciamo")) {
    console.log("TEST PASSATO: 'Il poeta no.' è stato raggruppato con la frase successiva.");
} else if (result.corrected.includes("Il poeta no.\n\nCome facciamo")) {
    console.log("TEST FALLITO: 'Il poeta no.' ha causato un a capo prematuro.");
} else {
    console.log("RISULTATO INCERTO: Verifica output manuale.");
}
