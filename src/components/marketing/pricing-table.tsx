import { PLANS } from "@/lib/plans";
import { ButtonLink } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function PricingTable() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {PLANS.map((p) => (
        <div key={p.id} className={cn("relative flex flex-col rounded-2xl border bg-white p-8",
          p.highlighted ? "border-brand-500 shadow-xl shadow-brand-600/10 ring-4 ring-brand-500/10" : "border-slate-200")}>
          {p.highlighted && <span className="absolute -top-3 left-8 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
          <h3 className="text-lg font-semibold">{p.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{p.description}</p>
          <p className="mt-6 flex items-baseline gap-1"><span className="text-4xl font-bold tracking-tight">${p.priceMonthly}</span><span className="text-sm text-slate-500">/month</span></p>
          <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700">
            {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-brand-600" />{f}</li>)}
          </ul>
          <ButtonLink href="/sign-up" className="mt-8 w-full" variant={p.highlighted ? "primary" : "secondary"}>
            {p.priceMonthly === 0 ? "Start for free" : `Choose ${p.name}`}
          </ButtonLink>
        </div>
      ))}
    </div>
  );
}
