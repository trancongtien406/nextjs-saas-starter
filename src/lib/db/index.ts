import "server-only";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";
import { ensureSchema } from "./migrate";

const file = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "app.db");
fs.mkdirSync(path.dirname(file), { recursive: true });

const globalForDb = globalThis as unknown as { sqlite?: Database.Database };
const sqlite = globalForDb.sqlite ?? new Database(file);
if (!globalForDb.sqlite) {
  ensureSchema(sqlite);
  globalForDb.sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
export { schema };
