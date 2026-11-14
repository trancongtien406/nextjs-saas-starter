import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export const Card = ({ className, ...p }: ComponentProps<"div">) => (
  <div className={cn("rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]", className)} {...p} />
);
export const CardHeader = ({ className, ...p }: ComponentProps<"div">) => (
  <div className={cn("flex items-start justify-between gap-4 px-6 pt-5", className)} {...p} />
);
export const CardTitle = ({ className, ...p }: ComponentProps<"h3">) => (
  <h3 className={cn("text-sm font-semibold text-slate-900", className)} {...p} />
);
export const CardDescription = ({ className, ...p }: ComponentProps<"p">) => (
  <p className={cn("mt-1 text-sm text-slate-500", className)} {...p} />
);
export const CardContent = ({ className, ...p }: ComponentProps<"div">) => <div className={cn("px-6 pb-6 pt-4", className)} {...p} />;
