import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/current";
import { listActivity } from "@/lib/queries";
import { timeAgo } from "@/lib/utils";
import { CreditCard, Download, Plug, Settings, Share2, UserPlus, Users, Sparkles, type LucideIcon } from "lucide-react";

export const metadata = { title: "Activity — Orbit" };
const icons: Record<string, [LucideIcon, string]> = {
  plan: [CreditCard, "bg-violet-50 text-violet-600"], member: [UserPlus, "bg-sky-50 text-sky-600"],
  export: [Download, "bg-emerald-50 text-emerald-600"], customer: [Users, "bg-brand-50 text-brand-600"],
  report: [Share2, "bg-amber-50 text-amber-600"], integration: [Plug, "bg-teal-50 text-teal-600"],
  settings: [Settings, "bg-slate-100 text-slate-600"], workspace: [Sparkles, "bg-fuchsia-50 text-fuchsia-600"],
};

export default async function ActivityPage() {
  const { team } = await requireUser();
  const items = listActivity(team.id);
  return (
    <>
      <PageHeader title="Activity log" description="An audit trail of important events in your workspace." />
      <Card>
        <CardContent className="pt-6">
          <ol className="relative space-y-6 border-l border-slate-200 pl-8">
            {items.map((a) => {
              const [Icon, tone] = icons[a.action.split(".")[0]] ?? icons.settings;
              return (
                <li key={a.id} className="relative">
                  <span className={`absolute -left-[49px] grid h-8 w-8 place-items-center rounded-full ring-4 ring-white ${tone}`}><Icon className="h-4 w-4" /></span>
                  <p className="text-sm text-slate-900"><span className="font-semibold">{a.name ?? "System"}</span> · {a.detail}</p>
                  <p className="mt-0.5 text-xs text-slate-400"><code className="rounded bg-slate-100 px-1 py-0.5 text-[11px] text-slate-500">{a.action}</code> · {timeAgo(a.createdAt)}</p>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </>
  );
}
