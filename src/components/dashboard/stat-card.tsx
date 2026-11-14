import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

export function StatCard({ label, value, delta, icon: Icon, invert }: { label: string; value: string; delta: number; icon: LucideIcon; invert?: boolean }) {
  const good = invert ? delta <= 0 : delta >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-400 ring-1 ring-slate-100"><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", good ? "text-emerald-600" : "text-rose-600")}>
        {delta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {Math.abs(delta)}% <span className="font-normal text-slate-400">vs last month</span>
      </p>
    </Card>
  );
}
