import "dotenv/config";
import crypto from "node:crypto";
import path from "node:path";

function str(key: string, fallback = ""): string {
  const v = process.env[key];
  return v === undefined || v === "" ? fallback : v;
}

function int(key: string, fallback: number): number {
  const v = Number(process.env[key]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

const origins = str("CORS_ORIGIN", "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const config = {
  env: str("NODE_ENV", "development"),
  port: int("PORT", 4000),
  corsOrigins: origins,
  adminToken: str("ADMIN_TOKEN"),
  databaseUrl: str("DATABASE_URL"),
  dataDir: path.resolve(str("DATA_DIR", path.join(process.cwd(), "data"))),
  // Rotation salt for one-way IP hashing (spam control without storing raw IPs).
  ipSalt: str("IP_SALT", "vobi"),
  version: "1.0.0",
} as const;

export function isProduction(): boolean {
  return config.env === "production";
}

export function hashIp(ip: string): string {
  const day = new Date().toISOString().slice(0, 10);
  return crypto.createHash("sha256").update(`${config.ipSalt}|${day}|${ip}`).digest("hex").slice(0, 32);
}
