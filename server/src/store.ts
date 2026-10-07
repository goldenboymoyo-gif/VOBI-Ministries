import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import pg from "pg";

import { config, isProduction } from "./config.js";

export type SubmissionKind = "contact" | "prayer";

export interface SubmissionRecord {
  id: string;
  kind: SubmissionKind;
  name: string;
  contact: string;
  subject: string;
  message: string;
  source: string;
  page: string;
  church: string;
  submittedAt: string | null;
  ipHash: string | null;
  read: boolean;
  createdAt: string;
}

export interface SubmissionStore {
  init(): Promise<void>;
  add(record: SubmissionRecord): Promise<void>;
  list(kind?: SubmissionKind): Promise<SubmissionRecord[]>;
  remove(id: string): Promise<boolean>;
  markRead(id: string): Promise<boolean>;
}

/* ------------------------------------------------------------------ file --- */

class FileStore implements SubmissionStore {
  private readonly file: string;
  private cache: SubmissionRecord[] | null = null;

  constructor(dataDir: string) {
    this.file = path.join(dataDir, "submissions.json");
  }

  async init(): Promise<void> {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    try {
      const raw = await fs.readFile(this.file, "utf8");
      this.cache = JSON.parse(raw) as SubmissionRecord[];
    } catch {
      this.cache = [];
      await this.persist();
    }
  }

  private async read(): Promise<SubmissionRecord[]> {
    if (this.cache) return this.cache;
    try {
      const raw = await fs.readFile(this.file, "utf8");
      this.cache = JSON.parse(raw) as SubmissionRecord[];
    } catch {
      this.cache = [];
    }
    return this.cache;
  }

  private async persist(): Promise<void> {
    const tmp = `${this.file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(this.cache ?? [], null, 2), "utf8");
    await fs.rename(tmp, this.file);
  }

  async add(record: SubmissionRecord): Promise<void> {
    const rows = await this.read();
    rows.unshift(record);
    // Keep the file bounded: only the newest 2000 messages are retained.
    if (rows.length > 2000) rows.length = 2000;
    await this.persist();
  }

  async list(kind?: SubmissionKind): Promise<SubmissionRecord[]> {
    const rows = await this.read();
    return kind ? rows.filter((r) => r.kind === kind) : rows;
  }

  async remove(id: string): Promise<boolean> {
    const rows = await this.read();
    const next = rows.filter((r) => r.id !== id);
    if (next.length === rows.length) return false;
    this.cache = next;
    await this.persist();
    return true;
  }

  async markRead(id: string): Promise<boolean> {
    const rows = await this.read();
    const row = rows.find((r) => r.id === id);
    if (!row) return false;
    row.read = true;
    await this.persist();
    return true;
  }
}

/* ------------------------------------------------------------- postgres --- */

class PostgresStore implements SubmissionStore {
  private readonly pool: pg.Pool;

  constructor(connectionString: string) {
    this.pool = new pg.Pool({ connectionString, max: 10 });
  }

  async init(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id           text PRIMARY KEY,
        kind         text NOT NULL CHECK (kind IN ('contact', 'prayer')),
        name         text NOT NULL DEFAULT '',
        contact      text NOT NULL DEFAULT '',
        subject      text NOT NULL DEFAULT '',
        message      text NOT NULL,
        source       text NOT NULL DEFAULT '',
        page         text NOT NULL DEFAULT '',
        church       text NOT NULL DEFAULT '',
        submitted_at text,
        ip_hash      text,
        read         boolean NOT NULL DEFAULT false,
        created_at   timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS submissions_kind_idx ON submissions (kind, created_at DESC);
    `);
  }

  async add(record: SubmissionRecord): Promise<void> {
    await this.pool.query(
      `INSERT INTO submissions
         (id, kind, name, contact, subject, message, source, page, church, submitted_at, ip_hash, read, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        record.id,
        record.kind,
        record.name,
        record.contact,
        record.subject,
        record.message,
        record.source,
        record.page,
        record.church,
        record.submittedAt,
        record.ipHash,
        record.read,
        record.createdAt,
      ],
    );
  }

  async list(kind?: SubmissionKind): Promise<SubmissionRecord[]> {
    const result = kind
      ? await this.pool.query(
          `SELECT id, kind, name, contact, subject, message, source, page, church,
                  submitted_at, ip_hash, read, created_at
             FROM submissions WHERE kind = $1 ORDER BY created_at DESC LIMIT 500`,
          [kind],
        )
      : await this.pool.query(
          `SELECT id, kind, name, contact, subject, message, source, page, church,
                  submitted_at, ip_hash, read, created_at
             FROM submissions ORDER BY created_at DESC LIMIT 500`,
        );

    return result.rows.map(mapRow);
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.pool.query(`DELETE FROM submissions WHERE id = $1`, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async markRead(id: string): Promise<boolean> {
    const res = await this.pool.query(`UPDATE submissions SET read = true WHERE id = $1`, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}

function mapRow(r: Record<string, unknown>): SubmissionRecord {
  return {
    id: String(r.id),
    kind: r.kind as SubmissionKind,
    name: String(r.name ?? ""),
    contact: String(r.contact ?? ""),
    subject: String(r.subject ?? ""),
    message: String(r.message ?? ""),
    source: String(r.source ?? ""),
    page: String(r.page ?? ""),
    church: String(r.church ?? ""),
    submittedAt: r.submitted_at ? String(r.submitted_at) : null,
    ipHash: r.ip_hash ? String(r.ip_hash) : null,
    read: Boolean(r.read),
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

/* --------------------------------------------------------------- factory --- */

export function createStore(): SubmissionStore {
  if (config.databaseUrl) return new PostgresStore(config.databaseUrl);
  return new FileStore(config.dataDir);
}

export function newId(): string {
  return crypto.randomUUID();
}

/* --------------------------------------------------------------- content --- */

const CONTENT_TYPES = [
  "sermons",
  "ministries",
  "testimonies",
  "events",
  "settings",
] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

/**
 * Optional content endpoint. If `data/content/<name>.json` exists it is
 * served; otherwise the route returns 404 and the website falls back to the
 * content it authors in `client/content/*`.
 */
export async function readContent<T>(name: ContentType): Promise<T | null> {
  const file = path.join(config.dataDir, "content", `${name}.json`);
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as T;
    if (parsed && typeof parsed === "object") return parsed as T;
    return null;
  } catch {
    if (isProduction()) return null;
    return null;
  }
}
