
import { GPXEngine } from './client/src/lib/gpx-engine';

const engine = new GPXEngine();
const testText = "Ogni sistema dominante usa tre strumenti: paura. Piacere. Appartenenza. Chi governa questi tre vettori, governa le masse.";

console.log("Originale:", testText);
const result = engine.correct(testText);
console.log("Corretto:", result.corrected);

if (result.corrected.includes("paura, piacere, appartenenza.")) {
    console.log("TEST PASSATO: Elenco unito correttamente.");
} else {
    console.log("TEST FALLITO: Elenco non unito.");
}
