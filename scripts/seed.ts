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

// monthly metrics, last 24 months (12 shown + 12 for "previous period" comparison).
// Growth has realistic variance (a summer dip, a strong launch month) and ends exactly at the live MRR.
const liveMrr = (db.prepare(`SELECT SUM(mrr_cents) v FROM customers WHERE team_id=? AND status IN ('active','past_due')`).get(teamId) as { v: number }).v;
const MONTHS = 24;
const shape = [0.06, 0.03, 0.08, 0.02, -0.03, 0.05, 0.09, 0.01, 0.04, 0.07, -0.02, 0.05,
               0.06, 0.02, 0.07, 0.10, 0.03, -0.04, 0.01, 0.08, 0.05, 0.03, 0.09, 0.065];
const series: number[] = new Array(MONTHS);
let mrr = liveMrr;
for (let i = MONTHS - 1; i >= 0; i--) { series[i] = Math.round(mrr); mrr /= 1 + shape[i] + (rnd() - 0.5) * 0.01; }
const liveActive = (db.prepare(`SELECT COUNT(*) v FROM customers WHERE team_id=? AND status='active'`).get(teamId) as { v: number }).v;
const added: number[] = [], churned: number[] = [], active: number[] = [];
for (let i = 0; i < MONTHS; i++) {
  added.push(Math.max(3, Math.round(4 + i * 0.6 + shape[i] * 90 + rnd() * 4)));
  churned.push(2 + Math.floor(rnd() * 4) + (shape[i] < 0 ? 3 : 0));
}
// scale sign-ups so the workspace starts with ~70 customers two years ago and ends at the live count
const startActive = 70;
const sumChurn = churned.reduce((x, y) => x + y, 0), sumAdd = added.reduce((x, y) => x + y, 0);
const k = (liveActive - startActive + sumChurn) / sumAdd;
for (let i = 0; i < MONTHS; i++) added[i] = Math.max(1, Math.round(added[i] * k));
let a = startActive;
for (let i = 0; i < MONTHS; i++) { a = a + added[i] - churned[i]; active[i] = a; }
added[MONTHS - 1] += liveActive - active[MONTHS - 1];
active[MONTHS - 1] = liveActive;
for (let i = 0; i < MONTHS; i++) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (MONTHS - 1 - i), 1));
  ins(`INSERT INTO monthly_metrics (team_id, month, mrr_cents, new_customers, churned_customers, active_customers, active_users) VALUES (?,?,?,?,?,?,?)`,
    teamId, d.toISOString().slice(0, 7), series[i], added[i], churned[i], active[i], 1500 + i * 180 + Math.floor(rnd() * 250));
}

// per-customer billing history: subscription events + monthly payments (powers the customer drawer)
const evStmt = db.prepare(`INSERT INTO customer_events (team_id, customer_id, type, detail, amount_cents, created_at) VALUES (?,?,?,?,?,?)`);
const custs = db.prepare(`SELECT id, plan, mrr_cents, status, created_at FROM customers WHERE team_id=?`).all(teamId) as
  { id: number; plan: string; mrr_cents: number; status: string; created_at: number }[];
const nowSec = Math.floor(now.getTime() / 1000);
db.transaction(() => {
  for (const c of custs) {
    const start = c.created_at;
    evStmt.run(teamId, c.id, "signup", "Signed up from the pricing page", 0, start);
    evStmt.run(teamId, c.id, "trial_started", "Started 14-day free trial", 0, start + 60);
    if (c.status === "trialing") continue;
    const converted = start + 14 * 86400;
    if (converted > nowSec) continue;
    const price = c.mrr_cents || 4900;
    const firstPlan = c.plan === "Enterprise" ? "Scale" : c.plan === "Scale" ? "Growth" : c.plan;
    evStmt.run(teamId, c.id, "converted", `Converted to ${firstPlan}`, 0, converted);
    const upgradeAt = firstPlan !== c.plan ? converted + Math.floor((nowSec - converted) * 0.55) : 0;
    if (upgradeAt) evStmt.run(teamId, c.id, "upgraded", `Upgraded ${firstPlan} → ${c.plan}`, 0, upgradeAt);
    const churnAt = c.status === "churned" ? converted + Math.floor((nowSec - converted) * (0.4 + rnd() * 0.5)) : Infinity;
    for (let t = converted, k = 0; t < Math.min(nowSec, churnAt); t += 30 * 86400, k++) {
      const amount = upgradeAt && t < upgradeAt ? Math.round(price * 0.4 / 100) * 100 : price;
      const lastFailed = c.status === "past_due" && t + 30 * 86400 >= nowSec;
      evStmt.run(teamId, c.id, lastFailed ? "payment_failed" : "payment_succeeded", lastFailed ? "Card declined (insufficient funds)" : "Invoice paid", amount, t + 3600);
    }
    if (c.status === "churned") evStmt.run(teamId, c.id, "churned", rnd() < 0.5 ? "Canceled: switched to a competitor" : "Canceled: no longer needed", 0, churnAt);
  }
})();

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
console.log(`Seeded ${file}\n  login: demo@orbit.dev / demo1234\n  team: Northwind Labs (Pro), 312 customers, 24 months of metrics + billing history`);
