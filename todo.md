# Project TODO

## Correttore Meccanico (Completato)
- [x] Motore GPX con 55+ regole regex
- [x] Gestione spazi, apostrofi, maiuscole, punteggiatura
- [x] Modalità ChatBook per dialoghi
- [x] Export DOCX e ePub
- [x] PWA con supporto offline

## Supervisore Editoriale AI (Completato)
- [x] Backend tRPC con endpoint aiSupervisor.analyze
- [x] Integrazione Gemini 2.5 Flash via invokeLLM
- [x] Chunking testo a 3000 parole per qualità analisi
- [x] Rilevamento refusi di fusione (es. "nonèpossibile" → "non è possibile")
- [x] Rilevamento frasi frammentate e miglioramento flusso
- [x] Report dettagliato con originale/corretto/motivazione
- [x] UI con pulsante "Supervisore AI" e banner risultato
- [x] Dialog "Report Supervisore AI" con lista correzioni
- [x] Test vitest per splitIntoChunks e schema validazione

## Da Analizzare (Richieste Precedenti)
- [ ] Analizzare contenuto e stile di `ManusINTRODUZIONE.docx`
- [ ] Analizzare contenuto e stile di `Manus-CAPITOLO1.docx`
- [ ] Verificare gestione titoli, sottotitoli e liste puntate nei file originali

## Miglioramenti Supervisore AI
- [x] Migliorare prompt LLM per rilevamento frasi frammentate che ripetono lo stesso concetto
- [x] Aggiungere rilevamento uso errato presente invece di futuro (es. "Vengo domani" → "Verrò domani")
- [x] Aggiungere istruzione esplicita per non riscrivere testo senza errori
- [x] Aggiungere regola "Coerenza temporale nel contesto" - mantenere futuro quando il contesto lo richiede
