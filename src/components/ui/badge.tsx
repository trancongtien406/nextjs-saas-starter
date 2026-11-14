import { cn } from "@/lib/utils";

const tones = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  blue: "bg-sky-50 text-sky-700 ring-sky-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-rose-50 text-rose-700 ring-rose-600/20",
  gray: "bg-slate-100 text-slate-600 ring-slate-500/20",
  brand: "bg-brand-50 text-brand-700 ring-brand-600/20",
};

export function Badge({ tone = "gray", className, children }: { tone?: keyof typeof tones; className?: string; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", tones[tone], className)}>{children}</span>;
}

export const statusTone = (s: string): keyof typeof tones =>
  s === "active" ? "green" : s === "trialing" ? "blue" : s === "past_due" ? "amber" : s === "churned" ? "red" : "gray";
