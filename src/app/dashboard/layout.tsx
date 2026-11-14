import { Logo } from "@/components/logo";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { requireUser } from "@/lib/auth/current";
import { signOut } from "@/lib/actions/auth";
import { getPlan } from "@/lib/plans";
import { initials } from "@/lib/utils";
import { Bell, ChevronsUpDown, LogOut, Search, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, team } = await requireUser();
  const plan = getPlan(team.plan);
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-100/60 px-4 py-5 lg:flex">
        <div className="px-2"><Logo href="/dashboard" /></div>
        <button className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left shadow-sm">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-rose-500 text-xs font-bold text-white">{initials(team.name)}</span>
          <span className="flex-1"><span className="block text-sm font-semibold leading-tight">{team.name}</span><span className="text-xs text-slate-500">{plan.name} plan</span></span>
          <ChevronsUpDown className="h-4 w-4 text-slate-400" />
        </button>
        <div className="mt-6 flex-1"><SidebarNav /></div>
        {team.plan !== "business" && (
          <div className="rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 p-4 text-white shadow-lg shadow-brand-600/20">
            <Sparkles className="h-5 w-5" />
            <p className="mt-2 text-sm font-semibold">Upgrade to {team.plan === "starter" ? "Pro" : "Business"}</p>
            <p className="mt-1 text-xs text-brand-100">More seats, audit log and priority support.</p>
            <Link href="/dashboard/billing" className="mt-3 inline-block rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25">See plans</Link>
          </div>
        )}
        <div className="mt-4 flex items-center gap-3 border-t border-slate-200 px-2 pt-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">{initials(user.name)}</span>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{user.name}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div>
          <form action={signOut}><button title="Sign out" className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700"><LogOut className="h-4 w-4" /></button></form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-8 backdrop-blur">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <form action="/dashboard/customers"><input name="q" placeholder="Search customers, companies, emails…" className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-16 text-sm outline-none focus:border-brand-500 focus:bg-white" /></form>
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 text-[10px] text-slate-400">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" /></button>
          </div>
        </header>
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
