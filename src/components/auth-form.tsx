"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { signIn, signUp, type FormState } from "@/lib/actions/auth";

export function AuthForm({ mode, next }: { mode: "sign-in" | "sign-up"; next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(mode === "sign-in" ? signIn : signUp, undefined);
  const isUp = mode === "sign-up";
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">{isUp ? "Create your workspace" : "Welcome back"}</h1>
      <p className="mt-2 text-sm text-slate-500">
        {isUp ? "Free forever on Starter. No credit card required." : "Sign in to your Orbit dashboard."}
      </p>
      {!isUp && (
        <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50/70 p-3 text-sm text-brand-800">
          Demo account: <b>demo@orbit.dev</b> / <b>demo1234</b>
        </div>
      )}
      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next ?? ""} />
        {isUp && (
          <>
            <div><Label htmlFor="name">Full name</Label><Input id="name" name="name" placeholder="Alex Morgan" required /></div>
            <div><Label htmlFor="company">Workspace name</Label><Input id="company" name="company" placeholder="Northwind Labs" required /></div>
          </>
        )}
        <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" placeholder="you@company.com" defaultValue={isUp ? "" : "demo@orbit.dev"} required /></div>
        <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" placeholder="••••••••" defaultValue={isUp ? "" : "demo1234"} required minLength={8} /></div>
        {state?.error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{state.error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>{pending ? "Please wait…" : isUp ? "Create account" : "Sign in"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        {isUp ? "Already have an account? " : "New to Orbit? "}
        <Link href={isUp ? "/sign-in" : "/sign-up"} className="font-medium text-brand-600 hover:text-brand-700">{isUp ? "Sign in" : "Create an account"}</Link>
      </p>
    </>
  );
}
