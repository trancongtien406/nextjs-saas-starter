import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/current";
import { listCustomers, PAGE_SIZE } from "@/lib/queries";
import { formatMoney } from "@/lib/plans";
import { cn, initials } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";

export const metadata = { title: "Customers — Orbit" };
const STATUSES = ["all", "active", "trialing", "past_due", "churned"];

export default async function Customers({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  const sp = await searchParams;
  const { team } = await requireUser();
  const { rows, total, page, pages } = listCustomers(team.id, { q: sp.q, status: sp.status, page: Number(sp.page) || 1 });
  const href = (o: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q: sp.q, status: sp.status, page: undefined as unknown, ...o };
    Object.entries(merged).forEach(([k, v]) => v && v !== "all" && p.set(k, String(v)));
    return `/dashboard/customers${p.size ? `?${p}` : ""}`;
  };
  return (
    <>
      <PageHeader title="Customers" description={`${total.toLocaleString("en-US")} customers match your filters.`}>
        <ButtonLink href="#" variant="secondary" size="sm">Export CSV</ButtonLink>
        <ButtonLink href="#" size="sm"><Plus className="h-4 w-4" />Add customer</ButtonLink>
      </PageHeader>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm">
            {STATUSES.map((s) => (
              <Link key={s} href={href({ status: s })} className={cn("rounded-md px-3 py-1.5 capitalize", (sp.status ?? "all") === s ? "bg-white font-medium shadow-sm" : "text-slate-500 hover:text-slate-900")}>{s.replace("_", " ")}</Link>
            ))}
          </div>
          <form className="relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            {sp.status && <input type="hidden" name="status" value={sp.status} />}
            <input name="q" defaultValue={sp.q} placeholder="Search name, email, company" className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-brand-500" />
          </form>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50/70 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="px-6 py-3 font-medium">Customer</th><th className="px-3 py-3 font-medium">Company</th><th className="px-3 py-3 font-medium">Country</th><th className="px-3 py-3 font-medium">Plan</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 text-right font-medium">MRR</th><th className="px-6 py-3 text-right font-medium">Since</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70">
                <td className="px-6 py-3"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{initials(c.name)}</span><div><p className="font-medium text-slate-900">{c.name}</p><p className="text-xs text-slate-500">{c.email}</p></div></div></td>
                <td className="px-3 py-3 text-slate-700">{c.company}</td>
                <td className="px-3 py-3 text-slate-500">{c.country}</td>
                <td className="px-3 py-3"><Badge tone={c.plan === "Enterprise" ? "brand" : "gray"}>{c.plan}</Badge></td>
                <td className="px-3 py-3"><Badge tone={statusTone(c.status)}>{c.status.replace("_", " ")}</Badge></td>
                <td className="px-3 py-3 text-right font-medium tabular-nums">{formatMoney(c.mrrCents)}</td>
                <td className="px-6 py-3 text-right text-slate-500">{c.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-500">No customers found. Try a different search.</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 text-sm text-slate-500">
          <span>Showing {total ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, total)} of {total}</span>
          <div className="flex items-center gap-2">
            <Link aria-disabled={page <= 1} href={href({ page: page - 1 })} className={cn("rounded-lg border border-slate-200 p-1.5", page <= 1 && "pointer-events-none opacity-40")}><ChevronLeft className="h-4 w-4" /></Link>
            <span>Page {page} of {pages}</span>
            <Link aria-disabled={page >= pages} href={href({ page: page + 1 })} className={cn("rounded-lg border border-slate-200 p-1.5", page >= pages && "pointer-events-none opacity-40")}><ChevronRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </Card>
    </>
  );
}
