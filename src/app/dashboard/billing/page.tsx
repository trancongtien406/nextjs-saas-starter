import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/current";
import { listInvoices } from "@/lib/queries";
import { PLANS, formatMoney, getPlan } from "@/lib/plans";
import { changePlan, openPortal } from "@/lib/actions/dashboard";
import { billingMode } from "@/lib/stripe";
import { cn } from "@/lib/utils";
import { Check, CheckCircle2, CreditCard, FileText, Info } from "lucide-react";

export const metadata = { title: "Billing — Orbit" };

export default async function Billing({ searchParams }: { searchParams: Promise<{ success?: string; portal?: string; error?: string }> }) {
  const sp = await searchParams;
  const { team, role } = await requireUser();
  const current = getPlan(team.plan);
  const invoices = listInvoices(team.id);
  return (
    <>
      <PageHeader title="Billing" description="Manage your subscription, payment method and invoices." />
      {sp.success && <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4" />Your plan has been updated.</div>}
      {sp.portal && <div className="mb-6 flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800"><Info className="h-4 w-4" />Demo billing mode: add Stripe test keys to open the real customer portal.</div>}
      {sp.error && <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">Only the workspace owner can change the plan.</div>}

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-6 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
            <div>
              <p className="text-sm text-slate-300">Current plan</p>
              <p className="mt-1 text-3xl font-bold">{current.name} <span className="text-lg font-medium text-slate-300">· ${current.priceMonthly}/mo</span></p>
              <p className="mt-2 text-sm text-slate-300">Renews on Dec 1, 2026 · <span className="capitalize">{team.subscriptionStatus}</span></p>
            </div>
            <form action={openPortal}><Button variant="secondary"><CreditCard className="h-4 w-4" />Manage payment</Button></form>
          </div>
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.id} className={cn("flex flex-col rounded-xl border p-5", p.id === current.id ? "border-brand-500 bg-brand-50/40 ring-4 ring-brand-500/10" : "border-slate-200")}>
                <div className="flex items-center justify-between"><p className="font-semibold">{p.name}</p>{p.id === current.id && <Badge tone="brand">Current</Badge>}</div>
                <p className="mt-2 text-2xl font-bold">${p.priceMonthly}<span className="text-sm font-normal text-slate-500">/mo</span></p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">{p.features.slice(0, 4).map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />{f}</li>)}</ul>
                <form action={changePlan} className="mt-5">
                  <input type="hidden" name="plan" value={p.id} />
                  <Button className="w-full" size="sm" variant={p.id === current.id ? "secondary" : "primary"} disabled={p.id === current.id || role !== "owner"}>
                    {p.id === current.id ? "Current plan" : p.priceMonthly > current.priceMonthly ? `Upgrade to ${p.name}` : `Switch to ${p.name}`}
                  </Button>
                </form>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Payment method</CardTitle><CardDescription>{billingMode === "stripe" ? "Managed by Stripe" : "Demo billing mode (no Stripe keys)"}</CardDescription></div></CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-violet-600 to-fuchsia-500 p-5 text-white shadow-lg">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
              <p className="text-xs uppercase tracking-widest text-white/70">Visa · test card</p>
              <p className="mt-8 font-mono text-lg tracking-widest">•••• •••• •••• 4242</p>
              <div className="mt-4 flex justify-between text-xs text-white/80"><span>{team.name}</span><span>12/28</span></div>
            </div>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Next invoice</dt><dd className="font-medium">{formatMoney(current.priceMonthly * 100)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Billing email</dt><dd className="font-medium">billing@northwind.io</dd></div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><div><CardTitle>Invoices</CardTitle><CardDescription>Download receipts for your records.</CardDescription></div></CardHeader>
        <CardContent className="px-0 pb-2">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-2 font-medium">Invoice</th><th className="px-3 py-2 font-medium">Date</th><th className="px-3 py-2 font-medium">Plan</th><th className="px-3 py-2 font-medium">Status</th><th className="px-6 py-2 text-right font-medium">Amount</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.slice(0, 8).map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-3"><span className="flex items-center gap-2 font-medium"><FileText className="h-4 w-4 text-slate-400" />{inv.number}</span></td>
                  <td className="px-3 py-3 text-slate-600">{inv.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-3 py-3 text-slate-600">{inv.plan}</td>
                  <td className="px-3 py-3"><Badge tone={inv.status === "paid" ? "green" : "amber"}>{inv.status}</Badge></td>
                  <td className="px-6 py-3 text-right font-medium tabular-nums">{formatMoney(inv.amountCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
