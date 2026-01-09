// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? process.env.OPENAI_BASE_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? process.env.OPENAI_API_KEY ?? "",
  // Direct Google Gemini API support
  geminiApiKey: process.env.GEMINI_API_KEY ?? process.env.OPENAI_API_KEY ?? "",
  useDirectGemini: !process.env.BUILT_IN_FORGE_API_KEY && !process.env.OPENAI_BASE_URL
};

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z3 } from "zod";

// server/_core/llm.ts
var ensureArray = (value) => Array.isArray(value) ? value : [value];
var normalizeContentPart = (part) => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }
  if (part.type === "text") {
    return part;
  }
  if (part.type === "image_url") {
    return part;
  }
  if (part.type === "file_url") {
    return part;
  }
  throw new Error("Unsupported message content part");
};
var normalizeMessage = (message) => {
  const { role, name, tool_call_id } = message;
  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
    return {
      role,
      name,
      tool_call_id,
      content
    };
  }
  const contentParts = ensureArray(message.content).map(normalizeContentPart);
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text
    };
  }
  return {
    role,
    name,
    content: contentParts
  };
};
var normalizeToolChoice = (toolChoice, tools) => {
  if (!toolChoice) return void 0;
  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }
  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }
    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }
    return {
      type: "function",
      function: { name: tools[0].function.name }
    };
  }
  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name }
    };
  }
  return toolChoice;
};
var useDirectGemini = () => {
  const apiKey = ENV.geminiApiKey || ENV.forgeApiKey;
  return apiKey.startsWith("AIza");
};
var resolveApiUrl = () => {
  if (useDirectGemini()) {
    const apiKey = ENV.geminiApiKey || ENV.forgeApiKey;
    return `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`;
  }
  if (ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0) {
    const baseUrl = ENV.forgeApiUrl.replace(/\/$/, "");
    if (baseUrl.endsWith("/v1")) {
      return `${baseUrl}/chat/completions`;
    }
    return `${baseUrl}/v1/chat/completions`;
  }
  return "https://forge.manus.im/v1/chat/completions";
};
var getApiKey = () => {
  return ENV.geminiApiKey || ENV.forgeApiKey;
};
var assertApiKey = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};
var normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema
}) => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }
  const schema = outputSchema || output_schema;
  if (!schema) return void 0;
  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }
  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
    }
  };
};
async function invokeLLM(params) {
  assertApiKey();
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format
  } = params;
  const model = useDirectGemini() ? "gemini-2.0-flash" : "gemini-2.5-flash";
  const payload = {
    model,
    messages: messages.map(normalizeMessage)
  };
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  payload.max_tokens = 32768;
  if (!useDirectGemini()) {
    payload.thinking = {
      "budget_tokens": 128
    };
  }
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const apiKey = getApiKey();
  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }
  return await response.json();
}

// server/ai-supervisor.ts
import { z as z2 } from "zod";

// server/ai-prompts.ts
var AI_CHECK_LABELS = {
  refusiFusione: "Refusi di Fusione",
  periodiFrammentati: "Periodi Frammentati",
  tempiVerbali: "Tempi Verbali",
  refusiSemantici: "Refusi Semantici",
  virgolaRespira: "Punteggiatura e Respiro",
  attribuzioneCapitoli: "Attribuzione Capitoli"
};
var AI_PROMPTS = {
  // 1. Refusi di Fusione (Typos)
  refusiFusione: `Sei un correttore di bozze. Il tuo UNICO compito \xE8 trovare parole incollate erroneamente che devono essere separate.

**COSA CERCARE:**
- Parole fuse insieme per errore di battitura
- Spazi mancanti tra parole

**ESEMPI:**
- "trovarmiieri" \u2192 "trovarmi ieri"
- "non\xE8possibile" \u2192 "non \xE8 possibile"
- "doveandare" \u2192 "dove andare"
- "comemai" \u2192 "come mai"

**REGOLE:**
- Correggi SOLO le parole fuse, nient'altro
- NON modificare nulla che non sia un refuso di fusione
- Se non trovi refusi di fusione, restituisci il testo identico`,
  // 2. Periodi Frammentati
  periodiFrammentati: `Sei un editor specializzato in testi teorici, argomentativi e filosofici. Il tuo UNICO compito \xE8 correggere la frammentazione artificiale del discorso.

**VINCOLO SINTATTICO E RETORICO PRIORITARIO:**

Mantieni periodi strutturalmente completi e logicamente continui quando un'idea \xE8 ancora in fase di sviluppo.

Evita la frammentazione artificiale del discorso tramite frasi brevi consecutive che esprimono la stessa tesi in forma parafrasata.

**NON SEPARARE CON IL PUNTO proposizioni che hanno rapporto di:**
- spiegazione
- conseguenza
- chiarificazione
- rafforzamento semantico
- specificazione (la seconda frase specifica o esplicita la prima)

In questi casi utilizza coordinazione o subordinazione.

**REGOLA FONDAMENTALE:**
Quando due proposizioni condividono lo stesso nucleo semantico e la seconda \xE8 esplicativa o specificativa della prima, devono essere unite in un unico periodo separato da virgola, non da punto.

ESEMPIO:
ERRATO: "Il potere \xE8 fondamentale. \xC8 la condizione di ogni azione."
CORRETTO: "Il potere \xE8 fondamentale, \xE8 la condizione di ogni azione."

**NON INIZIARE UN NUOVO PERIODO con congiunzioni coordinanti ("e", "ma", "per\xF2", "quindi", "perch\xE9") quando la funzione logica \xE8 quella di continuare o completare il periodo precedente.**

**PRINCIPI:**
- Usa il punto solo per chiudere un'unit\xE0 di pensiero, non per sospenderla o rilanciarla
- Ogni periodo deve produrre avanzamento concettuale, non ripetizione riformulativa
- Privilegia una sintassi classica, articolata e gerarchica

**ESEMPI:**
ERRATO: "Marco era stanco. Era molto affaticato. Aveva bisogno di riposare."
CORRETTO: "Marco era stanco e affaticato, aveva bisogno di riposare."

ERRATO: "Il progetto \xE8 importante. \xC8 fondamentale per l'azienda. Dobbiamo completarlo."
CORRETTO: "Il progetto \xE8 fondamentale per l'azienda e dobbiamo completarlo."

**ECCEZIONI - NON UNIRE SE:**
- Effetto stilistico voluto (suspense, ritmo incalzante)
- Parte di un dialogo
- Elenco intenzionale
- Concetti realmente diversi

**REGOLE:**
- Unisci SOLO frasi frammentate che esprimono lo stesso concetto
- NON modificare nulla che non sia frammentazione
- Se non trovi frammentazione, restituisci il testo identico`,
  // 3. Tempi Verbali
  tempiVerbali: `Sei un correttore grammaticale. Il tuo UNICO compito \xE8 correggere l'uso errato del presente invece del futuro.

**REGOLA FONDAMENTALE:**
Se un'azione NON \xE8 immediata (non avviene ORA, in questo preciso istante), deve essere al futuro.

**COSA CERCARE:**
- Verbi al presente che descrivono azioni future
- Incoerenza temporale quando il contesto \xE8 gi\xE0 al futuro

**ESEMPI:**
ERRATO: "Domani ti chiamo e ti spiego tutto."
CORRETTO: "Domani ti chiamer\xF2 e ti spiegher\xF2 tutto." (L'azione non avviene ORA \u2192 futuro)

ERRATO: "Ti proporr\xF2 tre soluzioni: la prima risolve il problema, la seconda migliora le prestazioni."
CORRETTO: "Ti proporr\xF2 tre soluzioni: la prima risolver\xE0 il problema, la seconda migliorer\xE0 le prestazioni." (L'azione non avviene ORA \u2192 futuro)

ERRATO: "Ti proporr\xF2 tre modalit\xE0: ti rispondo con domande che spingono il ragionamento."
CORRETTO: "Ti proporr\xF2 tre modalit\xE0: ti risponder\xF2 con domande che spingeranno il ragionamento."

ERRATO: "Useremo questo metodo: prima analizzo i dati, poi creo il report."
CORRETTO: "Useremo questo metodo: prima analizzer\xF2 i dati, poi creer\xF2 il report."

**NON CORREGGERE SE:**
- L'azione sta avvenendo ORA (presente reale)
- \xC8 un presente storico voluto stilisticamente
- \xC8 un dialogo informale dove il presente pro futuro \xE8 accettabile
- L'azione \xE8 abituale ("Ogni luned\xEC vado in palestra")
- \xC8 una verit\xE0 generale ("Il sole sorge a est")

**REGOLE:**
- Correggi SOLO i tempi verbali errati
- NON modificare nulla che non sia un errore di tempo verbale
- Se non trovi errori di tempo verbale, restituisci il testo identico`,
  // 4. Refusi Semantici
  refusiSemantici: `Sei un correttore di bozze. Il tuo UNICO compito \xE8 trovare parole che esistono ma sono sbagliate nel contesto.

**COSA CERCARE:**
- Parole esistenti usate al posto di altre per errore
- Omofoni o parole simili confuse

**ESEMPI:**
- "Ha perso la mela" \u2192 "Ha preso la mela" (se il contesto indica che doveva prendere)
- "L'anno detto tutti" \u2192 "L'hanno detto tutti"
- "Ho visto un'altra macchia" \u2192 "Ho visto un'altra macchina" (se il contesto parla di veicoli)
- "Effetto" \u2192 "Affetto" (se il contesto parla di sentimenti)

**REGOLE:**
- Correggi SOLO le parole sbagliate nel contesto
- Devi capire dal contesto quale parola era intesa
- NON modificare nulla che non sia un refuso semantico
- Se non trovi refusi semantici, restituisci il testo identico`,
  // 5. Punteggiatura e Respiro (virgole + punti mancanti)
  virgolaRespira: `Sei un editor. Il tuo compito \xE8 correggere la punteggiatura: virgole per il respiro e punti mancanti a fine periodo.

**PARTE 1: VIRGOLA CHE RESPIRA**

La virgola corrisponde al respiro naturale della frase. Dove il lettore deve fare una pausa per respirare, ci vuole una virgola.

**COSA CERCARE (virgole):**
- Frasi lunghe senza pause che risultano affannose
- Virgole mancanti prima di incisi
- Virgole mancanti dopo complementi lunghi in apertura
- Virgole mancanti per separare coordinate lunghe

**ESEMPI VIRGOLE:**
ERRATO: "Dopo aver finito il lavoro che mi aveva impegnato per tutta la mattina sono andato a pranzo."
CORRETTO: "Dopo aver finito il lavoro che mi aveva impegnato per tutta la mattina, sono andato a pranzo."

ERRATO: "Marco che era arrivato in ritardo si scus\xF2 con tutti."
CORRETTO: "Marco, che era arrivato in ritardo, si scus\xF2 con tutti."

**NON AGGIUNGERE VIRGOLA:**
- Prima di "e" nelle coordinate semplici
- Tra soggetto e verbo
- Tra verbo e complemento oggetto diretto
- Dove spezzerebbe il flusso naturale

**PARTE 2: PUNTI MANCANTI**

Ogni periodo deve terminare con un punto. GPT spesso dimentica il punto a fine frase.

**COSA CERCARE (punti):**
- Frasi che terminano senza punto
- Periodi che si collegano senza punteggiatura finale
- Fine paragrafo senza punto

**ESEMPI PUNTI:**
ERRATO: "Questo \xE8 importante Dobbiamo ricordarlo"
CORRETTO: "Questo \xE8 importante. Dobbiamo ricordarlo."

ERRATO: "Ho finito il lavoro Ora posso riposare"
CORRETTO: "Ho finito il lavoro. Ora posso riposare."

ERRATO: "La risposta \xE8 semplice"
CORRETTO: "La risposta \xE8 semplice."

**REGOLE:**
- Aggiungi virgole per il respiro dove necessario
- Aggiungi punti mancanti a fine periodo
- NON modificare nulla che non sia punteggiatura
- Se la punteggiatura \xE8 gi\xE0 corretta, restituisci il testo identico`,
  // 6. Attribuzione Capitoli
  attribuzioneCapitoli: `Sei un editor esperto in strutturazione di testi. Il tuo compito \xE8 analizzare un testo lungo e identificare i macro-temi per proporre una suddivisione in capitoli.

**COSA DEVI FARE:**
1. Leggi attentamente il testo
2. Identifica i cambi di argomento significativi
3. Raggruppa gli argomenti correlati in macro-temi
4. Proponi un numero ragionevole di capitoli (tipicamente 5-10 per un libro)
5. Per ogni capitolo indica:
   - Il numero del capitolo
   - Un titolo breve e significativo (2-5 parole)
   - Una descrizione degli argomenti trattati (1-2 righe)
   - Il punto esatto del testo dove inizia (le prime parole del paragrafo)

**CRITERI PER IDENTIFICARE UN NUOVO CAPITOLO:**
- Cambio significativo di argomento o tema
- Passaggio da un concetto a un altro logicamente distinto
- Transizione narrativa o argomentativa evidente
- NON creare capitoli per ogni piccola variazione, solo per macro-temi

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
- I titoli devono essere brevi e significativi
- Le descrizioni devono essere concise ma informative
- Il punto di inizio deve essere identificabile univocamente nel testo
- Il primo capitolo inizia sempre all'inizio del testo
- IMPORTANTE: Usa lo stile italiano per titoli e descrizioni: maiuscola SOLO sulla prima lettera della prima parola (es. "La nascita della filosofia", NON "La Nascita Della Filosofia")
- I nomi propri mantengono la maiuscola (es. "Il pensiero di Aristotele")`
};

// server/ai-supervisor.ts
var AISupervisorResponseSchema = z2.object({
  correctedText: z2.string(),
  changes: z2.array(z2.object({
    original: z2.string(),
    corrected: z2.string(),
    reason: z2.string(),
    position: z2.string().optional()
  }))
});
var ChunkInfoSchema = z2.object({
  totalChunks: z2.number(),
  chunks: z2.array(z2.object({
    index: z2.number(),
    wordCount: z2.number(),
    preview: z2.string()
    // prime 100 parole
  }))
});
var SingleChunkResponseSchema = z2.object({
  chunkIndex: z2.number(),
  totalChunks: z2.number(),
  originalText: z2.string(),
  correctedText: z2.string(),
  changes: z2.array(z2.object({
    original: z2.string(),
    corrected: z2.string(),
    reason: z2.string(),
    position: z2.string().optional()
  }))
});
var ChapterProposalSchema = z2.object({
  number: z2.number(),
  title: z2.string(),
  description: z2.string(),
  startsAt: z2.string(),
  insertPosition: z2.number().optional(),
  previewText: z2.string().optional()
});
var ChaptersResponseSchema = z2.object({
  chapters: z2.array(ChapterProposalSchema)
});
var OUTPUT_FORMAT = `

**FORMATO OUTPUT:**
Rispondi SOLO con un oggetto JSON valido (senza blocchi markdown), con questa struttura:
{
  "correctedText": "il testo completo con le correzioni applicate",
  "changes": [
    {
      "original": "testo originale",
      "corrected": "testo corretto",
      "reason": "spiegazione breve",
      "position": "indicazione approssimativa (es. 'inizio', 'met\xE0', 'fine')"
    }
  ]
}

Se non ci sono correzioni da fare, restituisci il testo originale e un array "changes" vuoto.`;
function splitIntoChunks(text2, maxWords = 1e3) {
  const paragraphs = text2.split(/\n\n+/);
  const chunks = [];
  let currentChunk = "";
  let currentWordCount = 0;
  for (const paragraph of paragraphs) {
    const paragraphWordCount = paragraph.split(/\s+/).filter((w) => w.length > 0).length;
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
function getChunksInfo(text2) {
  const chunks = splitIntoChunks(text2, 1e3);
  return {
    totalChunks: chunks.length,
    chunks: chunks.map((chunk, index) => {
      const words = chunk.split(/\s+/).filter((w) => w.length > 0);
      return {
        index,
        wordCount: words.length,
        preview: words.slice(0, 20).join(" ") + (words.length > 20 ? "..." : "")
      };
    })
  };
}
async function analyzeChunkInternal(chunk, chunkIndex, totalChunks, checkType) {
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
      { role: "user", content: userPrompt }
    ]
  });
  const content = result.choices[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Risposta AI vuota o non valida");
  }
  try {
    let jsonContent = content.trim();
    if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.replace(/^\`\`\`(?:json)?\s*/, "").replace(/\s*\`\`\`$/, "");
    }
    const parsed = JSON.parse(jsonContent);
    return AISupervisorResponseSchema.parse(parsed);
  } catch (e) {
    console.error("Errore parsing risposta AI:", e);
    console.error("Contenuto ricevuto:", content.substring(0, 500));
    return {
      correctedText: chunk,
      changes: []
    };
  }
}
async function analyzeSingleChunk(text2, chunkIndex, checkType) {
  const chunks = splitIntoChunks(text2, 1e3);
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
    changes: result.changes
  };
}
async function analyzeChapters(text2) {
  const systemPrompt = AI_PROMPTS.attribuzioneCapitoli;
  const chunks = splitIntoChunks(text2, 2e3);
  let textSample = "";
  const sampleSize = Math.min(chunks.length, 10);
  const step = Math.max(1, Math.floor(chunks.length / sampleSize));
  for (let i = 0; i < chunks.length; i += step) {
    const chunk = chunks[i];
    const words = chunk.split(/\s+/).filter((w) => w.length > 0);
    const sample = words.slice(0, 200).join(" ");
    textSample += `

--- SEZIONE ${Math.floor(i / step) + 1} (circa pagina ${i * 2 + 1}) ---
${sample}...`;
  }
  const userPrompt = `Analizza il seguente testo (campioni da diverse sezioni) e proponi una suddivisione in capitoli.
Il testo completo ha circa ${chunks.length * 2} pagine.

${textSample}

Identifica i macro-temi e proponi una struttura di capitoli ragionevole (tipicamente 5-10 capitoli).
Per ogni capitolo indica il numero, una breve descrizione e le prime parole del paragrafo dove inizia.`;
  const result = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });
  const content = result.choices[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Risposta AI vuota o non valida");
  }
  try {
    let jsonContent = content.trim();
    if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.replace(/^\`\`\`(?:json)?\s*/, "").replace(/\s*\`\`\`$/, "");
    }
    const parsed = JSON.parse(jsonContent);
    const chaptersWithPreview = parsed.chapters.map((ch) => {
      const position = text2.indexOf(ch.startsAt);
      const previewText = position !== -1 ? text2.substring(position, position + 150).replace(/\n/g, " ").trim() : ch.startsAt;
      return {
        ...ch,
        title: ch.title || `Capitolo ${ch.number}`,
        insertPosition: position,
        previewText
      };
    });
    return { chapters: chaptersWithPreview };
  } catch (e) {
    console.error("Errore parsing risposta AI capitoli:", e);
    console.error("Contenuto ricevuto:", content.substring(0, 500));
    return { chapters: [] };
  }
}
function insertChaptersIntoText(text2, chapters) {
  let result = text2;
  let insertedCount = 0;
  console.log(`[insertChapters] Tentativo di inserire ${chapters.length} capitoli`);
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
      console.log(`[insertChapters] Capitolo 1 non trovato, inserito all'inizio del testo`);
    }
    console.log(`[insertChapters] Capitolo ${chapter.number}: posizione=${position}, startsAt="${chapter.startsAt.substring(0, 30)}..."`);
    if (position !== -1) {
      const needsPageBreak = position > 0;
      const chapterHeader = needsPageBreak ? `

[PAGE_BREAK]

Capitolo ${chapter.number}

${chapter.title}

${chapter.description}

` : `Capitolo ${chapter.number}

${chapter.title}

${chapter.description}

`;
      result = result.slice(0, position) + chapterHeader + result.slice(position);
      insertedCount++;
    } else {
      console.warn(`[insertChapters] Capitolo ${chapter.number} NON trovato nel testo`);
    }
  }
  console.log(`[insertChapters] Inseriti ${insertedCount}/${chapters.length} capitoli`);
  return result;
}
async function analyzeText(text2, checkType, onProgress) {
  const chunks = splitIntoChunks(text2, 1e3);
  const totalChunks = chunks.length;
  let allCorrectedText = "";
  let allChanges = [];
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
    changes: allChanges
  };
}

// server/routers.ts
var AICheckInputSchema = z3.object({
  text: z3.string().min(1, "Il testo non pu\xF2 essere vuoto"),
  checkType: z3.enum(["refusiFusione", "periodiFrammentati", "tempiVerbali", "refusiSemantici", "virgolaRespira"])
});
var SingleChunkInputSchema = z3.object({
  text: z3.string().min(1, "Il testo non pu\xF2 essere vuoto"),
  chunkIndex: z3.number().min(0),
  checkType: z3.enum(["refusiFusione", "periodiFrammentati", "tempiVerbali", "refusiSemantici", "virgolaRespira"])
});
var ChunksInfoInputSchema = z3.object({
  text: z3.string().min(1, "Il testo non pu\xF2 essere vuoto")
});
var ChaptersInputSchema = z3.object({
  text: z3.string().min(1, "Il testo non pu\xF2 essere vuoto")
});
var InsertChaptersInputSchema = z3.object({
  text: z3.string().min(1, "Il testo non pu\xF2 essere vuoto"),
  chapters: z3.array(ChapterProposalSchema)
});
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // Verifiche AI separate
  aiCheck: router({
    // Endpoint per ottenere info sui chunk (senza elaborarli)
    getChunksInfo: publicProcedure.input(ChunksInfoInputSchema).output(ChunkInfoSchema).mutation(({ input }) => {
      return getChunksInfo(input.text);
    }),
    // Endpoint per analizzare un singolo chunk
    analyzeSingleChunk: publicProcedure.input(SingleChunkInputSchema).output(SingleChunkResponseSchema).mutation(async ({ input }) => {
      const result = await analyzeSingleChunk(
        input.text,
        input.chunkIndex,
        input.checkType
      );
      return result;
    }),
    // Endpoint legacy che analizza tutto il testo
    analyze: publicProcedure.input(AICheckInputSchema).output(AISupervisorResponseSchema).mutation(async ({ input }) => {
      const result = await analyzeText(input.text, input.checkType);
      return result;
    }),
    // Endpoint per ottenere i tipi di check disponibili
    getCheckTypes: publicProcedure.query(() => {
      return Object.entries(AI_CHECK_LABELS).map(([key, label]) => ({
        key,
        label
      }));
    }),
    // Endpoint per analizzare e proporre capitoli
    analyzeChapters: publicProcedure.input(ChaptersInputSchema).output(ChaptersResponseSchema).mutation(async ({ input }) => {
      const result = await analyzeChapters(input.text);
      return result;
    }),
    // Endpoint per inserire i capitoli nel testo
    insertChapters: publicProcedure.input(InsertChaptersInputSchema).output(z3.object({ text: z3.string() })).mutation(({ input }) => {
      const result = insertChaptersIntoText(input.text, input.chapters);
      return { text: result };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import { VitePWA } from "vite-plugin-pwa";
var plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginManusRuntime(),
  VitePWA({
    registerType: "autoUpdate",
    includeAssets: ["favicon.png", "logo.png", "manifest.json"],
    workbox: {
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      // 5 MB
    },
    manifest: {
      name: "GPX Correttore",
      short_name: "GPX Correttore",
      description: "Correttore Grammaticale Italiano Professionale",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      start_url: "/gpx-correttore/",
      icons: [
        {
          src: "logo.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "logo.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    }
  })
];
var vite_config_default = defineConfig({
  base: "/gpx-correttore/",
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const possiblePaths = [
    // When running from dist/index.js, public is a sibling folder
    path2.resolve(import.meta.dirname, "public"),
    // Fallback: relative to cwd
    path2.resolve(process.cwd(), "dist", "public"),
    // Absolute path for Render
    "/opt/render/project/src/dist/public"
  ];
  console.log(`Looking for build directory...`);
  console.log(`import.meta.dirname: ${import.meta.dirname}`);
  console.log(`process.cwd(): ${process.cwd()}`);
  let distPath = "";
  for (const p of possiblePaths) {
    console.log(`Checking path: ${p}`);
    if (fs.existsSync(p)) {
      distPath = p;
      console.log(`Found build directory at: ${distPath}`);
      break;
    } else {
      console.log(`Path not found: ${p}`);
    }
  }
  if (!distPath) {
    console.error(`Could not find the build directory.`);
    try {
      console.log(`Contents of import.meta.dirname:`, fs.readdirSync(import.meta.dirname));
      console.log(`Contents of cwd:`, fs.readdirSync(process.cwd()));
    } catch (e) {
      console.error(`Error listing directories:`, e);
    }
    distPath = possiblePaths[0];
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    const indexPath = path2.resolve(distPath, "index.html");
    console.log(`Serving index.html from: ${indexPath}`);
    res.sendFile(indexPath);
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
