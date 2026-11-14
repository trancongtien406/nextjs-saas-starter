import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { GrowthChart } from "@/components/dashboard/charts";
import { MrrPanel } from "@/components/dashboard/mrr-panel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/current";
import { getOverview } from "@/lib/queries";
import { formatMoney, percentChange } from "@/lib/plans";
import { timeAgo } from "@/lib/utils";
import { Avatar } from "@/components/dashboard/avatar";
import { DollarSign, Download, TrendingDown, Users, Wallet } from "lucide-react";

export const metadata = { title: "Overview — Orbit" };

export default async function Overview() {
  const { user, team } = await requireUser();
  const { metrics, byStatus, byPlan, recent } = getOverview(team.id);
  const cur = metrics.at(-1), prev = metrics.at(-2);
  const active = cur?.activeCustomers ?? byStatus.find((s) => s.status === "active")?.n ?? 0;
  const prevActive = prev?.activeCustomers ?? active;
  const mrr = cur?.mrrCents ?? 0;
  const churnRate = cur && prev ? (cur.churnedCustomers / prev.activeCustomers) * 100 : 0;
  const prevChurn = prev && metrics.at(-3) ? (prev.churnedCustomers / metrics.at(-3)!.activeCustomers) * 100 : churnRate;
  const arpa = active ? Math.round(mrr / active / 100) * 100 : 0;
  const prevArpa = prev && prevActive ? Math.round(prev.mrrCents / prevActive / 100) * 100 : 0;
  const last12 = metrics.slice(-12);
  const prev12 = metrics.slice(-24, -12);
  const totalPlanMrr = byPlan.reduce((a, p) => a + p.mrr, 0) || 1;
  const hour = new Date().getHours();

  return (
    <>
      <PageHeader title={`Good ${hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"}, ${user.name.split(" ")[0]}`} description={`Here's how ${team.name} is doing this month.`}>
        <ButtonLink href="#" variant="secondary" size="sm"><Download className="h-4 w-4" />Export</ButtonLink>
        <ButtonLink href="/dashboard/customers" size="sm">View customers</ButtonLink>
      </PageHeader>

      {metrics.length === 0 ? (
        <Card className="p-12 text-center">
          <h2 className="text-lg font-semibold">Your workspace is ready</h2>
          <p className="mt-2 text-sm text-slate-500">Connect Stripe or import a CSV to see MRR, churn and growth here. Run <code>pnpm db:seed</code> for demo data.</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Monthly recurring revenue" value={formatMoney(mrr)} delta={percentChange(mrr, prev?.mrrCents ?? 0)} icon={DollarSign} />
            <StatCard label="Active customers" value={active.toLocaleString("en-US")} delta={percentChange(active, prevActive)} icon={Users} />
            <StatCard label="Customer churn" value={`${churnRate.toFixed(1)}%`} delta={Math.round((churnRate - prevChurn) * 10) / 10} icon={TrendingDown} invert />
            <StatCard label="Avg. revenue per account" value={formatMoney(arpa)} delta={percentChange(arpa, prevArpa)} icon={Wallet} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <MrrPanel data={last12.map((m, i) => ({ month: m.month, mrr: m.mrrCents / 100, prev: prev12[i] ? prev12[i].mrrCents / 100 : null }))} />
            </div>
            <Card>
              <CardHeader><div><CardTitle>Revenue by plan</CardTitle><CardDescription>Share of active MRR</CardDescription></div></CardHeader>
              <CardContent className="space-y-4">
                {byPlan.map((p, i) => (
                  <div key={p.plan}>
                    <div className="flex justify-between text-sm"><span className="font-medium">{p.plan}</span><span className="text-slate-500">{formatMoney(p.mrr)} · {p.n}</span></div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full" style={{ width: `${(p.mrr / totalPlanMrr) * 100}%`, background: ["#6366f1", "#8b5cf6", "#0ea5e9", "#f59e0b"][i % 4] }} />
                    </div>
                  </div>
                ))}
                <div className="!mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
                  {(["trialing", "past_due", "churned"] as const).map((s) => (
                    <div key={s}><p className="text-lg font-semibold">{byStatus.find((x) => x.status === s)?.n ?? 0}</p><p className="text-xs capitalize text-slate-500">{s.replace("_", " ")}</p></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <Card>
              <CardHeader><div><CardTitle>Customer growth</CardTitle><CardDescription>New vs churned per month</CardDescription></div></CardHeader>
              <CardContent><GrowthChart data={last12.map((m) => ({ month: m.month, added: m.newCustomers, churned: m.churnedCustomers }))} /></CardContent>
            </Card>
            <Card className="xl:col-span-2">
              <CardHeader><div><CardTitle>Latest customers</CardTitle><CardDescription>Most recent sign-ups</CardDescription></div><ButtonLink href="/dashboard/customers" variant="ghost" size="sm">View all</ButtonLink></CardHeader>
              <CardContent className="px-0 pb-2">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {recent.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-3"><div className="flex items-center gap-3"><Avatar name={c.name} size="sm" /><div><p className="font-medium">{c.name}</p><p className="text-xs text-slate-500">{c.company}</p></div></div></td>
                        <td className="px-3 py-3 text-slate-600">{c.plan}</td>
                        <td className="px-3 py-3"><Badge tone={statusTone(c.status)}>{c.status.replace("_", " ")}</Badge></td>
                        <td className="px-3 py-3 text-right font-medium">{formatMoney(c.mrrCents)}</td>
                        <td className="px-6 py-3 text-right text-slate-400">{timeAgo(c.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
