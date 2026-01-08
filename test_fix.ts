
import { GPXEngine } from './client/src/lib/gpx-engine';

const engine = new GPXEngine();
const testText = "ChatGPT ha detto: Perfetto. Assumo quindi il ruolo di un filosofo.";

console.log("Originale:", testText);
const result = engine.correct(testText);
console.log("Corretto:", result.corrected);

if (result.corrected.includes(": perfetto")) {
    console.log("TEST PASSATO: Maiuscola corretta in minuscola.");
} else {
    console.log("TEST FALLITO: Maiuscola rimasta.");
}
