import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageBreak, Footer, PageNumber, NumberFormat } from "docx";
import { saveAs } from "file-saver";
import mammoth from "mammoth";
import JSZip from "jszip";

export interface FileData {
  name: string;
  content: string;
  order: number;
}

/**
 * Legge il contenuto di un file (.txt o .docx)
 */
export async function readFileContent(file: File): Promise<string> {
  if (file.name.endsWith(".docx")) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } else {
    return await file.text();
  }
}

/**
 * Ordina i file in base al nome (es. Capitolo 1, Capitolo 2...)
 * Cerca numeri nel nome file per ordinamento intelligente
 */
export function sortFiles(files: File[]): File[] {
  return files.sort((a, b) => {
    // Gestione priorità per Introduzione, Premessa, Prefazione
    const priorityWords = ["introduzione", "premessa", "prefazione", "prologo", "avvertenza"];
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    
    const priorityA = priorityWords.findIndex(w => nameA.includes(w));
    const priorityB = priorityWords.findIndex(w => nameB.includes(w));
    
    // Se entrambi sono prioritari, mantieni ordine relativo alla lista
    if (priorityA !== -1 && priorityB !== -1) return priorityA - priorityB;
    // Se solo A è prioritario, viene prima
    if (priorityA !== -1) return -1;
    // Se solo B è prioritario, viene prima
    if (priorityB !== -1) return 1;

    const numA = extractNumber(a.name);
    const numB = extractNumber(b.name);
    
    if (numA !== null && numB !== null) {
      return numA - numB;
    }
    return a.name.localeCompare(b.name);
  });
}

function extractNumber(name: string): number | null {
  const match = name.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/**
 * Esporta il testo corretto in un file .docx con formattazione editoriale
 */
export async function exportToDocx(text: string, filename: string = "Testo_Corretto.docx", format: 'standard' | 'kdp_a5' = 'standard') {
  // NORMALIZZAZIONE AGGRESSIVA PRE-ELABORAZIONE
  // 1. Sostituisce qualsiasi variante di [PAGE_BREAK] (con spazi, tab, case insensitive) con un token standard
  // 2. Rimuove caratteri invisibili che potrebbero rompere la regex
  const normalizedText = text
    .replace(/\[\s*PAGE[_\s]?BREAK\s*\]/gi, "\n[PAGE_BREAK_INTERNAL_TOKEN]\n");

  // Analizza il testo per identificare potenziali titoli (righe brevi tutte maiuscole o che iniziano con Capitolo)
  const lines = normalizedText.split('\n');
  const children = [];
  let emptyLineCount = 0;
  let pendingPageBreak = false;
  let expectSubtitle = false; // Flag per indicare che la prossima riga potrebbe essere un sottotitolo
  let currentSpeaker = "none"; // "user", "bot", "none"

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Gestione Page Break esplicito (Token Interno Sicuro)
    if (trimmed === "[PAGE_BREAK_INTERNAL_TOKEN]") {
      pendingPageBreak = true;
      emptyLineCount = 0;
      continue;
    }

    // Ignora righe vuote per evitare spazi eccessivi
    if (!trimmed) {
      continue;
    }

    // CHATBOOK LOGIC: Speaker Detection
    if (trimmed.match(/^Hai detto:/i)) {
      currentSpeaker = "user";
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 400, after: 100 }, // Spazio extra sopra
          children: [
            new TextRun({
              text: "HAI DETTO:",
              font: "Times New Roman",
              bold: true,
              size: 24, // 12pt
              color: "4A5568", // Slate-700
            })
          ]
        })
      );
      expectSubtitle = false;
      continue;
    } else if (trimmed.match(/^ChatGPT ha detto:/i)) {
      currentSpeaker = "bot";
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 400, after: 100 }, // Spazio extra sopra
          children: [
            new TextRun({
              text: "CHATGPT HA DETTO:",
              font: "Times New Roman",
              bold: true,
              size: 24, // 12pt
              color: "0D9488", // Teal-600
            })
          ]
        })
      );
      expectSubtitle = false;
      continue;
    }

    // PRIORITÀ ASSOLUTA: Riconoscimento titoli capitolo (anche dentro ChatBook)
    // Deve essere controllato PRIMA della logica ChatBook per garantire formattazione corretta
    const isChapterTitleLine = /^Capitolo\s+\d+$/i.test(trimmed);
    
    if (isChapterTitleLine) {
      // Reset modalità chat quando incontriamo un capitolo
      currentSpeaker = "none";
      
      // OGNI capitolo DEVE iniziare su una nuova pagina (tranne se è il primo elemento)
      const shouldPageBreak = children.length > 0;
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          pageBreakBefore: shouldPageBreak,
          spacing: {
            before: 400,
            after: 300,
          },
          children: [
            new TextRun({
              text: trimmed.toUpperCase(),
              font: "Times New Roman",
              bold: true,
              size: 28, // 14pt
              allCaps: true,
            })
          ]
        })
      );
      pendingPageBreak = false;
      expectSubtitle = true; // La prossima riga sarà il titolo del capitolo
      continue;
    }
    
    // Se siamo in modalità chat, renderizza il paragrafo senza spezzarlo e con lo stile appropriato
    if (currentSpeaker !== "none") {
      const parts = trimmed.split("**");
      const textRuns = parts.map((part, index) => {
        const isBold = index % 2 === 1;
        return new TextRun({
          text: part,
          font: "Times New Roman",
          size: 28, // 14pt
          bold: isBold,
          italics: currentSpeaker === "user", // CORSIVO PER UTENTE
          color: currentSpeaker === "user" ? "4A5568" : "000000", // Leggermente grigio per utente
        });
      });

      children.push(
        new Paragraph({
          children: textRuns,
          alignment: AlignmentType.JUSTIFIED,
          spacing: { line: 360, after: 240 },
          indent: currentSpeaker === "user" ? { left: 720 } : undefined, // Indentazione per utente (quote style)
          border: currentSpeaker === "user" ? { left: { color: "E2E8F0", space: 10, style: "single", size: 6 } } : undefined // Bordo sinistro per utente
        })
      );
      continue;
    }

    // Euristica per titoli capitolo e sezioni strutturali (SOLO SE NON IN CHAT)
    const structuralTitles = ["introduzione", "prefazione", "premessa", "conclusione", "prologo", "epilogo", "ringraziamenti", "bibliografia", "indice"];
    const isStructuralTitle = structuralTitles.includes(trimmed.toLowerCase());
    
    const isChapterTitle = /^Capitolo\s+\d+/i.test(trimmed) || 
                           (trimmed.length < 50 && trimmed === trimmed.toUpperCase() && trimmed.length > 3) ||
                           isStructuralTitle;
    
    if (isChapterTitle) {
      // OGNI capitolo DEVE iniziare su una nuova pagina (tranne se è il primo elemento)
      const shouldPageBreak = children.length > 0; // Page break se c'è già contenuto prima
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          pageBreakBefore: shouldPageBreak || pendingPageBreak,
          spacing: {
            before: 400, // Spazio prima
            after: 300,  // Spazio dopo
          },
          children: [
            new TextRun({
              text: trimmed,
              font: "Times New Roman",
              bold: true, // GRASSETTO FORZATO
              size: 28,   // 14pt RICHIESTO (28 half-points)
              allCaps: true,
            })
          ]
        })
      );
      pendingPageBreak = false;
      expectSubtitle = true; // Attiva la ricerca del sottotitolo per la prossima riga
    } else if (expectSubtitle && trimmed.length > 0 && trimmed.length < 150) {
      // GESTIONE SOTTOTITOLO (La riga subito dopo il capitolo)
      // Se è una riga ragionevolmente breve (non un paragrafo intero), la trattiamo come sottotitolo
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER, // CENTRATO
          spacing: {
            before: 0,
            after: 300, // Spazio dopo il sottotitolo
          },
          children: [
            new TextRun({
              text: trimmed,
              font: "Times New Roman",
              bold: true, // GRASSETTO
              size: 28,   // 14pt
            })
          ]
        })
      );
      expectSubtitle = false; // Sottotitolo trovato, disattiva flag
    } else {
      expectSubtitle = false; // Se la riga è troppo lunga o vuota, non è un sottotitolo, resetta flag
      
      // REGOLA DEI 3 PERIODI: Spezza il paragrafo ogni 3 frasi
      // Regex per identificare la fine di una frase (. ! ? seguiti da spazio o fine riga)
      // Usiamo un lookbehind positivo o catturiamo il delimitatore per non perderlo
      const sentences = trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed];
      
      let currentChunk: string[] = [];
      
      // Funzione helper per creare un paragrafo da un array di frasi
      const createParagraphFromSentences = (sentencesToJoin: string[], isFirst: boolean) => {
        const textContent = sentencesToJoin.join("").trim();
        if (!textContent) return;

        const parts = textContent.split("**");
        const textRuns = parts.map((part, index) => {
          const isBold = index % 2 === 1;
          return new TextRun({
            text: part,
            font: "Times New Roman",
            size: 28, // 14pt
            bold: isBold,
          });
        });

        children.push(
          new Paragraph({
            children: textRuns,
            alignment: AlignmentType.JUSTIFIED,
            pageBreakBefore: isFirst ? pendingPageBreak : false, // Solo il primo blocco eredita il page break
            spacing: {
              line: 360, // Interlinea 1.5
              after: 240, // Spazio dopo ogni blocco (12pt) per far "respirare" il testo
            }
          })
        );
      };

      // Raggruppa le frasi a blocchi di 3
      let sentenceCount = 0;
      let isFirstChunk = true;

      for (const sentence of sentences) {
        currentChunk.push(sentence);
        sentenceCount++;

        if (sentenceCount === 3) {
          createParagraphFromSentences(currentChunk, isFirstChunk);
          currentChunk = [];
          sentenceCount = 0;
          isFirstChunk = false;
          pendingPageBreak = false; // Reset dopo il primo utilizzo
        }
      }

      // Scrivi eventuali frasi rimanenti (meno di 3)
      if (currentChunk.length > 0) {
        createParagraphFromSentences(currentChunk, isFirstChunk);
        pendingPageBreak = false;
      }
    }
  }

  // Configurazione Pagina in base al formato
  const pageConfig = format === 'kdp_a5' ? {
    // FORMATO A5 (Bruno Editore Style)
    size: {
      width: 8390, // 14.8 cm (A5 width)
      height: 11906, // 21.0 cm (A5 height)
    },
    margin: {
      top: 850,    // 1.5 cm
      bottom: 850, // 1.5 cm
      left: 1134,  // 2.0 cm (Interno/Gutter per rilegatura)
      right: 850,  // 1.5 cm (Esterno)
      mirror: true // Margini speculari per stampa fronte-retro
    }
  } : {
    // FORMATO STANDARD A4
    margin: {
      top: 1440, // 2.54 cm
      right: 1440,
      bottom: 1440,
      left: 1440,
    }
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          page: pageConfig,
        },
        // Aggiungi numeri di pagina nel footer per KDP
        footers: format === 'kdp_a5' ? {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: "Times New Roman",
                    size: 24, // 12pt
                  })
                ],
              }),
            ],
          }),
        } : undefined,
        children: children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

/**
 * Esporta il testo corretto in formato ePub
 */
export interface EpubOptions {
  fontFamily: 'serif' | 'sans-serif' | 'monospace';
  fontSize: string; // es. "1em", "1.2em"
  margin: string; // es. "5%", "10%"
  isChatMode?: boolean; // v68: Chat Mode
}

export async function exportToEpub(text: string, filename: string = "Libro.epub", options: EpubOptions = { fontFamily: 'serif', fontSize: '1em', margin: '5%', isChatMode: false }) {
  const zip = new JSZip();
  const title = "Libro Corretto GPX";
  const author = "GPX Correttore";
  const uuid = "urn:uuid:" + crypto.randomUUID();

  // 1. Normalizza il testo e dividi in capitoli
  const normalizedText = text.replace(/\[\s*PAGE[_\s]?BREAK\s*\]/gi, "[PAGE_BREAK]");
  const chapters = normalizedText.split("[PAGE_BREAK]").filter(c => c.trim().length > 0);

  // 2. Crea mimetype
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

  // 3. Crea container.xml
  zip.file("META-INF/container.xml", `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

  // Helper per escape XML
  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  // 4. Prepara contenuto capitoli
  const chapterFiles: string[] = [];
  const manifestItems: string[] = [];
  const spineItems: string[] = [];
  const navPoints: string[] = [];

  chapters.forEach((chapterContent, index) => {
    const chapterId = `chapter_${index + 1}`;
    const chapterFilename = `${chapterId}.xhtml`;
    chapterFiles.push(chapterFilename);

    // Estrai titolo (prima riga non vuota)
    const lines = chapterContent.trim().split('\n');
    const firstLine = lines.find(l => l.trim().length > 0);
    
    // Logica intelligente per il titolo:
    // Usa la prima riga come titolo SOLO se è breve (< 100 caratteri) e non termina con punteggiatura discorsiva (., ;)
    // Altrimenti usa un titolo generico "Capitolo X" e tratta la prima riga come testo normale.
    let titleLine: string | null = null;
    let displayTitle = `Capitolo ${index + 1}`;
    
    if (firstLine && firstLine.length < 100 && !firstLine.match(/[.;:,]$/)) {
      titleLine = firstLine;
      displayTitle = firstLine.replace(/[*_]/g, '').substring(0, 50);
    }

    const cleanTitle = escapeXml(displayTitle);

    // CHATBOOK LOGIC: Rilevamento automatico se non forzato
    let isChatBook = options.isChatMode;
    if (isChatBook === undefined) {
       // Euristiche: conta occorrenze di "Hai detto:" e "ChatGPT ha detto:"
       const userMatches = (chapterContent.match(/Hai detto:/gi) || []).length;
       const botMatches = (chapterContent.match(/ChatGPT ha detto:/gi) || []).length;
       if (userMatches > 2 || botMatches > 2) {
         isChatBook = true;
       }
    }

    let htmlContent = "";
    
    if (isChatBook) {
      // MODALITÀ CHATBOOK
      let currentSpeaker = "none"; // "user", "bot", "none"
      
      htmlContent = lines.map(line => {
        if (!line.trim()) return "";
        let safeLine = escapeXml(line);
        safeLine = safeLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Rileva cambio speaker
        if (line.match(/^Hai detto:/i)) {
          currentSpeaker = "user";
          // Label separata con riga vuota sopra (gestita via CSS margin-top)
          return `<p class="chat-label-user">Hai detto:</p>`;
        } else if (line.match(/^ChatGPT ha detto:/i)) {
          currentSpeaker = "bot";
          return `<p class="chat-label-bot">ChatGPT ha detto:</p>`;
        } else if (line.match(/^.*?Hai detto:/i)) {
           // Caso in cui "Hai detto:" è inline ma all'inizio di una frase dopo punto?
           // Per ora gestiamo solo inizio riga o split precedente.
           // Se il testo è "Bla bla. Hai detto: Ciao", dovremmo averlo splittato prima?
           // Assumiamo che il correttore abbia mantenuto una struttura leggibile.
        }

        // Formatta contenuto in base allo speaker attivo
        if (currentSpeaker === "user") {
          // Utente: Corsivo
          return `<p class="chat-msg-user"><em>${safeLine}</em></p>`;
        } else if (currentSpeaker === "bot") {
          // Bot: Normale
          return `<p class="chat-msg-bot">${safeLine}</p>`;
        } else {
          // Testo narrativo o altro
          if (titleLine && line === titleLine) return `<h1>${safeLine}</h1>`;
          return `<p>${safeLine}</p>`;
        }
      }).join('\n');

    } else {
      // MODALITÀ STANDARD (Codice precedente)
      htmlContent = lines.map(line => {
        if (!line.trim()) return "";
        
        // Prima escape XML del contenuto grezzo
        let safeLine = escapeXml(line);
        
        // Poi ripristina il markup per il grassetto
        safeLine = safeLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Se questa riga è stata identificata come titolo, usa h1
        if (titleLine && line === titleLine) {
          return `<h1>${safeLine}</h1>`;
        }
        
        return `<p>${safeLine}</p>`;
      }).join('\n');
    }
    
    // Se non abbiamo usato la prima riga come titolo, aggiungiamo il titolo generico all'inizio dell'HTML
    // Ma solo se non c'è già un h1 (che non dovrebbe esserci se titleLine è null)
    let finalHtmlContent = htmlContent;
    if (!titleLine) {
       // Opzionale: Aggiungere <h1>Capitolo X</h1> all'inizio?
       // Per ora lasciamo che il reader usi il TOC, o aggiungiamo un h1 nascosto/visibile?
       // Meglio aggiungere un h1 visibile per coerenza visiva.
       finalHtmlContent = `<h1>${cleanTitle}</h1>\n${htmlContent}`;
    }

    const xhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>${cleanTitle}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  ${finalHtmlContent}
</body>
</html>`;

    zip.file(`OEBPS/${chapterFilename}`, xhtml);

    manifestItems.push(`<item id="${chapterId}" href="${chapterFilename}" media-type="application/xhtml+xml"/>`);
    spineItems.push(`<itemref idref="${chapterId}"/>`);
    navPoints.push(`<navPoint id="navPoint-${index + 1}" playOrder="${index + 1}">
      <navLabel><text>${cleanTitle}</text></navLabel>
      <content src="${chapterFilename}"/>
    </navPoint>`);
  });

  // 5. Crea style.css
  zip.file("OEBPS/style.css", `body { font-family: ${options.fontFamily}; font-size: ${options.fontSize}; line-height: 1.5; margin: ${options.margin}; }
h1 { text-align: center; page-break-before: always; color: #333; }
p { text-align: justify; margin-bottom: 1em; }

/* ChatBook Styles */
.chat-label-user {
  font-weight: bold;
  margin-top: 2em; /* Riga vuota sopra */
  margin-bottom: 0.5em;
  text-align: left;
  color: #2c3e50;
}
.chat-label-bot {
  font-weight: bold;
  margin-top: 2em; /* Riga vuota sopra */
  margin-bottom: 0.5em;
  text-align: left;
  color: #16a085;
}
.chat-msg-user {
  font-style: italic; /* Richiesta specifica: corsivo per umano */
  text-align: left;
  margin-bottom: 1em;
  color: #34495e;
}
.chat-msg-bot {
  font-style: normal;
  text-align: left;
  margin-bottom: 1em;
  color: #2c3e50;
}`);

  // 6. Crea content.opf
  const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${title}</dc:title>
    <dc:creator opf:role="aut">${author}</dc:creator>
    <dc:language>it</dc:language>
    <dc:identifier id="BookId" opf:scheme="UUID">${uuid}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="style" href="style.css" media-type="text/css"/>
    ${manifestItems.join('\n    ')}
  </manifest>
  <spine toc="ncx">
    ${spineItems.join('\n    ')}
  </spine>
</package>`;

  zip.file("OEBPS/content.opf", opf);

  // 7. Crea toc.ncx (Table of Contents per ePub 2)
  const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${uuid}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${title}</text></docTitle>
  <navMap>
    ${navPoints.join('\n    ')}
  </navMap>
</ncx>`;

  zip.file("OEBPS/toc.ncx", ncx);

  // Genera e salva
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, filename);
}
