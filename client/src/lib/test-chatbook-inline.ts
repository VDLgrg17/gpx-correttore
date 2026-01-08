
import { GPXEngine } from './gpx-engine';

const engine = new GPXEngine({
  enableReflow: true,
  enableSentenceFlow: true,
  enableAntiBias: true
});

const testCase = `
Vai ai contenuti, cronologia chat. Hai detto: desidero fare una chiacchierata di matrice filosofica sociologica. Comportati come un filosofo adattivo in grado eventualmente di fare anche valutazioni da sociologo.

ChatGPT ha detto: perfetto. Assumo quindi il ruolo di un filosofo adattivo, capace di spostarsi fluidamente tra analisi esistenziali, riflessioni etiche, domande sul senso e valutazioni sociologiche sui comportamenti, le strutture sociali, le dinamiche di potere e i mutamenti culturali. Metodo: ti proporrò – se lo desideri – tre modalità di dialogo, così possiamo scegliere la più adatta all'andamento della conversazione: maieutica socratica Ti rispondo con domande che spingono il ragionamento in profondità. Analitico-critica Esploro un concetto o una situazione, analizzando ne i presupposti filosofici e le ricadute sociali.

Visionaria-adattiva Parto da uno stimolo (una parola, un fatto, una sensazione) e costruisco uno scenario filosofico che ingloba etica, società e futuro. Come vuoi procedere? Hai detto: partiamo con la modalità visionaria.
`;

console.log("=== TEST CHATBOOK INLINE ===");
const result = engine.correct(testCase);
console.log(JSON.stringify(result.corrected));

if (result.corrected.includes("\n\nHai detto:") && result.corrected.includes("\n\nChatGPT ha detto:")) {
  console.log("PASS: Marcatori isolati correttamente.");
} else {
  console.log("FAIL: Marcatori non isolati.");
}
