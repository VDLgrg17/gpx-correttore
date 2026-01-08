/**
 * GPX ENGINE - Correttore Grammaticale Italiano (TypeScript Version)
 * Implementazione completa delle 55 regole GPX per PWA
 * Supporto Async Chunking per grandi testi
 * NUOVO: Modulo Correzione Ortografica (Spell Checker Euristico + Dizionario)
 */

import nspell from 'nspell';
import { COMMON_VERBS } from './italian-verbs';

// Dizionario Italiano Base (aff/dic semplificati per PWA)
// In produzione, questi dovrebbero essere caricati da file esterni
const aff = `
SET UTF-8
TRY aeiouàèéìòóùntsrldcmbgpfvzqhkjyxw
KEY qwertyuiop|asdfghjkl|zxcvbnm
REP 4
REP è e
REP é e
REP ò o
REP à a
`;

const dic = `
4
casa
perché
ciao
mondo
`;

// Dizionario esteso simulato (per demo PWA senza caricare 5MB di file)
// In una versione reale, caricheremmo it_IT.aff e it_IT.dic completi
const commonWords = new Set([
  "il", "lo", "la", "i", "gli", "le", "un", "uno", "una",
  "di", "a", "da", "in", "con", "su", "per", "tra", "fra",
  "è", "e", "ma", "però", "quindi", "infatti", "invece",
  "che", "chi", "cui", "quale", "dove", "quando", "come", "perché",
  "io", "tu", "lui", "lei", "noi", "voi", "loro", "esso", "essa", "essi", "esse",
  "mio", "tuo", "suo", "nostro", "vostro", "loro",
  "essere", "avere", "fare", "dire", "potere", "volere", "sapere", "stare", "dovere", "vedere", "andare", "venire", "dare", "parlare", "trovare", "sentire", "lasciare", "prendere", "guardare", "mettere", "pensare", "passare", "credere", "portare", "tornare", "sembrare", "tenere", "capire", "morire", "chiamare", "conoscere", "rimanere", "chiedere", "cercare", "entrare", "vivere", "aprire", "uscire", "ricordare", "bisognare", "cominciare", "rispondere", "aspettare", "riuscire", "chiudere", "finire", "arrivare", "scrivere", "diventare", "restare", "seguire", "bastare", "perdere", "rendere", "correre", "salvare", "vestire", "toccare", "considerare", "muovere", "stringere", "mandare", "domandare", "ascoltare", "decidere", "ricevere", "osservare", "permettere", "immaginare", "sedere", "usare", "spendere", "accadere", "volgere", "tacere", "offrire", "agire", "mostrare", "giocare", "raccontare", "bere", "ritornare", "cambiare", "servire", "giungere", "fermare", "apparire", "amare", "esistere", "intendere", "trattare", "piacere", "continuare", "partire", "servire", "giungere", "fermare", "apparire", "amare", "esistere", "intendere", "trattare", "piacere", "continuare", "partire",
  "management", "business", "marketing", "leader", "leadership", "manager", "team", "work", "smart", "digital",
  "sport", "email", "web", "app", "jazz", "watt", "staff", "stress", "null", "full", "hall", "grill",
  "caos", "caotico", "linearità", "prevedibilità", "controllo", "mondo", "irrimediabilmente", "non", "lineare", "imprevedibile",
  "pilastri", "solidi", "pianificazione", "strategica", "lungo", "termine", "gerarchie", "rigide", "processi", "decisionali", "centralizzati",
  "sgretolando", "fronte", "velocità", "esponenziale", "cambiamento", "tecnologico", "complessità", "soverchiante", "mercati", "globali",
  "testimoni", "vera", "propria", "frattura", "epistemologica", "punto", "rottura", "modelli", "mentali", "passato", "solo", "inefficaci",
  "diventano", "zavorra", "impedisce", "organizzazioni", "evolvere", "adattarsi", "ultima", "analisi", "sopravvivere",
  "oggi", "trovano", "navigare", "territorio", "sconosciuto", "armati", "mappe", "obsolete", "bussole", "tarate", "esiste", "più",
  "girano", "vuoto", "incapaci", "indicare", "direzione", "chiara",
  "sensazione", "diffusa", "quella", "profonda", "solitudine", "cognitiva", "isolamento", "strategico", "nasce", "consapevolezza",
  "possedere", "strumenti", "decifrare", "realtà", "decisioni", "vengono", "prese", "limbo", "incertezza", "basandosi", "dati", "parziali",
  "intuizioni", "personali", "spesso", "fallaci", "consigli", "esperti", "loro", "volta", "disorientati",
  "parola", "parole", "esempio", "errore", "errori", "vocale", "vocali", "fine", "finale", "rimediare", "possiamo",
  // Avverbi e Aggettivi Comuni (Espansione v56)
  "molto", "poco", "troppo", "tanto", "abbastanza", "più", "meno", "bene", "male", "meglio", "peggio",
  "sempre", "mai", "spesso", "talvolta", "ancora", "già", "ormai", "subito", "presto", "tardi",
  "qui", "qua", "lì", "là", "dove", "ovunque", "dappertutto",
  "intelligente", "stupido", "bello", "brutto", "grande", "piccolo", "nuovo", "vecchio", "giovane", "anziano",
  "buono", "cattivo", "alto", "basso", "lungo", "corto", "largo", "stretto", "pesante", "leggero",
  "amico", "amica", "amici", "amiche", "amore", "vita", "tempo", "uomo", "donna",
  "facile", "difficile", "veloce", "lento", "forte", "debole", "caldo", "freddo", "vero", "falso",
  "giusto", "sbagliato", "possibile", "impossibile", "probabile", "certo", "sicuro", "chiaro", "scuro",
  "bianco", "nero", "rosso", "blu", "verde", "giallo", "grigio", "marrone", "rosa", "viola",
  "primo", "ultimo", "prossimo", "scorso", "stesso", "altro", "diverso", "uguale", "simile",
  "felice", "triste", "arrabbiato", "calmo", "stanco", "riposato", "pieno", "vuoto", "ricco", "povero",
  "importante", "interessante", "utile", "inutile", "necessario", "sufficiente", "capace", "incapace",
  "pronto", "libero", "occupato", "aperto", "chiuso", "acceso", "spento", "pulito", "sporco",
  "dolce", "amaro", "salato", "acido", "morbido", "duro", "liscio", "ruvido",
  "simpatico", "antipatico", "gentile", "scortese", "onesto", "disonesto", "coraggioso", "codardo",
  "fortunato", "sfortunato", "famoso", "sconosciuto", "tipico", "strano", "normale", "speciale",
  "unico", "intero", "completo", "totale", "assoluto", "relativo", "massimo", "minimo",
  "reale", "ideale", "naturale", "artificiale", "sociale", "personale", "pubblico", "privato",
  "nazionale", "internazionale", "locale", "globale", "politico", "economico", "culturale", "storico",
  "fisico", "mentale", "spirituale", "emotivo", "psicologico", "tecnico", "scientifico", "artistico",
  // Nomi propri rimossi da commonWords per permettere la capitalizzazione automatica
  // Saranno gestiti tramite validPrefixes o dizionario nomi
]);

export interface GPXOptions {
  enableReflow: boolean;
  enableAntiBias: boolean;
  enableBreathing: boolean;
  enableSpellCheck: boolean;
  enableListDetection: boolean;
  enableSentenceFlow: boolean; // v63: Toggle per fluidificazione frasi (Modalità Romanzo)
  ignoredWords: string[]; // v64: Dizionario personale
}

export const DEFAULT_OPTIONS: GPXOptions = {
  enableReflow: true,
  enableAntiBias: true,
  enableBreathing: true,
  enableSpellCheck: true,
  enableListDetection: true,
  enableSentenceFlow: true, // Attivo di default
  ignoredWords: []
};

export interface GPXAnomaly {
  word: string;
  type: 'camelCase' | 'longWord' | 'stuckPunctuation';
  description: string;
}

export interface GPXReport {
  corrections: number;
  details: string[];
  anomalies: GPXAnomaly[];
  stats: {
    chars: number;
    words: number;
    sentences: number;
    readingTime: string;
    flowCorrections: number; // v63: Conteggio frasi fluidificate
  };
}

export interface GPXResult {
  corrected: string;
  report: GPXReport;
  changed: boolean;
}

export class GPXEngine {
  private report: GPXReport;
  private spell: ReturnType<typeof nspell>;
  private options: GPXOptions;

  constructor(options: Partial<GPXOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.report = {
      corrections: 0,
      details: [],
      anomalies: [],
      stats: { chars: 0, words: 0, sentences: 0, readingTime: '0 min', flowCorrections: 0 }
    };
    
    // Inizializza spell checker
    this.spell = nspell(aff, dic);
    // Aggiungi parole comuni al dizionario personale
    commonWords.forEach(w => this.spell.add(w));
    // Aggiungi parole ignorate dall'utente (v64)
    if (this.options.ignoredWords) {
      this.options.ignoredWords.forEach(w => this.spell.add(w));
    }
  }

  /**
   * Correzione asincrona a blocchi per non bloccare la UI
   */
  public async correctAsync(text: string, onProgress?: (progress: number) => void): Promise<GPXResult> {
    // Reset report
    this.report = {
      corrections: 0,
      details: [],
      anomalies: [],
      stats: { chars: 0, words: 0, sentences: 0, readingTime: '0 min', flowCorrections: 0 }
    };

    const original = text;
    
    // Dividi in paragrafi per elaborazione a blocchi
    const paragraphs = text.split('\n');
    const total = paragraphs.length;
    const chunkSize = 50; // Elabora 50 paragrafi alla volta
    
    let processedText = "";
    
    for (let i = 0; i < total; i += chunkSize) {
      const chunk = paragraphs.slice(i, i + chunkSize);
      
      // Elabora il chunk
      const processedChunk = chunk.map(p => this.processParagraph(p)).join('\n');
      processedText += (i > 0 ? '\n' : '') + processedChunk;
      
      // Aggiorna progresso
      if (onProgress) {
        onProgress(Math.min(99, Math.round(((i + chunkSize) / total) * 100)));
      }
      
      // Cedi il controllo al browser per aggiornare la UI (yield)
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    // FASE F: Layout e Spaziatura (Regola 53) - applicata globalmente alla fine
    processedText = this.applyLayoutRules(processedText);
    
    // Ripristina eventuali alterazioni al tag PAGE_BREAK (es. spazi aggiunti: [ PAGE_BREAK ])
    processedText = processedText.replace(/\[\s*PAGE_BREAK\s*\]/g, "[PAGE_BREAK]");

    // FASE H: FINAL ENFORCEMENT (Anti-Bias)
    // Eseguiamo fixCapitalization ANCHE alla fine assoluta per correggere eventuali
    // maiuscole reintrodotte dal reflow o sfuggite a causa di split/join.
    if (this.options.enableAntiBias) {
      processedText = this.fixCapitalization(processedText);
    }

    // FASE H.5: NAMED ENTITY OVERRIDE (v49)
    // Applicato alla fine per garantire che i nomi propri siano sempre maiuscoli,
    // sovrascrivendo eventuali minuscole forzate dall'Anti-Bias o dal Reflow.
    processedText = this.applyNamedEntities(processedText);

    // FASE I: RIPRISTINO CHATBOOK MARKERS (v70 - Final Stage)
    // Sostituisce i placeholder con i marcatori reali formattati correttamente e isolati.
    // Eseguito alla fine assoluta per garantire che il layout engine non li abbia uniti.
    processedText = processedText.replace(/\[\[AI_SAID\]\]/g, '\n\nChatGPT ha detto:\n');
    processedText = processedText.replace(/\[\[USER_SAID\]\]/g, '\n\nHai detto:\n');

    // FASE L: Integrity Check (Alert Anomalie)
    // Scansiona il testo finale alla ricerca di mostri lessicali (es. "GiorgioSono", "fiorentinaperché")
    this.checkIntegrity(processedText);

    // Calcolo statistiche finali
    this.calculateStats(processedText);
    
    if (onProgress) onProgress(100);

    return {
      corrected: processedText,
      report: this.report,
      changed: processedText !== original
    };
  }

  // Metodo sincrono legacy (per piccoli testi)
  public correct(text: string): GPXResult {
    this.report = {
      corrections: 0,
      details: [],
      anomalies: [],
      stats: { chars: 0, words: 0, sentences: 0, readingTime: '0 min', flowCorrections: 0 }
    };
    
    const original = text;
    let current = this.processParagraph(text); // Tratta tutto come un blocco
    current = this.applyLayoutRules(current);
    
    // FASE H: FINAL ENFORCEMENT (Anti-Bias)
    if (this.options.enableAntiBias) {
      current = this.fixCapitalization(current);
    }

    // FASE H.5: NAMED ENTITY OVERRIDE (v49)
    // Applicato alla fine per garantire che i nomi propri siano sempre maiuscoli,
    // sovrascrivendo eventuali minuscole forzate dall'Anti-Bias o dal Reflow.
    current = this.applyNamedEntities(current);
    
    // FASE I: RIPRISTINO CHATBOOK MARKERS (v70 - Final Stage)
    current = current.replace(/\[\[AI_SAID\]\]/g, '\n\nChatGPT ha detto:\n');
    current = current.replace(/\[\[USER_SAID\]\]/g, '\n\nHai detto:\n');

    // FASE L: Integrity Check (Alert Anomalie)
    this.checkIntegrity(current);

    this.calculateStats(current);
    
    return {
      corrected: current,
      report: this.report,
      changed: current !== original
    };
  }

  private processParagraph(text: string): string {
    let current = text;
    if (!current.trim()) return current;

    // FASE A: Normalizzazione Base
    current = this.normalizeBasic(current);

    // FASE A.1: Normalizzazione Apostrofi (Anticipata per gestire correttamente gli spazi)
    // Converte apostrofi curvi, accenti e backtick in apostrofo dritto standard
    current = current.replace(/[’‘`´]/g, "'");

    // FASE A.5: GLUED WORD SPLITTER (Nuova fase critica per testi OCR/PDF)
    // Deve avvenire PRIMA delle regole meccaniche per permettere corretta punteggiatura
    // Eseguiamo due passaggi per gestire incollature multiple (es. "nonvogliopiù" -> "nonvoglio più" -> "non voglio più")
    current = this.splitGluedWords(current);
    current = this.splitGluedWords(current);

    // FASE A.6: ANAFORA MERGER (v53)
    // Unisce frasi consecutive che iniziano con la stessa parola (es. "È... È...")
    current = this.mergeAnaforas(current);

    // FASE A.6.5: NORMALIZZAZIONE ACCENTI (Anticipata per supportare Sentence Flow)
    current = this.normalizeAccents(current);

    // FASE A.7: SENTENCE FLOW SMOOTHER (v62)
    // Unisce frasi spezzate artificialmente da punti (es. "Non è buono. È cattivo." -> "Non è buono, è cattivo.")
    if (this.options.enableSentenceFlow) {
      current = this.smoothSentenceFlow(current);
    }

    // FASE A.8: HA/A CONTEXTUAL CHECK (v63)
    // Distingue verbo avere (ha fatto) da preposizione (a casa)
    current = this.fixHaAContext(current);

    // FASE B: Regole Meccaniche (Punteggiatura, Spazi)
    current = this.applyMechanicalRules(current);

    // FASE C: Maiuscole e Minuscole
    if (this.options.enableAntiBias) {
      current = this.fixCapitalization(current);
    }

    // FASE D: Tipografia (Virgolette, Apostrofi)
    current = this.normalizeQuotes(current);

    // FASE E: Regole Avanzate (Litoti, Analisi Logica simulata)
    current = this.applyAdvancedRules(current);

    // FASE G: Correzione Ortografica (NUOVO)
    if (this.options.enableSpellCheck) {
      current = this.applySpellCheck(current);
    }

    return current;
  }

  private applySpellCheck(text: string): string {
    let t = text;

    // 1. Vocali ripetute a fine parola (logica legacy integrata)
    // Gestisce anche accentate ripetute (es. perchéé -> perché)
    const doubleVowelRegex = /([a-zA-Zàèéìòóù])([aeiouàèéìòóù])\2\b/gi;
    t = t.replace(doubleVowelRegex, (match, prefix, vowel) => {
       // Eccezioni comuni
       if (['zii', 'pii', 'vii'].includes(match.toLowerCase())) return match;
       return prefix + vowel;
    });
    
    // Fix specifico per accentate finali raddoppiate che potrebbero sfuggire alla regex sopra
    // Usiamo i codici esadecimali per essere sicuri o elenchiamo esplicitamente le coppie
    t = t.replace(/àà/g, 'à').replace(/èè/g, 'è').replace(/éé/g, 'é')
         .replace(/ìì/g, 'ì').replace(/òò/g, 'ò').replace(/óó/g, 'ó').replace(/ùù/g, 'ù');

    // 2. Doppie consonanti finali errate (es. managementt -> management)
    t = t.replace(/\b([a-zA-Zàèéìòóù]+?)([^aeiouàèéìòóù\s])\2\b/gi, (match, base, cons) => {
      // Se la parola originale è corretta (es. jazz, watt), lasciala stare
      if (this.spell.correct(match)) return match;
      
      // Se la base (senza l'ultima consonante) è corretta, usa quella
      if (this.spell.correct(base + cons)) return base + cons;
      
      return match;
    });

    // 3. Parole spezzate (DISABILITATO v45: Causava concatenazioni errate come "fiorentinaperché")
    // La logica era troppo aggressiva e il dizionario limitato generava falsi positivi.
    /*
    t = t.replace(/\b([a-zA-Zàèéìòóù]{1,3})\s+([a-zA-Zàèéìòóù]{1,10})\b/gi, (match, p1, p2) => {
      const combined = p1 + p2;
      if (this.spell.correct(combined)) {
        const commonPrepositions = ['a', 'di', 'da', 'in', 'su', 'con', 'per', 'tra', 'fra', 'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una'];
        const p1IsPrep = commonPrepositions.includes(p1.toLowerCase());
        const p2IsValid = this.spell.correct(p2);
        if (combined.toLowerCase() === 'insieme') return combined;
        if (p1IsPrep && p2IsValid) return match;
        return combined;
      }
      return match;
    });
    */

    return t;
  }

  private normalizeBasic(text: string): string {
    let t = text;
    
    // -2. CHATBOOK STRUCTURE ENFORCEMENT (Placeholder Shield - v70)
    // Protegge i marcatori sostituendoli con token sicuri e isolandoli con newline.
    // Questo impedisce a qualsiasi regola successiva (Reflow, Sentence Flow, ecc.) di alterarli o unirli.
    t = t.replace(/(?:^|[\s\.,;!?])(Hai detto:|ChatGPT ha detto:)/gi, (match, marker) => {
      const isAI = marker.toLowerCase().includes('chatgpt');
      
      // Preserva la punteggiatura precedente se presente nel match
      let prefix = "";
      const firstChar = match.charAt(0);
      if (/[.,;!?]/.test(firstChar)) {
         prefix = firstChar;
      }
      
      // Inserisce doppi a capo e il placeholder protetto
      return `${prefix}\n\n${isAI ? '[[AI_SAID]]' : '[[USER_SAID]]'}\n\n`;
    });

    // -1. REFLOW PARAGRAFI (Nuova regola v35)
    if (this.options.enableReflow) {
      // Unisce righe spezzate impropriamente (hard wrap)
      // Caso 1: Riga finisce con virgola e va a capo -> unisci
      t = t.replace(/,\s*\n\s*/g, ', ');
      
      // Caso 2: Riga va a capo ma la successiva inizia con minuscola -> unisci
      // Es: "Eravamo in tre\npoi in quattro" -> "Eravamo in tre poi in quattro"
      // FIX v70: Escludiamo righe che finiscono con ']' per proteggere i marcatori ChatBook ([[USER_SAID]])
      t = t.replace(/([^\n\]])\n\s*([a-zàèéìòóù])/g, '$1 $2');
    }

    // 0. RIMOZIONE EMOJI E SIMBOLI GRAFICI (Nuova regola v33)
    // Rimuove range Unicode di Emoji, Simboli Vari, Dingbats, ecc.
    // Mantiene caratteri latini, accentati, punteggiatura standard e numeri.
    // Regex compatibile senza flag 'u' (surrogate pairs per emoji comuni)
    // Rimuove Emoji e simboli grafici principali
    // FIX v37: Escludiamo il range \u2000-\u206F (Punteggiatura Generale) per salvare apostrofi (’), virgolette, trattini, ecc.
    // Rimuoviamo solo simboli grafici reali (Dingbats, Frecce, Simboli vari, Emoji)
    // Range rimossi:
    // \u2700-\u27BF (Dingbats)
    // \uE000-\uF8FF (Private Use Area - spesso icone font)
    // \uD83C-\uD83E... (Emoji surrogates)
    // \u2190-\u21FF (Arrows)
    // \u2200-\u22FF (Mathematical Operators - opzionale, ma spesso non voluti in testi narrativi)
    // \u2300-\u23FF (Miscellaneous Technical)
    // \u2460-\u24FF (Enclosed Alphanumerics)
    // \u2500-\u257F (Box Drawing)
    // \u2580-\u259F (Block Elements)
    // \u25A0-\u25FF (Geometric Shapes)
    // \u2600-\u26FF (Miscellaneous Symbols - ATTENZIONE: contiene alcuni segni utili, ma per lo più simboli grafici)
    
    t = t.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2190-\u21FF]|[\u2300-\u23FF]|[\u2460-\u24FF]|[\u2500-\u25FF]|[\u2600-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    // Proteggi tag speciali come [PAGE_BREAK] sostituendoli temporaneamente con un placeholder sicuro
    // In realtà, basta assicurarsi che le regole successive non li rompano.
    // Le regole sugli spazi potrebbero aggiungere spazi dentro le parentesi.
    // Per sicurezza, normalizziamo il tag se viene alterato.
    
    t = t.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Rimuovi spazi multipli (ma preserva newline)
    const beforeSpaces = t;
    t = t.replace(/ {2,}/g, ' ');
    if (t !== beforeSpaces) {
      this.report.corrections++;
      // Evitiamo di spammare il report per ogni spazio
      if (!this.report.details.includes('Rimossi spazi multipli')) {
        this.report.details.push('Rimossi spazi multipli');
      }
    }
    return t;
  }

  /**
   * Unisce frasi consecutive che iniziano con la stessa parola (Anafore).
   * Es. "È un problema. È una sfida." -> "È un problema, è una sfida."
   */
  private mergeAnaforas(t: string): string {
    // Cerca: Punto + Spazio + Parola1 + ... + Punto + Spazio + Parola1 (stessa parola)
    // La regex cattura:
    // 1. La fine della prima frase (o inizio stringa)
    // 2. La prima parola (Maiuscola)
    // 3. Il resto della prima frase fino al punto
    // 4. Il punto e spazio
    // 5. La seconda parola (che deve essere uguale alla prima)
    
    // Iteriamo finché ci sono sostituzioni per gestire catene multiple (A. A. A.)
    let previous = '';
    while (t !== previous) {
      previous = t;
      // Regex spiegazione:
      // (\.|^)\s+       -> Gruppo 1: Punto precedente o inizio stringa
      // ([A-ZÀÈÉÌÒÓÙ][a-zàèéìòóù']+) -> Gruppo 2: La parola chiave (es. "È", "Si", "Non")
      // ([^.?!]+)       -> Gruppo 3: Il resto della frase
      // [.?!]\s+        -> Separatore (Punto/Esclamativo/Interrogativo + Spazio)
      // \2              -> Backreference al Gruppo 2 (deve essere la stessa parola!)
      
      // Nota: usiamo 'gi' ma la backreference \2 garantisce l'uguaglianza esatta (case sensitive? No, flag i)
      // Ma noi vogliamo che la seconda diventi minuscola.
      
      t = t.replace(/(\.|^)\s+([A-ZÀÈÉÌÒÓÙ][a-zàèéìòóù']*)([^.?!]+)[.?!]\s+\2/g, (match, p1, word, rest) => {
        // p1: punto precedente o vuoto
        // word: la parola ripetuta (es. "È")
        // rest: resto della prima frase
        // La seconda occorrenza di 'word' è implicita nel match finale
        
        // Costruiamo: p1 + " " + word + rest + "," + " " + word.toLowerCase()
        // Attenzione: se p1 è vuoto (inizio stringa), non mettiamo spazio prima.
        const prefix = p1 ? `${p1} ` : '';
        return `${prefix}${word}${rest}, ${word.toLowerCase()}`;
      });
    }
    return t;
  }

  /**
   * Separa parole incollate (es. "Marcoera" -> "Marco era", "diriposare" -> "di riposare")
   * Implementazione avanzata v54 basata su dizionario e split intelligente.
   */
  private splitGluedWords(t: string): string {
    // Usa il dizionario globale commonWords definito all'inizio del file
    // Aggiungiamo solo validPrefixes locali se necessario, ma meglio usare tutto globale.
    // Per ora manteniamo validPrefixes qui per compatibilità con la logica esistente, ma lo espandiamo.
    const validPrefixes = new Set([
      'marco', 'luca', 'giovanni', 'maria', 'anna', 'paolo', 'francesco', 'andrea', 'mario', 'luigi',
      'questo', 'quello', 'questa', 'quella', 'questi', 'quelli', 'queste', 'quelle',
      'fatto', 'detto', 'visto', 'preso', 'messo', 'dato', 'stato', 'andato', 'venuto', 'aperto', 'chiuso', 'perso', 'vinto', 'scritto', 'letto',
      'ho', 'hai', 'ha', 'hanno', 'abbiamo', 'avete', 'sono', 'sei', 'siamo', 'siete', 'era', 'ero', 'erano', // Ausiliari
      'voglio', 'vuoi', 'vuole', 'vogliamo', 'volete', 'vogliono', // Volere
      'posso', 'puoi', 'può', 'possiamo', 'potete', 'possono', // Potere
      'devo', 'devi', 'deve', 'dobbiamo', 'dovete', 'devono', // Dovere
      'so', 'sai', 'sa', 'sappiamo', 'sapete', 'sanno', // Sapere
      'faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno', // Fare
      'vado', 'vai', 'va', 'andiamo', 'andate', 'vanno', // Andare
      'vedo', 'vedi', 'vede', 'vediamo', 'vedete', 'vedono', // Vedere
      'sento', 'senti', 'sente', 'sentiamo', 'sentite', 'sentono', // Sentire
      'parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano', // Parlare
      'dormo', 'dormi', 'dorme', 'dormiamo', 'dormite', 'dormono', // Dormire
      'mangio', 'mangi', 'mangia', 'mangiamo', 'mangiate', 'mangiano', // Mangiare
      'casa', 'cosa', 'tempo', 'modo', 'mondo', 'vita', 'mano', 'occhio', 'parte',
      'grande', 'piccolo', 'nuovo', 'vecchio', 'bello', 'brutto', 'buono', 'cattivo',
      'problema', 'esempio', 'punto', 'caso', 'senso', 'bisogno',
      'stanco', 'felice', 'triste', 'pronto', 'sicuro', 'certo', 'vero', 'falso',
      // Espansione v56 per coprire aggettivi comuni nello split
      "intelligente", "stupido", "veloce", "lento", "facile", "difficile"
    ]);

    // Funzione helper per verificare se una parola è valida (STRICT MODE)
    const isKnownWord = (w: string): boolean => {
      const lower = w.toLowerCase();
      return commonWords.has(lower) || validPrefixes.has(lower);
    };

    // Funzione di compatibilità sintattica (ispirata a GPT)
    // Evita split insensati tra due parole valide che non stanno bene insieme
    const areCompatible = (p1: string, p2: string): boolean => {
      const l1 = p1.toLowerCase();
      const l2 = p2.toLowerCase();
      
      // 1. Se una delle due è una stopword (funzionale), è quasi sempre ok
      // Stopwords: articoli, preposizioni, congiunzioni, ausiliari
      if (commonWords.has(l1) || commonWords.has(l2)) return true;
      
      // 2. Nome Proprio + Verbo (es. Marco + corre)
      // Qui assumiamo che validPrefixes contenga nomi e verbi.
      // Se non sono stopwords, devono essere entrambe parole "piene".
      // Accettiamo split tra parole piene solo se siamo sicuri.
      // Per ora, richiediamo che almeno una sia funzionale per massima sicurezza,
      // OPPURE che p1 sia un nome proprio noto O un verbo comune (participio).
      const knownNames = ['marco', 'luca', 'giovanni', 'maria', 'anna', 'paolo', 'francesco', 'andrea', 'mario', 'luigi'];
      const commonVerbs = ['fatto', 'detto', 'visto', 'preso', 'messo', 'dato', 'stato', 'andato', 'venuto'];
      const auxiliaries = ['ho', 'hai', 'ha', 'hanno', 'abbiamo', 'avete', 'è', 'sono', 'sei', 'siamo', 'siete', 'era', 'ero', 'erano', 'sta', 'sto', 'stai', 'stava', 'stanno'];

      if (knownNames.includes(l1)) return true;
      if (commonVerbs.includes(l1)) return true; // Es. "vistomaria" -> "visto" + "maria" (OK)
      if (auxiliaries.includes(l1)) return true; // Es. "haidetto" -> "hai" + "detto" (OK)

      return false; // Default conservativo: se sono due sostantivi rari incollati, non rischiare
    };

    // Suffissi che NON devono mai essere staccati se formano parole valide
    const forbiddenSuffixes = new Set(['mente', 'zione', 'zioni', 'tore', 'tori', 'trice', 'trici', 'bile', 'bili', 'vole', 'voli', 'logia', 'grafia']);

    // Tokenizzazione grezza per individuare parole lunghe sospette
    // FIX: Aggiunto apostrofo nella regex per catturare "Nonc'è"
    return t.replace(/[a-zA-Zàèéìòóù']+/g, (match) => {
      // Se la parola è già nel dizionario comune o è breve (< 6 lettere), la ignoriamo
      if (match.length < 6) return match;
      if (commonWords.has(match.toLowerCase())) return match;
      // Se il correttore ortografico la riconosce come corretta, non splittiamo (es. "amiche")
      if (this.spell.correct(match)) return match;
      
      // Se contiene apostrofo (es. "c'è", "l'albero"), gestiamo separatamente
      if (match.includes("'")) {
         // Logica semplificata per apostrofi incollati: "Nonc'è" -> "Non c'è"
         // Cerchiamo pattern: Parola + (l'|c'|un'|all'|dall'|nell'|sull') + Parola
         // Esempio: "Nonc'è" -> split a "Non" + "c'è"
         const aposSplit = match.split("'");
         if (aposSplit.length === 2) {
            // Es: Nonc'è -> Nonc + è. No, l'apostrofo è parte della seconda parola di solito (c'è) o prima (l'albero)
            // Caso "Nonc'è": "Non" + "c'è".
            // Cerchiamo split point prima di c', l', un', ecc.
            const commonApos = ["c'", "l'", "un'", "all'", "dall'", "nell'", "sull'", "dell'"];
            for (const apos of commonApos) {
               const idx = match.toLowerCase().indexOf(apos);
               if (idx > 2) { // Almeno 3 lettere prima (es. "Non")
                  const part1 = match.substring(0, idx);
                  const part2 = match.substring(idx);
                  if (isKnownWord(part1)) return `${part1} ${part2}`;
               }
            }
         }
         return match;
      }

      // Tentativo di split standard
      // FIX v58: Loop INVERSO (Greedy) per catturare prima i match più lunghi (es. "stanno" prima di "sta")
      // Parte da match.length - 1 fino a 1 (per catturare anche parole di 1 lettera come "è")
      for (let i = match.length - 1; i >= 1; i--) { 
         const part1 = match.substring(0, i);
         const part2 = match.substring(i);
        
        // Se part2 è vuota o troppo corta, skip (minimo 2 lettere per part2, salvo eccezioni grammaticali)
        if (part2.length < 2) continue;

        // Check rapido suffissi vietati
        if (forbiddenSuffixes.has(part2.toLowerCase())) continue;

        // --- NUOVA LOGICA GRAMMATICALE (v58) ---
        // Riconoscimento pattern strutturali (Ausiliare + Verbo)
        // Indipendente dal dizionario per la seconda parte
        
        const p1Lower = part1.toLowerCase();
        const p2Lower = part2.toLowerCase();

        // Pattern 1: Stare + Gerundio (es. "stariposando", "staiandando")
        // Ausiliari: sta, sto, stai, stava, stavo, stanno, stiamo
        const auxStare = ['sta', 'sto', 'stai', 'stava', 'stavo', 'stanno', 'stiamo'];
        if (auxStare.includes(p1Lower)) {
          // Verifica suffisso gerundio (-ando, -endo)
          if (p2Lower.endsWith('ando') || p2Lower.endsWith('endo')) {
             // Protezione contro falsi positivi
             if (part2.length > 3) { // "ando" è 4, quindi >3 ok
                return `${part1} ${part2}`;
             }
          }
        }

        // Pattern 2: Avere/Essere + Participio Passato (es. "homangiato", "èandato")
        // Ausiliari: ho, hai, ha, abbiamo, avete, hanno, è, sono, sei, siamo, siete, era, ero, erano
        const auxPassato = ['ho', 'hai', 'ha', 'hanno', 'abbiamo', 'avete', 'è', 'sono', 'sei', 'siamo', 'siete', 'era', 'ero', 'erano'];
        if (auxPassato.includes(p1Lower)) {
           // Verifica suffisso participio (-ato, -uto, -ito)
           if (p2Lower.endsWith('ato') || p2Lower.endsWith('uto') || p2Lower.endsWith('ito')) {
              // Protezione lunghezza minima participio
              if (part2.length > 3) {
                 return `${part1} ${part2}`;
              }
           }
        }

        // Pattern 3: Adverb Anchor (v59)
        // Se la parola finisce con un avverbio forte (già, più, mai, via, ora, qui, lì, là, su, giù)
        // e la parte precedente è plausibile (finisce per vocale o consonante liquida, lunghezza > 2)
        // RIMOSSI 'bene' e 'male' (v60) perché causano falsi positivi con parole come "animale", "normale"
        const adverbs = ['già', 'più', 'mai', 'via', 'ora', 'qui', 'lì', 'là', 'su', 'giù'];
        if (adverbs.includes(p2Lower)) {
           // Verifica plausibilità prima parte (Verbo o Parola)
           // Deve essere lunga almeno 3 lettere (es. "dorme" -> 5, "va" -> 2 ma "vagià" -> "va già" ok)
           // Accettiamo anche 2 lettere se è un verbo comune (va, fa, sta, ha, è)
           if (part1.length >= 2) {
              // Se finisce per vocale (molto probabile per verbi italiani)
              if (/[aeiouàèéìòóù]$/.test(p1Lower)) {
                 return `${part1} ${part2}`;
              }
              // Se finisce per consonante liquida/nasale (l, r, n, m) - es. "andar via"
              if (/[lrnm]$/.test(p1Lower)) {
                 return `${part1} ${part2}`;
              }
           }
        }

        // Pattern 4: Preposition Anchor (v60)
        // Se la parola finisce con una preposizione articolata (nel, del, al, dal, sul, col)
        // Queste preposizioni finiscono per 'l', che è raro come finale di parola in italiano (tranne monosillabi o prestiti)
        // E la parte precedente finisce per vocale (es. "proseguirenel")
        const prepositions = ['nel', 'del', 'al', 'dal', 'sul', 'col', 'nei', 'dei', 'ai', 'dai', 'sui', 'coi', 'negli', 'degli', 'agli', 'dagli', 'sugli', 'nelle', 'delle', 'alle', 'dalle', 'sulle'];
        if (prepositions.includes(p2Lower)) {
           const safePrepositions = ['nel', 'del', 'al', 'dal', 'sul', 'col', 'nei', 'dei', 'ai', 'dai', 'sui', 'coi'];
           if (safePrepositions.includes(p2Lower)) {
              if (p1Lower.length >= 3 && /[aeiouàèéìòù]$/.test(p1Lower)) {
                 // Controllo extra (v61): se la prima parte è un verbo noto
                 if (COMMON_VERBS.has(p1Lower)) {
                    return `${part1} ${part2}`;
                 }
                 return `${part1} ${part2}`;
              }
           }
        } // Chiusura if Pattern 4

        // Pattern 5: Verb Split (v61)
        // Se la prima parte è un verbo noto (inclusi condizionali, congiuntivi, ecc.)
        // e la seconda parte è una parola valida (es. "che", "non", "lo", "la", "mi", "ti", "si", "ci", "vi")
        if (COMMON_VERBS.has(p1Lower)) {
           // Lista di parole che si incollano spesso ai verbi
           const glueWords = ['che', 'non', 'lo', 'la', 'li', 'le', 'mi', 'ti', 'si', 'ci', 'vi', 'ne', 'ma', 'se', 'e', 'o'];
           // Accettiamo anche se la seconda parte è una parola comune generica
           if (glueWords.includes(p2Lower) || commonWords.has(p2Lower)) {
              return `${part1} ${part2}`;
           }
        }

        // --- FINE LOGICA GRAMMATICALE ---

        // STRICT CHECK CLASSICO: Entrambe le parti devono essere note
        const p1Known = isKnownWord(part1);
        const p2Known = isKnownWord(part2);

        if (p1Known && p2Known) {
          // COMPATIBILITY CHECK (v55): Verifica se ha senso grammaticale splittare
          if (!areCompatible(part1, part2)) continue;

          // Check aggiuntivo per parole cortissime (1 lettera)
          if (part1.length === 1 && !['a','e','i','o','u','è','y'].includes(part1.toLowerCase())) continue;
          if (part2.length === 1 && !['a','e','i','o','u','è','y'].includes(part2.toLowerCase())) continue;

          return `${part1} ${part2}`;
        }
      }

      return match;
    });
  }

  /**
   * SENTENCE FLOW SMOOTHER (v62)
   * Unisce frasi spezzate artificialmente da punti.
   * Es. "Non è buono. È cattivo." -> "Non è buono, è cattivo."
   */
  private smoothSentenceFlow(t: string): string {
    // 1. Verbo Essere (È, Era) - PRIORITÀ ALTA
    // Es. "Non è giusto. È sbagliato." -> "Non è giusto, è sbagliato."
    // Eseguiamo prima questo per evitare interferenze
    // NOTA: Evitiamo \b dopo È perché può dare problemi con caratteri accentati in alcuni engine
    t = t.replace(/(\.)\s+(È|Era)(?=\s|[^a-zA-Zàèéìòóù]|$)/g, (match, p1, word) => {
       this.report.stats.flowCorrections++;
       return `, ${word.toLowerCase()}`;
    });

    // 2. Connettivi Forti e Pronomi (Ma, Però, Quindi, Infatti, Invece, Cioè, Ti, Mi, Ci...)
    // Regex: Punto + Spazio + Connettivo + Spazio
    // Sostituisce con: Virgola + Spazio + connettivo (minuscolo) + Spazio
    const connectives = [
        'Ma', 'Però', 'Quindi', 'Infatti', 'Invece', 'Cioè', 
        'Ti', 'Mi', 'Ci', 'Vi', 'Si', 'Ne', 'Lo', 'La', 'Li', 'Le'
    ];
    const connRegex = new RegExp(`(\\.|^)\\s+(${connectives.join('|')})\\b`, 'g');
    
    t = t.replace(connRegex, (match, p1, word) => {
       // Se è inizio stringa (^), non mettiamo virgola, lasciamo stare o rimuoviamo punto se c'era
       if (!p1 || p1 === '') return match; // Inizio assoluto, ok lasciare Maiuscolo
       
       // Se c'è un punto prima, sostituiamo con virgola e minuscolo
       this.report.stats.flowCorrections++;
       return `, ${word.toLowerCase()}`;
    });

    // 3. Congiunzioni (E, Ed)
    // Es. "Bello. E costoso." -> "Bello e costoso."
    // Rimuoviamo il punto e rendiamo minuscolo. Niente virgola di solito.
    t = t.replace(/(\.)\s+(E|Ed)\b/g, (match, p1, word) => {
       this.report.stats.flowCorrections++;
       return ` ${word.toLowerCase()}`;
    });

    return t;
  }

  /**
   * HA/A CONTEXTUAL CHECK (v63)
   * Corregge errori comuni su "ha" (verbo) vs "a" (preposizione) basandosi sul contesto.
   */
  private fixHaAContext(t: string): string {
    // 1. "a" + Participio Passato -> "ha" + Participio Passato
    // Es. "Lui a detto" -> "Lui ha detto"
    // Lista participi passati comuni che spesso causano errori
    const pastParticiples = [
        'detto', 'fatto', 'visto', 'preso', 'perso', 'messo', 'chiesto', 'risposto', 
        'capito', 'sentito', 'voluto', 'potuto', 'dovuto', 'saputo', 'stato', 'avuto',
        'mangiato', 'bevuto', 'dormito', 'giocato', 'parlato', 'pensato', 'cercato',
        'trovato', 'chiamato', 'portato', 'lasciato', 'finito', 'iniziato', 'cominciato'
    ];
    
    // Regex: " a " + participio
    // Usiamo \b per word boundary. Case insensitive.
    const regexAtoHa = new RegExp(`\\b([Aa])\\s+(${pastParticiples.join('|')})\\b`, 'gi');
    
    t = t.replace(regexAtoHa, (match, p1, p2) => {
        // Mantieni case originale della 'a' (A -> Ha, a -> ha)
        const h = p1 === 'A' ? 'Ha' : 'ha';
        this.report.corrections++;
        if (this.report.details.length < 50) {
            this.report.details.push(`Corretto Ha/A: ${match} -> ${h} ${p2}`);
        }
        return `${h} ${p2}`;
    });

    // 2. "ha" + Infinito -> "a" + Infinito
    // Es. "Vado ha mangiare" -> "Vado a mangiare"
    // Lista infiniti comuni
    const infinitives = [
        'fare', 'dire', 'vedere', 'andare', 'venire', 'mangiare', 'dormire', 'parlare',
        'sentire', 'capire', 'prendere', 'mettere', 'stare', 'essere', 'avere',
        'giocare', 'leggere', 'scrivere', 'correre', 'camminare', 'cercare', 'trovare',
        'casa', 'scuola', 'letto', 'tavola', 'piedi', 'spasso', 'lavoro' // Aggiunti anche luoghi comuni retti da "a"
    ];

    const regexHaToA = new RegExp(`\\b([Hh]a)\\s+(${infinitives.join('|')})\\b`, 'gi');

    t = t.replace(regexHaToA, (match, p1, p2) => {
        // Mantieni case originale (Ha -> A, ha -> a)
        const a = p1 === 'Ha' ? 'A' : 'a';
        this.report.corrections++;
        if (this.report.details.length < 50) {
            this.report.details.push(`Corretto Ha/A: ${match} -> ${a} ${p2}`);
        }
        return `${a} ${p2}`;
    });

    return t;
  }

  private normalizeAccents(t: string): string {
    // B1: Accenti e Apostrofi comuni (Regola 4)
    const accentMap: Record<string, string> = {
      "e'": 'è', "E'": 'È', "a'": 'à', "A'": 'À', 
      // "o'": 'ò', "O'": 'Ò', // RIMOSSO: Causava Po' -> Pò. Gestito specificamente sotto.
      "u'": 'ù', "U'": 'Ù', 
      "i'": 'ì', "I'": 'Ì',
      "perche'": 'perché', "Perche'": 'Perché',
      "poiche'": 'poiché', "Poiche'": 'Poiché',
      "cosi'": 'così', "Cosi'": 'Così',
      "piu'": 'più', "Piu'": 'Più',
      "cioe'": 'cioè', "Cioe'": 'Cioè',
      "pò": "po'", "qual'è": "qual è", "Qual'è": "Qual è",
      "un'amico": "un amico", "un'albero": "un albero"
    };

    for (const [wrong, right] of Object.entries(accentMap)) {
      if (t.includes(wrong)) {
        const regex = new RegExp(wrong.replace(/'/g, "\\'"), 'g');
        t = t.replace(regex, right);
        this.report.corrections++;
        // Limitiamo log dettagliato
        if (this.report.details.length < 50) {
            this.report.details.push(`Corretto accento/elisione: ${wrong} -> ${right}`);
        }
      }
    }
    return t;
  }

  private applyMechanicalRules(t: string): string {
    // B1: Accenti spostati in normalizeAccents
    // B1.5: Punti mancanti (Regola Anti-GPT)
    // Caso 1: Parola minuscola + spazio + Parola Maiuscola di inizio frase (Questo, Ma, Il, La...)
    // Es: "sinaptiche Questo" -> "sinaptiche. Questo"
    t = t.replace(/([a-zàèéìòóù])\s+(Questo|Questa|Questi|Queste|Ma|Il|Lo|La|I|Gli|Le|Un|Uno|Una|Ognuno|Ognuna|Quindi|Infatti|Inoltre|Tuttavia|Perciò|Pertanto|Di conseguenza)\b/g, '$1. $2');

    // Caso 2: Fine paragrafo senza punto (se finisce con lettera)
    // Nota: Questo è difficile da fare qui perché lavoriamo su stringhe che potrebbero essere parziali o intere.
    // Ma se 't' è un paragrafo intero (come in processParagraph), possiamo controllare la fine.
    if (t.length > 0 && /[a-zàèéìòóù]$/i.test(t.trim())) {
        t = t.trim() + '.';
    }

    // B0: Normalizzazione Spazi Multipli (Regola v36)
    // Trasforma spazi multipli in spazio singolo
    t = t.replace(/[ \t]+/g, ' ');

    // B2: Spazio prima della punteggiatura
    t = t.replace(/\s+([.,;:!?])/g, '$1');

    // B2.1: Spazio dopo apostrofo (Errore comune: "all' ora" -> "all'ora")
    // Unisce l'apostrofo alla parola successiva se c'è uno spazio indesiderato,
    // MA preserva lo spazio per i troncamenti (Po', Va', Fa', Sta', Da', Di', To')
    t = t.replace(/([a-zA-Zàèéìòóù]+)'\s+([a-zA-Zàèéìòóù]+)/g, (match, p1, p2) => {
      const truncations = ['po', 'va', 'fa', 'sta', 'da', 'di', 'to', 'mo', 'be'];
      if (truncations.includes(p1.toLowerCase())) {
        return match; // Mantieni spazio (es. "Po' di")
      }
      return `${p1}'${p2}`; // Unisci (es. "all'ora")
    });

    // B2.5: Virgole doppie (,, -> ,)
    t = t.replace(/,\s*,+/g, ',');

    // B3: Spazio dopo punteggiatura
    t = t.replace(/([.,;:!?])(?![\\s\\n"'»\)\d])/g, '$1 ');
    t = t.replace(/ {2,}/g, ' ');

    // B4: Virgola prima di "e"
    t = t.replace(/,\s+e\s+/g, ' e ');

    // B5: Virgola dopo "e"
    t = t.replace(/\se\s*,\s*/g, ' e ');

    // B6: Preposizioni articolate
    const prepMap: Record<string, string> = {
      ' a il ': ' al ', ' a lo ': ' allo ', ' a la ': ' alla ', ' a i ': ' ai ', ' a gli ': ' agli ', ' a le ': ' alle ',
      ' di il ': ' del ', ' di lo ': ' dello ', ' di la ': ' della ', ' di i ': ' dei ', ' di gli ': ' degli ', ' di le ': ' delle ',
      ' da il ': ' dal ', ' da lo ': ' dallo ', ' da la ': ' dalla ', ' da i ': ' dai ', ' da gli ': ' dagli ', ' da le ': ' dalle ',
      ' in il ': ' nel ', ' in lo ': ' nello ', ' in la ': ' nella ', ' in i ': ' nei ', ' in gli ': ' negli ', ' in le ': ' nelle ',
      ' su il ': ' sul ', ' su lo ': ' sullo ', ' su la ': ' sulla ', ' su i ': ' sui ', ' su gli ': ' sugli ', ' su le ': ' sulle '
    };

    for (const [wrong, right] of Object.entries(prepMap)) {
      const regex = new RegExp(wrong, 'gi');
      if (regex.test(t)) {
        t = t.replace(regex, right);
        this.report.corrections++;
      }
    }

    return t;
  }

  private fixCapitalization(text: string): string {
    let t = text;

    // 0. Maiuscola a inizio testo RIMOSSA (v57) su richiesta utente
    // Non forziamo maiuscola arbitraria se non c'è punteggiatura.
    
    // 1. Maiuscola dopo punto, punto esclamativo, punto interrogativo
    t = t.replace(/([.!?])\s+([a-zàèéìòóù])/g, (match, punct, letter) => {
      return punct + ' ' + letter.toUpperCase();
    });

    // 1.5 Capitalizzazione Nomi Propri (v57)
    // Lista di 400 nomi comuni (Italiani + Inglesi) da capitalizzare ovunque
    const properNames = new Set([
      // ITALIANI (Top 200 approx)
      "marco", "luca", "giuseppe", "francesco", "antonio", "giovanni", "mario", "luigi", "andrea", "paolo",
      "roberto", "stefano", "alessandro", "davide", "michele", "giorgio", "federico", "pietro", "nicola", "daniele",
      "maria", "anna", "giulia", "francesca", "chiara", "sara", "elena", "silvia", "laura", "martina",
      "valentina", "alessia", "giorgia", "elisa", "alice", "sofia", "roberta", "cristina", "manuela", "lucia",
      "simone", "matteo", "lorenzo", "gabriele", "filippo", "riccardo", "edoardo", "tommaso", "leonardo", "giacomo",
      "claudio", "vincenzo", "salvatore", "massimo", "sergio", "mauro", "fabio", "enrico", "nicolo", "emanuele",
      "mattia", "christian", "pietro", "domenico", "raffaele", "bruno", "carlo", "alberto", "diego", "dario",
      "federica", "simona", "daniela", "alessandra", "eleonora", "ilaria", "monica", "barbara", "paola", "sonia",
      "serena", "noemi", "greta", "aurora", "ginevra", "ludovica", "beatrice", "vittoria", "gaia", "camilla",
      "matilde", "emma", "viola", "rebecca", "nicole", "bianca", "adele", "mia", "azzurra", "gioia",
      "angelo", "vito", "franco", "renato", "gino", "enzo", "aldo", "nino", "pino", "tino",
      "rita", "rosa", "teresa", "angela", "giovanna", "antonella", "marina", "sabrina", "cinzia", "patrizia",
      
      // INGLESI (Top 200 approx)
      "james", "john", "robert", "michael", "william", "david", "richard", "joseph", "thomas", "charles",
      "christopher", "daniel", "matthew", "anthony", "donald", "mark", "paul", "steven", "andrew", "kenneth",
      "george", "joshua", "kevin", "brian", "edward", "ronald", "timothy", "jason", "jeffrey", "ryan",
      "jacob", "gary", "nicholas", "eric", "stephen", "jonathan", "larry", "justin", "scott", "brandon",
      "frank", "benjamin", "gregory", "samuel", "raymond", "patrick", "alexander", "jack", "dennis", "jerry",
      "mary", "patricia", "jennifer", "linda", "elizabeth", "barbara", "susan", "jessica", "sarah", "karen",
      "nancy", "lisa", "margaret", "betty", "sandra", "ashley", "dorothy", "kimberly", "emily", "donna",
      "michelle", "carol", "amanda", "melissa", "deborah", "stephanie", "rebecca", "laura", "sharon", "cynthia",
      "kathleen", "amy", "shirley", "angela", "helen", "anna", "brenda", "pamela", "nicole", "samantha",
      "katherine", "emma", "olivia", "ava", "isabella", "sophia", "charlotte", "mia", "amelia", "harper",
      "evelyn", "abigail", "ella", "scarlett", "grace", "chloe", "liam", "noah", "oliver", "elijah",
      "lucas", "mason", "logan", "ethan", "aiden", "jackson", "sebastian", "henry", "owen", "wyatt",
      "carter", "jayden", "dylan", "luke", "gabriel", "isaac", "leo", "julian", "mateo", "lincoln"
    ]);

    // Regex per trovare queste parole quando sono minuscole e non precedute da caratteri strani
    // \b assicura che sia una parola intera (non "marcom" o "saram")
    t = t.replace(/\b([a-zàèéìòóù]+)\b/g, (match) => {
      if (properNames.has(match)) {
        // Capitalizza la prima lettera
        return match.charAt(0).toUpperCase() + match.slice(1);
      }
      return match;
    });

    // 2. Minuscola dopo due punti (ANTI-ENGLISH BIAS) - FIX v40
    // In italiano, dopo i due punti la maiuscola è ERRORE (tranne nomi propri e discorso diretto).
    // I modelli AI (addestrati in inglese) tendono a mettere sempre la maiuscola.
    // Questa regola forza la minuscola in modo aggressivo per contrastare il bias nativo.
    
    t = t.replace(/:\s+([A-ZÀÈÉÌÒÓÙ][a-zA-Zàèéìòóù]*)/g, (match, word) => {
      // Eccezioni: Nomi propri comuni, Acronimi, Discorso diretto (virgolette)
      
      // Lista eccezioni (Nomi propri, Città, Acronimi comuni)
      const exceptions = [
        "Mario", "Luigi", "Giuseppe", "Francesco", "Antonio", "Giovanni", "Maria", "Anna", "Giulia", "Francesca", "Chiara", "Sara",
        "Roma", "Milano", "Napoli", "Torino", "Firenze", "Venezia", "Bologna", "Palermo", "Genova", "Bari", "Catania", "Verona",
        "Italia", "Europa", "America", "Asia", "Africa", "Oceania",
        "Dio", "Gesù", "Papa", "Presidente", "Re", "Regina",
        "Internet", "Web", "Google", "Facebook", "Amazon", "Apple", "Microsoft",
        "HTTP", "HTML", "CSS", "API", "PDF", "DOC", "DOCX", "USB", "WIFI",
        "ChatGPT", "GPT", "AI", "OpenAI", "Anthropic", "Claude", "Gemini", "Llama", "Mistral"
      ];

      // Controllo esteso usando anche il set di nomi propri (convertendo la parola in lowercase per il check)
      if (exceptions.includes(word) || properNames.has(word.toLowerCase())) {
        return match; // Mantieni maiuscola (Nome Proprio o Eccezione nota)
      }

      // ANTI-BIAS ENFORCEMENT:
      // Se non è nella lista eccezioni, assumiamo che sia un errore da "English Bias" e forziamo minuscolo.
      // Esempio: ": Perfetto" -> ": perfetto"
      // Esempio: ": Assumo" -> ": assumo"
      
      this.report.corrections++;
      return ': ' + word.toLowerCase();
    });

    return t;
  }

  private normalizeQuotes(text: string): string {
    let t = text;
    let open = false;
    
    // Normalizza virgolette curve e diverse in virgolette standard (o caporali se preferito, qui usiamo caporali come da richiesta implicita nel codice python originale)
    // Il codice python originale usava una mappa VIRGOLETTE_SBAGLIATE che convertiva " in « o »
    
    // Prima normalizziamo tutto a "
    t = t.replace(/[“”]/g, '"');
    
    // Poi convertiamo in caporali « »
    t = t.replace(/"/g, () => {
      open = !open;
      return open ? '«' : '»';
    });
    
    return t;
  }

  private applyAdvancedRules(text: string): string {
    let t = text;

    // Litoti
    const litotiMap: Record<string, string> = {
      "non è male": "è buono", "non è brutto": "è bello", "non è difficile": "è facile",
      "non è poco": "è molto", "non è impossibile": "è possibile", "non è assente": "è presente",
      "non è diverso": "è uguale", "non è raro": "è comune"
    };

    for (const [wrong, right] of Object.entries(litotiMap)) {
      const regex = new RegExp(wrong, 'gi');
      if (regex.test(t)) {
        // NOTA: Per ora non sostituiamo automaticamente le litoti per non alterare lo stile, 
        // ma potremmo abilitarlo se richiesto. Il codice Python originale chiedeva conferma.
        // Qui ci limitiamo a segnalarlo nel report se volessimo, ma per ora lasciamo stare.
        // t = t.replace(regex, right); 
        // this.report.corrections++;
      }
    }

    // Pleonasmi
    const pleonasmiMap: Record<string, string> = {
      "a me mi": "a me", "ma però": "ma", "uscire fuori": "uscire", "scendere giù": "scendere",
      "salire su": "salire", "entrare dentro": "entrare", "protagonista principale": "protagonista",
      "breve attimo": "attimo", "piccolo dettaglio": "dettaglio", "collaborare insieme": "collaborare"
    };

    for (const [wrong, right] of Object.entries(pleonasmiMap)) {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      if (regex.test(t)) {
        t = t.replace(regex, right);
        this.report.corrections++;
      }
    }
    
    // Periodi spezzati (Analisi Logica)
    // Unisce frasi che iniziano con congiunzioni dopo un punto
    // Es: ". Ma" -> ", ma" | ". E" -> ", e" | ". Perché" -> ", perché"
    t = t.replace(/\.\s+(E|Ma|O|Oppure|Perché|Poiché|Quindi|Infatti)\s+/g, (match, conj) => {
      this.report.corrections++;
      return `, ${conj.toLowerCase()} `;
    });

    return t;
  }

  private applyNamedEntities(text: string): string {
    let t = text;
    
    // 4. NAMED ENTITY CAPITALIZATION (v49 - Metodo dedicato)
    // Forza la maiuscola per nomi propri famosi (artisti, filosofi, ecc.)
    // Eseguito alla fine per correggere eventuali minuscole introdotte da Colon List Reflow o Anti-Bias
    const famousNames = [
      // Artisti (richiesti dall'utente)
      "Duchamp", "Fontana", "Manzoni", "Cage", "Koons", "Hirst", "Banksy",
      "Picasso", "Dalì", "Warhol", "Pollock", "Rothko", "Basquiat", "Haring",
      "Caravaggio", "Michelangelo", "Leonardo", "Raffaello", "Bernini", "Giotto",
      "Cattelan", "Abramovic", "Beuys", "Kandinsky", "Klee", "Mondrian",
      
      // Filosofi e Pensatori
      "Nietzsche", "Kant", "Hegel", "Marx", "Freud", "Jung", "Lacan",
      "Platone", "Aristotele", "Socrate", "Cartesio", "Spinoza", "Leibniz",
      "Heidegger", "Wittgenstein", "Sartre", "Foucault", "Derrida", "Deleuze",
      "Schopenhauer", "Kierkegaard", "Hume", "Locke", "Hobbes", "Rousseau",
      
      // Scrittori e Poeti
      "Dante", "Petrarca", "Boccaccio", "Leopardi", "Manzoni", "Pascoli",
      "Shakespeare", "Goethe", "Tolstoj", "Dostoevskij", "Kafka", "Proust",
      "Joyce", "Woolf", "Hemingway", "Orwell", "Calvino", "Eco", "Pasolini"
    ];

    // Crea una regex ottimizzata: \b(duchamp|fontana|...)\b con flag 'gi'
    // Rimuoviamo duplicati usando filter invece di Set per compatibilità TS
    const uniqueNames = famousNames.filter((item, index) => famousNames.indexOf(item) === index);
    const namesPattern = uniqueNames.join("|");
    const namesRegex = new RegExp(`\\b(${namesPattern})\\b`, 'gi');

    t = t.replace(namesRegex, (match) => {
      // Restituisci il nome come scritto nel dizionario (con la maiuscola corretta)
      // Cerchiamo il match nel dizionario originale per avere la capitalizzazione corretta
      const correctName = uniqueNames.find(n => n.toLowerCase() === match.toLowerCase());
      return correctName || match; // Fallback (non dovrebbe accadere)
    });
    
    return t;
  }

  /**
   * NUOVO: Correzione Ortografica Euristica
   * Corregge errori comuni come vocali ripetute a fine parola
   * (Nota: La logica principale è stata spostata nella funzione applySpellCheck sopra definita)
   */
  private applySpellCheckLegacy(text: string): string {
    // Legacy wrapper, non più usato direttamente ma tenuto per riferimento
    return this.applySpellCheck(text);
  }
  
  private applyLayoutRules(text: string): string {
    let t = text;
    
    // 1. Normalizza "CAPITOLO" in "Capitolo"
    t = t.replace(/\bCAPITOLO\b/g, "Capitolo");
    


    // 2. REGOLA DEL RESPIRO v38 (Ricostruzione Strutturale)
    if (this.options.enableBreathing) {
      // Ignora i paragrafi originali e raggruppa le frasi in blocchi di 3.
      
      // Step 1: Identifica i blocchi "intoccabili" (Titoli, Page Break)
      // Usiamo un placeholder univoco per proteggerli
      const protectedBlocks: string[] = [];
      t = t.replace(/^(Capitolo.*|.*\[PAGE_BREAK\].*)$/gm, (match) => {
        protectedBlocks.push(match);
        return `__PROTECTED_BLOCK_${protectedBlocks.length - 1}__`;
      });

      // Step 2: Unisci tutto il resto in un unico flusso (Reflow totale)
      // Sostituisci i newline con spazi, poi normalizza gli spazi
      t = t.replace(/\n/g, ' ').replace(/\s+/g, ' ');

      // Step 2.5: LIST DETECTION (Fix v43 + v48 Colon Reflow)
      if (this.options.enableListDetection) {
        // A. COLON LIST REFLOW (Specifica per elenchi dopo i due punti)
        // Se troviamo ": ", cerchiamo di unire le frasi successive se sono brevi (< 8 parole)
        // Esempio: "deve: scaldarsi. Nutrirsi. Proteggersi." -> "deve: scaldarsi, nutrirsi, proteggersi."
        
        // Strategia: Troviamo i due punti, poi guardiamo avanti.
        // Usiamo una replace con funzione di callback che analizza il contesto successivo.
        // Cerchiamo ": " seguito da una sequenza di frasi che terminano con punto.
        
        // Regex: Due punti, spazio, parola, (qualsiasi cosa fino al punto), punto.
        // Ripetuto più volte.
        
        // Semplificazione: Applichiamo una trasformazione iterativa specifica per i segmenti dopo i due punti.
        // Cerchiamo pattern ": ... . Maiuscola ..."
        
        // 1. Identifica segmenti che iniziano con ":"
        // 2. All'interno di questi segmenti, trasforma ". Maiuscola" in ", minuscola" se la frase è breve.
        
        // Implementazione robusta:
        // Cerca ": " seguito da testo. Se il testo successivo è una serie di frasi brevi, uniscile.
        // Limite: guardiamo le prossime 3 frasi.
        
        // Approccio Regex Globale Migliorato:
        // Cerca pattern: Punto + Spazio + Maiuscola + (testo breve) + Punto
        // MA con tolleranza maggiore (fino a 6 parole) se siamo in un contesto di elenco (difficile da sapere senza lookbehind variabile).
        
        // Invece, potenziamo la regola esistente aumentando il range di parole consentite (da 3 a 6)
        // e gestendo meglio i casi limite.
        
        const MAX_LIST_ITEM_WORDS = 6; // Aumentato da 3 a 6 per catturare "Mantenere beni e relazioni"
        
        // Regex dinamica
        // \.\s+([A-ZÀÈÉÌÒÓÙ][a-zàèéìòóù]*(?:\s+[a-zàèéìòóù,]+){0,6})(?=\.|$)
        // FIX v51: Cambiato [a-z]+ in [a-z]* per accettare singole lettere maiuscole (E, O, A)
        // Questo risolve "Latte. E uova." -> "latte, e uova." (prima la "E" veniva ignorata)
        const listRegex = new RegExp(`\\.\\s+([A-ZÀÈÉÌÒÓÙ][a-zàèéìòóù]*(?:\\s+[a-zàèéìòóù,]+){0,${MAX_LIST_ITEM_WORDS}})(?=\\.|\\s+(?:E|Ma|O|Oppure)\\b|$)`, 'g');
        
        // Eseguiamo 3 passaggi per catturare elenchi lunghi (A. B. C. D.)
        for (let i = 0; i < 3; i++) {
            t = t.replace(listRegex, (match, content) => {
               // Trasforma in virgola + minuscola
               return `, ${content.toLowerCase()}`;
            });
        }
        
        // B. COLON SPECIFIC FIX (Per il primo elemento dopo i due punti)
        // Gestisce: ": Parola. Parola." -> ": parola, parola."
        // La regola sopra (listRegex) gestisce dal secondo elemento in poi (che ha un punto prima).
        // Qui gestiamo il primo elemento se è seguito da un punto che è stato trasformato in virgola dalla regola sopra,
        // OPPURE se è seguito da un punto che deve diventare virgola.
        
        // Caso: ": Parola. " -> ": parola, " se segue minuscola (che è stata trasformata sopra)
        // Regex: : Spazio Parola Punto Spazio (seguito da minuscola)
        // Esempio: "Ecco: Correre. Saltare." -> (step A) "Ecco: Correre, saltare." -> (step B) "Ecco: correre, saltare."
        
        // Trasforma ": Parola, " in ": parola, " (accetta anche minuscola iniziale)
        t = t.replace(/:\s+([a-zA-ZÀÈÉÌÒÓÙ][a-zàèéìòóù]+(?:\\s+[a-zàèéìòóù,]+){0,6}),\s+/g, (match, content) => {
           return `: ${content.toLowerCase()}, `;
        });

        // Trasforma ": Parola. " in ": parola, " se segue una minuscola (che indica che la frase dopo è stata unita)
        // Accetta anche minuscola iniziale (es. ": correre. Saltare." -> ": correre, saltare.")
        t = t.replace(/:\s+([a-zA-ZÀÈÉÌÒÓÙ][a-zàèéìòóù]+(?:\\s+[a-zàèéìòóù,]+){0,6})\.\s+(?=[a-zàèéìòóù])/g, (match, content) => {
           return `: ${content.toLowerCase()}, `;
        });
      }

      // Step 3: Spezza in frasi
      // Una frase finisce con . ! ? seguito da spazio o fine stringa
      // Attenzione: non spezzare su abbreviazioni comuni (es. "art.", "pag.") - gestione base qui
      // Usiamo un lookbehind positivo simulato o split intelligente
      // Regex: (qualsiasi cosa che finisce con .!?)(spazio o fine)
      const sentences = t.match(/[^.!?]+[.!?]+(\s|$)/g);

      if (sentences) {
        let newFlow = "";
        let sentenceCount = 0;

        for (let i = 0; i < sentences.length; i++) {
          let s = sentences[i].trim();
          
          // Se è un blocco protetto, inseriscilo su una nuova riga e resetta il conteggio
          if (s.includes("__PROTECTED_BLOCK_")) {
             // Ripristina il contenuto originale
             s = s.replace(/__PROTECTED_BLOCK_(\d+)__/g, (_, index) => protectedBlocks[parseInt(index)]);
             // Aggiungi newline prima e dopo per isolarlo
             newFlow += (newFlow ? "\n\n" : "") + s + "\n\n";
             sentenceCount = 0; // Resetta il contatore frasi
             continue;
          }

          // Aggiungi la frase
          newFlow += s + " ";
          
          // Conta le parole nella frase corrente
          const wordCount = s.split(/\s+/).length;
          
          // FIX v44: Short Sentence Exception
          // Se la frase è molto breve (< 5 parole), NON incrementare il contatore per il "respiro".
          // Questo evita che frasi ellittiche come "Il poeta no." spezzino il ritmo prematuramente.
          // Eccezione: se è l'ultima frase del testo, non importa.
          if (wordCount >= 5) {
             sentenceCount++;
          }

          // Ogni 3 frasi "piene", vai a capo con riga vuota
          if (sentenceCount > 0 && sentenceCount % 3 === 0) {
            newFlow += "\n\n";
            // Reset parziale per evitare doppi a capo se la prossima è breve? 
            // No, il modulo gestisce la ciclicità. Ma dobbiamo evitare che scatti ripetutamente
            // se arrivano solo frasi brevi dopo.
            // Meglio: resettiamo il contatore o usiamo un flag?
            // Approccio semplice: lasciamo che il modulo faccia il suo lavoro, ma resettiamo
            // il contatore a 0 per ricominciare il ciclo pulito.
            sentenceCount = 0; 
          }
        }
        t = newFlow.trim();
      } else {
        // Fallback se non trova frasi (es. testo senza punteggiatura)
        // Ripristina i blocchi protetti
        t = t.replace(/__PROTECTED_BLOCK_(\d+)__/g, (_, index) => protectedBlocks[parseInt(index)]);
      }
    }
    
    return t.trim();
  }

  private calculateStats(text: string) {
    this.report.stats.chars = text.length;
    const words = text.trim().split(/\s+/);
    this.report.stats.words = text.trim() === '' ? 0 : words.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    this.report.stats.sentences = sentences.length;
    const minutes = Math.ceil(this.report.stats.words / 200);
    this.report.stats.readingTime = `${minutes} min`;
  }

  /**
   * FASE I: Integrity Check
   * Analizza il testo finale per rilevare anomalie strutturali gravi
   * come parole concatenate ("GiorgioSono") o eccessivamente lunghe.
   */
  private checkIntegrity(text: string) {
    const anomalies: string[] = [];
    const words = text.split(/\s+/);
    
    // 1. Controllo CamelCase anomalo (es. "GiorgioSono", "fineInizio")
    // Ignora parole che iniziano con maiuscola (nomi propri) se non hanno altre maiuscole interne
    // Regex: trova parola che ha una minuscola seguita subito da una maiuscola
    const camelCaseRegex = /[a-zàèéìòóù][A-ZÀÈÉÌÒÓÙ]/;
    
    // 2. Controllo lunghezza eccessiva (es. "precipitevolissimevolmente" è 26, usiamo 25 come soglia sicura)
    // Parole > 25 caratteri sono quasi certamente errori di concatenazione
    const MAX_WORD_LENGTH = 25;

    // 3. Controllo punteggiatura inglobata (es. "parola.Altra")
    // Regex: lettera + punto/virgola + lettera (senza spazio)
    // Nota: split(/\s+/) separa per spazi, quindi "fine.Inizio" è una sola parola per questo loop.
    const stuckPunctuationRegex = /[a-zA-Zàèéìòóù][.,;:][a-zA-Zàèéìòóù]/;

    let camelCount = 0;
    let longCount = 0;
    let stuckCount = 0;

    // Analizza un campione o tutte le parole? Tutte è meglio per report accurati.
    words.forEach(w => {
      // Pulisci la parola da punteggiatura esterna per il controllo lunghezza
      const cleanWord = w.replace(/^[.,;:()"]+|[.,;:()"]+$/g, "");
      
      if (cleanWord.length > MAX_WORD_LENGTH && !cleanWord.startsWith("http")) {
        longCount++;
        this.report.anomalies.push({ word: cleanWord, type: 'longWord', description: 'Parola troppo lunga' });
        if (longCount <= 3) anomalies.push(`Parola sospetta (troppo lunga): "${cleanWord}"`);
      }

      if (camelCaseRegex.test(w) && !w.startsWith("http") && !w.includes("iPhone") && !w.includes("eBay") && !w.includes("YouTube")) {
        camelCount++;
        this.report.anomalies.push({ word: w, type: 'camelCase', description: 'Maiuscola interna' });
        if (camelCount <= 3) anomalies.push(`Parola sospetta (CamelCase): "${w}"`);
      }

      if (stuckPunctuationRegex.test(w) && !w.startsWith("http") && !w.match(/\d[.,]\d/)) { // Escludi numeri decimali/orari
        stuckCount++;
        this.report.anomalies.push({ word: w, type: 'stuckPunctuation', description: 'Punteggiatura inglobata' });
        if (stuckCount <= 3) anomalies.push(`Punteggiatura inglobata: "${w}"`);
      }
    });

    if (camelCount > 0 || longCount > 0 || stuckCount > 0) {
      this.report.details.push(`⚠️ ALERT INTEGRITÀ: Rilevate possibili anomalie nel testo!`);
      if (camelCount > 0) this.report.details.push(`- ${camelCount} parole con maiuscole interne (es. "GiorgioSono"). Possibile spazio mancante.`);
      if (longCount > 0) this.report.details.push(`- ${longCount} parole eccessivamente lunghe (>25 caratteri). Possibile concatenazione.`);
      if (stuckCount > 0) this.report.details.push(`- ${stuckCount} casi di punteggiatura senza spazio (es. "fine.Inizio").`);
      
      // Aggiungi esempi specifici al report
      anomalies.forEach(a => this.report.details.push(`  • ${a}`));
    }
  }
}
