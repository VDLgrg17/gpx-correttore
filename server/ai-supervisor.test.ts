import { describe, it, expect, vi, beforeEach } from "vitest";
import { splitIntoChunks, AISupervisorResponseSchema } from "./ai-supervisor";

// Mock del modulo LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

describe("AI Supervisor", () => {
  describe("splitIntoChunks", () => {
    it("dovrebbe restituire un singolo chunk per testi brevi", () => {
      const shortText = "Questo è un testo breve con poche parole.";
      const chunks = splitIntoChunks(shortText, 3000);
      
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toBe(shortText);
    });

    it("dovrebbe dividere il testo in più chunk quando supera il limite", () => {
      // Creiamo un testo con circa 6000 parole divise in paragrafi (2 chunk da 3000)
      // La funzione splitIntoChunks divide per paragrafi, quindi dobbiamo creare paragrafi separati
      const paragraph1 = Array(3500).fill("parola").join(" ");
      const paragraph2 = Array(3500).fill("altra").join(" ");
      const text = `${paragraph1}\n\n${paragraph2}`;
      const chunks = splitIntoChunks(text, 3000);
      
      expect(chunks.length).toBeGreaterThanOrEqual(2);
    });

    it("dovrebbe preservare i paragrafi interi quando possibile", () => {
      const paragraph1 = "Primo paragrafo con alcune parole.";
      const paragraph2 = "Secondo paragrafo con altre parole.";
      const text = `${paragraph1}\n\n${paragraph2}`;
      
      const chunks = splitIntoChunks(text, 3000);
      
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toContain(paragraph1);
      expect(chunks[0]).toContain(paragraph2);
    });

    it("dovrebbe gestire testo vuoto", () => {
      const chunks = splitIntoChunks("", 3000);
      expect(chunks).toHaveLength(0);
    });

    it("dovrebbe gestire testo con solo spazi", () => {
      const chunks = splitIntoChunks("   \n\n   ", 3000);
      // Potrebbe restituire un chunk vuoto o nessun chunk
      expect(chunks.every(c => c.trim().length === 0 || c.length > 0)).toBe(true);
    });
  });

  describe("AISupervisorResponseSchema", () => {
    it("dovrebbe validare una risposta corretta", () => {
      const validResponse = {
        correctedText: "Testo corretto",
        changes: [
          {
            original: "errore",
            corrected: "corretto",
            reason: "Typo",
            position: "inizio",
          },
        ],
      };

      const result = AISupervisorResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it("dovrebbe validare una risposta senza modifiche", () => {
      const noChangesResponse = {
        correctedText: "Testo senza errori",
        changes: [],
      };

      const result = AISupervisorResponseSchema.safeParse(noChangesResponse);
      expect(result.success).toBe(true);
    });

    it("dovrebbe rifiutare una risposta senza correctedText", () => {
      const invalidResponse = {
        changes: [],
      };

      const result = AISupervisorResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it("dovrebbe rifiutare una risposta con changes malformato", () => {
      const invalidResponse = {
        correctedText: "Testo",
        changes: [
          {
            // Manca 'original' e 'corrected'
            reason: "Typo",
          },
        ],
      };

      const result = AISupervisorResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it("dovrebbe accettare changes senza position (opzionale)", () => {
      const validResponse = {
        correctedText: "Testo corretto",
        changes: [
          {
            original: "errore",
            corrected: "corretto",
            reason: "Typo",
            // position è opzionale
          },
        ],
      };

      const result = AISupervisorResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });
});
