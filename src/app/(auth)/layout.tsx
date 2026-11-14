import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-8 py-8 sm:px-16">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">{children}</div>
      </div>
      <div className="relative hidden overflow-hidden bg-slate-900 lg:block">
        <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="relative flex h-full flex-col justify-end p-16 text-white">
          <div className="mb-10 grid grid-cols-2 gap-4">
            {[["$24.7k", "MRR this month"], ["+6.5%", "Month over month"], ["264", "Active customers"], ["2.0%", "Monthly churn"]].map(([v, k]) => (
              <div key={k} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-2xl font-semibold">{v}</p><p className="mt-1 text-sm text-slate-300">{k}</p>
              </div>
            ))}
          </div>
          <blockquote className="text-xl font-medium leading-8">&ldquo;Orbit replaced three spreadsheets and a weekly meeting. Everyone sees the same numbers.&rdquo;</blockquote>
          <p className="mt-4 text-sm text-slate-400">Hana Sato — Founder, Kitewave</p>
        </div>
      </div>
    </div>
  );
}
