import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export const Input = ({ className, ...p }: ComponentProps<"input">) => (
  <input className={cn("h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10", className)} {...p} />
);
export const Label = ({ className, ...p }: ComponentProps<"label">) => (
  <label className={cn("mb-1.5 block text-sm font-medium text-slate-700", className)} {...p} />
);
