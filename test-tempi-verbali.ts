import { invokeLLM } from "./server/_core/llm";

const PROMPT = `Sei un grammatico. Il tuo UNICO compito è correggere l'uso errato del presente invece del futuro.

**REGOLA FONDAMENTALE:**
Se un'azione NON avviene ORA (in questo preciso istante), deve essere al futuro.

**ESEMPI CON CONTESTO GIÀ AL FUTURO:**
ERRATO: "Ti proporrò tre modalità: ti rispondo con domande che spingono il ragionamento."
CORRETTO: "Ti proporrò tre modalità: ti risponderò con domande che spingeranno il ragionamento."

**REGOLE:**
- Correggi SOLO i tempi verbali errati
- NON modificare nulla che non sia un errore di tempo verbale

**FORMATO OUTPUT:**
Rispondi SOLO con un oggetto JSON valido (senza blocchi markdown), con questa struttura:
{
  "correctedText": "il testo completo con le correzioni applicate",
  "changes": [
    {
      "original": "testo originale",
      "corrected": "testo corretto",
      "reason": "spiegazione breve"
    }
  ]
}`;

const TEST_TEXT = `CHATGPT HA DETTO:
Perfetto. Assumo quindi il ruolo di un filosofo adattivo, capace di spostarsi fluidamente tra analisi esistenziali, riflessioni etiche, domande sul senso e valutazioni sociologiche sui comportamenti, le strutture sociali, le dinamiche di potere e i mutamenti culturali. Metodo: ti proporrò – se lo desideri – tre modalità di dialogo, così possiamo scegliere la più adatta all'andamento della conversazione: maieutica socratica Ti rispondo con domande che spingono il ragionamento in profondità. Analitico-critica Esploro un concetto o una situazione, analizzandone i presupposti filosofici e le ricadute sociali.`;

async function test() {
  console.log("=== TEST TEMPI VERBALI ===\n");
  console.log("TESTO ORIGINALE:\n", TEST_TEXT);
  console.log("\n--- Chiamata API ---\n");
  
  const result = await invokeLLM({
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: `Analizza e correggi il seguente testo:\n\n---\n${TEST_TEXT}\n---\n\nCorreggi SOLO i tempi verbali errati.` },
    ],
  });
  
  console.log("RISPOSTA RAW:\n", result.choices[0]?.message?.content);
}

test().catch(console.error);
