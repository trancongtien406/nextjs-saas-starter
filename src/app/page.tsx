import { SiteFooter, SiteHeader } from "@/components/marketing/site-header";
import { HeroPreview } from "@/components/marketing/hero-preview";
import { PricingTable } from "@/components/marketing/pricing-table";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, BarChart3, CreditCard, Lock, Users, Zap, Database, Star } from "lucide-react";

const features = [
  { icon: Lock, title: "Auth & sessions", text: "Email/password sign-up, bcrypt hashing, signed JWT cookies and route protection in middleware." },
  { icon: Users, title: "Teams & roles", text: "Workspaces with Owner, Admin and Member roles, invitations and seat limits per plan." },
  { icon: CreditCard, title: "Stripe billing", text: "Checkout, customer portal and a signed webhook. Works in demo mode until you add test keys." },
  { icon: BarChart3, title: "Analytics dashboard", text: "MRR, churn, ARPA and growth charts on top of real queries — not hard-coded numbers." },
  { icon: Database, title: "Typed database", text: "Drizzle ORM with SQLite out of the box. Swap to Postgres (Neon, Supabase) in one file." },
  { icon: Zap, title: "Fast by default", text: "Next.js App Router, React Server Components and server actions. No client-side data fetching boilerplate." },
];

const testimonials = [
  { name: "Hana Sato", role: "Founder, Kitewave", text: "We went from Figma to paying customers in three weeks. Auth, billing and the dashboard were already done." },
  { name: "Daniel Clarke", role: "CTO, Loop Fitness", text: "Clean code, sensible structure, and the Stripe flow just worked in test mode on day one." },
  { name: "Elena Rossi", role: "PM, Mosaic Learning", text: "The analytics views gave our investors exactly the MRR and churn numbers they asked for." },
];

const faqs = [
  ["Can I use my own database?", "Yes. SQLite is the default for zero-setup local runs; the Drizzle schema works with Postgres by switching the driver."],
  ["Do I need Stripe to try it?", "No. Without keys the app runs in demo billing mode. Add STRIPE_SECRET_KEY and price IDs to use real Checkout in test mode."],
  ["Is it production ready?", "It covers the foundations — auth, teams, billing, dashboard, activity log. You add your product features on top."],
  ["Can you customise it for my idea?", "Yes — that's what I do on Fiverr: MVPs on this stack, delivered with a clean repo and deployment guide."],
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
          <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
            <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] text-white">NEW</span> Teams, roles &amp; Stripe billing included <ArrowRight className="h-3 w-3" />
            </a>
            <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
              Revenue analytics for <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">subscription businesses</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Orbit shows MRR, churn and customer health in one dashboard. Built on a production-grade Next.js starter with auth, teams and Stripe billing.
            </p>
            <div className="mt-10 flex justify-center gap-3">
              <ButtonLink href="/sign-up" size="lg">Start free trial <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href="/sign-in" size="lg" variant="secondary">View live demo</ButtonLink>
            </div>
            <p className="mt-4 text-sm text-slate-500">Demo login: demo@orbit.dev / demo1234</p>
            <HeroPreview />
          </div>
        </section>

        <section className="border-y border-slate-100 bg-slate-50/60 py-10">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">Trusted by fast-moving teams</p>
          <div className="mx-auto mt-6 flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 text-xl font-semibold text-slate-400">
            {["Kitewave", "Lumora", "Northpeak", "Quillstack", "Helix", "Juniper AI"].map((x) => <span key={x}>{x}</span>)}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-brand-600">Everything you rebuild on day one</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Ship the product, not the plumbing</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="group rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50/70 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple, transparent pricing</h2>
              <p className="mt-4 text-slate-600">Start free. Upgrade when you have paying customers.</p>
            </div>
            <div className="mt-12"><PricingTable /></div>
          </div>
        </section>

        <section id="testimonials" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight">Loved by builders</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-slate-200 p-6">
                <div className="flex gap-0.5 text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <blockquote className="mt-4 text-slate-700">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="mt-6 text-sm"><span className="font-semibold">{t.name}</span><span className="text-slate-500"> · {t.role}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl px-6 pb-24">
          <h2 className="text-center text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {faqs.map(([q, a]) => (
              <details key={q} className="group p-6" open={q === faqs[0][0]}>
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">{q}<span className="text-slate-400 transition group-open:rotate-45">+</span></summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center">
            <div className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-brand-600/40 blur-3xl" />
            <h2 className="relative text-3xl font-bold tracking-tight text-white md:text-4xl">Launch your SaaS this month</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-slate-300">Auth, teams, billing and analytics are done. Spend your time on what makes your product unique.</p>
            <div className="relative mt-8 flex justify-center gap-3">
              <ButtonLink href="/sign-up" size="lg">Get started free</ButtonLink>
              <ButtonLink href="https://www.fiverr.com/optimus2003" size="lg" variant="secondary">Hire the developer</ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
