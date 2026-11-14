"use client";

import { useMemo, useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

export interface MrrPoint { month: string; mrr: number; prev: number | null }
const RANGES = [{ id: "3M", n: 3 }, { id: "6M", n: 6 }, { id: "12M", n: 12 }] as const;
const fmt = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
const monthLabel = (m: string, year = false) =>
  new Date(m + "-01T00:00:00Z").toLocaleString("en-US", { month: "short", ...(year ? { year: "numeric" } : {}), timeZone: "UTC" });

function ChartTooltip({ active, payload, label }: TooltipProps<number, string> & { payload?: { payload: MrrPoint }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  const delta = p.prev ? ((p.mrr - p.prev) / p.prev) * 100 : null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-xl shadow-slate-900/10">
      <p className="text-xs font-medium text-slate-500">{monthLabel(String(label), true)}</p>
      <p className="mt-1 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-500" /><span className="font-semibold">{fmt(p.mrr)}</span> <span className="text-slate-400">MRR</span></p>
      {p.prev != null && <p className="mt-1 flex items-center gap-2 text-slate-500"><span className="h-0.5 w-2 bg-slate-400" />{fmt(p.prev)} same month last year</p>}
      {delta != null && <p className={cn("mt-2 text-xs font-semibold", delta >= 0 ? "text-emerald-600" : "text-rose-600")}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% year over year</p>}
    </div>
  );
}

export function MrrPanel({ data }: { data: MrrPoint[] }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("12M");
  const [compare, setCompare] = useState(true);
  const view = useMemo(() => data.slice(-RANGES.find((r) => r.id === range)!.n), [data, range]);
  const first = view[0]?.mrr ?? 0, last = view.at(-1)?.mrr ?? 0;
  const growth = first ? ((last - first) / first) * 100 : 0;
  const prevTotal = view.reduce((a, p) => a + (p.prev ?? 0), 0), curTotal = view.reduce((a, p) => a + p.mrr, 0);
  const yoy = prevTotal ? ((curTotal - prevTotal) / prevTotal) * 100 : 0;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 pt-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Monthly recurring revenue</h3>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-3 text-sm text-slate-500">
            <span className="text-2xl font-semibold tracking-tight text-slate-900">{fmt(last)}</span>
            <span className={cn("font-medium", growth >= 0 ? "text-emerald-600" : "text-rose-600")}>{growth >= 0 ? "+" : ""}{growth.toFixed(1)}% in {range}</span>
            <span>· {yoy >= 0 ? "+" : ""}{yoy.toFixed(0)}% vs previous period</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
            <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} className="h-3.5 w-3.5 accent-brand-600" />
            Compare previous period
          </label>
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-medium">
            {RANGES.map((r) => (
              <button key={r.id} onClick={() => setRange(r.id)} className={cn("rounded-md px-2.5 py-1", range === r.id ? "bg-white shadow-sm" : "text-slate-500 hover:text-slate-900")}>{r.id}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-2">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={view} margin={{ left: 0, right: 12, top: 16 }}>
            <defs>
              <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eef2f7" strokeDasharray="4 4" />
            <XAxis dataKey="month" tickFormatter={(m) => monthLabel(m)} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={6} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} width={48} domain={["auto", "auto"]} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#c7d2fe", strokeWidth: 1.5 }} />
            {compare && <Line type="monotone" dataKey="prev" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />}
            <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={2.5} fill="url(#mrrFill)" dot={{ r: 3, fill: "#fff", stroke: "#6366f1", strokeWidth: 2 }}
              activeDot={{ r: 5 }} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-5 px-2 text-xs text-slate-500">
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-500" />This period</span>
          {compare && <span className="flex items-center gap-2"><span className="h-0.5 w-3 border-t-2 border-dashed border-slate-400" />Previous period</span>}
        </div>
      </div>
    </div>
  );
}
