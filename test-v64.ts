
import { GPXEngine } from './client/src/lib/gpx-engine';

const engine = new GPXEngine();

async function runTests() {
  console.log("STARTING TEST V64...");
  console.log("Running GPX v64 Tests (Personal Dictionary)...\n");
  
  // Test 1: Parola sconosciuta che verrebbe corretta normalmente
  // "Aragorn" non è nel dizionario, potrebbe essere segnalato (se spellcheck attivo)
  // Ma qui testiamo ignoredWords.
  
  // Simuliamo una parola che il correttore potrebbe toccare o segnalare.
  // GPXEngine usa nspell. Se aggiungiamo una parola a ignoredWords, nspell.correct() dovrebbe tornare true.
  
  const options = {
    ignoredWords: ['Gandalf', 'Mordor']
  };
  
  const engineWithDict = new GPXEngine(options);
  
  // Verifica interna: accediamo a spell checker (che è privato, ma in JS possiamo barare o testare indirettamente)
  // Testiamo indirettamente: se ignoredWords funziona, non dovrebbero esserci anomalie di tipo "spell" se implementassimo spell check report.
  // Attualmente GPXEngine non riporta errori di spelling nel report.anomalies, ma usa spell check per altre logiche.
  
  // Tuttavia, ignoredWords viene aggiunto al dizionario nspell.
  // Possiamo verificare se il metodo correct() di nspell accetta la parola.
  
  // Hack per accedere a spell checker privato per il test
  const spell = (engineWithDict as any).spell;
  
  const word1 = 'Gandalf';
  const isCorrect1 = spell.correct(word1);
  
  if (isCorrect1) {
      console.log(`✅ PASS: '${word1}' is recognized as correct.`);
  } else {
      console.log(`❌ FAIL: '${word1}' is NOT recognized.`);
  }
  
  const word2 = 'Mordor';
  const isCorrect2 = spell.correct(word2);
  
  if (isCorrect2) {
      console.log(`✅ PASS: '${word2}' is recognized as correct.`);
  } else {
      console.log(`❌ FAIL: '${word2}' is NOT recognized.`);
  }
  
  const word3 = 'Sauron'; // Non in lista
  const isCorrect3 = spell.correct(word3);
  
  if (!isCorrect3) {
      console.log(`✅ PASS: '${word3}' is correctly NOT recognized.`);
  } else {
      console.log(`❌ FAIL: '${word3}' SHOULD NOT be recognized.`);
  }
}

runTests();
