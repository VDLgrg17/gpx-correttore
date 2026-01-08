import { FileList, FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { exportToDocx, exportToEpub, readFileContent, sortFiles } from "@/lib/file-utils";
import { DEFAULT_OPTIONS, GPXEngine, GPXOptions, GPXResult } from "@/lib/gpx-engine";
import { AlertTriangle, BookOpen, Copy, Download, FileText, RefreshCw, Settings, Trash2, Wand2, Printer, Brain, Loader2, Type, Clock, Quote, Sparkles, Pause, Play, Square, BookMarked, Edit3, Check, X, Save, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import jsPDF from "jspdf";

// Tipi di check AI disponibili
type AICheckType = "refusiFusione" | "periodiFrammentati" | "tempiVerbali" | "refusiSemantici" | "virgolaRespira";

// Tipo per le proposte di capitoli
type ChapterProposal = {
  number: number;
  title: string;
  description: string;
  insertPosition: number;
  previewText: string;
};

// Configurazione dei 5 pulsanti AI
const AI_CHECKS: { key: AICheckType; label: string; icon: typeof Brain; color: string }[] = [
  { key: "refusiFusione", label: "Refusi di Fusione", icon: Type, color: "from-red-500 to-orange-500" },
  { key: "periodiFrammentati", label: "Periodi Frammentati", icon: Sparkles, color: "from-amber-500 to-yellow-500" },
  { key: "tempiVerbali", label: "Tempi Verbali", icon: Clock, color: "from-blue-500 to-cyan-500" },
  { key: "refusiSemantici", label: "Refusi Semantici", icon: Quote, color: "from-purple-500 to-pink-500" },
  { key: "virgolaRespira", label: "Punteggiatura e Respiro", icon: Brain, color: "from-green-500 to-emerald-500" },
];

// Tipo per i chunk info
type ChunkInfo = {
  index: number;
  wordCount: number;
  preview: string;
};

export default function Home() {

  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<GPXResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<GPXOptions>(DEFAULT_OPTIONS);
  const [newIgnoredWord, setNewIgnoredWord] = useState("");
  
  // ePub Options
  const [epubOptions, setEpubOptions] = useState({
    fontFamily: 'serif' as 'serif' | 'sans-serif' | 'monospace',
    fontSize: '1em',
    margin: '5%'
  });
  const [showEpubPreview, setShowEpubPreview] = useState(false);

  // AI Check state - modalità semi-automatica
  const [aiResult, setAiResult] = useState<{ correctedText: string; changes: Array<{ original: string; corrected: string; reason: string; position?: string }> } | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [currentAiCheck, setCurrentAiCheck] = useState<AICheckType | null>(null);
  const [showAiReport, setShowAiReport] = useState(false);
  const [lastCheckLabel, setLastCheckLabel] = useState<string>("");
  
  // Modalità semi-automatica sequenziale
  const [autoMode, setAutoMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [chunksInfo, setChunksInfo] = useState<ChunkInfo[]>([]);
  const [allChanges, setAllChanges] = useState<any[]>([]);
  const [processedChunks, setProcessedChunks] = useState<Map<number, string>>(new Map());
  const [currentChunkChanges, setCurrentChunkChanges] = useState<any[]>([]);
  
  // Ref per controllare lo stop
  const stopRequestedRef = useRef(false);
  const pauseRequestedRef = useRef(false);
  
  // tRPC mutations
  const getChunksInfoMutation = trpc.aiCheck.getChunksInfo.useMutation();
  const analyzeSingleChunkMutation = trpc.aiCheck.analyzeSingleChunk.useMutation();
  const analyzeChaptersMutation = trpc.aiCheck.analyzeChapters.useMutation();
  const insertChaptersMutation = trpc.aiCheck.insertChapters.useMutation();
  
  // Stato per i capitoli
  const [showChaptersModal, setShowChaptersModal] = useState(false);
  const [chaptersProposals, setChaptersProposals] = useState<ChapterProposal[]>([]);
  const [isAnalyzingChapters, setIsAnalyzingChapters] = useState(false);
  const [editingChapterIndex, setEditingChapterIndex] = useState<number | null>(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);

  const handleFilesSelected = async (files: File[]) => {
    const newFiles = [...uploadedFiles, ...files];
    const sortedFiles = sortFiles(newFiles);
    setUploadedFiles(sortedFiles);
    
    toast.loading("Lettura file in corso...", { id: "reading-files" });
    
    try {
      let fullText = "";
      for (let i = 0; i < sortedFiles.length; i++) {
        const file = sortedFiles[i];
        const content = await readFileContent(file);
        
        if (i > 0) {
          fullText += `\n\n[PAGE_BREAK]\n\n`;
        }
        fullText += content;
      }
      
      setInputText(fullText.trim());
      toast.success(`${sortedFiles.length} file caricati e uniti`, { id: "reading-files" });
    } catch (error) {
      console.error(error);
      toast.error("Errore nella lettura dei file", { id: "reading-files" });
    }
  };

  const handleRemoveFile = async (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    
    if (newFiles.length > 0) {
      let fullText = "";
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const content = await readFileContent(file);
        
        if (i > 0) {
          fullText += `\n\n[PAGE_BREAK]\n\n`;
        }
        fullText += content;
      }
      setInputText(fullText.trim());
    } else {
      setInputText("");
    }
  };

  const handleCorrect = async () => {
    if (!inputText.trim()) {
      toast.error("Inserisci del testo da correggere");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setResult(null);
    setAiResult(null);
    resetAutoMode();
    
    try {
      const engine = new GPXEngine(options);
      const res = await engine.correctAsync(inputText, (p) => setProgress(p));
      
      setResult(res);
      
      if (res.changed) {
        toast.success(`Correzione completata: ${res.report.corrections} modifiche`);
      } else {
        toast.info("Nessuna correzione necessaria");
      }
    } catch (error) {
      console.error(error);
      toast.error("Errore durante la correzione");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const resetAutoMode = () => {
    setAutoMode(false);
    setIsPaused(false);
    setCurrentChunkIndex(0);
    setTotalChunks(0);
    setChunksInfo([]);
    setAllChanges([]);
    setProcessedChunks(new Map());
    setCurrentChunkChanges([]);
    setCurrentAiCheck(null);
    stopRequestedRef.current = false;
    pauseRequestedRef.current = false;
  };

  // Funzione di pausa (sleep)
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Avvia la modalità semi-automatica sequenziale
  const handleStartAutoMode = async (checkType: AICheckType, label: string) => {
    const textToAnalyze = aiResult?.correctedText || result?.corrected;
    
    if (!textToAnalyze) {
      toast.error("Prima correggi il testo con il motore meccanico");
      return;
    }
    
    // Reset stato
    resetAutoMode();
    setLastCheckLabel(label);
    setCurrentAiCheck(checkType);
    setIsAiProcessing(true);
    stopRequestedRef.current = false;
    pauseRequestedRef.current = false;
    
    toast.loading("Preparazione analisi sequenziale...", { id: "auto-mode" });
    
    try {
      // Ottieni info sui chunk PRIMA di attivare autoMode
      const info = await getChunksInfoMutation.mutateAsync({ text: textToAnalyze });
      setChunksInfo(info.chunks);
      setTotalChunks(info.totalChunks);
      
      // Ora attiva autoMode con i dati già pronti
      setAutoMode(true);
      
      toast.dismiss("auto-mode");
      toast.success(`Avvio analisi: ${info.totalChunks} blocchi da elaborare`);
      
      // Inizia l'elaborazione sequenziale
      const newProcessedChunks = new Map<number, string>();
      const newAllChanges: any[] = [];
      
      for (let i = 0; i < info.totalChunks; i++) {
        // Controlla se è stato richiesto lo stop
        if (stopRequestedRef.current) {
          toast.info("Elaborazione interrotta dall'utente");
          break;
        }
        
        // Controlla se è in pausa
        while (pauseRequestedRef.current) {
          await sleep(500);
          if (stopRequestedRef.current) break;
        }
        
        if (stopRequestedRef.current) break;
        
        setCurrentChunkIndex(i);
        
        // Analizza il chunk corrente
        toast.loading(`Analisi blocco ${i + 1}/${info.totalChunks}...`, { id: "chunk-progress" });
        
        try {
          const chunkResult = await analyzeSingleChunkMutation.mutateAsync({
            text: textToAnalyze,
            chunkIndex: i,
            checkType: checkType,
          });
          
          // Salva il risultato
          newProcessedChunks.set(i, chunkResult.correctedText);
          setProcessedChunks(new Map(newProcessedChunks));
          
          if (chunkResult.changes.length > 0) {
            newAllChanges.push(...chunkResult.changes);
            setAllChanges([...newAllChanges]);
            setCurrentChunkChanges(chunkResult.changes);
          } else {
            setCurrentChunkChanges([]);
          }
          
          toast.dismiss("chunk-progress");
          
          if (chunkResult.changes.length > 0) {
            toast.success(`Blocco ${i + 1}: ${chunkResult.changes.length} correzioni`, { duration: 2000 });
          } else {
            toast.info(`Blocco ${i + 1}: nessuna correzione`, { duration: 1500 });
          }
          
          // Pausa intelligente tra i blocchi (2 secondi)
          if (i < info.totalChunks - 1 && !stopRequestedRef.current) {
            await sleep(2000);
          }
          
        } catch (error) {
          toast.dismiss("chunk-progress");
          toast.error(`Errore nel blocco ${i + 1}, continuo...`);
          // Continua con il prossimo blocco
          await sleep(1000);
        }
      }
      
      // Elaborazione completata - applica tutte le correzioni
      if (!stopRequestedRef.current || newProcessedChunks.size > 0) {
        applyAllCorrections(textToAnalyze, newProcessedChunks, newAllChanges, info.totalChunks);
      }
      
    } catch (error) {
      toast.dismiss("auto-mode");
      toast.error("Errore nell'avvio dell'analisi");
    } finally {
      setIsAiProcessing(false);
      setAutoMode(false);
      setCurrentAiCheck(null);
    }
  };

  // Applica tutte le correzioni
  const applyAllCorrections = (originalText: string, processedChunks: Map<number, string>, changes: any[], totalChunks: number) => {
    // Dividi il testo in chunk (stessa logica del backend)
    const paragraphs = originalText.split(/\n\n+/);
    const chunks: string[] = [];
    let currentChunk = "";
    let currentWordCount = 0;
    const maxWords = 1000;

    for (const paragraph of paragraphs) {
      const paragraphWordCount = paragraph.split(/\s+/).filter((w: string) => w.length > 0).length;
      
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
    
    // Applica le correzioni
    let finalText = "";
    
    for (let i = 0; i < chunks.length; i++) {
      const corrected = processedChunks.get(i);
      if (corrected) {
        finalText += (finalText ? "\n\n" : "") + corrected;
      } else {
        finalText += (finalText ? "\n\n" : "") + chunks[i];
      }
    }
    
    setAiResult({
      correctedText: finalText,
      changes: changes,
    });
    
    if (changes.length > 0) {
      toast.success(`Completato! ${changes.length} correzioni totali applicate`);
      setShowAiReport(true);
    } else {
      toast.info("Completato! Nessuna correzione necessaria");
    }
    
    // Mostra pulsante salva e traccia il check completato
    setShowSaveButton(true);
    if (currentAiCheck && !completedChecks.includes(currentAiCheck)) {
      setCompletedChecks(prev => [...prev, currentAiCheck]);
    }
  };

  // Pausa/Riprendi
  const handlePauseResume = () => {
    if (isPaused) {
      pauseRequestedRef.current = false;
      setIsPaused(false);
      toast.info("Ripresa elaborazione...");
    } else {
      pauseRequestedRef.current = true;
      setIsPaused(true);
      toast.info("Elaborazione in pausa");
    }
  };

  // Stop
  const handleStop = () => {
    stopRequestedRef.current = true;
    pauseRequestedRef.current = false;
    setIsPaused(false);
    toast.info("Interruzione in corso...");
  };

  // Funzione per analizzare e proporre capitoli
  const handleAnalyzeChapters = async () => {
    const textToAnalyze = aiResult?.correctedText || result?.corrected;
    
    if (!textToAnalyze) {
      toast.error("Prima correggi il testo con il motore meccanico");
      return;
    }
    
    setIsAnalyzingChapters(true);
    toast.loading("Analisi struttura capitoli in corso...", { id: "chapters" });
    
    try {
      const response = await analyzeChaptersMutation.mutateAsync({ text: textToAnalyze });
      setChaptersProposals(response.chapters);
      setShowChaptersModal(true);
      toast.dismiss("chapters");
      toast.success(`Trovati ${response.chapters.length} capitoli proposti`);
    } catch (error) {
      toast.dismiss("chapters");
      toast.error("Errore nell'analisi dei capitoli");
    } finally {
      setIsAnalyzingChapters(false);
    }
  };

  // Funzione per aggiornare un capitolo
  const handleUpdateChapter = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...chaptersProposals];
    updated[index] = { ...updated[index], [field]: value };
    setChaptersProposals(updated);
  };

  // Funzione per rimuovere un capitolo
  const handleRemoveChapter = (index: number) => {
    const updated = chaptersProposals.filter((_, i) => i !== index);
    // Rinumera i capitoli
    const renumbered = updated.map((ch, i) => ({ ...ch, number: i + 1 }));
    setChaptersProposals(renumbered);
  };

  // Funzione per applicare i capitoli al testo
  const handleApplyChapters = async () => {
    const textToModify = aiResult?.correctedText || result?.corrected;
    
    if (!textToModify || chaptersProposals.length === 0) return;
    
    toast.loading("Inserimento capitoli nel testo...", { id: "apply-chapters" });
    
    try {
      const response = await insertChaptersMutation.mutateAsync({
        text: textToModify,
        chapters: chaptersProposals,
      });
      
      setAiResult({
        correctedText: response.text,
        changes: aiResult?.changes || [],
      });
      
      setShowChaptersModal(false);
      toast.dismiss("apply-chapters");
      toast.success(`${chaptersProposals.length} capitoli inseriti nel testo`);
    } catch (error) {
      toast.dismiss("apply-chapters");
      toast.error("Errore nell'inserimento dei capitoli");
    }
  };

  const handleCopy = () => {
    if (result?.corrected) {
      const textToCopy = aiResult?.correctedText || result.corrected;
      navigator.clipboard.writeText(textToCopy);
      toast.success("Testo corretto copiato negli appunti");
    }
  };

  const handleExportDocx = async () => {
    if (!result) return;
    const textToExport = aiResult?.correctedText || result.corrected;
    await exportToDocx(textToExport, "Testo_Corretto_GPX.docx");
    toast.success("File DOCX scaricato!");
  };

  const handleExportEpub = async () => {
    if (!result) return;
    setShowEpubPreview(true);
  };

  const confirmExportEpub = async () => {
    if (!result) return;
    const textToExport = aiResult?.correctedText || result.corrected;
    await exportToEpub(textToExport, "Libro_Corretto_GPX.epub", epubOptions);
    toast.success("File ePub scaricato!");
    setShowEpubPreview(false);
  };

  const handleExportReport = () => {
    if (!result) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("GPX Correttore - Report Analisi", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 30);
    
    doc.setFontSize(14);
    doc.text("Statistiche", 20, 45);
    doc.setFontSize(10);
    doc.text(`Parole: ${result.report.stats.words}`, 20, 55);
    doc.text(`Caratteri: ${result.report.stats.chars}`, 20, 60);
    doc.text(`Frasi: ${result.report.stats.sentences}`, 20, 65);
    doc.text(`Tempo lettura: ${result.report.stats.readingTime}`, 20, 70);
    doc.text(`Interventi totali: ${result.report.corrections}`, 20, 75);

    if (result.report.anomalies.length > 0) {
      doc.setTextColor(255, 0, 0);
      doc.setFontSize(14);
      doc.text("⚠️ ALERT INTEGRITÀ", 20, 90);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      let y = 100;
      result.report.anomalies.forEach((anomaly) => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(`• ${anomaly.description}: "${anomaly.word}"`, 20, y);
        y += 7;
      });
    }

    doc.save("GPX_Report.pdf");
    toast.success("Report PDF scaricato");
  };

  const handleClear = () => {
    setInputText("");
    setResult(null);
    setAiResult(null);
    setUploadedFiles([]);
    resetAutoMode();
    toast.info("Editor pulito");
  };

  // Salta la correzione meccanica e abilita direttamente i pulsanti AI
  const handleSkipMechanical = () => {
    if (!inputText.trim()) {
      toast.error("Inserisci del testo prima di procedere");
      return;
    }
    
    // Calcola statistiche base del testo
    const words = inputText.split(/\s+/).filter(w => w.length > 0).length;
    const chars = inputText.length;
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const readingTime = Math.ceil(words / 200) + " min";
    
    // Crea un risultato "finto" che permette di usare i pulsanti AI
    setResult({
      original: inputText,
      corrected: inputText,
      changed: false,
      report: {
        corrections: 0,
        categories: {},
        details: ["Correzione meccanica saltata dall'utente"],
        anomalies: [],
        stats: {
          words,
          chars,
          sentences,
          readingTime,
          flowCorrections: 0,
        },
      },
    });
    
    toast.success("Correzione meccanica saltata - Pulsanti AI abilitati");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200 dark:shadow-none">
              <Wand2 size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">GPX Correttore</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Correttore Grammaticale Italiano Professionale</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <InstallPrompt />
            <div className="hidden md:block text-xs text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
              v22.0 PWA • 5 AI Checks • Auto Mode
            </div>
          </div>
        </header>

        {/* Main Editor Area - 3 colonne */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_1fr] gap-4 h-[calc(100vh-180px)] min-h-[600px]">
          
          {/* Input Column */}
          <Card className="flex flex-col shadow-sm border-slate-200 dark:border-slate-800 h-full overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-row items-center justify-between shrink-0">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} />
                Testo Originale
              </CardTitle>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                      <Settings size={16} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Opzioni Correzione</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="spazi" className="text-xs">Spazi multipli</Label>
                          <Switch id="spazi" checked={options.fixMultipleSpaces} onCheckedChange={(v) => setOptions({...options, fixMultipleSpaces: v})} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="punteggiatura" className="text-xs">Punteggiatura</Label>
                          <Switch id="punteggiatura" checked={options.fixPunctuation} onCheckedChange={(v) => setOptions({...options, fixPunctuation: v})} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="maiuscole" className="text-xs">Maiuscole</Label>
                          <Switch id="maiuscole" checked={options.fixCapitalization} onCheckedChange={(v) => setOptions({...options, fixCapitalization: v})} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="apostrofi" className="text-xs">Apostrofi</Label>
                          <Switch id="apostrofi" checked={options.fixApostrophes} onCheckedChange={(v) => setOptions({...options, fixApostrophes: v})} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="virgolette" className="text-xs">Virgolette</Label>
                          <Switch id="virgolette" checked={options.fixQuotes} onCheckedChange={(v) => setOptions({...options, fixQuotes: v})} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="accenti" className="text-xs">Accenti comuni</Label>
                          <Switch id="accenti" checked={options.fixAccents} onCheckedChange={(v) => setOptions({...options, fixAccents: v})} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="flow" className="text-xs">Fluidità periodi</Label>
                          <Switch id="flow" checked={options.improveFlow} onCheckedChange={(v) => setOptions({...options, improveFlow: v})} />
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label className="text-xs">Parole da ignorare</Label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            className="flex-1 text-xs px-2 py-1 border rounded" 
                            placeholder="Aggiungi parola..."
                            value={newIgnoredWord}
                            onChange={(e) => setNewIgnoredWord(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newIgnoredWord.trim()) {
                                setOptions({
                                  ...options, 
                                  ignoredWords: [...(options.ignoredWords || []), newIgnoredWord.trim()]
                                });
                                setNewIgnoredWord("");
                              }
                            }}
                          />
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              if (newIgnoredWord.trim()) {
                                setOptions({
                                  ...options, 
                                  ignoredWords: [...(options.ignoredWords || []), newIgnoredWord.trim()]
                                });
                                setNewIgnoredWord("");
                              }
                            }}
                          >
                            +
                          </Button>
                        </div>
                        
                        {options.ignoredWords && options.ignoredWords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 max-h-24 overflow-y-auto">
                            {options.ignoredWords.map((word, i) => (
                              <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                                {word}
                                <button 
                                  className="hover:text-red-500"
                                  onClick={() => {
                                    const newWords = [...options.ignoredWords!];
                                    newWords.splice(i, 1);
                                    setOptions({...options, ignoredWords: newWords});
                                  }}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button variant="ghost" size="sm" onClick={handleClear} disabled={!inputText || isProcessing || autoMode} className="h-8 text-xs text-slate-400 hover:text-red-500">
                  <Trash2 size={14} className="mr-1" /> Pulisci
                </Button>
                <Button 
                  onClick={handleCorrect} 
                  disabled={!inputText || isProcessing || autoMode} 
                  size="sm"
                  className="h-8 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 dark:shadow-none transition-all"
                >
                  {isProcessing ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Wand2 className="mr-2 h-3 w-3" />}
                  Correggi Testo
                </Button>
                <Button 
                  onClick={handleSkipMechanical} 
                  disabled={!inputText || isProcessing || autoMode || result !== null} 
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs border-amber-300 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                  title="Salta la correzione meccanica e vai direttamente ai pulsanti AI"
                >
                  <Play size={14} className="mr-1" /> Salta
                </Button>
              </div>
            </CardHeader>
            
            {isProcessing && (
              <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
                <div className="flex justify-between text-xs text-blue-600 dark:text-blue-300 mb-1">
                  <span>Elaborazione in corso...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            )}

            <CardContent className="flex-1 p-0 relative bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
              
              <div className="shrink-0 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                {uploadedFiles.length === 0 ? (
                  <div className="p-4">
                    <FileUpload onFilesSelected={handleFilesSelected} />
                  </div>
                ) : (
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-slate-500 uppercase">File Caricati ({uploadedFiles.length})</span>
                      <div className="flex gap-2">
                        <FileUpload onFilesSelected={handleFilesSelected} className="p-1 border-dashed border rounded text-xs py-1 px-2 h-auto min-h-0" />
                        <Button variant="ghost" size="sm" onClick={() => setUploadedFiles([])} className="h-6 text-xs text-red-500 px-2">
                          Rimuovi tutti
                        </Button>
                      </div>
                    </div>
                    <FileList files={uploadedFiles} onRemove={handleRemoveFile} />
                  </div>
                )}
              </div>

              <Textarea 
                placeholder="Incolla qui il tuo testo o carica i file..." 
                className="flex-1 w-full resize-none border-0 focus-visible:ring-0 p-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-serif placeholder:text-slate-300"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* AI Checks Column - 5 pulsanti verticali + controlli auto mode */}
          <Card className="flex flex-col shadow-sm border-slate-200 dark:border-slate-800 h-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2 justify-center">
                <Brain size={14} />
                Verifiche AI
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3 flex flex-col gap-2 overflow-auto">
              
              {/* Modalità normale: 5 pulsanti */}
              {!autoMode && (
                <>
                  {AI_CHECKS.map((check) => {
                    const Icon = check.icon;
                    
                    return (
                      <Button
                        key={check.key}
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartAutoMode(check.key, check.label)}
                        disabled={!result || isAiProcessing || isAnalyzingChapters}
                        className={`w-full h-auto py-3 px-3 flex flex-col items-center gap-1 text-xs font-medium transition-all
                          hover:bg-slate-100 dark:hover:bg-slate-800
                          ${!result ? 'opacity-50' : ''}
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-center leading-tight">{check.label}</span>
                      </Button>
                    );
                  })}
                  
                  {/* Separatore */}
                  <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
                  
                  {/* 6° Pulsante: Attribuzione Capitoli */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAnalyzeChapters}
                    disabled={!result || isAiProcessing || isAnalyzingChapters}
                    className={`w-full h-auto py-3 px-3 flex flex-col items-center gap-1 text-xs font-medium transition-all
                      hover:bg-amber-50 dark:hover:bg-amber-900/20 border-amber-200 dark:border-amber-800
                      ${!result ? 'opacity-50' : ''}
                    `}
                  >
                    {isAnalyzingChapters ? (
                      <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                    ) : (
                      <BookMarked className="h-5 w-5 text-amber-600" />
                    )}
                    <span className="text-center leading-tight text-amber-700 dark:text-amber-400">
                      Attribuzione Capitoli
                    </span>
                  </Button>
                  
                  {!result && (
                    <p className="text-[10px] text-slate-400 text-center mt-2 px-2">
                      Prima correggi il testo con il motore meccanico
                    </p>
                  )}
                </>
              )}
              
              {/* Modalità auto: progress e controlli */}
              {autoMode && (
                <div className="flex flex-col gap-3 h-full">
                  {/* Header auto mode */}
                  <div className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 p-3 rounded-lg border border-violet-200 dark:border-violet-800">
                    <div className="flex items-center gap-2 justify-center mb-2">
                      <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                      <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                        {lastCheckLabel}
                      </span>
                    </div>
                    <div className="text-xs text-violet-600 dark:text-violet-400 text-center">
                      Elaborazione automatica in corso
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Blocco {currentChunkIndex + 1} di {totalChunks}</span>
                      <span>{totalChunks > 0 ? Math.round(((currentChunkIndex + 1) / totalChunks) * 100) : 0}%</span>
                    </div>
                    <Progress value={totalChunks > 0 ? ((currentChunkIndex + 1) / totalChunks) * 100 : 0} className="h-2" />
                  </div>
                  
                  {/* Stats in tempo reale */}
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Correzioni trovate:</span>
                      <span className="font-bold text-green-600">{allChanges.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Blocchi elaborati:</span>
                      <span className="font-bold text-blue-600">{processedChunks.size}</span>
                    </div>
                    {currentChunkChanges.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase mb-1">Ultimo blocco:</div>
                        <div className="text-xs text-green-600">
                          +{currentChunkChanges.length} correzioni
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Anteprima chunk corrente */}
                  {chunksInfo[currentChunkIndex] && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-200 dark:border-slate-700 flex-1 overflow-auto">
                      <div className="text-[10px] text-slate-400 uppercase font-medium mb-1">
                        Blocco corrente:
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-3">
                        {chunksInfo[currentChunkIndex].preview}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-1">
                        ~{chunksInfo[currentChunkIndex].wordCount} parole
                      </div>
                    </div>
                  )}
                  
                  {/* Controlli Pausa/Stop */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      onClick={handlePauseResume}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {isPaused ? (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Riprendi
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Pausa
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleStop}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Square className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                  </div>
                  
                  {isPaused && (
                    <div className="text-center text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                      ⏸️ In pausa - clicca "Riprendi" per continuare
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Column */}
          <Card className={`flex flex-col shadow-sm border-slate-200 dark:border-slate-800 h-full transition-colors overflow-hidden ${result ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-950/50'}`}>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900 flex flex-row items-center justify-between shrink-0">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <Wand2 size={16} />
                Risultato Corretto
              </CardTitle>
              {result && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 text-xs">
                    <Copy className="mr-2 h-3 w-3" />
                    Copia
                  </Button>
                  <Button variant="default" size="sm" onClick={handleExportDocx} className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white border-0 shadow-md shadow-green-100 dark:shadow-none">
                    <Download className="mr-2 h-3 w-3" />
                    DOCX
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportToDocx(aiResult?.correctedText || result.corrected, "Libro_KDP_A5.docx", "kdp_a5")} className="h-8 text-xs border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-900 dark:text-orange-400">
                    <Printer className="mr-2 h-3 w-3" />
                    KDP (A5)
                  </Button>
                  <Button variant="default" size="sm" onClick={handleExportEpub} className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-md shadow-purple-100 dark:shadow-none">
                    <BookOpen className="mr-2 h-3 w-3" />
                    ePub
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative overflow-hidden flex flex-col">
              {result ? (
                <>
                  <ScrollArea className="flex-1 p-6 bg-slate-50 dark:bg-slate-950">
                    {/* Banner AI se il testo è stato elaborato */}
                    {aiResult && (
                      <div className="mb-4 p-3 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-200 dark:border-violet-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                              {lastCheckLabel}
                            </span>
                            <span className="text-xs bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full">
                              {aiResult.changes.length} correzioni
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowAiReport(true)}
                            className="h-6 text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400"
                          >
                            Vedi Report
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-lg leading-relaxed font-serif">
                      {(() => {
                        const textToDisplay = aiResult?.correctedText || result.corrected;
                        const lines = textToDisplay.split('\n');
                        let currentSpeaker = "none";
                        
                        return lines.map((line, lineIndex) => {
                          if (!line.trim()) return <div key={lineIndex} className="h-4" />;

                          if (line.match(/^Hai detto:/i)) {
                            currentSpeaker = "user";
                            return <p key={lineIndex} className="font-bold text-slate-700 dark:text-slate-300 mt-6 mb-2 text-base sans-serif uppercase tracking-wide">Hai detto:</p>;
                          } else if (line.match(/^ChatGPT ha detto:/i)) {
                            currentSpeaker = "bot";
                            return <p key={lineIndex} className="font-bold text-teal-600 dark:text-teal-400 mt-6 mb-2 text-base sans-serif uppercase tracking-wide">ChatGPT ha detto:</p>;
                          }

                          let className = "mb-4 text-slate-800 dark:text-slate-200";
                          if (currentSpeaker === "user") {
                            className = "italic text-slate-600 dark:text-slate-400 mb-4 pl-4 border-l-2 border-slate-200 dark:border-slate-800";
                          }

                          return (
                            <p key={lineIndex} className={className}>
                              {result.report.anomalies.length > 0 ? (
                                line.split(/(\s+)/).map((part, i) => {
                                  const cleanWord = part.replace(/^[.,;:()"]+|[.,;:()"]+$/g, "");
                                  const anomaly = result.report.anomalies.find(a => a.word === cleanWord);
                                  if (anomaly) {
                                    return (
                                      <span key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-1 rounded border border-yellow-400 dark:border-yellow-700" title={anomaly.description}>
                                        {part}
                                      </span>
                                    );
                                  }
                                  return part;
                                })
                              ) : (
                                line
                              )}
                            </p>
                          );
                        });
                      })()}
                    </div>
                  </ScrollArea>
                  
                  {/* Stats & Report Panel */}
                  <div className="shrink-0 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 p-4 text-sm">
                    <div className="grid grid-cols-4 gap-4 mb-4 text-center">
                      <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Parole</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">{result.report.stats.words}</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Caratteri</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">{result.report.stats.chars}</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Frasi</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">{result.report.stats.sentences}</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Lettura</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">{result.report.stats.readingTime}</div>
                      </div>
                    </div>
                    
                    {result.report.stats.flowCorrections > 0 && (
                      <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded text-center">
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          ✨ {result.report.stats.flowCorrections} frasi fluidificate automaticamente
                        </span>
                      </div>
                    )}
                    
                    <Separator className="my-3" />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-bold">
                            {result.report.corrections}
                          </span>
                          Interventi effettuati
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleExportReport} className="h-6 text-[10px] text-slate-400 hover:text-blue-600">
                          <FileText size={12} className="mr-1" /> Export Report
                        </Button>
                      </div>
                      
                      {result.report.anomalies.length > 0 && (
                        <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-300 flex items-start gap-2">
                          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                          <div>
                            <strong>Attenzione:</strong> Rilevate {result.report.anomalies.length} anomalie nel testo. Controlla le parole evidenziate.
                          </div>
                        </div>
                      )}

                      <ScrollArea className="h-24 w-full rounded border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2">
                        <ul className="space-y-1">
                          {result.report.details.length > 0 ? (
                            result.report.details.map((detail, i) => (
                              <li key={i} className={`text-xs flex items-start gap-2 ${detail.includes("ALERT") ? "text-red-600 font-bold" : "text-slate-500"}`}>
                                <span className={detail.includes("ALERT") ? "text-red-500 mt-0.5" : "text-green-500 mt-0.5 font-bold"}>
                                  {detail.includes("ALERT") ? "⚠️" : "✓"}
                                </span>
                                {detail}
                              </li>
                            ))
                          ) : (
                            <li className="text-xs text-slate-400 italic">Nessuna modifica necessaria rilevata.</li>
                          )}
                        </ul>
                      </ScrollArea>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 p-8 text-center">
                  <Wand2 size={48} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium">In attesa di input</p>
                  <p className="text-sm max-w-xs mx-auto mt-2 opacity-60">
                    Carica i file o incolla il testo a sinistra e premi "Correggi Testo" per avviare l'analisi GPX v22.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ePub Preview Dialog */}
      <Dialog open={showEpubPreview} onOpenChange={setShowEpubPreview}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Anteprima ePub & Opzioni</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Font</Label>
                <Select 
                  value={epubOptions.fontFamily} 
                  onValueChange={(v: 'serif' | 'sans-serif' | 'monospace') => setEpubOptions({...epubOptions, fontFamily: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serif">Serif (Classico)</SelectItem>
                    <SelectItem value="sans-serif">Sans-Serif (Moderno)</SelectItem>
                    <SelectItem value="monospace">Monospace (Codice)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Dimensione</Label>
                <Select 
                  value={epubOptions.fontSize} 
                  onValueChange={(v) => setEpubOptions({...epubOptions, fontSize: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.8em">Piccolo</SelectItem>
                    <SelectItem value="1em">Normale</SelectItem>
                    <SelectItem value="1.2em">Grande</SelectItem>
                    <SelectItem value="1.5em">Molto Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Margini</Label>
                <Select 
                  value={epubOptions.margin} 
                  onValueChange={(v) => setEpubOptions({...epubOptions, margin: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2%">Stretti</SelectItem>
                    <SelectItem value="5%">Normali</SelectItem>
                    <SelectItem value="10%">Ampi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md p-4 h-[300px] overflow-y-auto bg-white dark:bg-slate-950 shadow-inner">
              <div 
                style={{
                  fontFamily: epubOptions.fontFamily,
                  fontSize: epubOptions.fontSize,
                  padding: epubOptions.margin,
                  lineHeight: 1.5
                }}
                className="text-slate-900 dark:text-slate-100"
              >
                <h1 style={{textAlign: 'center', marginBottom: '1em'}}>Capitolo 1</h1>
                <p>
                  Questa è un'anteprima in tempo reale di come apparirà il testo nel tuo ePub. 
                  Il correttore GPX ha ottimizzato la punteggiatura e la fluidità del testo.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  "Non è vero," disse lui. "È solo un'illusione."
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEpubPreview(false)}>Annulla</Button>
            <Button onClick={confirmExportEpub} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="mr-2 h-4 w-4" />
              Scarica ePub
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Report Dialog */}
      <Dialog open={showAiReport} onOpenChange={setShowAiReport}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-violet-600" />
              Report {lastCheckLabel}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {aiResult && aiResult.changes.length > 0 ? (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {aiResult.changes.map((change, index) => (
                    <div key={index} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-violet-600 bg-violet-100 dark:bg-violet-900 px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase">Originale:</span>
                              <span className="text-sm bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded line-through">
                                {change.original}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase">Corretto:</span>
                              <span className="text-sm bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded font-medium">
                                {change.corrected}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                            {change.reason}
                          </p>
                          {change.position && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              Posizione: {change.position}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Nessuna correzione rilevata</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAiReport(false)}>Chiudi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chapters Dialog */}
      <Dialog open={showChaptersModal} onOpenChange={setShowChaptersModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-amber-600" />
              Attribuzione Capitoli
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-slate-500 mb-4">
              Modifica i titoli e le descrizioni dei capitoli proposti. Puoi eliminare quelli che non ti convincono.
            </p>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {chaptersProposals.map((chapter, index) => (
                  <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-3">
                        {/* Header capitolo */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-amber-600 bg-amber-100 dark:bg-amber-900 px-3 py-1 rounded">
                            Capitolo {chapter.number}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingChapterIndex(editingChapterIndex === index ? null : index)}
                            className="h-7 px-2"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Titolo */}
                        {editingChapterIndex === index ? (
                          <input
                            type="text"
                            value={chapter.title}
                            onChange={(e) => handleUpdateChapter(index, 'title', e.target.value)}
                            className="w-full text-lg font-semibold px-3 py-2 border rounded bg-white dark:bg-slate-800"
                            placeholder="Titolo del capitolo"
                          />
                        ) : (
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            {chapter.title}
                          </h3>
                        )}
                        
                        {/* Descrizione */}
                        {editingChapterIndex === index ? (
                          <textarea
                            value={chapter.description}
                            onChange={(e) => handleUpdateChapter(index, 'description', e.target.value)}
                            className="w-full text-sm px-3 py-2 border rounded bg-white dark:bg-slate-800 min-h-[80px]"
                            placeholder="Descrizione degli argomenti del capitolo"
                          />
                        ) : (
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {chapter.description}
                          </p>
                        )}
                        
                        {/* Anteprima posizione */}
                        <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded">
                          <span className="font-medium">Inizio:</span> {chapter.previewText.substring(0, 100)}...
                        </div>
                      </div>
                      
                      {/* Pulsante rimuovi */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveChapter(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowChaptersModal(false)}>
              Annulla
            </Button>
            <Button 
              onClick={handleApplyChapters}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={chaptersProposals.length === 0}
            >
              <Check className="mr-2 h-4 w-4" />
              Applica {chaptersProposals.length} Capitoli
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
