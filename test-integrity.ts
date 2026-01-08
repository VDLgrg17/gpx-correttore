
import { GPXEngine } from './client/src/lib/gpx-engine';

const engine = new GPXEngine();

const testCases = [
  {
    name: "CamelCase Anomaly",
    input: "Questo è un testo con GiorgioSono un errore.",
    expectedAlert: "Parola sospetta (CamelCase): \"GiorgioSono\""
  },
  {
    name: "Long Word Anomaly",
    input: "Questa parola è davvero troppo lunga: precipitevolissimevolmentesupercalifragilistichespiralidoso.",
    expectedAlert: "Parola sospetta (troppo lunga)"
  },
  {
    name: "Stuck Punctuation Anomaly",
    input: "Ecco un errore di punteggiatura.Come questo.",
    expectedAlert: "Punteggiatura inglobata: \"punteggiatura.Come\"" // O simile, dipende da come split words gestisce il punto
  },
  {
    name: "Clean Text",
    input: "Questo è un testo pulito e corretto. Non dovrebbe generare alert.",
    expectedAlert: null
  }
];

console.log("=== TEST INTEGRITY ALERT ===\n");

testCases.forEach(test => {
  console.log(`Testing: ${test.name}`);
  const result = engine.correct(test.input);
  
  const alerts = result.report.details.filter(d => d.includes("ALERT INTEGRITÀ") || d.includes("sospetta") || d.includes("inglobata"));
  
  if (test.expectedAlert) {
    const found = alerts.some(a => a.includes(test.expectedAlert) || JSON.stringify(alerts).includes(test.expectedAlert));
    if (found) {
      console.log("✅ PASS: Alert rilevato correttamente.");
      console.log("   Dettagli:", alerts);
    } else {
      console.log("❌ FAIL: Alert atteso non trovato.");
      console.log("   Report:", result.report.details);
    }
  } else {
    if (alerts.length === 0) {
      console.log("✅ PASS: Nessun alert (come atteso).");
    } else {
      console.log("❌ FAIL: Alert inatteso rilevato.");
      console.log("   Dettagli:", alerts);
    }
  }
  console.log("-".repeat(40));
});
