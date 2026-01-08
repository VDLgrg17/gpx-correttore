import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  analyzeText, 
  analyzeSingleChunk,
  getChunksInfo,
  analyzeChapters,
  insertChaptersIntoText,
  AISupervisorResponseSchema, 
  SingleChunkResponseSchema,
  ChunkInfoSchema,
  ChaptersResponseSchema,
  ChapterProposalSchema,
  AICheckType 
} from "./ai-supervisor";
import { AI_CHECK_LABELS } from "./ai-prompts";

// Schema per l'input con tipo di check
const AICheckInputSchema = z.object({
  text: z.string().min(1, "Il testo non può essere vuoto"),
  checkType: z.enum(["refusiFusione", "periodiFrammentati", "tempiVerbali", "refusiSemantici", "virgolaRespira"]),
});

// Schema per l'input del singolo chunk
const SingleChunkInputSchema = z.object({
  text: z.string().min(1, "Il testo non può essere vuoto"),
  chunkIndex: z.number().min(0),
  checkType: z.enum(["refusiFusione", "periodiFrammentati", "tempiVerbali", "refusiSemantici", "virgolaRespira"]),
});

// Schema per ottenere info sui chunk
const ChunksInfoInputSchema = z.object({
  text: z.string().min(1, "Il testo non può essere vuoto"),
});

// Schema per l'input dell'analisi capitoli
const ChaptersInputSchema = z.object({
  text: z.string().min(1, "Il testo non può essere vuoto"),
});

// Schema per l'input dell'inserimento capitoli
const InsertChaptersInputSchema = z.object({
  text: z.string().min(1, "Il testo non può essere vuoto"),
  chapters: z.array(ChapterProposalSchema),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Verifiche AI separate
  aiCheck: router({
    // Endpoint per ottenere info sui chunk (senza elaborarli)
    getChunksInfo: publicProcedure
      .input(ChunksInfoInputSchema)
      .output(ChunkInfoSchema)
      .mutation(({ input }) => {
        return getChunksInfo(input.text);
      }),

    // Endpoint per analizzare un singolo chunk
    analyzeSingleChunk: publicProcedure
      .input(SingleChunkInputSchema)
      .output(SingleChunkResponseSchema)
      .mutation(async ({ input }) => {
        const result = await analyzeSingleChunk(
          input.text, 
          input.chunkIndex, 
          input.checkType as AICheckType
        );
        return result;
      }),

    // Endpoint legacy che analizza tutto il testo
    analyze: publicProcedure
      .input(AICheckInputSchema)
      .output(AISupervisorResponseSchema)
      .mutation(async ({ input }) => {
        const result = await analyzeText(input.text, input.checkType as AICheckType);
        return result;
      }),
    
    // Endpoint per ottenere i tipi di check disponibili
    getCheckTypes: publicProcedure.query(() => {
      return Object.entries(AI_CHECK_LABELS).map(([key, label]) => ({
        key,
        label,
      }));
    }),

    // Endpoint per analizzare e proporre capitoli
    analyzeChapters: publicProcedure
      .input(ChaptersInputSchema)
      .output(ChaptersResponseSchema)
      .mutation(async ({ input }) => {
        const result = await analyzeChapters(input.text);
        return result;
      }),

    // Endpoint per inserire i capitoli nel testo
    insertChapters: publicProcedure
      .input(InsertChaptersInputSchema)
      .output(z.object({ text: z.string() }))
      .mutation(({ input }) => {
        const result = insertChaptersIntoText(input.text, input.chapters);
        return { text: result };
      }),
  }),
});

export type AppRouter = typeof appRouter;
