/* Static, lightweight product preview for the landing page (pure SVG, no chart lib). */
const points = [18, 22, 21, 27, 30, 29, 35, 41, 40, 47, 53, 61];

export function HeroPreview() {
  const w = 560, h = 180, max = 65;
  const xy = points.map((p, i) => [(i / (points.length - 1)) * w, h - (p / max) * h]);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <div className="relative mx-auto mt-16 max-w-5xl">
      <div className="absolute -inset-x-10 -top-10 -bottom-10 rounded-[40px] bg-gradient-to-tr from-brand-500/20 via-violet-400/10 to-sky-400/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-rose-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-4 rounded-md bg-white px-3 py-1 text-xs text-slate-400 ring-1 ring-slate-200">app.orbit.dev/dashboard</span>
        </div>
        <div className="grid grid-cols-[180px_1fr]">
          <div className="space-y-1 border-r border-slate-100 p-4 text-sm">
            {["Overview", "Customers", "Team", "Billing", "Activity", "Settings"].map((x, i) => (
              <div key={x} className={i === 0 ? "rounded-lg bg-brand-50 px-3 py-2 font-medium text-brand-700" : "px-3 py-2 text-slate-500"}>{x}</div>
            ))}
          </div>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4">
              {[["MRR", "$24,678", "+6.5%"], ["Active customers", "264", "+7.3%"], ["Net new MRR", "$1,504", "+18%"], ["Trials", "6", "+2"]].map(([k, v, d]) => (
                <div key={k} className="rounded-xl border border-slate-100 p-4">
                  <p className="text-xs text-slate-500">{k}</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight">{v}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-600">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-slate-100 p-4">
              <p className="mb-3 text-sm font-medium">Monthly recurring revenue</p>
              <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full" preserveAspectRatio="none">
                <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6366f1" stopOpacity=".35" /><stop offset="1" stopColor="#6366f1" stopOpacity="0" /></linearGradient></defs>
                <path d={`${line} L${w},${h} L0,${h} Z`} fill="url(#g)" />
                <path d={line} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
