import { SiteFooter, SiteHeader } from "@/components/marketing/site-header";
import { HeroPreview } from "@/components/marketing/hero-preview";
import { PricingTable } from "@/components/marketing/pricing-table";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, BarChart3, CreditCard, Lock, Users, Zap, Database, Star } from "lucide-react";

const features = [
  { icon: BarChart3, title: "MRR you can trust", text: "Monthly recurring revenue, growth and year-over-year comparison, updated from your billing data." },
  { icon: Zap, title: "Churn early warnings", text: "Health scores flag customers with failed payments or falling usage before they cancel." },
  { icon: Users, title: "Every customer in one place", text: "Plan, payments, lifetime value and a full subscription timeline for each account." },
  { icon: CreditCard, title: "Billing that just works", text: "Connect Stripe in minutes. Upgrades, invoices and the customer portal are handled for you." },
  { icon: Lock, title: "Built for teams", text: "Invite finance, sales and support with Owner, Admin and Member roles and an audit log." },
  { icon: Database, title: "Your data, exportable", text: "Export customers and reports to CSV any time. No lock-in." },
];

const testimonials = [
  { name: "Hana Sato", role: "Founder, Kitewave", text: "We went from Figma to paying customers in three weeks. Auth, billing and the dashboard were already done." },
  { name: "Daniel Clarke", role: "CTO, Loop Fitness", text: "Clean code, sensible structure, and the Stripe flow just worked in test mode on day one." },
  { name: "Elena Rossi", role: "PM, Mosaic Learning", text: "The analytics views gave our investors exactly the MRR and churn numbers they asked for." },
];

const faqs = [
  ["How does Orbit get my data?", "Connect your Stripe account (read-only) or import a CSV. Your dashboard is ready in a few minutes."],
  ["What is a customer health score?", "A 0–100 score built from plan, tenure, upgrades and failed payments, so you know who needs attention first."],
  ["Can my whole team use it?", "Yes. Pro includes 10 seats and Business 50, with Owner, Admin and Member roles."],
  ["Can I cancel anytime?", "Yes. Manage or cancel your plan from the billing page; you keep access until the end of the period."],
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
              <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] text-white">NEW</span> Customer health scores are here <ArrowRight className="h-3 w-3" />
            </a>
            <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
              Understand your revenue. <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">Grow with confidence.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Orbit turns your subscription data into clear answers: how much you earn every month, who is about to churn, and which customers to talk to today.
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
            <p className="text-sm font-semibold text-brand-600">Why teams switch to Orbit</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Stop guessing. Start knowing.</h2>
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
            <h2 className="relative text-3xl font-bold tracking-tight text-white md:text-4xl">See your real numbers in five minutes</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-slate-300">Free on Starter. Upgrade when Orbit pays for itself.</p>
            <div className="relative mt-8 flex justify-center gap-3">
              <ButtonLink href="/sign-up" size="lg">Get started free</ButtonLink>
              <ButtonLink href="/sign-in" size="lg" variant="secondary">See the live demo</ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
