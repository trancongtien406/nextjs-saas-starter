import { PageHeader } from "@/components/dashboard/page-header";
import { InviteForm } from "@/components/dashboard/forms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth/current";
import { listMembers } from "@/lib/queries";
import { getPlan } from "@/lib/plans";
import { removeMember, revokeInvitation } from "@/lib/actions/dashboard";
import { initials, timeAgo } from "@/lib/utils";
import { Mail, X } from "lucide-react";

export const metadata = { title: "Team — Orbit" };
const colors = ["from-brand-500 to-violet-500", "from-emerald-400 to-teal-500", "from-amber-400 to-orange-500", "from-sky-400 to-blue-500", "from-rose-400 to-pink-500", "from-slate-500 to-slate-700"];

export default async function Team() {
  const { user, team, role } = await requireUser();
  const { members, pending } = listMembers(team.id);
  const plan = getPlan(team.plan);
  const used = members.length + pending.length;
  return (
    <>
      <PageHeader title="Team" description="Manage who has access to this workspace." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader><div><CardTitle>Members</CardTitle><CardDescription>{members.length} people in {team.name}</CardDescription></div></CardHeader>
          <CardContent className="px-0">
            <ul className="divide-y divide-slate-100">
              {members.map((m, i) => (
                <li key={m.id} className="flex items-center gap-4 px-6 py-3.5">
                  <span className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${colors[i % colors.length]} text-sm font-semibold text-white`}>{initials(m.name)}</span>
                  <div className="min-w-0 flex-1"><p className="font-medium">{m.name}{m.userId === user.id && <span className="ml-2 text-xs text-slate-400">(you)</span>}</p><p className="text-sm text-slate-500">{m.email}</p></div>
                  <span className="hidden text-sm text-slate-400 sm:block">Joined {timeAgo(m.joinedAt)}</span>
                  <Badge tone={m.role === "owner" ? "brand" : m.role === "admin" ? "blue" : "gray"} className="capitalize">{m.role}</Badge>
                  {role === "owner" && m.role !== "owner" ? (
                    <form action={removeMember}><input type="hidden" name="id" value={m.id} /><button className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" title="Remove"><X className="h-4 w-4" /></button></form>
                  ) : <span className="w-7" />}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader><div><CardTitle>Invite a teammate</CardTitle><CardDescription>They&apos;ll get an email to join {team.name}.</CardDescription></div></CardHeader>
            <CardContent><InviteForm disabled={role === "member"} /></CardContent>
          </Card>
          <Card>
            <CardHeader><div><CardTitle>Seats</CardTitle><CardDescription>{used} of {plan.seats} used on {plan.name}</CardDescription></div></CardHeader>
            <CardContent>
              <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-600" style={{ width: `${Math.min(100, (used / plan.seats) * 100)}%` }} /></div>
              {pending.length > 0 && (
                <ul className="mt-5 space-y-2">
                  <li className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pending invitations</li>
                  {pending.map((p) => (
                    <li key={p.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                      <Mail className="h-4 w-4 text-slate-400" /><span className="flex-1 truncate">{p.email}</span><Badge tone="amber">{p.role}</Badge>
                      {role !== "member" && <form action={revokeInvitation}><input type="hidden" name="id" value={p.id} /><button className="text-slate-400 hover:text-rose-600" title="Revoke"><X className="h-4 w-4" /></button></form>}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
