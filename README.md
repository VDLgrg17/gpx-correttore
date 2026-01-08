# GPX Correttore - Sistema di Correzione Editoriale

Applicazione web per la correzione automatica e la formattazione di manoscritti in lingua italiana. Progettata per gestire interi libri divisi in capitoli, garantendo un output professionale pronto per l'impaginazione.

## 🚀 Funzionalità Principali

### 1. Correzione Ortografica Intelligente
- **Doppie consonanti finali**: Corregge errori come "managementt" → "management".
- **Vocali doppie**: Corregge errori come "perchéé" → "perché".
- **Parole spezzate**: Unisce parole separate erroneamente (es. "ca sa" → "casa").
- **Dizionario Italiano**: Validazione basata su dizionario nspell.

### 2. Gestione Capitoli e File
- **Upload Multiplo**: Carica tutti i capitoli contemporaneamente (.docx o .txt).
- **Ordinamento Automatico**: Riconosce la struttura del libro dai nomi dei file:
  - Gestisce prefissi vari (es. "Manus-CAPITOLO1", "ManusCAPITOLO2").
  - Priorità intelligente per "Introduzione", "Premessa", "Prefazione".
  - Ordinamento numerico corretto (Capitolo 2 viene prima di Capitolo 10).
- **Unione Documenti**: Crea un unico file master rispettando l'ordine.

### 3. Formattazione ed Export Editoriale
- **Page Break Automatici**: Ogni capitolo inizia su una nuova pagina.
- **Stile Professionale**:
  - Font: Times New Roman 14pt.
  - Allineamento: Giustificato.
  - Interlinea: 1.5 righe.
  - Rientro prima riga: 0.5 pollici (1.27 cm).
  - Margini: 2.54 cm su tutti i lati.
- **Titoli Capitoli**: Formattati automaticamente come Intestazione 1 (Centrato, Grassetto, 16pt).
- **Grassetto**: Supporto per sintassi markdown `**testo**` convertita in vero grassetto DOCX.

## 🛠 Utilizzo

1. **Caricamento**: Trascina i file dei capitoli nell'area di upload.
2. **Verifica Ordine**: Controlla che la lista dei file sia nell'ordine desiderato (il sistema li ordina automaticamente).
3. **Correzione**: Premi "Correggi Testo" per avviare l'analisi.
4. **Export**: Premi "Scarica DOCX" per ottenere il manoscritto formattato.

## 📦 Installazione Locale

```bash
# Installazione dipendenze
pnpm install

# Avvio server di sviluppo
pnpm dev
```

## 🏗 Struttura del Progetto

- `client/src/lib/gpx-engine.ts`: Motore di correzione (regole regex e dizionario).
- `client/src/lib/file-utils.ts`: Gestione file, ordinamento e generazione DOCX.
- `client/src/pages/Home.tsx`: Interfaccia utente principale.

## 📝 Note di Versione (v24)
- Risolto bug spaziatura eccessiva (rimosse righe vuote multiple).
- Implementato parsing grassetto per tag `**testo**`.
- Aggiornato font a 14pt per migliore leggibilità.
