import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { SESSION_COOKIE, verifySession } from "./session";

export async function getSession() {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  const user = db.select().from(schema.users).where(eq(schema.users.id, session.userId)).get();
  const team = db.select().from(schema.teams).where(eq(schema.teams.id, session.teamId)).get();
  const membership = db
    .select()
    .from(schema.teamMembers)
    .where(and(eq(schema.teamMembers.teamId, session.teamId), eq(schema.teamMembers.userId, session.userId)))
    .get();
  if (!user || !team || !membership) redirect("/sign-in");
  return { user, team, role: membership.role };
}
