import "server-only";
import { and, asc, count, desc, eq, like, or, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

const { customers, monthlyMetrics, activityLogs, users, teamMembers, invoices, invitations } = schema;

export function getOverview(teamId: number) {
  const metrics = db.select().from(monthlyMetrics).where(eq(monthlyMetrics.teamId, teamId)).orderBy(asc(monthlyMetrics.month)).all();
  const byStatus = db.select({ status: customers.status, n: count(), mrr: sql<number>`sum(${customers.mrrCents})` })
    .from(customers).where(eq(customers.teamId, teamId)).groupBy(customers.status).all();
  const byPlan = db.select({ plan: customers.plan, n: count(), mrr: sql<number>`sum(${customers.mrrCents})` })
    .from(customers).where(and(eq(customers.teamId, teamId), eq(customers.status, "active"))).groupBy(customers.plan)
    .orderBy(desc(sql`sum(${customers.mrrCents})`)).all();
  const recent = db.select().from(customers).where(eq(customers.teamId, teamId)).orderBy(desc(customers.createdAt)).limit(6).all();
  return { metrics, byStatus, byPlan, recent };
}

export const PAGE_SIZE = 12;

export function listCustomers(teamId: number, opts: { q?: string; status?: string; page?: number }) {
  const page = Math.max(1, opts.page ?? 1);
  const filters = [eq(customers.teamId, teamId)];
  if (opts.q) {
    const q = `%${opts.q}%`;
    filters.push(or(like(customers.name, q), like(customers.email, q), like(customers.company, q))!);
  }
  if (opts.status && opts.status !== "all") filters.push(eq(customers.status, opts.status as "active"));
  const where = and(...filters);
  const total = db.select({ n: count() }).from(customers).where(where).get()?.n ?? 0;
  const rows = db.select().from(customers).where(where).orderBy(desc(customers.createdAt)).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE).all();
  return { rows, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export function listMembers(teamId: number) {
  const members = db.select({ id: teamMembers.id, role: teamMembers.role, joinedAt: teamMembers.joinedAt, userId: users.id, name: users.name, email: users.email })
    .from(teamMembers).innerJoin(users, eq(users.id, teamMembers.userId)).where(eq(teamMembers.teamId, teamId)).orderBy(asc(teamMembers.joinedAt)).all();
  const pending = db.select().from(invitations).where(eq(invitations.teamId, teamId)).orderBy(desc(invitations.createdAt)).all();
  return { members, pending };
}

export function listActivity(teamId: number, limit = 50) {
  return db.select({ id: activityLogs.id, action: activityLogs.action, detail: activityLogs.detail, createdAt: activityLogs.createdAt, name: users.name })
    .from(activityLogs).leftJoin(users, eq(users.id, activityLogs.userId)).where(eq(activityLogs.teamId, teamId))
    .orderBy(desc(activityLogs.createdAt)).limit(limit).all();
}

export function listInvoices(teamId: number) {
  return db.select().from(invoices).where(eq(invoices.teamId, teamId)).orderBy(desc(invoices.createdAt)).all();
}
