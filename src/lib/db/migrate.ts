import type Database from "better-sqlite3";

/** Idempotent schema bootstrap so `pnpm dev` works without a separate migration step. */
export function ensureSchema(sqlite: Database.Database) {
  sqlite.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, plan TEXT NOT NULL DEFAULT 'starter',
      subscription_status TEXT NOT NULL DEFAULT 'active', stripe_customer_id TEXT, stripe_subscription_id TEXT,
      created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT, team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, role TEXT NOT NULL, joined_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS invitations (
      id INTEGER PRIMARY KEY AUTOINCREMENT, team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      email TEXT NOT NULL, role TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT, team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      name TEXT NOT NULL, email TEXT NOT NULL, company TEXT NOT NULL, country TEXT NOT NULL, plan TEXT NOT NULL,
      mrr_cents INTEGER NOT NULL, status TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS customers_team_idx ON customers(team_id, created_at);
    CREATE TABLE IF NOT EXISTS monthly_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT, team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      month TEXT NOT NULL, mrr_cents INTEGER NOT NULL, new_customers INTEGER NOT NULL,
      churned_customers INTEGER NOT NULL, active_customers INTEGER NOT NULL, active_users INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT, team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      number TEXT NOT NULL, plan TEXT NOT NULL, amount_cents INTEGER NOT NULL, status TEXT NOT NULL,
      created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT, team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, action TEXT NOT NULL, detail TEXT NOT NULL,
      created_at INTEGER NOT NULL);
  `);
}
