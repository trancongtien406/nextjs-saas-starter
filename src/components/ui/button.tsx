import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-brand-600 text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700",
  secondary: "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  dark: "bg-slate-900 text-white hover:bg-slate-800",
  danger: "bg-white text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50",
};
const sizes = { sm: "h-8 px-3 text-sm", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" };
type Common = { variant?: keyof typeof variants; size?: keyof typeof sizes };
const base = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

export function Button({ variant = "primary", size = "md", className, ...props }: ComponentProps<"button"> & Common) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ComponentProps<typeof Link> & Common) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
