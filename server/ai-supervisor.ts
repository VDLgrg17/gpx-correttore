import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import { AI_PROMPTS } from "./ai-prompts";

// Tipo per identificare quale verifica eseguire
export type AICheckType = "refusiFusione" | "periodiFrammentati" | "tempiVerbali" | "refusiSemantici" | "virgolaRespira" | "attribuzioneCapitoli";

// Schema per la risposta dell'AI
export const AISupervisorResponseSchema = z.object({
  correctedText: z.string(),
  changes: z.array(z.object({
    original: z.string(),
    corrected: z.string(),
    reason: z.string(),
    position: z.string().optional(),
  })),
});

export type AISupervisorResponse = z.infer<typeof AISupervisorResponseSchema>;

// Schema per la risposta con info sui chunk
export const ChunkInfoSchema = z.object({
  totalChunks: z.number(),
  chunks: z.array(z.object({
    index: z.number(),
    wordCount: z.number(),
    preview: z.string(), // prime 100 parole
  })),
});

export type ChunkInfo = z.infer<typeof ChunkInfoSchema>;

// Schema per la risposta di un singolo chunk
export const SingleChunkResponseSchema = z.object({
  chunkIndex: z.number(),
  totalChunks: z.number(),
  originalText: z.string(),
  correctedText: z.string(),
  changes: z.array(z.object({
    original: z.string(),
    corrected: z.string(),
    reason: z.string(),
    position: z.string().optional(),
  })),
});

export type SingleChunkResponse = z.infer<typeof SingleChunkResponseSchema>;

// Schema per i capitoli proposti
export const ChapterProposalSchema = z.object({
  number: z.number(),
  title: z.string(),
  description: z.string(),
  startsAt: z.string(),
  insertPosition: z.number().optional(),
  previewText: z.string().optional(),
});

export const ChaptersResponseSchema = z.object({
  chapters: z.array(ChapterProposalSchema),
});

export type ChapterProposal = z.infer<typeof ChapterProposalSchema>;
export type ChaptersResponse = z.infer<typeof ChaptersResponseSchema>;

// Prompt di output comune per tutte le verifiche
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

// Funzione per dividere il testo in chunk di circa 1000 parole (~2 pagine A4)
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

// Funzione per ottenere info sui chunk senza elaborarli
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

// Funzione per analizzare un singolo chunk con un check specifico
async function analyzeChunkInternal(
  chunk: string, 
  chunkIndex: number, 
  totalChunks: number,
  checkType: AICheckType
): Promise<AISupervisorResponse> {
  // Per attribuzioneCapitoli usiamo una logica diversa
  if (checkType === "attribuzioneCapitoli") {
    throw new Error("Usa analyzeChapters per l'attribuzione capitoli");
  }
  
  const systemPrompt = AI_PROMPTS[checkType] + OUTPUT_FORMAT;
  
  const userPrompt = `Analizza e correggi il seguente testo (Parte ${chunkIndex + 1} di ${totalChunks}):

---
${chunk}
---

Ricorda: correggi SOLO gli errori specifici per questa verifica, nient'altro.`;

  const result = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = result.choices[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Risposta AI vuota o non valida");
  }

  try {
    // Rimuovi eventuali blocchi markdown \`\`\`json ... \`\`\`
    let jsonContent = content.trim();
    if (jsonContent.startsWith("\`\`\`")) {
      jsonContent = jsonContent.replace(/^\`\`\`(?:json)?\s*/, "").replace(/\s*\`\`\`$/, "");
    }
    const parsed = JSON.parse(jsonContent);
    return AISupervisorResponseSchema.parse(parsed);
  } catch (e) {
    console.error("Errore parsing risposta AI:", e);
    console.error("Contenuto ricevuto:", content.substring(0, 500));
    return {
      correctedText: chunk,
      changes: [],
    };
  }
}

// Funzione pubblica per analizzare un singolo chunk
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
  const result = await analyzeChunkInternal(chunk, chunkIndex, chunks.length, checkType);
  
  return {
    chunkIndex,
    totalChunks: chunks.length,
    originalText: chunk,
    correctedText: result.correctedText,
    changes: result.changes,
  };
}

// Funzione per analizzare i capitoli del testo
export async function analyzeChapters(text: string): Promise<ChaptersResponse> {
  const systemPrompt = AI_PROMPTS.attribuzioneCapitoli;
  
  // Per testi molto lunghi, prendiamo campioni rappresentativi
  const chunks = splitIntoChunks(text, 2000);
  
  // Creiamo un riassunto del testo con campioni da ogni parte
  let textSample = "";
  const sampleSize = Math.min(chunks.length, 10); // max 10 campioni
  const step = Math.max(1, Math.floor(chunks.length / sampleSize));
  
  for (let i = 0; i < chunks.length; i += step) {
    const chunk = chunks[i];
    const words = chunk.split(/\s+/).filter(w => w.length > 0);
    // Prendiamo le prime 200 parole di ogni campione
    const sample = words.slice(0, 200).join(" ");
    textSample += `\n\n--- SEZIONE ${Math.floor(i / step) + 1} (circa pagina ${i * 2 + 1}) ---\n${sample}...`;
  }
  
  const userPrompt = `Analizza il seguente testo (campioni da diverse sezioni) e proponi una suddivisione in capitoli.
Il testo completo ha circa ${chunks.length * 2} pagine.

${textSample}

Identifica i macro-temi e proponi una struttura di capitoli ragionevole (tipicamente 5-10 capitoli).
Per ogni capitolo indica il numero, una breve descrizione e le prime parole del paragrafo dove inizia.`;

  const result = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = result.choices[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Risposta AI vuota o non valida");
  }

  try {
    // Rimuovi eventuali blocchi markdown \`\`\`json ... \`\`\`
    let jsonContent = content.trim();
    if (jsonContent.startsWith("\`\`\`")) {
      jsonContent = jsonContent.replace(/^\`\`\`(?:json)?\s*/, "").replace(/\s*\`\`\`$/, "");
    }
    const parsed = JSON.parse(jsonContent);
    
    // Aggiungi previewText per ogni capitolo trovando la posizione nel testo
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
    console.error("Contenuto ricevuto:", content.substring(0, 500));
    // Restituisci una struttura vuota in caso di errore
    return { chapters: [] };
  }
}

// Funzione per inserire i capitoli nel testo
export function insertChaptersIntoText(
  text: string, 
  chapters: ChapterProposal[]
): string {
  let result = text;
  
  // Ordina i capitoli dal più alto al più basso per evitare problemi con gli indici
  const sortedChapters = [...chapters].sort((a, b) => {
    const posA = result.indexOf(a.startsAt);
    const posB = result.indexOf(b.startsAt);
    return posB - posA; // ordine decrescente
  });
  
  for (const chapter of sortedChapters) {
    const position = result.indexOf(chapter.startsAt);
    if (position !== -1) {
      // Formato: Page break + Capitolo X (grassetto, centrato) + titolo + descrizione (centrata) + testo
      const chapterHeader = `\n\n---PAGE_BREAK---\n\n**Capitolo ${chapter.number}**\n\n${chapter.title}\n\n${chapter.description}\n\n`;
      result = result.slice(0, position) + chapterHeader + result.slice(position);
    }
  }
  
  return result;
}

// Funzione principale per analizzare l'intero testo con un check specifico (legacy)
export async function analyzeText(
  text: string, 
  checkType: AICheckType,
  onProgress?: (current: number, total: number) => void
): Promise<AISupervisorResponse> {
  const chunks = splitIntoChunks(text, 1000);
  const totalChunks = chunks.length;
  
  let allCorrectedText = "";
  let allChanges: AISupervisorResponse["changes"] = [];
  
  for (let i = 0; i < chunks.length; i++) {
    if (onProgress) {
      onProgress(i + 1, totalChunks);
    }
    
    const result = await analyzeChunkInternal(chunks[i], i, totalChunks, checkType);
    
    allCorrectedText += (allCorrectedText ? "\n\n" : "") + result.correctedText;
    allChanges = [...allChanges, ...result.changes];
  }
  
  return {
    correctedText: allCorrectedText,
    changes: allChanges,
  };
}
