import Link from "next/link";
import { Avatar } from "@/components/dashboard/avatar";
import { Badge, statusTone } from "@/components/ui/badge";
import { formatMoney } from "@/lib/plans";
import { healthLabel, healthScore } from "@/lib/health";
import type { getCustomerDetail } from "@/lib/queries";
import { ArrowUpCircle, CheckCircle2, Flag, Mail, MapPin, PlayCircle, UserPlus, X, XCircle } from "lucide-react";

type Detail = NonNullable<ReturnType<typeof getCustomerDetail>>;
const ICONS: Record<string, [typeof Flag, string]> = {
  signup: [UserPlus, "text-sky-600 bg-sky-50"], trial_started: [PlayCircle, "text-violet-600 bg-violet-50"],
  converted: [CheckCircle2, "text-emerald-600 bg-emerald-50"], upgraded: [ArrowUpCircle, "text-brand-600 bg-brand-50"],
  churned: [XCircle, "text-rose-600 bg-rose-50"],
};
const d = (t: Date) => t.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function CustomerDrawer({ detail, closeHref }: { detail: Detail; closeHref: string }) {
  const { customer: c, events } = detail;
  const payments = events.filter((e) => e.type.startsWith("payment_"));
  const timeline = events.filter((e) => !e.type.startsWith("payment_"));
  const failed = payments.filter((p) => p.type === "payment_failed").length;
  const ltv = payments.filter((p) => p.type === "payment_succeeded").reduce((a, p) => a + p.amountCents, 0);
  const tenureDays = Math.floor((Date.now() - c.createdAt.getTime()) / 86400000);
  const score = healthScore({ status: c.status, plan: c.plan, tenureDays, failedPayments: failed, upgrades: timeline.filter((e) => e.type === "upgraded").length });
  const health = healthLabel(score);
  const ring = 2 * Math.PI * 34;
  const color = health.tone === "green" ? "#10b981" : health.tone === "amber" ? "#f59e0b" : "#f43f5e";

  return (
    <div className="fixed inset-0 z-40">
      <Link href={closeHref} scroll={false} aria-label="Close" className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start gap-4 border-b border-slate-100 p-6">
          <Avatar name={c.name} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <p className="text-sm text-slate-500">{c.company}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{c.email}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.country}</span>
            </div>
            <div className="mt-3 flex gap-2"><Badge tone={statusTone(c.status)}>{c.status.replace("_", " ")}</Badge><Badge tone="brand">{c.plan}</Badge></div>
          </div>
          <Link href={closeHref} scroll={false} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></Link>
        </div>

        <div className="grid grid-cols-[96px_1fr] items-center gap-5 border-b border-slate-100 p-6">
          <div className="relative h-24 w-24">
            <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle cx="40" cy="40" r="34" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={ring} strokeDashoffset={ring * (1 - score / 100)} />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-2xl font-bold">{score}</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Health score</p>
            <p className="mt-1 text-base font-semibold" style={{ color }}>{health.label}</p>
            <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div><dt className="text-xs text-slate-500">MRR</dt><dd className="font-semibold">{formatMoney(c.mrrCents)}</dd></div>
              <div><dt className="text-xs text-slate-500">Lifetime value</dt><dd className="font-semibold">{formatMoney(ltv)}</dd></div>
              <div><dt className="text-xs text-slate-500">Customer since</dt><dd className="font-semibold">{c.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</dd></div>
            </dl>
          </div>
        </div>

        <section className="border-b border-slate-100 p-6">
          <h3 className="text-sm font-semibold">Payment history</h3>
          {payments.length === 0 ? <p className="mt-3 text-sm text-slate-500">No payments yet — customer is on a free trial.</p> : (
            <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100">
              {payments.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-slate-600">{d(p.createdAt)}</span>
                  <span className="text-xs text-slate-400">{p.detail}</span>
                  <span className="flex items-center gap-2 font-medium tabular-nums">{formatMoney(p.amountCents)}
                    <Badge tone={p.type === "payment_failed" ? "red" : "green"}>{p.type === "payment_failed" ? "failed" : "paid"}</Badge></span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="p-6">
          <h3 className="text-sm font-semibold">Subscription timeline</h3>
          <ol className="relative mt-4 space-y-5 border-l border-slate-200 pl-7">
            {timeline.map((e) => {
              const [Icon, tone] = ICONS[e.type] ?? [Flag, "text-slate-500 bg-slate-100"];
              return (
                <li key={e.id} className="relative">
                  <span className={`absolute -left-[42px] grid h-7 w-7 place-items-center rounded-full ring-4 ring-white ${tone}`}><Icon className="h-4 w-4" /></span>
                  <p className="text-sm font-medium text-slate-900">{e.detail}</p>
                  <p className="text-xs text-slate-400">{d(e.createdAt)}</p>
                </li>
              );
            })}
          </ol>
        </section>
      </aside>
    </div>
  );
}
