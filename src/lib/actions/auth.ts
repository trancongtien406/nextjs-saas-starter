"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { SESSION_COOKIE, signSession } from "@/lib/auth/session";
import { safeNext } from "@/lib/auth/redirect";

export type FormState = { error?: string; ok?: string } | undefined;

async function startSession(userId: number, teamId: number) {
  const store = await cookies();
  store.set(SESSION_COOKIE, await signSession({ userId, teamId }), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
}

const signInSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Enter a valid email and a password of at least 8 characters." };
  const user = db.select().from(schema.users).where(eq(schema.users.email, parsed.data.email.toLowerCase())).get();
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) return { error: "Invalid email or password." };
  const member = db.select().from(schema.teamMembers).where(eq(schema.teamMembers.userId, user.id)).get();
  if (!member) return { error: "No workspace found for this account." };
  await startSession(user.id, member.teamId);
  redirect(safeNext(form.get("next")));
}

const signUpSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().min(2, "Workspace name is too short"),
});

export async function signUp(_: FormState, form: FormData): Promise<FormState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const email = parsed.data.email.toLowerCase();
  if (db.select().from(schema.users).where(eq(schema.users.email, email)).get()) return { error: "An account with this email already exists." };
  const now = new Date();
  const user = db.insert(schema.users).values({ name: parsed.data.name, email, passwordHash: await hashPassword(parsed.data.password), createdAt: now }).returning().get();
  const team = db.insert(schema.teams).values({ name: parsed.data.company, plan: "starter", createdAt: now }).returning().get();
  db.insert(schema.teamMembers).values({ teamId: team.id, userId: user.id, role: "owner", joinedAt: now }).run();
  db.insert(schema.activityLogs).values({ teamId: team.id, userId: user.id, action: "workspace.created", detail: `Created workspace ${team.name}`, createdAt: now }).run();
  await startSession(user.id, team.id);
  redirect("/dashboard");
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
