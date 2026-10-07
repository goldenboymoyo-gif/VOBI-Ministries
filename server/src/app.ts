import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { config, hashIp, isProduction } from "./config.js";
import { contactSchema, prayerSchema, looksLikeEmail } from "./schemas.js";
import {
  createStore,
  newId,
  readContent,
  type SubmissionKind,
  type SubmissionRecord,
  type SubmissionStore,
} from "./store.js";

export interface AppDeps {
  store: SubmissionStore;
}

export function createApp(store: SubmissionStore): Express {
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(helmet({ contentSecurityPolicy: isProduction() ? undefined : false }));
  app.use(
    compression({
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) return false;
        return compression.filter(req, res);
      },
    }),
  );
  app.use(
    cors({
      origin(origin, cb) {
        // Server-to-server and same-origin requests carry no Origin header.
        if (!origin || config.corsOrigins.includes(origin)) return cb(null, true);
        cb(new Error("Origin not allowed"));
      },
      credentials: false,
      methods: ["GET", "POST", "DELETE", "OPTIONS"],
    }),
  );
  app.use(express.json({ limit: "64kb" }));
  app.use(express.urlencoded({ extended: false, limit: "64kb" }));
  app.use(cookieParser());

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again shortly." },
  });

  const submitLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 6,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many messages in a short time. Please try again later." },
  });

  app.use("/api", apiLimiter);

  /* ------------------------------------------------------------- health --- */

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      version: config.version,
      env: config.env,
      storage: config.databaseUrl ? "postgres" : "file",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  /* ------------------------------------------------------------- content --- */

  const contentTypes = ["sermons", "ministries", "testimonies", "events"] as const;

  for (const type of contentTypes) {
    app.get(`/api/${type}`, async (_req, res) => {
      const rows = await readContent(type);
      if (!rows) {
        res.status(404).json({
          error: `${type} are authored in the website content layer.`,
          hint: `Drop an array at data/content/${type}.json to serve it from this API.`,
        });
        return;
      }
      res.json(rows);
    });
  }

  /**
   * Settings overrides. The website merges anything returned here over its
   * verified defaults — so VOBI can publish a service time here the moment it
   * is confirmed, without a code change.
   */
  app.get("/api/settings", async (_req, res) => {
    const rows = await readContent<Record<string, unknown>>("settings");
    res.json(rows ?? null);
  });

  /* ---------------------------------------------------------- submissions --- */

  app.post("/api/contacts", submitLimiter, async (req, res, next) => {
    try {
      const parsed = contactSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(422).json({
          error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
        });
        return;
      }
      const data = parsed.data;
      if (!looksLikeEmail(data.contact) && data.contact.replace(/\D/g, "").length < 7) {
        res.status(422).json({
          error: "Please leave a valid email address or telephone number.",
        });
        return;
      }
      await persist(req, res, store, "contact", data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/prayer-requests", submitLimiter, async (req, res, next) => {
    try {
      const parsed = prayerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(422).json({
          error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
        });
        return;
      }
      await persist(req, res, store, "prayer", parsed.data);
    } catch (err) {
      next(err);
    }
  });

  /* --------------------------------------------------------------- admin --- */

  app.get("/api/admin/submissions", requireAdmin, async (req, res, next) => {
    try {
      const kind = req.query.kind as SubmissionKind | undefined;
      const rows = await store.list(kind);
      res.json({ count: rows.length, submissions: rows });
    } catch (err) {
      next(err);
    }
  });

  app.delete("/api/admin/submissions/:id", requireAdmin, async (req, res, next) => {
    try {
      const ok = await store.remove(String(req.params.id ?? ""));
      res.status(ok ? 204 : 404).end();
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/admin/submissions/:id/read", requireAdmin, async (req, res, next) => {
    try {
      const ok = await store.markRead(String(req.params.id ?? ""));
      res.status(ok ? 200 : 404).json(ok ? { ok: true } : { error: "Not found." });
    } catch (err) {
      next(err);
    }
  });

  /* -------------------------------------------------------------- errors --- */

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found." });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const message = err.message.includes("Origin not allowed")
      ? "Origin not allowed."
      : "Unexpected server error.";
    if (!isProduction()) console.error(err);
    res.status(500).json({ error: message });
  });

  return app;
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!config.adminToken) {
    res.status(503).json({
      error: "Admin access is not configured. Set ADMIN_TOKEN in the server environment.",
    });
    return;
  }
  if (token !== config.adminToken) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }
  next();
}

interface SubmissionData {
  name?: string;
  contact?: string;
  subject?: string;
  message?: string;
  source?: string;
  page?: string;
  church?: string;
  submittedAt?: string;
}

async function persist(
  req: Request,
  res: Response,
  store: SubmissionStore,
  kind: SubmissionKind,
  data: SubmissionData,
): Promise<void> {
  const record: SubmissionRecord = {
    id: newId(),
    kind,
    name: data.name ?? "",
    contact: data.contact ?? "",
    subject: data.subject ?? "",
    message: data.message ?? "",
    source: data.source ?? "vobi-website",
    page: data.page ?? "/",
    church: data.church ?? "",
    submittedAt: data.submittedAt ?? new Date().toISOString(),
    ipHash: hashIp(req.ip ?? "unknown"),
    read: false,
    createdAt: new Date().toISOString(),
  };

  await store.add(record);

  res.status(201).json({
    ok: true,
    id: record.id,
    kind: record.kind,
    // Nothing private is echoed back to the visitor.
    received: true,
  });
}
