/* Seeds a realistic demo workspace: `pnpm db:seed` (wipes data/app.db first). */
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { ensureSchema } from "../src/lib/db/migrate";

const file = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "app.db");
fs.mkdirSync(path.dirname(file), { recursive: true });
for (const f of [file, `${file}-wal`, `${file}-shm`]) if (fs.existsSync(f)) fs.rmSync(f);
const db = new Database(file);
ensureSchema(db);

// deterministic PRNG so screenshots are reproducible
let s = 42;
const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
const now = new Date("2026-11-14T09:00:00Z");
const daysAgo = (d: number) => Math.floor((now.getTime() - d * 86400000) / 1000);

const first = ["Olivia", "Liam", "Emma", "Noah", "Ava", "Lucas", "Mia", "Ethan", "Sofia", "Mateo", "Hana", "Kenji", "Linh",
  "Minh", "Chloe", "Leo", "Isla", "Arjun", "Priya", "Jonas", "Elena", "Omar", "Zara", "Daniel", "Yuki", "Camille", "Felix",
  "Nora", "Ivan", "Grace", "Samuel", "Amara", "Diego", "Freya", "Hugo", "Lea", "Marcus", "Aisha", "Tomás", "Ingrid"];
const last = ["Nguyen", "Smith", "Garcia", "Müller", "Rossi", "Tanaka", "Kim", "Johnson", "Silva", "Dubois", "Patel",
  "Andersen", "Kowalski", "Tran", "Brown", "Lopez", "Novak", "Haddad", "Okafor", "Lindqvist", "Moreau", "Sato", "Clarke"];
const companies = ["Brightlane", "Fernhill", "Kitewave", "Lumora", "Northpeak", "Quillstack", "Rivetly", "Solstice Labs",
  "Tidewell", "Upframe", "Vantaflow", "Wildgrain", "Zentrix", "Apexium", "Bluecove", "Cobalt & Co", "Driftwood Studio",
  "Embercloud", "Foxtrot Health", "Glasshouse", "Helix Robotics", "Inkpath", "Juniper AI", "Keystone Legal", "Loop Fitness",
  "Mosaic Learning", "Nimbus Retail", "Orchard Bank", "Pinecrest", "Quantum Leaf", "Redwood Travel", "Saffron Kitchen"];
const countries = ["United States", "United States", "United States", "United Kingdom", "Germany", "Canada", "Australia",
  "France", "Netherlands", "Singapore", "Japan", "Vietnam", "Sweden", "Brazil", "India"];

const pw = bcrypt.hashSync("demo1234", 10);
const ins = (sql: string, ...a: unknown[]) => Number(db.prepare(sql).run(...a).lastInsertRowid);

const teamId = ins(`INSERT INTO teams (name, plan, subscription_status, created_at) VALUES (?,?,?,?)`,
  "Northwind Labs", "pro", "active", daysAgo(380));
const team: { name: string; email: string; role: string; days: number }[] = [
  { name: "Alex Morgan", email: "demo@orbit.dev", role: "owner", days: 380 },
  { name: "Linh Tran", email: "linh@northwind.io", role: "admin", days: 300 },
  { name: "Jonas Lindqvist", email: "jonas@northwind.io", role: "member", days: 220 },
  { name: "Priya Patel", email: "priya@northwind.io", role: "member", days: 150 },
  { name: "Marcus Okafor", email: "marcus@northwind.io", role: "member", days: 60 },
  { name: "Camille Dubois", email: "camille@northwind.io", role: "admin", days: 25 },
];
const userIds = team.map((m) => {
  const id = ins(`INSERT INTO users (name, email, password_hash, created_at) VALUES (?,?,?,?)`, m.name, m.email, pw, daysAgo(m.days));
  ins(`INSERT INTO team_members (team_id, user_id, role, joined_at) VALUES (?,?,?,?)`, teamId, id, m.role, daysAgo(m.days));
  return id;
});
ins(`INSERT INTO invitations (team_id, email, role, created_at) VALUES (?,?,?,?)`, teamId, "sam@northwind.io", "member", daysAgo(2));

// customers: growth curve over 14 months
const planPrices: [string, number][] = [["Basic", 1900], ["Growth", 4900], ["Growth", 4900], ["Scale", 14900], ["Enterprise", 49900]];
const custStmt = db.prepare(`INSERT INTO customers (team_id, name, email, company, country, plan, mrr_cents, status, created_at) VALUES (?,?,?,?,?,?,?,?,?)`);
const tx = db.transaction(() => {
  for (let i = 0; i < 312; i++) {
    const age = Math.floor(Math.pow(rnd(), 0.7) * 420); // more recent customers
    const fn = pick(first), ln = pick(last), co = pick(companies);
    const [plan, price] = rnd() < 0.06 ? planPrices[4] : pick(planPrices.slice(0, 4));
    const r = rnd();
    const status = age < 45 && r < 0.35 ? "trialing" : r < 0.1 ? "churned" : r < 0.13 ? "past_due" : "active";
    const email = `${fn}.${ln}`.toLowerCase().normalize("NFD").replace(/[^a-z.]/g, "") + "@" + co.toLowerCase().replace(/[^a-z]/g, "") + ".com";
    custStmt.run(teamId, `${fn} ${ln}`, email, co, pick(countries), plan, status === "trialing" ? 0 : price, status, daysAgo(age));
  }
});
tx();

// monthly metrics, last 12 months: a smooth growth curve that ends exactly at the real MRR of active customers
const liveMrr = (db.prepare(`SELECT SUM(mrr_cents) v FROM customers WHERE team_id=? AND status IN ('active','past_due')`).get(teamId) as { v: number }).v;
const growth: number[] = [];
for (let m = 0; m < 12; m++) growth.push(1.055 + rnd() * 0.05);
let mrr = liveMrr;
const series: number[] = [];
for (let m = 0; m < 12; m++) { series.unshift(Math.round(mrr)); mrr /= growth[m]; }
const liveActive = (db.prepare(`SELECT COUNT(*) v FROM customers WHERE team_id=? AND status='active'`).get(teamId) as { v: number }).v;
const added: number[] = [], churned: number[] = [], active: number[] = [];
for (let i = 0; i < 12; i++) { added.push(8 + Math.floor(rnd() * 6) + i); churned.push(2 + Math.floor(rnd() * 4)); }
let a = liveActive;
for (let i = 11; i >= 0; i--) { active[i] = a; a = a - added[i] + churned[i]; }
for (let i = 0; i < 12; i++) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (11 - i), 1));
  ins(`INSERT INTO monthly_metrics (team_id, month, mrr_cents, new_customers, churned_customers, active_customers, active_users) VALUES (?,?,?,?,?,?,?)`,
    teamId, d.toISOString().slice(0, 7), series[i], added[i], churned[i], active[i], 2400 + i * 310 + Math.floor(rnd() * 250));
}

// invoices: Starter for 2 months, then Pro
for (let m = 11; m >= 0; m--) {
  const pro = m < 10;
  ins(`INSERT INTO invoices (team_id, number, plan, amount_cents, status, created_at) VALUES (?,?,?,?,?,?)`,
    teamId, `INV-2026-${String(1000 + (11 - m)).padStart(4, "0")}`, pro ? "Pro" : "Starter", pro ? 2900 : 0, "paid", daysAgo(m * 30 + 3));
}

const actions: [number, string, string, number][] = [
  [0, "plan.upgraded", "Upgraded workspace to Pro", 300],
  [1, "member.joined", "Linh Tran joined as Admin", 300],
  [5, "member.joined", "Camille Dubois joined as Admin", 25],
  [0, "export.created", "Exported 312 customers to CSV", 9],
  [1, "customer.created", "Added Juniper AI (Enterprise)", 6],
  [3, "report.shared", "Shared the October revenue report", 5],
  [2, "integration.connected", "Connected Stripe (test mode)", 4],
  [0, "member.invited", "Invited sam@northwind.io as Member", 2],
  [4, "customer.updated", "Moved Helix Robotics to Scale", 1],
  [1, "settings.updated", "Updated workspace name", 0.2],
];
for (const [u, a, d, ago] of actions) {
  ins(`INSERT INTO activity_logs (team_id, user_id, action, detail, created_at) VALUES (?,?,?,?,?)`, teamId, userIds[u], a, d, daysAgo(ago));
}
console.log(`Seeded ${file}\n  login: demo@orbit.dev / demo1234\n  team: Northwind Labs (Pro), 312 customers, 12 months of metrics`);
