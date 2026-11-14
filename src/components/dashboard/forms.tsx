"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { inviteMember, updateSettings } from "@/lib/actions/dashboard";
import type { FormState } from "@/lib/actions/auth";

function Status({ state }: { state: FormState }) {
  if (state?.error) return <p className="text-sm text-rose-600">{state.error}</p>;
  if (state?.ok) return <p className="text-sm text-emerald-600">{state.ok}</p>;
  return null;
}

export function InviteForm({ disabled }: { disabled?: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(inviteMember, undefined);
  return (
    <form action={action} className="space-y-3">
      <div className="flex gap-2">
        <Input name="email" type="email" placeholder="teammate@company.com" required disabled={disabled} />
        <select name="role" className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm" disabled={disabled}>
          <option value="member">Member</option><option value="admin">Admin</option>
        </select>
        <Button disabled={pending || disabled}>{pending ? "Sending…" : "Invite"}</Button>
      </div>
      <Status state={state} />
    </form>
  );
}

export function SettingsForm({ name, email, teamName, canEditTeam }: { name: string; email: string; teamName: string; canEditTeam: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateSettings, undefined);
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><Label htmlFor="name">Full name</Label><Input id="name" name="name" defaultValue={name} /></div>
        <div><Label htmlFor="email">Email</Label><Input id="email" defaultValue={email} disabled /></div>
        <div className="sm:col-span-2"><Label htmlFor="teamName">Workspace name</Label><Input id="teamName" name="teamName" defaultValue={teamName} disabled={!canEditTeam} /></div>
      </div>
      <div className="flex items-center gap-4"><Button disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button><Status state={state} /></div>
    </form>
  );
}
