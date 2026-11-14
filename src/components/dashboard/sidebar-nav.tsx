"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, CreditCard, LayoutDashboard, Settings, Users, UserSquare2 } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customers", label: "Customers", icon: UserSquare2 },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const path = usePathname();
  return (
    <nav className="space-y-1">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/dashboard" ? path === href : path.startsWith(href);
        return (
          <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
            active ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:bg-white/60 hover:text-slate-900")}>
            <Icon className={cn("h-4 w-4", active ? "text-brand-600" : "text-slate-400")} />{label}
          </Link>
        );
      })}
    </nav>
  );
}
