"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireUser } from "@/lib/auth/current";
import { canAddSeat, getPlan, type PlanId } from "@/lib/plans";
import { createCheckoutUrl, createPortalUrl, stripe } from "@/lib/stripe";
import type { FormState } from "./auth";

function log(teamId: number, userId: number, action: string, detail: string) {
  db.insert(schema.activityLogs).values({ teamId, userId, action, detail, createdAt: new Date() }).run();
}

export async function inviteMember(_: FormState, form: FormData): Promise<FormState> {
  const { user, team, role } = await requireUser();
  if (role === "member") return { error: "Only owners and admins can invite teammates." };
  const parsed = z.object({ email: z.string().email(), role: z.enum(["admin", "member"]) }).safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Enter a valid email address." };
  const seats = (db.select({ n: count() }).from(schema.teamMembers).where(eq(schema.teamMembers.teamId, team.id)).get()?.n ?? 0)
    + (db.select({ n: count() }).from(schema.invitations).where(eq(schema.invitations.teamId, team.id)).get()?.n ?? 0);
  if (!canAddSeat(team.plan, seats)) return { error: `Your ${getPlan(team.plan).name} plan includes ${getPlan(team.plan).seats} seats. Upgrade to add more.` };
  db.insert(schema.invitations).values({ teamId: team.id, email: parsed.data.email.toLowerCase(), role: parsed.data.role, createdAt: new Date() }).run();
  log(team.id, user.id, "member.invited", `Invited ${parsed.data.email} as ${parsed.data.role === "admin" ? "Admin" : "Member"}`);
  revalidatePath("/dashboard/team");
  return { ok: `Invitation sent to ${parsed.data.email}` };
}

export async function revokeInvitation(form: FormData) {
  const { user, team, role } = await requireUser();
  if (role === "member") return;
  const id = Number(form.get("id"));
  const inv = db.select().from(schema.invitations).where(and(eq(schema.invitations.id, id), eq(schema.invitations.teamId, team.id))).get();
  if (!inv) return;
  db.delete(schema.invitations).where(eq(schema.invitations.id, id)).run();
  log(team.id, user.id, "member.invite_revoked", `Revoked invitation for ${inv.email}`);
  revalidatePath("/dashboard/team");
}

export async function removeMember(form: FormData) {
  const { user, team, role } = await requireUser();
  if (role !== "owner") return;
  const id = Number(form.get("id"));
  const m = db.select().from(schema.teamMembers).where(and(eq(schema.teamMembers.id, id), eq(schema.teamMembers.teamId, team.id))).get();
  if (!m || m.role === "owner") return;
  db.delete(schema.teamMembers).where(eq(schema.teamMembers.id, id)).run();
  log(team.id, user.id, "member.removed", `Removed a member from the workspace`);
  revalidatePath("/dashboard/team");
}

export async function changePlan(form: FormData) {
  const { user, team, role } = await requireUser();
  if (role !== "owner") redirect("/dashboard/billing?error=owner");
  const planId = z.enum(["starter", "pro", "business"]).parse(form.get("plan")) as PlanId;
  if (stripe && planId !== "starter") {
    redirect(await createCheckoutUrl({ teamId: team.id, planId, customerId: team.stripeCustomerId, email: user.email }));
  }
  // demo billing mode: switch immediately and issue a paid invoice
  const plan = getPlan(planId);
  db.update(schema.teams).set({ plan: planId, subscriptionStatus: "active" }).where(eq(schema.teams.id, team.id)).run();
  const n = db.select({ n: count() }).from(schema.invoices).where(eq(schema.invoices.teamId, team.id)).get()?.n ?? 0;
  db.insert(schema.invoices).values({ teamId: team.id, number: `INV-2026-${String(1000 + n).padStart(4, "0")}`, plan: plan.name, amountCents: plan.priceMonthly * 100, status: "paid", createdAt: new Date() }).run();
  log(team.id, user.id, "plan.changed", `Changed plan to ${plan.name}`);
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/billing?success=1");
}

export async function openPortal() {
  const { team } = await requireUser();
  if (!stripe || !team.stripeCustomerId) redirect("/dashboard/billing?portal=demo");
  redirect(await createPortalUrl(team.stripeCustomerId));
}

export async function updateSettings(_: FormState, form: FormData): Promise<FormState> {
  const { user, team, role } = await requireUser();
  const parsed = z.object({ name: z.string().min(2), teamName: z.string().min(2) }).safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Names must be at least 2 characters." };
  db.update(schema.users).set({ name: parsed.data.name }).where(eq(schema.users.id, user.id)).run();
  if (role !== "member" && parsed.data.teamName !== team.name) {
    db.update(schema.teams).set({ name: parsed.data.teamName }).where(eq(schema.teams.id, team.id)).run();
    log(team.id, user.id, "settings.updated", `Renamed workspace to ${parsed.data.teamName}`);
  }
  revalidatePath("/dashboard", "layout");
  return { ok: "Settings saved" };
}
