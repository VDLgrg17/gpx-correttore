
import { GPXEngine, DEFAULT_OPTIONS } from './client/src/lib/gpx-engine';

console.log("=== TEST OPTIONS & TOGGLES ===\n");

// Test 1: Reflow disabilitato
// Nota: Dobbiamo disabilitare anche enableBreathing perché fa un reflow totale implicito
const reflowInput = "Riga spezzata,\nche dovrebbe unirsi.";
const engineReflowOff = new GPXEngine({ ...DEFAULT_OPTIONS, enableReflow: false, enableBreathing: false });
const resReflowOff = engineReflowOff.correct(reflowInput);

if (resReflowOff.corrected.includes("\n")) {
  console.log("✅ PASS: Reflow disabilitato correttamente (newline preservato).");
} else {
  console.log("❌ FAIL: Reflow ancora attivo nonostante l'opzione false.");
}

// Test 2: Anti-Bias disabilitato
const biasInput = "ChatGPT ha detto: Perfetto.";
const engineBiasOff = new GPXEngine({ ...DEFAULT_OPTIONS, enableAntiBias: false });
const resBiasOff = engineBiasOff.correct(biasInput);

if (resBiasOff.corrected.includes("Perfetto")) {
  console.log("✅ PASS: Anti-Bias disabilitato correttamente (maiuscola preservata).");
} else {
  console.log("❌ FAIL: Anti-Bias ancora attivo (forzata minuscola).");
}

// Test 3: Integrity Alert Metadata
const anomalyInput = "Test con GiorgioSono un errore.";
const engineAlert = new GPXEngine(DEFAULT_OPTIONS);
const resAlert = engineAlert.correct(anomalyInput);

if (resAlert.report.anomalies.length > 0 && resAlert.report.anomalies[0].word === "GiorgioSono") {
  console.log("✅ PASS: Metadati anomalia generati correttamente.");
  console.log("   Dettagli:", resAlert.report.anomalies);
} else {
  console.log("❌ FAIL: Metadati anomalia mancanti.");
}

console.log("-".repeat(40));
