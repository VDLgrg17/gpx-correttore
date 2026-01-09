// Client-side direct Gemini API calls
// This allows the PWA to work without a backend server

export type AICheckType = "refusiFusione" | "periodiFrammentati" | "tempiVerbali" | "refusiSemantici" | "virgolaRespira" | "attribuzioneCapitoli";

// Nomi visualizzati per i pulsanti
export const AI_CHECK_LABELS: Record<AICheckType, string> = {
  refusiFusione: "Refusi di Fusione",
  periodiFrammentati: "Periodi Frammentati",
  tempiVerbali: "Tempi Verbali",
  refusiSemantici: "Refusi Semantici",
  virgolaRespira: "Punteggiatura e Respiro",
  attribuzioneCapitoli: "Attribuzione Capitoli",
};

// Prompt dedicati per ogni verifica LLM
const AI_PROMPTS: Record<AICheckType, string> = {
  refusiFusione: `Sei un correttore di bozze. Il tuo UNICO compito è trovare parole incollate erroneamente che devono essere separate.

**COSA CERCARE:**
- Parole fuse insieme per errore di battitura
- Spazi mancanti tra parole

**ESEMPI:**
- "trovarmiieri" → "trovarmi ieri"
- "nonèpossibile" → "non è possibile"
- "doveandare" → "dove andare"

**REGOLE:**
- Correggi SOLO le parole fuse, nient'altro
- NON modificare nulla che non sia un refuso di fusione
- Se non trovi refusi di fusione, restituisci il testo identico`,

  periodiFrammentati: `Sei un editor specializzato in testi teorici, argomentativi e filosofici. Il tuo UNICO compito è correggere la frammentazione artificiale del discorso.

**REGOLA FONDAMENTALE:**
Quando due proposizioni condividono lo stesso nucleo semantico e la seconda è esplicativa o specificativa della prima, devono essere unite in un unico periodo separato da virgola, non da punto.

ESEMPIO:
ERRATO: "Il potere è fondamentale. È la condizione di ogni azione."
CORRETTO: "Il potere è fondamentale, è la condizione di ogni azione."

**NON INIZIARE UN NUOVO PERIODO con congiunzioni coordinanti ("e", "ma", "però", "quindi", "perché") quando la funzione logica è quella di continuare o completare il periodo precedente.**

**ECCEZIONI - NON UNIRE SE:**
- Effetto stilistico voluto (suspense, ritmo incalzante)
- Parte di un dialogo
- Concetti realmente diversi

**REGOLE:**
- Unisci SOLO frasi frammentate che esprimono lo stesso concetto
- NON modificare nulla che non sia frammentazione
- Se non trovi frammentazione, restituisci il testo identico`,

  tempiVerbali: `Sei un correttore grammaticale. Il tuo UNICO compito è correggere l'uso errato del presente invece del futuro.

**REGOLA FONDAMENTALE:**
Se un'azione NON è immediata (non avviene ORA, in questo preciso istante), deve essere al futuro.

**ESEMPI:**
ERRATO: "Domani ti chiamo e ti spiego tutto."
CORRETTO: "Domani ti chiamerò e ti spiegherò tutto."

**NON CORREGGERE SE:**
- L'azione sta avvenendo ORA (presente reale)
- È un presente storico voluto stilisticamente
- È un dialogo informale
- L'azione è abituale ("Ogni lunedì vado in palestra")

**REGOLE:**
- Correggi SOLO i tempi verbali errati
- NON modificare nulla che non sia un errore di tempo verbale
- Se non trovi errori di tempo verbale, restituisci il testo identico`,

  refusiSemantici: `Sei un correttore di bozze. Il tuo UNICO compito è trovare parole che esistono ma sono sbagliate nel contesto.

**COSA CERCARE:**
- Parole esistenti usate al posto di altre per errore
- Omofoni o parole simili confuse

**ESEMPI:**
- "L'anno detto tutti" → "L'hanno detto tutti"
- "Effetto" → "Affetto" (se il contesto parla di sentimenti)

**REGOLE:**
- Correggi SOLO le parole sbagliate nel contesto
- NON modificare nulla che non sia un refuso semantico
- Se non trovi refusi semantici, restituisci il testo identico`,

  virgolaRespira: `Sei un editor. Il tuo compito è correggere la punteggiatura: virgole per il respiro e punti mancanti a fine periodo.

**VIRGOLA CHE RESPIRA:**
La virgola corrisponde al respiro naturale della frase. Dove il lettore deve fare una pausa per respirare, ci vuole una virgola.

**PUNTI MANCANTI:**
Ogni periodo deve terminare con un punto.

**REGOLE:**
- Aggiungi virgole per il respiro dove necessario
- Aggiungi punti mancanti a fine periodo
- NON modificare nulla che non sia punteggiatura
- Se la punteggiatura è già corretta, restituisci il testo identico`,

  attribuzioneCapitoli: `Sei un editor esperto in strutturazione di testi. Il tuo compito è analizzare un testo lungo e identificare i macro-temi per proporre una suddivisione in capitoli.

**COSA DEVI FARE:**
1. Identifica i cambi di argomento significativi
2. Proponi un numero ragionevole di capitoli (tipicamente 5-10 per un libro)
3. Per ogni capitolo indica:
   - Il numero del capitolo
   - Un titolo breve e significativo (2-5 parole)
   - Una descrizione degli argomenti trattati (1-2 righe)
   - Il punto esatto del testo dove inizia (le prime parole del paragrafo)

**FORMATO OUTPUT:**
Restituisci un JSON con questa struttura:
{
  "chapters": [
    {
      "number": 1,
      "title": "Titolo del capitolo",
      "description": "Descrizione degli argomenti trattati nel capitolo",
      "startsAt": "Le prime 10-15 parole del paragrafo dove inizia il capitolo"
    }
  ]
}

**REGOLE:**
- Mantieni un numero ragionevole di capitoli (non troppi, non troppo pochi)
- IMPORTANTE: Usa lo stile italiano per titoli: maiuscola SOLO sulla prima lettera della prima parola`,
};

const OUTPUT_FORMAT = `

**FORMATO OUTPUT:**
Rispondi SOLO con un oggetto JSON valido (senza blocchi markdown), con questa struttura:
{
  "correctedText": "il testo completo con le correzioni applicate",
  "changes": [
    {
      "original": "testo originale",
      "corrected": "testo corretto",
      "reason": "spiegazione breve",
      "position": "indicazione approssimativa (es. 'inizio', 'metà', 'fine')"
    }
  ]
}

Se non ci sono correzioni da fare, restituisci il testo originale e un array "changes" vuoto.`;

// Tipi per le risposte
export interface AIChange {
  original: string;
  corrected: string;
  reason: string;
  position?: string;
}

export interface AISupervisorResponse {
  correctedText: string;
  changes: AIChange[];
}

export interface ChunkInfo {
  totalChunks: number;
  chunks: Array<{
    index: number;
    wordCount: number;
    preview: string;
  }>;
}

export interface SingleChunkResponse {
  chunkIndex: number;
  totalChunks: number;
  originalText: string;
  correctedText: string;
  changes: AIChange[];
}

export interface ChapterProposal {
  number: number;
  title: string;
  description: string;
  startsAt: string;
  insertPosition?: number;
  previewText?: string;
}

export interface ChaptersResponse {
  chapters: ChapterProposal[];
}

// La chiave API Gemini - l'utente la imposta nelle impostazioni
let geminiApiKey: string = localStorage.getItem('gemini_api_key') || '';

export function setGeminiApiKey(key: string) {
  geminiApiKey = key;
  localStorage.setItem('gemini_api_key', key);
}

export function getGeminiApiKey(): string {
  return geminiApiKey;
}

export function hasGeminiApiKey(): boolean {
  return geminiApiKey.length > 0;
}

// Funzione per chiamare Gemini direttamente
async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!geminiApiKey) {
    throw new Error("Chiave API Gemini non configurata. Vai nelle impostazioni per inserirla.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${geminiApiKey}`,
      },
      body: JSON.stringify({
        model: "gemini-2.0-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 32768,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Errore Gemini: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

// Funzione per dividere il testo in chunk
export function splitIntoChunks(text: string, maxWords: number = 1000): string[] {
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = "";
  let currentWordCount = 0;

  for (const paragraph of paragraphs) {
    const paragraphWordCount = paragraph.split(/\s+/).filter(w => w.length > 0).length;
    
    if (currentWordCount + paragraphWordCount > maxWords && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
      currentWordCount = 0;
    }
    
    currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
    currentWordCount += paragraphWordCount;
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Funzione per ottenere info sui chunk
export function getChunksInfo(text: string): ChunkInfo {
  const chunks = splitIntoChunks(text, 1000);
  return {
    totalChunks: chunks.length,
    chunks: chunks.map((chunk, index) => {
      const words = chunk.split(/\s+/).filter(w => w.length > 0);
      return {
        index,
        wordCount: words.length,
        preview: words.slice(0, 20).join(" ") + (words.length > 20 ? "..." : ""),
      };
    }),
  };
}

// Funzione per analizzare un singolo chunk
export async function analyzeSingleChunk(
  text: string,
  chunkIndex: number,
  checkType: AICheckType
): Promise<SingleChunkResponse> {
  const chunks = splitIntoChunks(text, 1000);
  
  if (chunkIndex < 0 || chunkIndex >= chunks.length) {
    throw new Error(`Chunk index ${chunkIndex} non valido. Totale chunks: ${chunks.length}`);
  }
  
  const chunk = chunks[chunkIndex];
  const systemPrompt = AI_PROMPTS[checkType] + OUTPUT_FORMAT;
  
  const userPrompt = `Analizza e correggi il seguente testo (Parte ${chunkIndex + 1} di ${chunks.length}):

---
${chunk}
---

Ricorda: correggi SOLO gli errori specifici per questa verifica, nient'altro.`;

  const content = await callGemini(systemPrompt, userPrompt);
  
  try {
    let jsonContent = content.trim();
    if (jsonContent.startsWith("\`\`\`")) {
      jsonContent = jsonContent.replace(/^\`\`\`(?:json)?\s*/, "").replace(/\s*\`\`\`$/, "");
    }
    const parsed = JSON.parse(jsonContent);
    
    return {
      chunkIndex,
      totalChunks: chunks.length,
      originalText: chunk,
      correctedText: parsed.correctedText || chunk,
      changes: parsed.changes || [],
    };
  } catch (e) {
    console.error("Errore parsing risposta AI:", e);
    return {
      chunkIndex,
      totalChunks: chunks.length,
      originalText: chunk,
      correctedText: chunk,
      changes: [],
    };
  }
}

// Funzione per analizzare i capitoli
export async function analyzeChapters(text: string): Promise<ChaptersResponse> {
  const systemPrompt = AI_PROMPTS.attribuzioneCapitoli;
  
  const chunks = splitIntoChunks(text, 2000);
  
  let textSample = "";
  const sampleSize = Math.min(chunks.length, 10);
  const step = Math.max(1, Math.floor(chunks.length / sampleSize));
  
  for (let i = 0; i < chunks.length; i += step) {
    const chunk = chunks[i];
    const words = chunk.split(/\s+/).filter(w => w.length > 0);
    const sample = words.slice(0, 200).join(" ");
    textSample += `\n\n--- SEZIONE ${Math.floor(i / step) + 1} (circa pagina ${i * 2 + 1}) ---\n${sample}...`;
  }
  
  const userPrompt = `Analizza il seguente testo (campioni da diverse sezioni) e proponi una suddivisione in capitoli.
Il testo completo ha circa ${chunks.length * 2} pagine.

${textSample}

Identifica i macro-temi e proponi una struttura di capitoli ragionevole (tipicamente 5-10 capitoli).
Per ogni capitolo indica il numero, una breve descrizione e le prime parole del paragrafo dove inizia.`;

  const content = await callGemini(systemPrompt, userPrompt);
  
  try {
    let jsonContent = content.trim();
    if (jsonContent.startsWith("\`\`\`")) {
      jsonContent = jsonContent.replace(/^\`\`\`(?:json)?\s*/, "").replace(/\s*\`\`\`$/, "");
    }
    const parsed = JSON.parse(jsonContent);
    
    const chaptersWithPreview = parsed.chapters.map((ch: any) => {
      const position = text.indexOf(ch.startsAt);
      const previewText = position !== -1 
        ? text.substring(position, position + 150).replace(/\n/g, ' ').trim()
        : ch.startsAt;
      return {
        ...ch,
        title: ch.title || `Capitolo ${ch.number}`,
        insertPosition: position,
        previewText,
      };
    });
    
    return { chapters: chaptersWithPreview };
  } catch (e) {
    console.error("Errore parsing risposta AI capitoli:", e);
    return { chapters: [] };
  }
}

// Funzione per inserire i capitoli nel testo
export function insertChaptersIntoText(
  text: string, 
  chapters: ChapterProposal[]
): string {
  let result = text;
  
  const sortedChapters = [...chapters].sort((a, b) => {
    const posA = a.insertPosition ?? result.indexOf(a.startsAt);
    const posB = b.insertPosition ?? result.indexOf(b.startsAt);
    return posB - posA;
  });
  
  for (const chapter of sortedChapters) {
    let position = chapter.insertPosition ?? -1;
    
    if (position === -1 || position >= result.length) {
      position = result.indexOf(chapter.startsAt);
    }
    
    if (position === -1 && chapter.startsAt.length > 20) {
      const shortSearch = chapter.startsAt.substring(0, 50);
      position = result.indexOf(shortSearch);
    }
    
    if (position === -1 && chapter.number === 1) {
      position = 0;
    }
    
    if (position !== -1) {
      const needsPageBreak = position > 0;
      const chapterHeader = needsPageBreak 
        ? `\n\n[PAGE_BREAK]\n\nCapitolo ${chapter.number}\n\n${chapter.title}\n\n${chapter.description}\n\n`
        : `Capitolo ${chapter.number}\n\n${chapter.title}\n\n${chapter.description}\n\n`;
      result = result.slice(0, position) + chapterHeader + result.slice(position);
    }
  }
  
  return result;
}
