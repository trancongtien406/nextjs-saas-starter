"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const money = (v: number) => `$${(v / 1000).toFixed(0)}k`;
const monthLabel = (m: string) => new Date(m + "-01T00:00:00Z").toLocaleString("en-US", { month: "short", timeZone: "UTC" });

export function MrrChart({ data }: { data: { month: string; mrr: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ left: -8, right: 8, top: 10 }}>
        <defs>
          <linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#eef2f7" />
        <XAxis dataKey="month" tickFormatter={monthLabel} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
        <YAxis tickFormatter={money} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} width={56} />
        <Tooltip formatter={(v) => [`$${Number(v).toLocaleString("en-US")}`, "MRR"]} labelFormatter={(l) => monthLabel(String(l)) + " 2026"}
          contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(15,23,42,.08)" }} />
        <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={2.5} fill="url(#mrr)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function GrowthChart({ data }: { data: { month: string; added: number; churned: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: -24, right: 0, top: 10 }} barGap={2}>
        <CartesianGrid vertical={false} stroke="#eef2f7" />
        <XAxis dataKey="month" tickFormatter={monthLabel} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <Tooltip labelFormatter={(l) => monthLabel(String(l))} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
        <Bar dataKey="added" name="New" fill="#6366f1" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        <Bar dataKey="churned" name="Churned" fill="#fda4af" radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
